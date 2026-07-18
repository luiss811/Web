import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SupportWidget } from './components/SupportWidget';
import { PointerHighlight } from './components/PointerHighlight';
import { Shop } from './pages/Shop';
import { Catalog } from './pages/Catalog';
import { Analytics } from './pages/Analytics';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';
import { AuthPage } from './pages/AuthPage';

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

const AccessDenied: React.FC<{ type: 'login' | 'unauthorized'; requiredPermission: string }> = ({ type, requiredPermission }) => {
  const { navigateTo } = useApp();
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full glass rounded-3xl border border-rose-500/20 p-8 shadow-xl text-center relative overflow-hidden">

        <h3 className="text-2xl font-black font-display text-mineral-800 dark:text-white mb-2">
          {type === 'login' ? 'Inicia sesion o registrate' : 'Acceso Denegado'}
        </h3>
        <p className="text-sm text-mineral-505 dark:text-mineral-400 mb-6 leading-relaxed">
          {type === 'login' 
            ? 'Para ingresar a este módulo necesitas iniciar sesión con una cuenta autorizada.'
            : `Tu rol actual no posee los permisos necesarios (${requiredPermission}) para acceder a esta pagina.`
          }
        </p>
        <div className="flex flex-col gap-3">
          {type === 'login' ? (
            <button
              onClick={() => navigateTo('auth')}
              className="w-full py-3  font-bold rounded-xl shadow-md cursor-pointer transition-all"
            >
              Iniciar Sesión
            </button>
          ) : (
            <button
              onClick={() => navigateTo('auth')}
              className="w-full py-3 bg-mineral-100 dark:bg-mineral-900 border border-mineral-200/50 dark:border-mineral-800/50 text-mineral-700 dark:text-mineral-200 font-bold rounded-xl cursor-pointer hover:bg-mineral-200 transition-all"
            >
              Cambiar de Cuenta
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { currentPage, activeCampaign } = useApp();
  const { user, hasPermission, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-mineral-50 dark:bg-mineral-950">
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-xs font-bold text-mineral-500 dark:text-mineral-450 uppercase tracking-widest animate-pulse">
            Verificando credenciales de seguridad...
          </p>
        </div>
      </div>
    );
  }

  // Mapa de permisos para cada página protegida
  const permissionsMap: Record<string, string> = {
    shop: 'ver_tienda',
    catalog: 'ver_catalogo',
    analytics: 'ver_metricas',
    contact: 'ver_contacto',
    legal: 'ver_legal',
  };

  const renderPage = () => {
    const requiredPermission = permissionsMap[currentPage];
    
    // Si la ruta requiere un permiso y el usuario no lo tiene, bloquear
    if (requiredPermission && !hasPermission(requiredPermission)) {
      if (!user) {
        return <AccessDenied type="login" requiredPermission={requiredPermission} />;
      } else {
        return <AccessDenied type="unauthorized" requiredPermission={requiredPermission} />;
      }
    }

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
      case 'auth':
        return <AuthPage />;
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
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
