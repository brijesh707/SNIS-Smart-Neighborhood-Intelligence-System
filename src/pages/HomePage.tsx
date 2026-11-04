import {
  MapPin,
  Shield,
  BarChart3,
  Layers,
  Database,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Users,
  Building2,
  Navigation,
} from 'lucide-react';
import type { PageId } from '@/components/Navbar';
import { neighbourhoods } from '@/data/neighbourhoods';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const totalVenues = neighbourhoods.reduce((sum, n) => sum + n.venues.length, 0);
  const avgSafety = Math.round(
    neighbourhoods.reduce((sum, n) => sum + n.safetyIndex, 0) / neighbourhoods.length
  );

  const features = [
    {
      icon: Layers,
      title: 'K-Means Clustering',
      description:
        'Neighbourhoods are segmented using K-Means clustering on venue category frequencies from Foursquare Places API data, combined with socio-economic indicators.',
      color: 'mint',
    },
    {
      icon: Shield,
      title: 'Safety Ranking',
      description:
        'Machine-learning-informed crime analysis ranks boroughs by safety, helping users make informed relocation decisions based on historical crime data.',
      color: 'sky',
    },
    {
      icon: MapPin,
      title: 'Location Intelligence',
      description:
        'Venue data from Google Maps and Foursquare APIs is geocoded and mapped, providing a visual understanding of neighbourhood amenities and character.',
      color: 'peach',
    },
  ];

  const pipeline = [
    { icon: Database, label: 'Data Collection', detail: 'Foursquare & Google Maps APIs' },
    { icon: BarChart3, label: 'Feature Engineering', detail: 'Venue frequency vectors' },
    { icon: Layers, label: 'Clustering', detail: 'K-Means on standardized features' },
    { icon: Shield, label: 'Safety Scoring', detail: 'Crime data analysis' },
    { icon: TrendingUp, label: 'Visualization', detail: 'Maps, charts & rankings' },
  ];

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-pastel-50">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(93,125,150,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(93,125,150,0.5) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint-100 border border-mint-200 text-mint-600 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-mint-400" />
              Academic Project - Neighbourhood Intelligence
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-mint-500 leading-tight tracking-tight">
              Smart Neighborhood Intelligence System
            </h1>
            <p className="mt-6 text-lg text-pastel-400 leading-relaxed max-w-2xl mx-auto">
              Using K-Means clustering and location APIs to segment, analyse, and rank
              neighbourhoods - helping users evaluate areas for security, amenities, and
              overall quality of life before relocating.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => onNavigate('analysis')}
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-mint-400 hover:bg-mint-500 text-white font-medium text-sm transition-colors"
              >
                Explore Analysis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('survey')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-pastel-100 text-pastel-500 font-medium text-sm transition-colors border border-pastel-200"
              >
                Take Survey
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Building2, label: 'Neighbourhoods', value: neighbourhoods.length.toString() },
              { icon: MapPin, label: 'Venues Mapped', value: totalVenues.toString() },
              { icon: Shield, label: 'Avg Safety Index', value: avgSafety.toString() },
              { icon: Users, label: 'Borough Groups', value: '2' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-white border border-pastel-200 rounded-xl p-5"
                >
                  <Icon className="w-6 h-6 text-mint-400 mb-3" />
                  <div className="text-2xl font-bold text-pastel-500">{stat.value}</div>
                  <div className="text-pastel-400 text-xs mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-pastel-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-pastel-500">How It Works</h2>
            <p className="mt-3 text-pastel-400 max-w-2xl mx-auto">
              Three core capabilities combine venue data, clustering algorithms, and crime
              analysis into a unified neighbourhood intelligence platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-7 border border-pastel-200 hover:border-pastel-300 hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                      feature.color === 'mint'
                        ? 'bg-mint-100 text-mint-500'
                        : feature.color === 'sky'
                        ? 'bg-sky-100 text-sky-500'
                        : 'bg-peach-100 text-peach-500'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-pastel-500 mb-2">{feature.title}</h3>
                  <p className="text-pastel-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-pastel-500">The Pipeline</h2>
            <p className="mt-3 text-pastel-400">From raw API data to actionable neighbourhood insights</p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-7 left-0 right-0 h-0.5 bg-pastel-200" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {pipeline.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.label} className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 rounded-full bg-white border-2 border-mint-300 flex items-center justify-center mb-4 relative z-10">
                        <Icon className="w-6 h-6 text-mint-500" />
                      </div>
                      <div className="text-xs font-bold text-mint-500 mb-1">STEP {i + 1}</div>
                      <h4 className="text-sm font-semibold text-pastel-500">{step.label}</h4>
                      <p className="text-xs text-pastel-400 mt-1">{step.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Literature */}
      <section className="py-20 bg-pastel-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-pastel-500">Research Foundation</h2>
            <p className="mt-3 text-pastel-400 max-w-2xl mx-auto">
              This project builds on published studies applying K-Means clustering to venue data
              and machine learning to crime analysis.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-7 border border-pastel-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-mint-100 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5 text-mint-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-pastel-500">
                    Neighbourhood Segmentation with K-Means
                  </h3>
                  <p className="text-xs text-pastel-400 mt-0.5">Section 2.1</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-pastel-400">
                {[
                  'Kannepalli [1]: Foursquare venue data + socio-economic indicators to cluster neighbourhoods of Visakhapatnam and San Francisco',
                  'Roy [2]: Restaurant-category analysis distinguishing neighbourhood character in Paris and Strasbourg',
                  'Peddi [3]: Wikipedia scraping to geocoding to Foursquare API to K-Means for mall site selection in Hyderabad',
                  'Kabra [4]: NYC clustering showing clusters match dominant venue types',
                  'Foursquare team [5]: K-Means + standardization + PCA for audience and location segments',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-mint-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-7 border border-pastel-200">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-sky-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-pastel-500">
                    ML for Crime Analysis & Safety Planning
                  </h3>
                  <p className="text-xs text-pastel-400 mt-0.5">Section 2.2</p>
                </div>
              </div>
              <ul className="space-y-2.5 text-sm text-pastel-400">
                {[
                  'Nandini [6]: Systematic review of 150+ articles on ML/DL crime prediction approaches',
                  'ScienceDirect [7]: ML model predicting crime concentration, trained on one city and validated on Philadelphia',
                  'Crime predictions directly inform city-layout and urban-planning decisions',
                  'Fu et al. [8]: Deep learning predicting urban safety from satellite and Street View imagery',
                  'Safety can be estimated from multiple data modalities beyond official crime statistics',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-pastel-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Navigation className="w-12 h-12 text-mint-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-pastel-500">Ready to Explore Neighbourhoods?</h2>
          <p className="mt-3 text-pastel-400 max-w-xl mx-auto">
            View the clustering results, check safety rankings, explore the map, or participate
            in the neighbourhood survey.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('analysis')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-mint-400 hover:bg-mint-500 text-white font-medium text-sm transition-colors"
            >
              View Analysis
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('map')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white hover:bg-pastel-100 text-pastel-500 font-medium text-sm transition-colors border border-pastel-200"
            >
              Open Map
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
