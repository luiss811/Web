import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Mineral } from '../context/AppContext';
import { ShoppingCart, Star, Trash2, ShieldCheck, RefreshCw, X, ShoppingBag } from 'lucide-react';

// Beautiful geometric mineral visual representation based on crystal system and color
export const MineralVisual: React.FC<{ mineral: Mineral; size?: 'sm' | 'md' | 'lg' }> = ({ mineral, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
  };

  // Build unique gradient based on the mineral color and system
  const color = mineral.accentColor;

  // eslint-disable-next-line prefer-const
  let clipPath = '';
  // eslint-disable-next-line prefer-const
  let shadowGlow = '';


  return (
    <div className={`relative flex items-center justify-center ${sizeClasses[size]}`}>
      {/* Background glow */}
      <div
        className="absolute inset-0 scale-95 opacity-50 rounded-full blur-xl"
        style={{ backgroundColor: color }}
      ></div>

      {/* Dynamic Crystal facet 1 */}
      <div
        className="absolute inset-2 bg-gradient-to-tr from-white/20 via-transparent to-white/40 mix-blend-overlay border border-white/30"
        style={{
          clipPath,
          boxShadow: shadowGlow,
        }}
      ></div>

      {/* Main Core Crystal body */}

    </div>
  );
};
export const Shop: React.FC = () => {
  const {
    minerals,
    loading,
    error,
    apiPage,
    fetchMinerals,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    trackAction,
    selectedCrystalSystem,
    setSelectedCrystalSystem,
    activeCampaign,
  } = useApp();

  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  const rarities = ['all', 'Comun', 'Raro', 'Exotico', 'Unico'];

  const filteredMinerals = minerals.filter(mineral => {
    const matchesRarity = selectedRarity === 'all' || mineral.rarity === selectedRarity;
    const matchesSystem = selectedCrystalSystem === 'all' ||
      (mineral.crystalSystems && mineral.crystalSystems.toLowerCase().includes(selectedCrystalSystem.toLowerCase()));
    return matchesRarity && matchesSystem;
  });

  const sortedMinerals = [...filteredMinerals].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // Default
  });

  const cartTotal = cart.reduce((acc, item) => acc + item.mineral.price * item.quantity, 0);

  const handleCheckout = () => {
    const randomOrder = 'MIN-' + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrder);
    setCheckoutSuccess(true);
    trackAction('successfulOrders');
    clearCart();
  };

  const handleAddToCart = (mineral: Mineral) => {
    addToCart(mineral);

    if (activeCampaign && (activeCampaign.id === 'gaia' || activeCampaign.id === 'muertos')) {
      const isGaia = activeCampaign.id === 'gaia';

      const animEl = document.createElement('div');
      animEl.className = "fixed z-[9999] pointer-events-none flex flex-col items-center justify-center p-6 bg-mineral-900/95 dark:bg-mineral-950/95 border border-mineral-700/50 rounded-2xl shadow-2xl backdrop-blur-md";
      animEl.style.left = "50%";
      animEl.style.top = "50%";
      animEl.style.transform = "translate(-50%, -50%)";

      const earthSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-earth"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"/><path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2v0a2 2 0 0 1 2-2v0a2 2 0 0 0-2-2h-1.5"/><path d="M11.5 22H14a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2h-.27"/><path d="M3 14h3.3a2 2 0 0 1 1.9 2.7L7.5 19.3a2 2 0 0 0 1.9 2.7H11"/><circle cx="12" cy="12" r="10"/></svg>`;

      const skullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-skull"><path d="M12 2a10 10 0 0 0-10 10c0 4.4 3.6 8 8 8H14c4.4 0 8-3.6 8-8A10 10 0 0 0 12 2Z"/><path d="M12 22v-2"/><path d="M9 16h6"/><path d="M10 10h.01"/><path d="M14 10h.01"/></svg>`;

      animEl.innerHTML = `
        <div class="flex flex-col items-center justify-center animate-cart-bounce">
          ${isGaia ? earthSvg : skullSvg}
          <span class="mt-3 text-sm font-bold text-white tracking-wide uppercase">
            Mineral Agregado! :)
          </span>
        </div>
      `;

      document.body.appendChild(animEl);

      const animation = animEl.animate([
        { opacity: '0', transform: 'translate(-50%, calc(-50% + 40px)) scale(0.5)' },
        { opacity: '1', transform: 'translate(-50%, -50%) scale(1.1)', offset: 0.15 },
        { transform: 'translate(-50%, -50%) scale(1)', offset: 0.3 },
        { opacity: '1', transform: 'translate(-50%, calc(-50% - 20px)) scale(1)', offset: 0.8 },
        { opacity: '0', transform: 'translate(-50%, calc(-50% - 100px)) scale(0.8)' }
      ], {
        duration: 4000,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards'
      });

      const svgEl = animEl.querySelector('svg');
      if (svgEl) {
        if (isGaia) {
          svgEl.animate([
            { transform: 'rotate(0deg)' },
            { transform: 'rotate(360deg)' }
          ], {
            duration: 6000,
            iterations: Infinity,
            easing: 'linear'
          });
        } else {
          svgEl.animate([
            { transform: 'scale(1)' },
            { transform: 'scale(1.1)' },
            { transform: 'scale(1)' }
          ], {
            duration: 1000,
            iterations: Infinity,
            easing: 'ease-in-out'
          });
        }
      }

      animation.onfinish = () => {
        animEl.remove();
      };
    }
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* BANNER & CTA */}
      <section className={`relative overflow-hidden text-white py-20 px-6 sm:px-12 lg:px-24 mb-12 rounded-2xl mx-4 sm:mx-8 mt-6 border shadow-2xl transition-all duration-500 ${activeCampaign
        ? (activeCampaign.id === 'gaia'
          ? 'bg-gradient-to-r from-emerald-950 via-mineral-950 to-teal-950 border-emerald-800/40 shadow-emerald-500/5'
          : 'bg-gradient-to-r from-purple-950 via-mineral-950 to-orange-950 border-purple-800/30 shadow-purple-500/5')
        : 'bg-gradient-to-r from-mineral-900 to-mineral-950 border-mineral-800 shadow-gold-500/5'
        }`}>
        <div className="absolute inset-0 overflow-hidden sci-grid opacity-30"></div>
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated decorative graphics */}
          <div className={`absolute -top-1/2 -left-1/4 w-[700px] h-[700px] rounded-full blur-[120px] animate-pulse-slow transition-colors duration-500 ${activeCampaign
            ? (activeCampaign.id === 'gaia' ? 'bg-emerald-500/10' : 'bg-purple-500/10')
            : 'bg-emerald-500/10'
            }`}></div>
          <div className={`absolute -bottom-1/2 -right-1/4 w-[700px] h-[700px] rounded-full blur-[120px] animate-pulse-slow transition-colors duration-500 ${activeCampaign
            ? (activeCampaign.id === 'gaia' ? 'bg-teal-500/10' : 'bg-orange-500/10')
            : 'bg-gold-500/10'
            }`}></div>
          {activeCampaign ? (
            activeCampaign.id === 'gaia' ? (
              <>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoMScapOb56wfNXewvdnLsuYB143BmQZM7VfJgvayqfRvmXHuFDXOBY8c&s=10"
                  alt="Gaia"
                  className={`absolute inset-0 w-full h-full object-cover duration-500`}
                />
              </>
            ) : (
              <>
                <img
                  src="https://thumbs.dreamstime.com/b/cristales-oscuros-y-relucientes-en-una-superficie-texturada-con-efecto-espumoso-descubra-la-belleza-de-los-brillantes-descansando-379493207.jpg"
                  alt="Cristales oscuros"
                  className={`absolute inset-0 w-full h-full object-cover duration-500`}
                />
              </>
            )
          ) : (
            <>
              <img
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=1920,fit=crop/SXlqp9cI9TSN8EVD/img_20251027_152656343_mfnr-Y170sgt6mcC1UUWI.jpg"
                alt="Canek Logo"
                className={`absolute inset-0 w-full h-full object-cover duration-500`}
              />
            </>
          )}
        </div>
        
        {/* Telemetry labels */}
        <div className="relative max-w-4xl z-10 space-y-6">
          <div className="relative max-w-4xl z-10 space-y-6">
            <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-none text-white">
              {activeCampaign ? (
                activeCampaign.id === 'gaia' ? (
                  <>
                    Día de <br />
                    <span className="text-emerald-400">Gaia</span>
                  </>
                ) : (
                  <>
                    Día de <br />
                    <span className="text-purple-400">Muertos</span>
                  </>
                )
              ) : (
                <>
                  Colecciona la Belleza <br /> Geometrica de la Tierra
                </>
              )}
            </h1>
            <p className="text-lg text-mineral-100 max-w-xl transition-all duration-500">
              {activeCampaign ? activeCampaign.bannerDesc : 'Adquiere especimenes cristalinos autenticos y accede a la base cientifica más completa del mundo. Despachos rapidos y asegurados con certificados de autenticidad.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#tienda"
                className={`px-8 py-3.5 text-mineral-950 font-bold rounded-xl shadow-lg transition-all hover:scale-105 text-center ${activeCampaign
                  ? (activeCampaign.id === 'gaia'
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white')
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  }`}
              >
                Comprar Especimenes
              </a>
              <button
                onClick={() => {
                  const el = document.getElementById('tienda');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-8 py-3.5 bg-mineral-800/80 hover:bg-mineral-800 text-white font-bold rounded-xl border border-mineral-700 transition-colors"
              >
                Ver Ofertas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main E-Shop area */}
      <div id="tienda" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Filters and Search Bar Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 bg-white dark:bg-mineral-900 p-5 rounded-2xl border border-mineral-200/50 dark:border-mineral-800/50 shadow-sm">
          {/* Rarity filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-mineral-400 uppercase tracking-wider mr-2">Filtrar Rareza:</span>
            {rarities.map(rarity => (
              <button
                key={rarity}
                onClick={() => setSelectedRarity(rarity)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRarity === rarity
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-mineral-100 dark:bg-mineral-800 text-mineral-600 dark:text-mineral-300 hover:bg-mineral-200 dark:hover:bg-mineral-750'
                }`}
              >
                {rarity === 'all' ? 'Todos' : rarity}
              </button>
            ))}

            {/* Crystal System Active Badge */}
            {selectedCrystalSystem !== 'all' && (
              <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-gold-400 border border-emerald-500/20 animate-fadeIn ml-2">
                <span>Sistema: <span className="capitalize">{selectedCrystalSystem}</span></span>
                <button
                  onClick={() => setSelectedCrystalSystem('all')}
                  className="hover:text-ruby-500 dark:hover:text-ruby-400 transition-colors font-extrabold focus:outline-none ml-1"
                  title="Quitar filtro de sistema"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Sorters & Actions */}
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-mineral-400 uppercase tracking-wider">Ordenar:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-mineral-50 dark:bg-mineral-850 text-mineral-700 dark:text-mineral-200 border border-mineral-200 dark:border-mineral-800 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="default">Nombre</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Calificación</option>
              </select>
            </div>

            {/* Cart Trigger Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-mineral-100 dark:bg-mineral-800 text-mineral-700 dark:text-mineral-200 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
              aria-label="Abrir Carrito"
            >
              <ShoppingCart className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-1xs rounded-full bg-emerald-500 dark:bg-emerald-600 text-white font-black shadow">
                  {cart.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* API Fetching State Handlers */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin" />
            <p className="text-sm font-semibold text-mineral-500 dark:text-mineral-400">
              Consultando catálogo de minerales en GeoAPIs.io...
            </p>
          </div>
        ) : error ? (
          <div className="bg-ruby-50 dark:bg-ruby-950/20 border border-ruby-200 dark:border-ruby-900/50 rounded-2xl p-8 text-center max-w-2xl mx-auto my-12 shadow-md">
            <h2 className="text-xl font-bold text-ruby-600 dark:text-ruby-400 mb-3">Error de Conexión de Datos</h2>
            <p className="text-sm text-mineral-600 dark:text-mineral-400 leading-relaxed mb-6">
              {error}
            </p>
            <button
              onClick={() => fetchMinerals(apiPage)}
              className="px-6 py-2.5 bg-ruby-600 hover:bg-ruby-750 text-white font-bold rounded-xl shadow transition-transform hover:scale-105 flex items-center justify-center mx-auto space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Intentar Reconexión</span>
            </button>
          </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedMinerals.length === 0 ? (
              <div className="col-span-full text-center py-20 text-mineral-400">
                No se encontraron minerales con el filtro seleccionado.
              </div>
            ) : (
              sortedMinerals.map(mineral => (
                <div 
                  key={mineral.identifier}
                  className={`glass-card spotlight-card flex flex-col justify-between p-5 group ${
                    mineral.rarity === 'Unico' ? 'sci-box-gold border border-gold-500/20' : 'sci-box'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-mineral-500 bg-mineral-100 dark:bg-mineral-950/60 px-2 py-0.5 border border-mineral-200/50 dark:border-mineral-800/50 rounded">
                      {mineral.crystalSystems || 'Desconocido'}
                    </span>
                    <span 
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        mineral.rarity === 'Unico' 
                          ? 'bg-gold-500/10 text-gold-500 border border-gold-500/30' 
                        : mineral.rarity === 'Exotico'
                          ? 'bg-ruby-500/10 text-ruby-500 border border-ruby-500/30'
                          : mineral.rarity === 'Raro'
                          ? 'bg-sapphire-500/10 text-sapphire-500 border border-sapphire-500/30'
                          : 'bg-mineral-200/50 text-mineral-500 dark:bg-mineral-800'
                      }`}
                    >
                      {mineral.rarity}
                    </span>
                  </div>

                  <div className="flex justify-center items-center py-6 mb-4 border border-mineral-200/30 dark:border-mineral-850/50 rounded-xl relative overflow-hidden sci-box sci-crosshairs">
                    <img src={`${mineral.crystalSystems === 'cubic' ? '/src/assets/cubico.png' :
                        mineral.crystalSystems === 'hexagonal' ? '/src/assets/hexagonal.png' :
                          mineral.crystalSystems === 'tetragonal' ? '/src/assets/tetragonal.png' :
                            mineral.crystalSystems === 'orthorhombic' ? '/src/assets/otorrombico.png' :
                              mineral.crystalSystems === 'monoclinic' ? '/src/assets/monoclinico.png' :
                              mineral.crystalSystems === 'triclinic' ? '/src/assets/triclinico.png' :
                                  ''
                      }`} />
                  </div>

                  {/* Text details */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-display font-bold text-mineral-800 dark:text-mineral-100 group-hover:text-emerald-500 transition-colors truncate">
                      {mineral.name}
                    </h3>
                    <p className="text-xs text-mineral-700 dark:text-mineral-800 font-display truncate">
                      Fórmula: {mineral.chemicalFormula || 'No disponible'}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 py-1">
                      <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                      <span className="text-xs font-display text-mineral-700 dark:text-mineral-300">
                        {mineral.rating.toFixed(1)}
                      </span>
                      <span className="text-2xs text-mineral-400 dark:text-mineral-500">
                        ({Math.round(mineral.price * 0.7)} reseñas)
                      </span>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex justify-between items-end pt-2 border-t border-mineral-100 dark:border-mineral-800/40">
                      <div>
                        <span className="text-2xs font-display text-mineral-400 uppercase tracking-wide block">Precio:</span>
                        <span className="text-xl font-black text-mineral-800 dark:text-mineral-100 font-display">
                          ${mineral.price.toFixed(2)} USD
                        </span>
                      </div>
                      <span className="text-2xs text-mineral-400 dark:text-mineral-500 mb-1">
                        Stock: {mineral.stock} u.
                      </span>
                    </div>

                    {/* Add to Cart CTA */}
                    <button
                      onClick={() => handleAddToCart(mineral)}
                      disabled={mineral.stock <= 0}
                      className="w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-display transition-transform hover:scale-[1.02] flex items-center justify-center space-x-2 hover:from-emerald-600 hover:to-gold-600 text-mineral-950 disabled:bg-mineral-300 disabled:text-mineral-500 disabled:cursor-not-allowed shadow-md"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>{mineral.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}</span>
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* 2. SHOPPING CART DRAWER (Prezi requirement for e-commerce) */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-mineral-950/60 backdrop-blur-sm transition-opacity" onClick={() => setCartOpen(false)}></div>
            
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className="pointer-events-auto w-screen max-w-md transform transition-transform duration-500 ease-in-out glass border-l border-mineral-200/50 dark:border-mineral-800/50 flex flex-col justify-between shadow-2xl h-full text-mineral-800 dark:text-mineral-100">
                
                {/* Cart Drawer Header */}
                <div className="px-6 py-6 border-b border-mineral-200/50 dark:border-mineral-800/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-5 h-5 text-emerald-500" />
                    <h2 className="text-lg font-bold font-display">Carrito de Compras</h2>
                  </div>
                  <button 
                    onClick={() => setCartOpen(false)}
                    className="p-1 rounded-lg text-mineral-400 hover:bg-mineral-100 dark:hover:bg-mineral-800 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto py-6 px-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-mineral-450 dark:text-mineral-500 space-y-4">
                      <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
                      <p className="text-sm font-semibold text-center leading-normal">
                        Tu carrito está vacío.<br />
                        Explora la tienda para añadir especímenes.
                      </p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div 
                        key={item.mineral.identifier}
                        className="flex items-center justify-between p-3 rounded-xl bg-mineral-50/50 dark:bg-mineral-950/20 border border-mineral-200/30 dark:border-mineral-800/30"
                      >
                        <div className="flex items-center space-x-3">

                          <div className="space-y-1">
                            <h4 className="text-sm font-bold truncate max-w-[140px]">
                              {item.mineral.name}
                            </h4>
                            <p className="text-xs text-mineral-400">
                              ${item.mineral.price.toFixed(2)} MXN
                            </p>
                            
                            {/* Quantity controls */}
                            <div className="flex items-center space-x-1.5 pt-1">
                              <button 
                                onClick={() => updateCartQuantity(item.mineral.identifier, item.quantity - 1)}
                                className="w-5 h-5 rounded bg-mineral-200 dark:bg-mineral-850 flex items-center justify-center text-xs font-black hover:bg-mineral-300"
                              >
                                -
                              </button>
                              <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item.mineral.identifier, item.quantity + 1)}
                                className="w-5 h-5 rounded bg-mineral-200 dark:bg-mineral-850 flex items-center justify-center text-xs font-black hover:bg-mineral-300"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <span className="text-sm font-black font-display block">
                            ${(item.mineral.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.mineral.identifier)}
                            className="p-1 text-ruby-500 hover:bg-ruby-500/10 rounded-lg transition-colors ml-auto block"
                            title="Eliminar ítem"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart Checkout Footer */}
                {cart.length > 0 && (
                  <div className="px-6 py-6 border-t border-mineral-200/50 dark:border-mineral-800/50 bg-mineral-50/50 dark:bg-mineral-950/30 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-mineral-500 dark:text-mineral-400">Subtotal:</span>
                      <span className="text-2xl font-black font-display text-emerald-500">
                        ${cartTotal.toFixed(2)} MXN
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-mineral-400">
                      <span>Impuestos y Envío Asegurado:</span>
                      <span className="font-bold text-emerald-500 uppercase">Gratis</span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 hover:from-emerald-600 hover:to-gold-600 text-mineral-950 font-black rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center space-x-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>Proceder a Comprar</span>
                    </button>
                    <p className="text-[10px] text-mineral-400 text-center leading-normal">
                      Garantía de retorno de 30 días si el espécimen no cumple con tu entera satisfacción.
                    </p>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CHECKOUT SUCCESS MODAL (Prezi layout element) */}
      {checkoutSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mineral-950/80 backdrop-blur-md">
          <div className="glass border border-emerald-500/20 max-w-md w-full p-8 rounded-3xl text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black font-display text-emerald-500 uppercase tracking-wide">
                ¡Compra Exitosa!
              </h2>
              <p className="text-sm text-mineral-500 dark:text-mineral-400">
                El pedido se completo correctamente.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-mineral-100 dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-mineral-400">Número de Pedido:</span>
                <span className="font-mono font-bold text-mineral-800 dark:text-mineral-200">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-mineral-400">Estado de Envío:</span>
                <span className="font-bold text-emerald-500">Preparando Despacho</span>
              </div>
            </div>

            <button
              onClick={() => setCheckoutSuccess(false)}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors shadow"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
