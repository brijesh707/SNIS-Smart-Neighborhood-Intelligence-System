import { neighbourhoods, type Neighbourhood, type VenueCategory } from '@/data/neighbourhoods';

// Build a feature vector for each neighbourhood based on venue category frequencies
// (one-hot encoded venue proportions) + normalized socio-economic indicators,
// mirroring the pipeline described in the literature (Foursquare venue data + K-Means).
export function buildFeatureMatrix(): {
  vectors: number[][];
  labels: string[];
  features: string[];
} {
  const categories: VenueCategory[] = [
    'restaurants',
    'parks',
    'schools',
    'shopping',
    'healthcare',
    'transit',
    'entertainment',
    'groceries',
  ];

  const features = [
    ...categories.map((c) => `venue_${c}`),
    'safety_index',
    'income_norm',
    'population_norm',
  ];

  // For normalization
  const maxIncome = Math.max(...neighbourhoods.map((n) => n.medianIncome));
  const maxPop = Math.max(...neighbourhoods.map((n) => n.population));

  const vectors = neighbourhoods.map((n) => {
    const totalVenues = n.venues.length || 1;
    const categoryFreqs = categories.map((cat) => {
      const count = n.venues.filter((v) => v.category === cat).length;
      return count / totalVenues;
    });
    const safetyNorm = n.safetyIndex / 100;
    const incomeNorm = n.medianIncome / maxIncome;
    const popNorm = n.population / maxPop;
    return [...categoryFreqs, safetyNorm, incomeNorm, popNorm];
  });

  const labels = neighbourhoods.map((n) => n.name);

  return { vectors, labels, features };
}

// Standardize features to zero mean and unit variance (z-score),
// as recommended in the Foursquare applied-data-science tutorial.
export function standardize(vectors: number[][]): number[][] {
  if (vectors.length === 0) return [];
  const numFeatures = vectors[0].length;
  const means = new Array(numFeatures).fill(0);
  const stds = new Array(numFeatures).fill(0);

  for (const vec of vectors) {
    for (let i = 0; i < numFeatures; i++) means[i] += vec[i];
  }
  for (let i = 0; i < numFeatures; i++) means[i] /= vectors.length;

  for (const vec of vectors) {
    for (let i = 0; i < numFeatures; i++) {
      stds[i] += Math.pow(vec[i] - means[i], 2);
    }
  }
  for (let i = 0; i < numFeatures; i++) {
    stds[i] = Math.sqrt(stds[i] / vectors.length) || 1;
  }

  return vectors.map((vec) =>
    vec.map((val, i) => (val - means[i]) / stds[i])
  );
}

function euclidean(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.pow(a[i] - b[i], 2);
  return Math.sqrt(sum);
}

export interface KMeansResult {
  assignments: number[];
  centroids: number[][];
  iterations: number;
  inertia: number;
}

// Lloyd's algorithm K-Means clustering
export function kMeans(
  vectors: number[][],
  k: number,
  maxIterations = 100,
  seed = 42
): KMeansResult {
  const n = vectors.length;
  if (n === 0 || k <= 0) return { assignments: [], centroids: [], iterations: 0, inertia: 0 };
  if (k >= n) k = n;

  // Deterministic k-means++ initialization for reproducibility
  const rng = mulberry32(seed);
  const centroids: number[][] = [];
  const firstIdx = Math.floor(rng() * n);
  centroids.push([...vectors[firstIdx]]);

  for (let c = 1; c < k; c++) {
    const distances = vectors.map((v) => {
      let minDist = Infinity;
      for (const cent of centroids) {
        const d = euclidean(v, cent);
        if (d < minDist) minDist = d;
      }
      return minDist * minDist;
    });
    const totalDist = distances.reduce((a, b) => a + b, 0);
    if (totalDist === 0) {
      centroids.push([...vectors[Math.floor(rng() * n)]]);
      continue;
    }
    let r = rng() * totalDist;
    let chosen = 0;
    for (let i = 0; i < n; i++) {
      r -= distances[i];
      if (r <= 0) {
        chosen = i;
        break;
      }
    }
    centroids.push([...vectors[chosen]]);
  }

  const assignments = new Array(n).fill(0);
  let iterations = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterations++;
    let changed = false;

    // Assignment step
    for (let i = 0; i < n; i++) {
      let minDist = Infinity;
      let bestCluster = 0;
      for (let c = 0; c < k; c++) {
        const d = euclidean(vectors[i], centroids[c]);
        if (d < minDist) {
          minDist = d;
          bestCluster = c;
        }
      }
      if (assignments[i] !== bestCluster) {
        assignments[i] = bestCluster;
        changed = true;
      }
    }

    // Update step
    for (let c = 0; c < k; c++) {
      const members = vectors.filter((_, i) => assignments[i] === c);
      if (members.length === 0) continue;
      const numFeatures = centroids[c].length;
      const newCentroid = new Array(numFeatures).fill(0);
      for (const m of members) {
        for (let f = 0; f < numFeatures; f++) newCentroid[f] += m[f];
      }
      for (let f = 0; f < numFeatures; f++) newCentroid[f] /= members.length;
      centroids[c] = newCentroid;
    }

    if (!changed) break;
  }

  // Compute inertia (sum of squared distances to assigned centroid)
  let inertia = 0;
  for (let i = 0; i < n; i++) {
    const d = euclidean(vectors[i], centroids[assignments[i]]);
    inertia += d * d;
  }

  return { assignments, centroids, iterations, inertia };
}

// Simple PRNG for deterministic seeding
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Run the full clustering pipeline and return labelled neighbourhoods
export function runClustering(k: number): {
  clustered: Neighbourhood[];
  result: KMeansResult;
  features: string[];
} {
  const { vectors, features } = buildFeatureMatrix();
  const standardized = standardize(vectors);
  const result = kMeans(standardized, k);

  const clustered = neighbourhoods.map((n, i) => ({
    ...n,
    cluster: result.assignments[i],
  }));

  return { clustered, result, features };
}

// Compute the elbow curve (inertia for k=1..maxK) to help pick the optimal k
export function computeElbowCurve(maxK: number): { k: number; inertia: number }[] {
  const { vectors } = buildFeatureMatrix();
  const standardized = standardize(vectors);
  const results: { k: number; inertia: number }[] = [];
  for (let k = 1; k <= Math.min(maxK, vectors.length); k++) {
    const { inertia } = kMeans(standardized, k);
    results.push({ k, inertia });
  }
  return results;
}

// Compute a simple safety score (0-100) from crime records
export function computeCrimeScore(n: Neighbourhood): number {
  const totalCrimes = n.crime.reduce(
    (sum, c) => sum + c.theft + c.assault + c.burglary + c.vandalism,
    0
  );
  // Lower crime = higher score. Scale relative to max across all neighbourhoods.
  const allTotals = neighbourhoods.map((nb) =>
    nb.crime.reduce((s, c) => s + c.theft + c.assault + c.burglary + c.vandalism, 0)
  );
  const maxCrimes = Math.max(...allTotals);
  return Math.round(100 - (totalCrimes / maxCrimes) * 100);
}
