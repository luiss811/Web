import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SupportWidget } from './components/SupportWidget';
import { PointerHighlight } from './components/PointerHighlight';
import { Shop } from './pages/Shop';
import { Catalog } from './pages/Catalog';
import { Analytics } from './pages/Analytics';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

const CampaignParticles: React.FC<{ type: 'gaia' | 'muertos' }> = ({ type }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => {
        let newY = p.y - p.speed * 0.15;
        if (newY < -15) {
          newY = 115;
        }
        return { ...p, y: newY };
      }));
    }, 30);

    return () => clearInterval(interval);
  }, [type]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map(p => {
        const isEarth = type === 'gaia';
        const bgStyle = isEarth
          ? 'bg-gradient-to-t from-emerald-500/10 to-teal-400/25'
          : 'bg-gradient-to-tr from-purple-800/20 via-purple-500/15 to-orange-500/20 blur-[1px]';

        return (
          <div
            key={p.id}
            className={`absolute transition-all duration-[30ms] ease-linear ${bgStyle}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              borderRadius: isEarth ? '60% 40% 50% 50% / 40% 40% 60% 60%' : '50%',
              transform: isEarth ? `rotate(${p.y * 2.5}deg)` : 'none'
            }}
          />
        );
      })}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentPage, activeCampaign } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <Shop />;
      case 'catalog':
        return <Catalog />;
      case 'analytics':
        return <Analytics />;
      case 'contact':
        return <Contact />;
      case 'legal':
        return <Legal />;
      default:
        return <Shop />;
    }
  };

  return (
    <div className={`flex flex-col min-h-screen bg-mineral-50 dark:bg-mineral-950 text-mineral-800 dark:text-mineral-100 transition-colors duration-300 relative overflow-x-hidden ${activeCampaign ? activeCampaign.themeClass : ''}`}>
      {activeCampaign && (activeCampaign.id === 'gaia' || activeCampaign.id === 'muertos') && (
        <CampaignParticles type={activeCampaign.id as 'gaia' | 'muertos'} />
      )}
      <PointerHighlight />
      <Header />      
      <main className="flex-grow transition-opacity duration-300 animate-fadeIn relative z-20">
        {renderPage()}
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
