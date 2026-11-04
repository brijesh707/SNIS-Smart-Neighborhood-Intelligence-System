import { Map, Github, Mail } from 'lucide-react';
import type { PageId } from './Navbar';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-pastel-100 border-t border-pastel-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-mint-300 flex items-center justify-center">
                <Map className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-mint-500 font-bold">SNIS</span>
            </div>
            <p className="text-pastel-400 text-sm leading-relaxed">
              A neighbourhood intelligence system using K-Means clustering and location data
              to help users evaluate and compare areas for relocation.
            </p>
          </div>

          <div>
            <h4 className="text-pastel-500 font-semibold text-sm mb-3">Navigation</h4>
            <ul className="space-y-2">
              {[
                { id: 'home' as PageId, label: 'Home' },
                { id: 'analysis' as PageId, label: 'Neighbourhood Analysis' },
                { id: 'safety' as PageId, label: 'Safety Ranking' },
                { id: 'map' as PageId, label: 'Map View' },
                { id: 'survey' as PageId, label: 'Survey' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate(link.id)}
                    className="text-pastel-400 hover:text-mint-500 text-sm transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-pastel-500 font-semibold text-sm mb-3">Data Sources</h4>
            <ul className="space-y-2 text-pastel-400 text-sm">
              <li>Google Maps Places API</li>
              <li>Foursquare Places API</li>
              <li>Open Crime Statistics</li>
              <li>Wikipedia Neighbourhood Lists</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-pastel-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-pastel-400 text-xs">
            Academic Project - K-Means Clustering & Location Intelligence
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-pastel-400 hover:text-mint-500 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-pastel-400 hover:text-mint-500 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
