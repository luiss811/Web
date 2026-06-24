import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShoppingCart, Sun, Moon, Menu, X, Gem, MessageSquare, ShieldAlert } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    currentPage,
    navigateTo,
    cart,
    searchQuery,
    setSearchQuery,
    trackAction
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (currentPage !== 'shop' && currentPage !== 'catalog') {
      navigateTo('catalog'); // redirect to catalog on typing
    }
  };

  const handleNavClick = (page: string) => {
    navigateTo(page);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackAction('searchesCount');
    if (currentPage !== 'shop' && currentPage !== 'catalog') {
      navigateTo('catalog');
    }
  };
  //{ id: 'analytics', label: 'Estadísticas', icon: BarChart2 },
  const navItems = [
    { id: 'shop', label: 'Shop', icon: ShoppingCart },
    { id: 'catalog', label: 'Catálogo', icon: Gem },
    { id: 'contact', label: 'Contacto', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 glass border-b border-mineral-200/30 dark:border-mineral-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div 
            onClick={() => handleNavClick('shop')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-gold-500 shadow-md group-hover:scale-105 transition-transform duration-300">
              <Gem className="w-6 h-6 text-white animate-pulse-slow" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-emerald-500 to-gold-500 blur-sm opacity-50 group-hover:opacity-80 transition-opacity"></div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-widest font-display bg-clip-text text-transparent">
                MINERALIA
              </span>
            </div>
          </div>

          {/* Description Tagline (Center-Left) */}
          <div className="hidden lg:flex flex-col max-w-xs text-left leading-tight ml-4 border-l border-mineral-200 dark:border-mineral-800 pl-4">
            <span className="text-[10px] text-mineral-400 dark:text-mineral-500">
              Compra y aprende de los cristales más raros de la Tierra.
            </span>
          </div>

          {/* Search Box */}
          <form 
            onSubmit={handleSearchSubmit} 
            className="hidden md:flex items-center relative max-w-xs w-full mx-4"
          >
            <input
              type="text"
              placeholder="Buscar minerales..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-mineral-200 dark:border-mineral-850 bg-mineral-50/50 dark:bg-mineral-900/50 text-mineral-800 dark:text-mineral-100 placeholder-mineral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-mineral-400" />
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-4 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive 
                    ? 'text-emerald-600 dark:text-gold-400 border border-emerald-500/20' 
                      : 'text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100/50 dark:hover:bg-mineral-900/50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                  <span>{item.label}</span>
                  {item.id === 'shop' && cartItemsCount > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-emerald-500 text-white font-bold animate-pulse">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 ml-2 rounded-xl text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100/50 dark:hover:bg-mineral-900/50 border border-transparent transition-all"
              aria-label="Alternar modo oscuro"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5 text-mineral-600" />}
            </button>
          </nav>

          {/* Mobile buttons */}
          <div className="flex items-center space-x-2 md:hidden">
            {/* Dark Mode */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-mineral-600 dark:text-mineral-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-gold-400" /> : <Moon className="w-5 h-5 text-mineral-600" />}
            </button>

            {/* Cart shortcut */}
            <button 
              onClick={() => handleNavClick('shop')}
              className="relative p-2 text-mineral-600 dark:text-mineral-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 px-1.5 py-0.5 text-[10px] rounded-full bg-emerald-500 text-white font-bold">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Menu burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100 dark:hover:bg-mineral-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass border-t border-mineral-200/30 dark:border-mineral-800/40 px-4 py-4 space-y-3">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="Buscar minerales..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-mineral-250 dark:border-mineral-800 bg-mineral-50/50 dark:bg-mineral-900/50 text-mineral-800 dark:text-mineral-100"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-mineral-400" />
          </form>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive 
                    ? 'text-emerald-600 dark:text-gold-400' 
                      : 'text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100/50 dark:hover:bg-mineral-900/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.id === 'shop' && cartItemsCount > 0 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500 text-white font-bold">
                      {cartItemsCount}
                    </span>
                  )}
                </button>
              );
            })}
            
            <button
              onClick={() => handleNavClick('legal')}
              className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100/50 dark:hover:bg-mineral-900/50`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Privacidad & Legal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
