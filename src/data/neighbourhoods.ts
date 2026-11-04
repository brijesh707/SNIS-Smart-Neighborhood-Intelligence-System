export type VenueCategory =
  | 'restaurants'
  | 'parks'
  | 'schools'
  | 'shopping'
  | 'healthcare'
  | 'transit'
  | 'entertainment'
  | 'groceries';

export interface Venue {
  id: string;
  name: string;
  category: VenueCategory;
  lat: number;
  lng: number;
  rating: number;
}

export interface CrimeRecord {
  month: string;
  theft: number;
  assault: number;
  burglary: number;
  vandalism: number;
}

export interface Neighbourhood {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  population: number;
  medianIncome: number;
  venues: Venue[];
  crime: CrimeRecord[];
  safetyIndex: number; // 0-100, higher is safer
  cluster?: number;
}

export const venueCategoryLabels: Record<VenueCategory, string> = {
  restaurants: 'Restaurants',
  parks: 'Parks & Recreation',
  schools: 'Schools & Education',
  shopping: 'Shopping',
  healthcare: 'Healthcare',
  transit: 'Public Transit',
  entertainment: 'Entertainment',
  groceries: 'Groceries',
};

// 12 London boroughs (Inner + Outer London), with realistic venue + crime distributions
export const neighbourhoods: Neighbourhood[] = [
  {
    id: 'n1',
    name: 'Camden',
    city: 'Inner London',
    lat: 51.5290,
    lng: -0.1255,
    population: 270000,
    medianIncome: 42000,
    safetyIndex: 64,
    venues: [
      { id: 'v1', name: 'Regents Park', category: 'parks', lat: 51.531, lng: -0.124, rating: 4.7 },
      { id: 'v2', name: 'Camden Market', category: 'shopping', lat: 51.529, lng: -0.127, rating: 4.5 },
      { id: 'v3', name: 'The Roundhouse', category: 'entertainment', lat: 51.534, lng: -0.137, rating: 4.6 },
      { id: 'v4', name: 'Camden Town Station', category: 'transit', lat: 51.528, lng: -0.123, rating: 4.0 },
      { id: 'v5', name: 'Camden School for Girls', category: 'schools', lat: 51.533, lng: -0.13, rating: 4.2 },
    ],
    crime: [
      { month: 'Jan', theft: 28, assault: 9, burglary: 12, vandalism: 14 },
      { month: 'Feb', theft: 31, assault: 7, burglary: 10, vandalism: 11 },
      { month: 'Mar', theft: 26, assault: 11, burglary: 14, vandalism: 16 },
      { month: 'Apr', theft: 24, assault: 6, burglary: 9, vandalism: 10 },
      { month: 'May', theft: 29, assault: 8, burglary: 11, vandalism: 13 },
      { month: 'Jun', theft: 22, assault: 5, burglary: 8, vandalism: 9 },
    ],
  },
  {
    id: 'n2',
    name: 'Westminster',
    city: 'Inner London',
    lat: 51.4947,
    lng: -0.1370,
    population: 210000,
    medianIncome: 38000,
    safetyIndex: 58,
    venues: [
      { id: 'v6', name: 'Hyde Park', category: 'parks', lat: 51.507, lng: -0.164, rating: 4.8 },
      { id: 'v7', name: 'The Ritz Restaurant', category: 'restaurants', lat: 51.508, lng: -0.141, rating: 4.6 },
      { id: 'v8', name: 'Oxford Street Shops', category: 'shopping', lat: 51.515, lng: -0.141, rating: 4.5 },
      { id: 'v9', name: 'Oxford Circus Station', category: 'transit', lat: 51.515, lng: -0.141, rating: 4.1 },
      { id: 'v10', name: 'Westminster Abbey', category: 'entertainment', lat: 51.499, lng: -0.126, rating: 4.7 },
      { id: 'v11', name: 'St Marys Hospital', category: 'healthcare', lat: 51.518, lng: -0.173, rating: 4.0 },
    ],
    crime: [
      { month: 'Jan', theft: 42, assault: 14, burglary: 15, vandalism: 18 },
      { month: 'Feb', theft: 45, assault: 12, burglary: 13, vandalism: 16 },
      { month: 'Mar', theft: 38, assault: 16, burglary: 17, vandalism: 20 },
      { month: 'Apr', theft: 36, assault: 10, burglary: 12, vandalism: 14 },
      { month: 'May', theft: 41, assault: 13, burglary: 14, vandalism: 17 },
      { month: 'Jun', theft: 34, assault: 9, burglary: 11, vandalism: 12 },
    ],
  },
  {
    id: 'n3',
    name: 'Kensington & Chelsea',
    city: 'Inner London',
    lat: 51.4990,
    lng: -0.1930,
    population: 160000,
    medianIncome: 58000,
    safetyIndex: 82,
    venues: [
      { id: 'v12', name: 'Kensington Gardens', category: 'parks', lat: 51.506, lng: -0.188, rating: 4.8 },
      { id: 'v13', name: 'The Ivy Chelsea', category: 'restaurants', lat: 51.49, lng: -0.166, rating: 4.7 },
      { id: 'v14', name: 'Knightsbridge Shops', category: 'shopping', lat: 51.501, lng: -0.158, rating: 4.6 },
      { id: 'v15', name: 'Chelsea & Westminster Hospital', category: 'healthcare', lat: 51.487, lng: -0.171, rating: 4.2 },
      { id: 'v16', name: 'High Street Kensington Station', category: 'transit', lat: 51.501, lng: -0.194, rating: 4.1 },
    ],
    crime: [
      { month: 'Jan', theft: 8, assault: 2, burglary: 4, vandalism: 3 },
      { month: 'Feb', theft: 7, assault: 1, burglary: 3, vandalism: 2 },
      { month: 'Mar', theft: 9, assault: 2, burglary: 4, vandalism: 3 },
      { month: 'Apr', theft: 6, assault: 1, burglary: 3, vandalism: 2 },
      { month: 'May', theft: 8, assault: 2, burglary: 4, vandalism: 3 },
      { month: 'Jun', theft: 5, assault: 0, burglary: 2, vandalism: 1 },
    ],
  },
  {
    id: 'n4',
    name: 'Hackney',
    city: 'Inner London',
    lat: 51.5450,
    lng: -0.0650,
    population: 280000,
    medianIncome: 35000,
    safetyIndex: 52,
    venues: [
      { id: 'v17', name: 'London Fields', category: 'parks', lat: 51.545, lng: -0.065, rating: 4.4 },
      { id: 'v18', name: 'Broadway Market', category: 'shopping', lat: 51.542, lng: -0.063, rating: 4.5 },
      { id: 'v19', name: 'Hackney Empire', category: 'entertainment', lat: 51.545, lng: -0.057, rating: 4.6 },
      { id: 'v20', name: 'Hackney Central Station', category: 'transit', lat: 51.544, lng: -0.064, rating: 3.9 },
      { id: 'v21', name: 'Mossbourne Academy', category: 'schools', lat: 51.543, lng: -0.06, rating: 4.1 },
      { id: 'v22', name: 'Hackney Grocery', category: 'groceries', lat: 51.546, lng: -0.067, rating: 4.0 },
    ],
    crime: [
      { month: 'Jan', theft: 32, assault: 11, burglary: 13, vandalism: 15 },
      { month: 'Feb', theft: 35, assault: 13, burglary: 15, vandalism: 17 },
      { month: 'Mar', theft: 30, assault: 10, burglary: 12, vandalism: 14 },
      { month: 'Apr', theft: 28, assault: 9, burglary: 11, vandalism: 12 },
      { month: 'May', theft: 33, assault: 12, burglary: 14, vandalism: 16 },
      { month: 'Jun', theft: 26, assault: 8, burglary: 10, vandalism: 11 },
    ],
  },
  {
    id: 'n5',
    name: 'Islington',
    city: 'Inner London',
    lat: 51.5460,
    lng: -0.1060,
    population: 240000,
    medianIncome: 45000,
    safetyIndex: 68,
    venues: [
      { id: 'v23', name: 'Highbury Fields', category: 'parks', lat: 51.547, lng: -0.105, rating: 4.5 },
      { id: 'v24', name: 'The Angel Restaurant', category: 'restaurants', lat: 51.532, lng: -0.106, rating: 4.4 },
      { id: 'v25', name: 'N1 Shopping Centre', category: 'shopping', lat: 51.535, lng: -0.103, rating: 4.3 },
      { id: 'v26', name: 'Angel Station', category: 'transit', lat: 51.532, lng: -0.106, rating: 4.0 },
      { id: 'v27', name: 'Sadlers Wells Theatre', category: 'entertainment', lat: 51.527, lng: -0.106, rating: 4.6 },
    ],
    crime: [
      { month: 'Jan', theft: 20, assault: 6, burglary: 8, vandalism: 9 },
      { month: 'Feb', theft: 18, assault: 5, burglary: 7, vandalism: 8 },
      { month: 'Mar', theft: 22, assault: 7, burglary: 9, vandalism: 10 },
      { month: 'Apr', theft: 16, assault: 4, burglary: 6, vandalism: 7 },
      { month: 'May', theft: 19, assault: 5, burglary: 8, vandalism: 8 },
      { month: 'Jun', theft: 15, assault: 4, burglary: 6, vandalism: 6 },
    ],
  },
  {
    id: 'n6',
    name: 'Lambeth',
    city: 'Inner London',
    lat: 51.4600,
    lng: -0.1160,
    population: 320000,
    medianIncome: 36000,
    safetyIndex: 56,
    venues: [
      { id: 'v28', name: 'Brockwell Park', category: 'parks', lat: 51.452, lng: -0.107, rating: 4.5 },
      { id: 'v29', name: 'Brixton Market', category: 'shopping', lat: 51.461, lng: -0.115, rating: 4.4 },
      { id: 'v30', name: 'Brixton Academy', category: 'entertainment', lat: 51.461, lng: -0.115, rating: 4.7 },
      { id: 'v31', name: 'Brixton Station', category: 'transit', lat: 51.462, lng: -0.114, rating: 3.9 },
      { id: 'v32', name: "King's College Hospital", category: 'healthcare', lat: 51.47, lng: -0.095, rating: 4.1 },
    ],
    crime: [
      { month: 'Jan', theft: 34, assault: 12, burglary: 14, vandalism: 16 },
      { month: 'Feb', theft: 37, assault: 14, burglary: 16, vandalism: 18 },
      { month: 'Mar', theft: 32, assault: 11, burglary: 13, vandalism: 15 },
      { month: 'Apr', theft: 30, assault: 10, burglary: 12, vandalism: 13 },
      { month: 'May', theft: 35, assault: 13, burglary: 15, vandalism: 17 },
      { month: 'Jun', theft: 28, assault: 9, burglary: 11, vandalism: 12 },
    ],
  },
  {
    id: 'n7',
    name: 'Richmond',
    city: 'Outer London',
    lat: 51.4610,
    lng: -0.3030,
    population: 195000,
    medianIncome: 62000,
    safetyIndex: 88,
    venues: [
      { id: 'v33', name: 'Richmond Park', category: 'parks', lat: 51.447, lng: -0.287, rating: 4.9 },
      { id: 'v34', name: 'Kew Gardens', category: 'parks', lat: 51.478, lng: -0.296, rating: 4.8 },
      { id: 'v35', name: 'The Petersham Restaurant', category: 'restaurants', lat: 51.458, lng: -0.302, rating: 4.6 },
      { id: 'v36', name: 'Richmond Station', category: 'transit', lat: 51.461, lng: -0.302, rating: 4.1 },
      { id: 'v37', name: 'Richmond Green Shops', category: 'shopping', lat: 51.46, lng: -0.301, rating: 4.3 },
    ],
    crime: [
      { month: 'Jan', theft: 5, assault: 1, burglary: 2, vandalism: 1 },
      { month: 'Feb', theft: 4, assault: 0, burglary: 1, vandalism: 1 },
      { month: 'Mar', theft: 6, assault: 1, burglary: 2, vandalism: 2 },
      { month: 'Apr', theft: 3, assault: 0, burglary: 1, vandalism: 1 },
      { month: 'May', theft: 5, assault: 1, burglary: 2, vandalism: 1 },
      { month: 'Jun', theft: 2, assault: 0, burglary: 1, vandalism: 0 },
    ],
  },
  {
    id: 'n8',
    name: 'Kingston',
    city: 'Outer London',
    lat: 51.4120,
    lng: -0.3000,
    population: 168000,
    medianIncome: 48000,
    safetyIndex: 78,
    venues: [
      { id: 'v38', name: 'Hampton Court Park', category: 'parks', lat: 51.403, lng: -0.339, rating: 4.7 },
      { id: 'v39', name: 'Bentalls Centre', category: 'shopping', lat: 51.412, lng: -0.301, rating: 4.4 },
      { id: 'v40', name: 'Kingston Station', category: 'transit', lat: 51.412, lng: -0.301, rating: 4.0 },
      { id: 'v41', name: 'Kingston Grammar School', category: 'schools', lat: 51.41, lng: -0.303, rating: 4.5 },
      { id: 'v42', name: 'The Bishop Cafe', category: 'restaurants', lat: 51.413, lng: -0.299, rating: 4.3 },
    ],
    crime: [
      { month: 'Jan', theft: 10, assault: 3, burglary: 5, vandalism: 4 },
      { month: 'Feb', theft: 9, assault: 2, burglary: 4, vandalism: 3 },
      { month: 'Mar', theft: 11, assault: 3, burglary: 5, vandalism: 4 },
      { month: 'Apr', theft: 8, assault: 2, burglary: 4, vandalism: 3 },
      { month: 'May', theft: 10, assault: 3, burglary: 5, vandalism: 4 },
      { month: 'Jun', theft: 7, assault: 1, burglary: 3, vandalism: 2 },
    ],
  },
  {
    id: 'n9',
    name: 'Sutton',
    city: 'Outer London',
    lat: 51.3610,
    lng: -0.1930,
    population: 205000,
    medianIncome: 44000,
    safetyIndex: 80,
    venues: [
      { id: 'v43', name: 'Nonsuch Park', category: 'parks', lat: 51.366, lng: -0.207, rating: 4.6 },
      { id: 'v44', name: 'Sutton High Street', category: 'shopping', lat: 51.361, lng: -0.193, rating: 4.2 },
      { id: 'v45', name: 'Sutton Station', category: 'transit', lat: 51.361, lng: -0.192, rating: 3.9 },
      { id: 'v46', name: 'Sutton Grammar School', category: 'schools', lat: 51.363, lng: -0.194, rating: 4.4 },
      { id: 'v47', name: 'St Helier Hospital', category: 'healthcare', lat: 51.373, lng: -0.183, rating: 3.8 },
    ],
    crime: [
      { month: 'Jan', theft: 7, assault: 2, burglary: 3, vandalism: 3 },
      { month: 'Feb', theft: 6, assault: 1, burglary: 3, vandalism: 2 },
      { month: 'Mar', theft: 8, assault: 2, burglary: 4, vandalism: 3 },
      { month: 'Apr', theft: 5, assault: 1, burglary: 2, vandalism: 2 },
      { month: 'May', theft: 7, assault: 2, burglary: 3, vandalism: 3 },
      { month: 'Jun', theft: 4, assault: 0, burglary: 2, vandalism: 1 },
    ],
  },
  {
    id: 'n10',
    name: 'Barking & Dagenham',
    city: 'Outer London',
    lat: 51.5390,
    lng: 0.0810,
    population: 220000,
    medianIncome: 30000,
    safetyIndex: 44,
    venues: [
      { id: 'v48', name: 'Mayesbrook Park', category: 'parks', lat: 51.539, lng: 0.081, rating: 3.9 },
      { id: 'v49', name: 'Barking Market', category: 'shopping', lat: 51.539, lng: 0.081, rating: 3.8 },
      { id: 'v50', name: 'Barking Station', category: 'transit', lat: 51.539, lng: 0.081, rating: 3.6 },
      { id: 'v51', name: 'Barking Abbey School', category: 'schools', lat: 51.538, lng: 0.08, rating: 3.7 },
      { id: 'v52', name: 'Queens Hospital', category: 'healthcare', lat: 51.545, lng: 0.093, rating: 3.8 },
    ],
    crime: [
      { month: 'Jan', theft: 36, assault: 14, burglary: 13, vandalism: 16 },
      { month: 'Feb', theft: 40, assault: 16, burglary: 15, vandalism: 18 },
      { month: 'Mar', theft: 34, assault: 13, burglary: 12, vandalism: 15 },
      { month: 'Apr', theft: 32, assault: 11, burglary: 11, vandalism: 13 },
      { month: 'May', theft: 38, assault: 15, burglary: 14, vandalism: 17 },
      { month: 'Jun', theft: 31, assault: 10, burglary: 10, vandalism: 12 },
    ],
  },
  {
    id: 'n11',
    name: 'Bromley',
    city: 'Outer London',
    lat: 51.4030,
    lng: 0.0150,
    population: 330000,
    medianIncome: 46000,
    safetyIndex: 84,
    venues: [
      { id: 'v53', name: 'Crystal Palace Park', category: 'parks', lat: 51.418, lng: -0.064, rating: 4.6 },
      { id: 'v54', name: 'The Glades Shopping Centre', category: 'shopping', lat: 51.403, lng: 0.015, rating: 4.3 },
      { id: 'v55', name: 'Bromley South Station', category: 'transit', lat: 51.402, lng: 0.014, rating: 4.0 },
      { id: 'v56', name: 'Bromley High School', category: 'schools', lat: 51.404, lng: 0.016, rating: 4.3 },
      { id: 'v57', name: 'Bromley Grocery', category: 'groceries', lat: 51.403, lng: 0.014, rating: 4.1 },
    ],
    crime: [
      { month: 'Jan', theft: 6, assault: 1, burglary: 3, vandalism: 2 },
      { month: 'Feb', theft: 5, assault: 1, burglary: 2, vandalism: 2 },
      { month: 'Mar', theft: 7, assault: 2, burglary: 3, vandalism: 3 },
      { month: 'Apr', theft: 4, assault: 0, burglary: 2, vandalism: 1 },
      { month: 'May', theft: 6, assault: 1, burglary: 3, vandalism: 2 },
      { month: 'Jun', theft: 3, assault: 0, burglary: 1, vandalism: 1 },
    ],
  },
  {
    id: 'n12',
    name: 'Croydon',
    city: 'Outer London',
    lat: 51.3760,
    lng: -0.0980,
    population: 390000,
    medianIncome: 38000,
    safetyIndex: 60,
    venues: [
      { id: 'v58', name: 'Wandle Park', category: 'parks', lat: 51.376, lng: -0.103, rating: 4.3 },
      { id: 'v59', name: 'Whitgift Centre', category: 'shopping', lat: 51.375, lng: -0.098, rating: 4.1 },
      { id: 'v60', name: 'East Croydon Station', category: 'transit', lat: 51.375, lng: -0.095, rating: 4.0 },
      { id: 'v61', name: 'Croydon Box Theatre', category: 'entertainment', lat: 51.377, lng: -0.1, rating: 4.2 },
      { id: 'v62', name: 'Croydon College', category: 'schools', lat: 51.376, lng: -0.097, rating: 3.9 },
    ],
    crime: [
      { month: 'Jan', theft: 22, assault: 7, burglary: 9, vandalism: 10 },
      { month: 'Feb', theft: 20, assault: 6, burglary: 8, vandalism: 9 },
      { month: 'Mar', theft: 24, assault: 8, burglary: 10, vandalism: 11 },
      { month: 'Apr', theft: 18, assault: 5, burglary: 7, vandalism: 8 },
      { month: 'May', theft: 21, assault: 6, burglary: 9, vandalism: 9 },
      { month: 'Jun', theft: 17, assault: 4, burglary: 6, vandalism: 7 },
    ],
  },
];
