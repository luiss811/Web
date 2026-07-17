import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ShoppingCart, Sun, Moon, Menu, X, ShieldAlert } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    currentPage,
    navigateTo,
    cart,
    searchQuery,
    setSearchQuery,
    trackAction,
    selectedCrystalSystem,
    setSelectedCrystalSystem,
    eventoCalendarizadoId,
    setEventoCalendarizadoId
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const crystalSystemsList = [
    { value: 'all', label: 'Todos los Sistemas' },
    { value: 'cubic', label: 'Cúbico (Isométrico)' },
    { value: 'hexagonal', label: 'Hexagonal' },
    { value: 'monoclinic', label: 'Monoclínico' },
    { value: 'triclinic', label: 'Triclínico' },
    { value: 'orthorhombic', label: 'Ortorrómbico' },
    { value: 'tetragonal', label: 'Tetragonal' }
  ];

  useEffect(() => {
    const container = document.getElementById('shop-dropdown-container');
    const dropdownMenu = document.getElementById('shop-dropdown-menu');

    if (container && dropdownMenu) {
      let timeoutId: number;

      const showDropdown = () => {
        clearTimeout(timeoutId);
        dropdownMenu.style.display = 'block';
        requestAnimationFrame(() => {
          dropdownMenu.style.opacity = '1';
          dropdownMenu.style.transform = 'translateY(0)';
        });
      };

      const hideDropdown = () => {
        dropdownMenu.style.opacity = '0';
        dropdownMenu.style.transform = 'translateY(10px)';
        timeoutId = window.setTimeout(() => {
          if (dropdownMenu.style.opacity === '0') {
            dropdownMenu.style.display = 'none';
          }
        }, 200);
      };

      container.addEventListener('mouseenter', showDropdown);
      container.addEventListener('mouseleave', hideDropdown);

      return () => {
        container.removeEventListener('mouseenter', showDropdown);
        container.removeEventListener('mouseleave', hideDropdown);
        clearTimeout(timeoutId);
      };
    }
  }, [currentPage]);

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
  const navItems = [
    { id: 'shop', label: 'Shop' },
    { id: 'catalog', label: 'Catálogo' },
    { id: 'contact', label: 'Contacto' },
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
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl shadow-md group-hover:scale-105 transition-transform duration-300">
              <img src="/src/assets/canek.png" alt="Canek Logo" className="w-8 h-8 relative z-10" />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-emerald-500 to-gold-500 blur-sm opacity-50 group-hover:opacity-80 transition-opacity"></div>
            </div>
            <div>
              <span className="text-2xl font-black font-display bg-gradient-to-r from-gray-800 to-gray-200 bg-clip-text text-transparent">
                Canek
              </span>
            </div>
          </div>

          {/* Description Tagline */}
          <div className="hidden lg:flex flex-col max-w-xs text-left leading-tight ml-4 border-l border-mineral-200 dark:border-mineral-800 pl-4">
            <span className="text-[15px] text-mineral-500 dark:text-mineral-100">
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
              const isActive = currentPage === item.id;

              if (item.id === 'shop') {
                return (
                  <div key={item.id} id="shop-dropdown-container" className="relative py-2">
                    <button
                      id="shop-nav-item"
                      onClick={() => {
                        setSelectedCrystalSystem('all');
                        handleNavClick(item.id);
                      }}
                      className={`flex items-center space-x-4 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-r from-emerald-500/10 to-gold-500/10 text-emerald-600 dark:text-gold-400 border border-emerald-500/20'
                        : 'text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100/50 dark:hover:bg-mineral-900/50 border border-transparent'
                        }`}
                    >
                      <span>{item.label}</span>
                      {cartItemsCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-emerald-500 text-white font-bold">
                          {cartItemsCount}
                        </span>
                      )}
                    </button>

                    {/* Dropdown Menu */}
                    <div id="shop-dropdown-menu" style={{ display: 'none', opacity: 0, transform: 'translateY(10px)', transition: 'all 0.2s ease-in-out' }} className="absolute left-0 mt-2 w-56 rounded-xl glass border border-mineral-200/30 dark:border-mineral-800/40 shadow-xl z-50 p-2">
                      <div className="text-[10px] font-bold text-mineral-450 dark:text-mineral-500 px-3 py-1.5 uppercase tracking-wider">
                        Sistemas de Cristalización
                      </div>
                      {crystalSystemsList.map((sys) => (
                        <button
                          key={sys.value}
                          onClick={() => {
                            setSelectedCrystalSystem(sys.value);
                            handleNavClick('shop');
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg text-left transition-colors ${selectedCrystalSystem === sys.value
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-gold-400 font-bold'
                            : 'text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100/50 dark:hover:bg-mineral-900/50'
                            }`}
                        >
                          <span>{sys.label}</span>
                          <span className="text-[10px] font-mono text-mineral-450 dark:text-mineral-500">
                            {sys.value === 'all' ? 'Ver todo' : sys.value}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-4 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-emerald-500/10 to-gold-500/10 text-emerald-600 dark:text-gold-400 border border-emerald-500/20'
                    : 'text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100/50 dark:hover:bg-mineral-900/50 border border-transparent'
                    }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Campaign */}
            <div className="flex items-center space-x-1.5 ml-3 bg-mineral-100/60 dark:bg-mineral-900/60 p-1.5 rounded-xl border border-mineral-200/30 dark:border-mineral-800/30">
              <span className="text-[10px] font-bold text-mineral-450 dark:text-mineral-500 uppercase tracking-wider px-1.5 hidden lg:inline">Evento:</span>
              <select
                value={eventoCalendarizadoId}
                onChange={(e) => setEventoCalendarizadoId(e.target.value)}
                className="bg-transparent text-[11px] font-bold text-mineral-700 dark:text-mineral-200 focus:outline-none cursor-pointer pr-4"
              >
                <option value="system" className="bg-white dark:bg-mineral-950 text-mineral-800 dark:text-mineral-100">Calendario</option>
                <option value="gaia" className="bg-white dark:bg-mineral-950 text-mineral-800 dark:text-mineral-100">Dia de Gaia</option>
                <option value="muertos" className="bg-white dark:bg-mineral-950 text-mineral-800 dark:text-mineral-100">Dia de muertos</option>
                <option value="none" className="bg-white dark:bg-mineral-950 text-mineral-800 dark:text-mineral-100">Desactivar</option>
              </select>
            </div>

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
              const isActive = currentPage === item.id;

              if (item.id === 'shop') {
                return (
                  <div key={item.id} className="flex flex-col space-y-1">
                    <button
                      onClick={() => {
                        setMobileShopOpen(!mobileShopOpen);
                        setSelectedCrystalSystem('all');
                        handleNavClick(item.id);
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive
                        ? 'bg-gradient-to-r from-emerald-500/10 to-gold-500/10 text-emerald-600 dark:text-gold-400'
                        : 'text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100/50 dark:hover:bg-mineral-900/50'
                        }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{item.label}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {cartItemsCount > 0 && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500 text-white font-bold">
                            {cartItemsCount}
                          </span>
                        )}
                        <span className="text-mineral-450 dark:text-mineral-500 text-[10px]">{mobileShopOpen ? '<' : '>'}</span>
                      </div>
                    </button>

                    {/* Collapsible Mobile Crystal Systems */}
                    {mobileShopOpen && (
                      <div className="pl-6 flex flex-col space-y-1 border-l border-mineral-200/30 dark:border-mineral-800/40 ml-5 py-1">
                        {crystalSystemsList.map((sys) => (
                          <button
                            key={sys.value}
                            onClick={() => {
                              setSelectedCrystalSystem(sys.value);
                              handleNavClick('shop');
                            }}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${selectedCrystalSystem === sys.value
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-gold-400'
                              : 'text-mineral-550 dark:text-mineral-400 hover:bg-mineral-100/30'
                              }`}
                          >
                            <span>{sys.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${isActive
                    ? 'bg-gradient-to-r from-emerald-500/10 to-gold-500/10 text-emerald-600 dark:text-gold-400'
                    : 'text-mineral-600 dark:text-mineral-300 hover:bg-mineral-100/50 dark:hover:bg-mineral-900/50'
                    }`}
                >
                  <div className="flex items-center space-x-2">
                    <span>{item.label}</span>
                  </div>
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

            {/* Mobile Campaign Simulator */}
            <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-mineral-100/50 dark:bg-mineral-900/30 border border-mineral-200/20 dark:border-mineral-800/20 mt-4">
              <span className="text-xs font-bold text-mineral-550 dark:text-mineral-400">Simulador de Evento:</span>
              <select
                value={eventoCalendarizadoId}
                onChange={(e) => setEventoCalendarizadoId(e.target.value)}
                className="bg-transparent text-xs font-bold text-mineral-700 dark:text-mineral-200 focus:outline-none cursor-pointer"
              >
                <option value="system" className="bg-white dark:bg-mineral-950 text-mineral-800 dark:text-mineral-100">Calendario</option>
                <option value="gaia" className="bg-white dark:bg-mineral-950 text-mineral-800 dark:text-mineral-100">Dia de Gaia</option>
                <option value="muertos" className="bg-white dark:bg-mineral-950 text-mineral-800 dark:text-mineral-100">Dia de muertos</option>
                <option value="none" className="bg-white dark:bg-mineral-950 text-mineral-800 dark:text-mineral-100">Desactivado</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
