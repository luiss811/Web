import React from 'react';
import { useApp } from '../context/AppContext';
import { BarChart2, Activity, Eye, Search, ShoppingBag, Database, Users, ShieldAlert, Cpu } from 'lucide-react';

export const Analytics: React.FC = () => {
  const { stats, apiPage, apiTotalPages, apiTotalItems } = useApp();

  const pageViewArray = Object.entries(stats.pageViews);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const totalViews = pageViewArray.reduce((acc, [_, val]) => acc + val, 0);

  // Simulated traffic sources
  const trafficSources = [
    { source: 'Búsqueda Orgánica (Google/Bing)', percentage: 48, color: 'bg-emerald-500' },
    { source: 'Tráfico Directo', percentage: 27, color: 'bg-gold-500' },
    { source: 'Redes Sociales (Instagram/Facebook)', percentage: 15, color: 'bg-ruby-500' },
    { source: 'Sitios Referidos (Mindat/GeoAPIs)', percentage: 10, color: 'bg-sapphire-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Intro */}
      <div className="space-y-4 mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-mineral-800 dark:text-mineral-100">
          Panel de <span className="bg-clip-text text-transparent">Analíticas</span> y Estadísticas
        </h1>
        <p className="text-sm text-mineral-500 dark:text-mineral-400 leading-relaxed">
          Monitoreo en tiempo real de la actividad del portal, tráfico de usuarios, interacciones del carro de compras e indicadores técnicos de respuesta de la API.
        </p>
      </div>

      {/* Grid of counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Total Views */}
        <div className="glass-card sci-box p-6 flex items-center space-x-4 relative overflow-hidden">
          <div className="absolute top-1 right-2 text-[7px] font-mono text-emerald-500/50 select-none">T_VIEW_M</div>
          <div className="w-12 h-12 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
            <Eye className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-widest block">// Vistas de Página</span>
            <span className="text-2xl font-black font-mono text-mineral-800 dark:text-mineral-100">{totalViews}</span>
          </div>
        </div>

        {/* Searches */}
        <div className="glass-card sci-box p-6 flex items-center space-x-4 relative overflow-hidden">
          <div className="absolute top-1 right-2 text-[7px] font-mono text-gold-500/50 select-none">DB_SRCH_M</div>
          <div className="w-12 h-12 rounded bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 flex-shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-widest block">// Búsquedas</span>
            <span className="text-2xl font-black font-mono text-mineral-800 dark:text-mineral-100">{stats.searchesCount}</span>
          </div>
        </div>

        {/* Cart Additions */}
        <div className="glass-card sci-box p-6 flex items-center space-x-4 relative overflow-hidden">
          <div className="absolute top-1 right-2 text-[7px] font-mono text-sapphire-500/50 select-none">CRT_ADD_M</div>
          <div className="w-12 h-12 rounded bg-sapphire-500/10 border border-sapphire-500/20 flex items-center justify-center text-sapphire-500 flex-shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-widest block">// Carro Items</span>
            <span className="text-2xl font-black font-mono text-mineral-800 dark:text-mineral-100">{stats.itemsAddedToCart}</span>
          </div>
        </div>

        {/* Orders Processed */}
        <div className="glass-card sci-box p-6 flex items-center space-x-4 relative overflow-hidden">
          <div className="absolute top-1 right-2 text-[7px] font-mono text-ruby-500/50 select-none">CHK_OUT_M</div>
          <div className="w-12 h-12 rounded bg-ruby-500/10 border border-ruby-500/20 flex items-center justify-center text-ruby-500 flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-widest block">// Transacciones</span>
            <span className="text-2xl font-black font-mono text-mineral-800 dark:text-mineral-100">{stats.successfulOrders}</span>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Page views chart (CSS represented) */}
        <div className="lg:col-span-2 glass-card sci-box p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-mineral-200/40 dark:border-mineral-800/40 pb-4">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold font-display">Vistas por Sección</h2>
            </div>
            <span className="text-[10px] bg-mineral-100 dark:bg-mineral-800 px-2.5 py-1 rounded text-mineral-500 font-mono font-bold">
              Historial de Sesión
            </span>
          </div>

          <div className="space-y-4.5 pt-2">
            {pageViewArray.map(([pageKey, count]) => {
              const percentage = totalViews > 0 ? Math.round((count / totalViews) * 100) : 0;
              const pageLabels: Record<string, string> = {
                shop: 'E-Shop / Tienda',
                catalog: 'Catálogo de Minerales',
                analytics: 'Estadísticas / Tráfico',
                contact: 'Contacto / Mapa',
                legal: 'Políticas Legales'
              };
              
              return (
                <div key={pageKey} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold font-mono">
                    <span className="text-mineral-700 dark:text-mineral-200">{pageLabels[pageKey]}</span>
                    <span className="text-emerald-500 font-mono">{count} vistas ({percentage}%)</span>
                  </div>
                  <div className="w-full h-3 rounded bg-mineral-150 dark:bg-mineral-950/80 border border-mineral-200/30 dark:border-mineral-800/40 overflow-hidden">
                    <div 
                      className="h-full rounded-sm transition-all duration-1000"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="glass-card sci-box p-6 space-y-6">
          <div className="flex items-center space-x-2 border-b border-mineral-200/40 dark:border-mineral-800/40 pb-4">
            <Users className="w-5 h-5 text-gold-500" />
            <h2 className="text-lg font-bold font-display">Fuentes de Tráfico</h2>
          </div>

          <div className="space-y-5 pt-2">
            {trafficSources.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-mineral-700 dark:text-mineral-200">{item.source}</span>
                  <span className="text-mineral-550 font-mono font-bold">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-mineral-100 dark:bg-mineral-900 overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Technical API Stats */}
      <div className="mt-8 glass-card sci-box-gold p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-mineral-200/40 dark:border-mineral-800/40 pb-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-sapphire-500" />
            <h2 className="text-lg font-bold font-display">Indicadores Técnicos de Conectividad</h2>
          </div>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest">
            API_SOURCE: GEOAPIS.IO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Latency card */}
          <div className="p-4 rounded-xl bg-mineral-50 dark:bg-mineral-950/20 border border-mineral-200/30 dark:border-mineral-800/30 flex items-center space-x-3.5">
            <Cpu className="w-8 h-8 text-emerald-500 flex-shrink-0" />
            <div>
              <span className="text-3xs font-bold text-mineral-400 uppercase tracking-wide block">Latencia Media de Respuesta</span>
              <span className="text-lg font-black font-mono text-mineral-800 dark:text-mineral-100">
                {stats.apiLatency === 0 ? 'Sin datos' : `${stats.apiLatency} ms`}
              </span>
            </div>
          </div>

          {/* Calls count */}
          <div className="p-4 rounded-xl bg-mineral-50 dark:bg-mineral-950/20 border border-mineral-200/30 dark:border-mineral-800/30 flex items-center space-x-3.5">
            <Database className="w-8 h-8 text-sapphire-500 flex-shrink-0" />
            <div>
              <span className="text-3xs font-bold text-mineral-400 uppercase tracking-wide block">Llamadas Realizadas</span>
              <span className="text-lg font-black font-mono text-mineral-800 dark:text-mineral-100">
                {stats.apiCalls} peticiones
              </span>
            </div>
          </div>

          {/* Errors count */}
          <div className="p-4 rounded-xl bg-mineral-50 dark:bg-mineral-950/20 border border-mineral-200/30 dark:border-mineral-800/30 flex items-center space-x-3.5">
            <ShieldAlert className="w-8 h-8 text-ruby-500 flex-shrink-0" />
            <div>
              <span className="text-3xs font-bold text-mineral-400 uppercase tracking-wide block">Errores Registrados</span>
              <span className={`text-lg font-black font-mono ${stats.apiErrors > 0 ? 'text-ruby-500' : 'text-emerald-500'}`}>
                {stats.apiErrors} fallos
              </span>
            </div>
          </div>

        </div>

        {/* Database general information */}
        <div className="p-4 rounded-xl bg-mineral-100/40 dark:bg-mineral-900/30 border border-mineral-200/30 dark:border-mineral-800/30 flex flex-col md:flex-row items-center justify-between text-xs text-mineral-500 space-y-3 md:space-y-0">
          <div>
            Página de API activa: <span className="font-bold text-mineral-700 dark:text-mineral-200">{apiPage}</span> de <span className="font-bold text-mineral-700 dark:text-mineral-200">{apiTotalPages}</span>.
          </div>
          <div>
            Índice de base de datos: <span className="font-bold text-mineral-700 dark:text-mineral-200">{apiTotalItems} especies de minerales registradas</span>.
          </div>
          <div>
            Proveedor de API: <span className="font-bold text-mineral-700 dark:text-mineral-200">Ben Norton / GeoAPIs.io</span>.
          </div>
        </div>

      </div>

    </div>
  );
};
