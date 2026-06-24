import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Mineral } from '../context/AppContext';
import { ShoppingCart, Star, Trash2, ShieldCheck, Sparkles, RefreshCw, X, ShoppingBag, Gem } from 'lucide-react';

// Beautiful geometric mineral visual representation based on crystal system and color
export const MineralVisual: React.FC<{ mineral: Mineral; size?: 'sm' | 'md' | 'lg' }> = ({ mineral, size = 'md' }) => {
  const system = (mineral.crystalSystems || '').toLowerCase();
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-36 h-36',
    lg: 'w-48 h-48',
  };

  // Build unique gradient based on the mineral color and system
  const color = mineral.accentColor;
  
  let clipPath = '';
  let shadowGlow = '';
  
  if (system.includes('cubic')) {
    clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)'; // hexagon-like
    shadowGlow = '0 0 20px rgba(245, 158, 11, 0.4)';
  } else if (system.includes('hexagonal')) {
    clipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';
    shadowGlow = '0 0 20px rgba(16, 185, 129, 0.4)';
  } else if (system.includes('monoclinic') || system.includes('triclinic')) {
    clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'; // diamond
    shadowGlow = '0 0 20px rgba(239, 68, 68, 0.4)';
  } else {
    // Orthorhombic/other: crystal point
    clipPath = 'polygon(50% 0%, 90% 20%, 90% 80%, 50% 100%, 10% 80%, 10% 20%)';
    shadowGlow = '0 0 20px rgba(59, 130, 246, 0.4)';
  }

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
      <div 
        className="w-full h-full shadow-inner flex items-center justify-center relative overflow-hidden"
        style={{ 
          clipPath,
          background: `linear-gradient(135deg, ${color} 0%, hsl(210, 30%, 12%) 100%)`,
        }}
      >
        {/* Facet highlights */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50"></div>
        <div className="absolute top-0 left-0 w-full h-[50%] bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-y-12"></div>
        <div className="absolute bottom-0 right-0 w-6 h-12 bg-white/15 blur-sm rotate-45"></div>

        <Gem className="w-1/3 h-1/3 text-white/40 drop-shadow-md" />
      </div>
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
  } = useApp();

  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');

  const rarities = ['all', 'Común', 'Raro', 'Exótico', 'Legendario'];

  // Filter & Sort Minerals
  const filteredMinerals = minerals.filter(mineral => {
    if (selectedRarity === 'all') return true;
    return mineral.rarity === selectedRarity;
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

  return (
    <div className="min-h-screen pb-20">
      
      {/* 1. HERO BANNER & CTA (Prezi elements) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-mineral-900 to-mineral-950 text-white py-20 px-6 sm:px-12 lg:px-24 mb-12 rounded-2xl mx-4 sm:mx-8 mt-6 border border-mineral-800 shadow-2xl sci-box-gold">
        <div className="absolute inset-0 overflow-hidden sci-grid opacity-30"></div>
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated decorative graphics */}
          <div className="absolute -top-1/2 -left-1/4 w-[700px] h-[700px] rounded-full bg-emerald-500/10 blur-[120px] animate-pulse-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/4 w-[700px] h-[700px] rounded-full bg-gold-500/10 blur-[120px] animate-pulse-slow"></div>
        </div>
        
        {/* Telemetry labels */}
        <div className="absolute top-4 right-4 text-[8px] font-mono text-gold-500/60 uppercase select-none tracking-widest hidden md:block">
          SYS_STATUS: ACTIVE // STABLE_SYS // GRID_REF: MX_QRO
        </div>
        <div className="absolute bottom-4 left-6 text-[8px] font-mono text-emerald-500/50 select-none tracking-widest hidden md:block">
          GEOLOGICAL DATA ACQUISITION LAYER // LAT: 20.5888 N
        </div>
        
        <div className="relative max-w-4xl z-10 space-y-6">
          <span className="inline-flex items-center px-3 py-1 rounded bg-gold-500/10 text-gold-400 border border-gold-500/25 font-mono text-[10px] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> SPECIMENS_DB: ONLINE
          </span>
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight leading-none bg-gradient-to-r from-white via-mineral-100 to-mineral-300 bg-clip-text">
            Colecciona la Belleza <br />
            <span className="bg-gradient-to-r from-emerald-400 to-gold-400 bg-clip-text text-transparent">Geométrica</span> de la Tierra
          </h1>
          <p className="text-lg text-mineral-300 max-w-xl font-light">
            Adquiere especímenes cristalinos auténticos y accede a la base científica más completa del mundo. Despachos rápidos y asegurados con certificados de autenticidad.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <a 
              href="#tienda"
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-gold-500 hover:from-emerald-600 hover:to-gold-600 text-mineral-950 font-bold rounded-xl shadow-lg transition-transform hover:scale-105"
            >
              Comprar Especímenes
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
                <option value="default">Nombre (Por Defecto)</option>
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
                <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 text-2xs rounded-full bg-emerald-500 dark:bg-emerald-600 text-white font-black animate-bounce shadow">
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
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedMinerals.length === 0 ? (
              <div className="col-span-full text-center py-20 text-mineral-400">
                No se encontraron minerales con el filtro seleccionado.
              </div>
            ) : (
              sortedMinerals.map(mineral => (
                <div 
                  key={mineral.identifier}
                  className={`glass-card flex flex-col justify-between p-5 group ${
                    mineral.rarity === 'Legendario' ? 'sci-box-gold border border-gold-500/20' : 'sci-box'
                  }`}
                >
                  {/* Card Header & Rarity Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-mineral-500 bg-mineral-100 dark:bg-mineral-950/60 px-2 py-0.5 border border-mineral-200/50 dark:border-mineral-800/50 rounded">
                      {mineral.crystalSystems || 'Desconocido'}
                    </span>
                    <span 
                      className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        mineral.rarity === 'Legendario' 
                          ? 'bg-gold-500/10 text-gold-500 border border-gold-500/30' 
                          : mineral.rarity === 'Exótico'
                          ? 'bg-ruby-500/10 text-ruby-500 border border-ruby-500/30'
                          : mineral.rarity === 'Raro'
                          ? 'bg-sapphire-500/10 text-sapphire-500 border border-sapphire-500/30'
                          : 'bg-mineral-200/50 text-mineral-500 dark:bg-mineral-800'
                      }`}
                    >
                      {mineral.rarity}
                    </span>
                  </div>

                  {/* Mineral Aesthetic Image */}
                  <div className="flex justify-center items-center py-6 mb-4 bg-mineral-950/40 dark:bg-mineral-950/80 border border-mineral-200/30 dark:border-mineral-850/50 rounded-xl relative overflow-hidden sci-box sci-crosshairs">
                    <MineralVisual mineral={mineral} />
                    <div className="absolute top-1 left-2 text-[7px] font-mono text-emerald-500/40 select-none">SCAN_X: 405</div>
                    <div className="absolute bottom-1 right-2 text-[7px] font-mono text-emerald-500/40 select-none">ZOOM: 2.5X</div>
                  </div>

                  {/* Text details */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-mineral-800 dark:text-mineral-100 group-hover:text-emerald-500 transition-colors truncate">
                      {mineral.name}
                    </h3>
                    <p className="text-xs text-mineral-400 dark:text-mineral-500 font-mono truncate">
                      Fórmula: {mineral.chemicalFormula || 'No disponible'}
                    </p>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-1 py-1">
                      <Star className="w-4 h-4 fill-gold-500 text-gold-500" />
                      <span className="text-xs font-bold text-mineral-700 dark:text-mineral-300">
                        {mineral.rating.toFixed(1)}
                      </span>
                      <span className="text-2xs text-mineral-400 dark:text-mineral-500">
                        ({Math.round(mineral.price * 0.7)} reseñas)
                      </span>
                    </div>

                    {/* Price and Stock */}
                    <div className="flex justify-between items-end pt-2 border-t border-mineral-100 dark:border-mineral-800/40">
                      <div>
                        <span className="text-2xs font-bold text-mineral-400 uppercase tracking-wide block">Precio:</span>
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
                      onClick={() => addToCart(mineral)}
                      disabled={mineral.stock <= 0}
                      className="w-full mt-4 py-2.5 px-4 rounded-xl text-xs font-bold transition-transform hover:scale-[1.02] flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-gold-500 hover:from-emerald-600 hover:to-gold-600 text-mineral-950 disabled:bg-mineral-300 disabled:text-mineral-500 disabled:cursor-not-allowed shadow-md"
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
                        Explora la E-Shop para añadir especímenes.
                      </p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div 
                        key={item.mineral.identifier}
                        className="flex items-center justify-between p-3 rounded-xl bg-mineral-50/50 dark:bg-mineral-950/20 border border-mineral-200/30 dark:border-mineral-800/30"
                      >
                        <div className="flex items-center space-x-3">
                          <MineralVisual mineral={item.mineral} size="sm" />
                          <div className="space-y-1">
                            <h4 className="text-sm font-bold truncate max-w-[140px]">
                              {item.mineral.name}
                            </h4>
                            <p className="text-xs text-mineral-400">
                              ${item.mineral.price.toFixed(2)} USD
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
                        ${cartTotal.toFixed(2)} USD
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-mineral-400">
                      <span>Impuestos y Envío Asegurado:</span>
                      <span className="font-bold text-emerald-500 uppercase">Gratis</span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-gold-500 hover:from-emerald-600 hover:to-gold-600 text-mineral-950 font-black rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center space-x-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>Proceder a Comprar</span>
                    </button>
                    <p className="text-[10px] text-mineral-400 text-center leading-normal">
                      Compra protegida por cifrado SSL. Garantía de retorno de 30 días si el espécimen no cumple con tu entera satisfacción.
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
          <div className="glass border border-emerald-500/20 max-w-md w-full p-8 rounded-3xl text-center space-y-6 shadow-2xl animate-float">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-emerald-500" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-black font-display text-emerald-500 uppercase tracking-wide">
                ¡Compra Exitosa!
              </h2>
              <p className="text-sm text-mineral-500 dark:text-mineral-400">
                Tu orden ha sido procesada con éxito en nuestro sistema de simulación.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-mineral-100 dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-mineral-400">Número de Orden:</span>
                <span className="font-mono font-bold text-mineral-800 dark:text-mineral-200">{orderNumber}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-mineral-400">Estado de Envío:</span>
                <span className="font-bold text-emerald-500">Preparando Despacho</span>
              </div>
            </div>

            <p className="text-xs text-mineral-450 dark:text-mineral-500 leading-relaxed">
              Hemos enviado los detalles del despacho y el certificado digital de autenticidad mineralógica al correo del comprador. ¡Gracias por confiar en Mineralia!
            </p>

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
