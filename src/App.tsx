import { useState, useEffect } from 'react';
import Navbar, { type PageId } from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import AnalysisPage from '@/pages/AnalysisPage';
import SafetyPage from '@/pages/SafetyPage';
import SurveyPage from '@/pages/SurveyPage';
import MapPage from '@/pages/MapPage';

export default function App() {
  const [page, setPage] = useState<PageId>('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="min-h-screen bg-pastel-50 flex flex-col">
      <Navbar currentPage={page} onNavigate={setPage} />
      <main className="flex-1">
        {page === 'home' && <HomePage onNavigate={setPage} />}
        {page === 'analysis' && <AnalysisPage />}
        {page === 'safety' && <SafetyPage />}
        {page === 'survey' && <SurveyPage />}
        {page === 'map' && <MapPage />}
      </main>
      <Footer onNavigate={setPage} />
    </div>
  );
}
