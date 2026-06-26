import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SupportWidget } from './components/SupportWidget';
import { Shop } from './pages/Shop';
import { Catalog } from './pages/Catalog';
import { Analytics } from './pages/Analytics';
import { Contact } from './pages/Contact';
import { Legal } from './pages/Legal';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();

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
    <div className="flex flex-col min-h-screen bg-mineral-50 dark:bg-mineral-950 text-mineral-800 dark:text-mineral-100 transition-colors duration-300">
      <Header />      
      <main className="flex-grow transition-opacity duration-300 animate-fadeIn">
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
