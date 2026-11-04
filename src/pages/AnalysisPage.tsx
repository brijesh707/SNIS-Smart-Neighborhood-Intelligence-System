import { useState, useMemo } from 'react';
import {
  Layers,
  Settings2,
  TrendingDown,
  Info,
  Building2,
  MapPin,
} from 'lucide-react';
import {
  runClustering,
  computeElbowCurve,
} from '@/lib/clustering';
import { venueCategoryLabels, type VenueCategory } from '@/data/neighbourhoods';

const clusterColors = [
  { bg: 'bg-mint-400', text: 'text-mint-600', light: 'bg-mint-50', border: 'border-mint-200', dot: 'bg-mint-400' },
  { bg: 'bg-sky-400', text: 'text-sky-600', light: 'bg-sky-50', border: 'border-sky-200', dot: 'bg-sky-400' },
  { bg: 'bg-peach-400', text: 'text-peach-500', light: 'bg-peach-50', border: 'border-peach-200', dot: 'bg-peach-400' },
  { bg: 'bg-lavender-400', text: 'text-lavender-500', light: 'bg-lavender-50', border: 'border-lavender-200', dot: 'bg-lavender-400' },
  { bg: 'bg-rose-400', text: 'text-rose-500', light: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-400' },
  { bg: 'bg-amber-400', text: 'text-amber-500', light: 'bg-amber-50', border: 'border-amber-200', dot: 'bg-amber-400' },
];

const clusterLabels = ['Cluster A', 'Cluster B', 'Cluster C', 'Cluster D', 'Cluster E', 'Cluster F'];

export default function AnalysisPage() {
  const [kValue, setKValue] = useState(3);
  const [runTrigger, setRunTrigger] = useState(0);

  const { clustered, result, features } = useMemo(
    () => {
      void runTrigger;
      return runClustering(kValue);
    },
    [kValue, runTrigger]
  );

  const elbowData = useMemo(() => computeElbowCurve(8), []);

  const maxInertia = Math.max(...elbowData.map((d) => d.inertia));

  const clusterGroups = useMemo(() => {
    const groups: Record<number, typeof clustered> = {};
    clustered.forEach((n) => {
      if (!groups[n.cluster!]) groups[n.cluster!] = [];
      groups[n.cluster!].push(n);
    });
    return groups;
  }, [clustered]);

  return (
    <div className="pt-16 bg-pastel-50 min-h-screen">
      {/* Header */}
      <div className="bg-pastel-100 border-b border-pastel-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-7 h-7 text-mint-500" />
            <h1 className="text-2xl font-bold text-pastel-500">Neighbourhood Analysis</h1>
          </div>
          <p className="text-pastel-400 max-w-2xl">
            K-Means clustering on venue category frequencies (Foursquare Places API) combined
            with socio-economic indicators. Features are standardized (z-score) before clustering.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Controls */}
        <div className="bg-white rounded-2xl border border-pastel-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            <div className="flex-1">
              <label className="flex items-center gap-2 text-sm font-medium text-pastel-500 mb-3">
                <Settings2 className="w-4 h-4 text-mint-500" />
                Number of Clusters (k): <span className="text-mint-500 font-bold text-lg">{kValue}</span>
              </label>
              <input
                type="range"
                min={2}
                max={6}
                value={kValue}
                onChange={(e) => setKValue(Number(e.target.value))}
                className="w-full h-2 bg-pastel-200 rounded-lg appearance-none cursor-pointer accent-mint-400"
              />
              <div className="flex justify-between text-xs text-pastel-400 mt-1">
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
              </div>
            </div>
            <button
              onClick={() => setRunTrigger((t) => t + 1)}
              className="px-5 py-2.5 rounded-lg bg-mint-400 hover:bg-mint-500 text-white font-medium text-sm transition-colors whitespace-nowrap"
            >
              Re-run Clustering
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-pastel-100">
            <div>
              <div className="text-xs text-pastel-400">Iterations</div>
              <div className="text-lg font-semibold text-pastel-500">{result.iterations}</div>
            </div>
            <div>
              <div className="text-xs text-pastel-400">Inertia (WCSS)</div>
              <div className="text-lg font-semibold text-pastel-500">{result.inertia.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-pastel-400">Features</div>
              <div className="text-lg font-semibold text-pastel-500">{features.length}</div>
            </div>
          </div>
        </div>

        {/* Elbow chart */}
        <div className="bg-white rounded-2xl border border-pastel-200 p-6">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-5 h-5 text-mint-500" />
            <h2 className="text-lg font-semibold text-pastel-500">Elbow Method</h2>
          </div>
          <p className="text-sm text-pastel-400 mb-5">
            Within-cluster sum of squares (WCSS) vs. k. The "elbow" indicates the optimal number of clusters.
          </p>
          <div className="flex items-end justify-between gap-2 h-48 px-2">
            {elbowData.map((d) => {
              const heightPct = (d.inertia / maxInertia) * 100;
              const isActive = d.k === kValue;
              return (
                <div key={d.k} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs text-pastel-400 font-medium">{d.inertia.toFixed(1)}</div>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isActive ? 'bg-mint-400' : 'bg-pastel-300'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <div className={`text-xs font-medium ${isActive ? 'text-mint-500' : 'text-pastel-400'}`}>
                    k={d.k}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cluster cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(clusterGroups)
            .sort(([a], [b]) => Number(a) - Number(b))
            .map(([clusterId, members]) => {
              const c = clusterColors[Number(clusterId) % clusterColors.length];
              return (
                <div
                  key={clusterId}
                  className={`bg-white rounded-2xl border-2 ${c.border} p-5`}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-3 h-3 rounded-full ${c.dot}`} />
                    <h3 className="font-semibold text-pastel-500">
                      {clusterLabels[Number(clusterId) % clusterLabels.length]}
                    </h3>
                    <span className="text-xs text-pastel-400 ml-auto">
                      {members.length} area{members.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {members.map((n) => (
                      <div key={n.id} className={`rounded-lg ${c.light} p-3`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="font-medium text-pastel-500 text-sm">{n.name}</span>
                          <span className="text-xs text-pastel-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {n.city}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-pastel-400">
                          <span>Pop: {(n.population / 1000).toFixed(1)}k</span>
                          <span>Income: £{(n.medianIncome / 1000).toFixed(0)}k</span>
                          <span>Safety: {n.safetyIndex}</span>
                        </div>
                        {/* Venue category mini bars */}
                        <div className="mt-2 flex gap-0.5 h-1.5 rounded-full overflow-hidden bg-pastel-200">
                          {Object.entries(venueCategoryLabels).map(([cat]) => {
                            const count = n.venues.filter(
                              (v) => v.category === (cat as VenueCategory)
                            ).length;
                            const pct = (count / n.venues.length) * 100;
                            if (pct === 0) return null;
                            return (
                              <div
                                key={cat}
                                className={`${c.bg} opacity-60`}
                                style={{ width: `${pct}%` }}
                                title={`${venueCategoryLabels[cat as VenueCategory]}: ${count}`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Feature legend */}
        <div className="bg-white rounded-2xl border border-pastel-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-mint-500" />
            <h2 className="text-lg font-semibold text-pastel-500">Feature Vector</h2>
          </div>
          <p className="text-sm text-pastel-400 mb-4">
            Each neighbourhood is represented by a {features.length}-dimensional vector used by K-Means:
          </p>
          <div className="flex flex-wrap gap-2">
            {features.map((f) => (
              <span
                key={f}
                className="px-3 py-1.5 rounded-lg bg-pastel-100 text-pastel-500 text-xs font-medium"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Interpretation note */}
        <div className="bg-mint-50 border border-mint-200 rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-mint-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-pastel-500 text-sm mb-1">Interpreting the Clusters</h3>
              <p className="text-sm text-pastel-400 leading-relaxed">
                Neighbourhoods in the same cluster share similar venue profiles and socio-economic
                characteristics. As Kabra [4] observed, clusters tend to correspond to dominant
                venue types (e.g., restaurant-heavy zones, park-rich residential areas). This
                approach generalizes across cities - Kannepalli [1] demonstrated it works for
                comparing neighbourhoods in entirely different cities like Visakhapatnam and
                San Francisco.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
