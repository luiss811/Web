import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart2, Activity, Eye, Search, ShoppingBag, Database, ShieldAlert, Cpu, Award, Zap } from 'lucide-react';

interface LighthouseReport {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  metrics: {
    firstContentfulPaint: string;
    speedIndex: string;
    largestContentfulPaint: string;
    interactive: string;
    totalBlockingTime: string;
    cumulativeLayoutShift: string;
  };
}

const CircularProgress: React.FC<{ score: number; label: string; colorClass: string }> = ({ score, label, colorClass }) => {
  const radius = 26;
  const stroke = 5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="relative w-14 h-14 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            className="text-mineral-200 dark:text-mineral-800"
            strokeWidth={stroke}
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx={radius + stroke}
            cy={radius + stroke}
          />
          <circle
            className={`transition-all duration-1000 ease-out ${colorClass}`}
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={normalizedRadius}
            cx={radius + stroke}
            cy={radius + stroke}
          />
        </svg>
        <span className="absolute text-[11px] font-black font-mono text-mineral-800 dark:text-mineral-100">{score}</span>
      </div>
      <span className="text-[9px] font-bold text-mineral-450 dark:text-mineral-400 uppercase tracking-wide text-center leading-none">{label}</span>
    </div>
  );
};

export const Analytics: React.FC = () => {
  const { stats, apiPage, apiTotalPages, apiTotalItems } = useApp();

  const pageViewArray = Object.entries(stats.pageViews);
  const totalViews = pageViewArray.reduce((acc, entry) => acc + entry[1], 0);

  // Lighthouse State
  const [lhReport, setLhReport] = useState<LighthouseReport | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState('');

  // Fetch report on mount
  useEffect(() => {
    const fetchLighthouseReport = async () => {
      setIsLoadingReport(true);
      try {
        const response = await fetch('/lighthouse-report.json');
        if (response.ok) {
          const data = await response.json();
          setLhReport(data);
        }
      } catch (err) {
        console.warn("Could not load static Lighthouse report.", err);
      } finally {
        setIsLoadingReport(false);
      }
    };
    fetchLighthouseReport();
  }, []);

  // Run real Google PageSpeed Insights audit
  const runRealAudit = async () => {
    setIsAuditing(true);
    setAuditStep('Contactando con Google PageSpeed Insights API...');
    try {
      const targetUrl = 'https://geoapis.io';
      const categories = ['performance', 'accessibility', 'best-practices', 'seo'];
      const categoriesQuery = categories.map(cat => `category=${cat}`).join('&');
      const pagespeedUrl = `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&${categoriesQuery}`;

      setAuditStep('Ejecutando auditoría de Lighthouse en tiempo real (puede tardar hasta 30s)...');
      const response = await fetch(pagespeedUrl);
      if (!response.ok) {
        throw new Error(`Error de API: Código ${response.status}`);
      }

      setAuditStep('Procesando resultados de la auditoría de Google...');
      const rawData = await response.json();
      const result = rawData.lighthouseResult;

      if (!result || !result.categories) {
        throw new Error('Estructura de respuesta de API inválida');
      }

      const getScore = (catKey: string) => Math.round((result.categories[catKey]?.score || 0) * 100);
      const getAuditVal = (auditKey: string, fallback: string) => {
        return result.audits[auditKey]?.displayValue || result.audits[auditKey]?.numericValue || fallback;
      };

      const newReport: LighthouseReport = {
        performance: getScore('performance'),
        accessibility: getScore('accessibility'),
        bestPractices: getScore('best-practices'),
        seo: getScore('seo'),
        metrics: {
          firstContentfulPaint: getAuditVal('first-contentful-paint', '0.4s'),
          speedIndex: getAuditVal('speed-index', '0.7s'),
          largestContentfulPaint: getAuditVal('largest-contentful-paint', '0.9s'),
          interactive: getAuditVal('interactive', '0.6s'),
          totalBlockingTime: `${Math.round(result.audits['total-blocking-time']?.numericValue || 10)}ms`,
          cumulativeLayoutShift: getAuditVal('cumulative-layout-shift', '0.00')
        }
      };

      setLhReport(newReport);
      setAuditStep('');
    } catch (err) {
      console.error("Error al ejecutar la auditoría real:", err);
      const errMsg = err instanceof Error ? err.message : 'No se pudo completar la auditoría';
      setAuditStep(`Error: ${errMsg}`);
      // Clear error after timeout
      setTimeout(() => {
        setAuditStep('');
      }, 5000);
    } finally {
      setIsAuditing(false);
    }
  };

  const getColorClass = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-ruby-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Intro */}
      <div className="space-y-4 mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-mineral-800 dark:text-mineral-100">
          Panel de Analíticas
        </h1>
        <p className="text-sm text-mineral-500 dark:text-mineral-400 leading-relaxed">
          Monitoreo de la actividad, tráfico de usuarios, interacciones del carrito de compras y auditorías de Lighthouse.
        </p>
      </div>

      {/* Grid of counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        
        {/* Total Views */}
        <div className="glass-card sci-box p-6 flex items-center space-x-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
            <Eye className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-widest block">Vistas de Página</span>
            <span className="text-2xl font-black font-mono text-mineral-800 dark:text-mineral-100">{totalViews}</span>
          </div>
        </div>

        {/* Searches */}
        <div className="glass-card sci-box p-6 flex items-center space-x-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-500 flex-shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-widest block">Búsquedas</span>
            <span className="text-2xl font-black font-mono text-mineral-800 dark:text-mineral-100">{stats.searchesCount}</span>
          </div>
        </div>

        {/* Cart Additions */}
        <div className="glass-card sci-box p-6 flex items-center space-x-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded bg-sapphire-500/10 border border-sapphire-500/20 flex items-center justify-center text-sapphire-500 flex-shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-widest block">Carro Items</span>
            <span className="text-2xl font-black font-mono text-mineral-800 dark:text-mineral-100">{stats.itemsAddedToCart}</span>
          </div>
        </div>

        {/* Orders Processed */}
        <div className="glass-card sci-box p-6 flex items-center space-x-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded bg-ruby-500/10 border border-ruby-500/20 flex items-center justify-center text-ruby-500 flex-shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-widest block">Transacciones</span>
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
                shop: 'Shop / Tienda',
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
                      className="h-full rounded-sm transition-all duration-1000 bg-emerald-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lighthouse Audit Panel */}
        <div className="glass-card sci-box p-6 space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-mineral-200/40 dark:border-mineral-800/40 pb-4">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-emerald-500" />
                <h2 className="text-lg font-bold font-display">Lighthouse Audits</h2>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 border border-emerald-500/20 rounded font-mono font-bold uppercase tracking-wide">
                Production
              </span>
            </div>

            {/* Real loading or scores */}
            {isAuditing || isLoadingReport || !lhReport ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4 min-h-[220px]">
                <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                <div className="text-center px-4">
                  <p className="text-xs font-mono font-bold text-emerald-500 animate-pulse">
                    {isAuditing ? 'Corriendo auditoría real...' : 'Cargando métricas de Lighthouse...'}
                  </p>
                  <p className="text-[10px] text-mineral-450 dark:text-mineral-500 font-mono mt-2 max-w-[240px] mx-auto leading-relaxed">
                    {auditStep || 'Obteniendo reporte de auditoría estática desde el servidor...'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 pt-4">
                {/* Circular scores grid */}
                <div className="grid grid-cols-4 gap-2">
                  <CircularProgress score={lhReport.performance} label="Perf" colorClass={getColorClass(lhReport.performance)} />
                  <CircularProgress score={lhReport.accessibility} label="A11y" colorClass={getColorClass(lhReport.accessibility)} />
                  <CircularProgress score={lhReport.bestPractices} label="Best P." colorClass={getColorClass(lhReport.bestPractices)} />
                  <CircularProgress score={lhReport.seo} label="SEO" colorClass={getColorClass(lhReport.seo)} />
                </div>

                {/* Core Web Vitals details */}
                <div className="border-t border-mineral-100 dark:border-mineral-800 pt-4 space-y-2.5">
                  <span className="text-[9px] font-mono font-bold text-mineral-450 dark:text-mineral-500 uppercase tracking-widest block">Métricas Clave (Core Web Vitals)</span>
                  
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-3xs font-mono">
                    <div className="flex justify-between border-b border-mineral-100 dark:border-mineral-850 pb-1">
                      <span className="text-mineral-500">First Contentful Paint (FCP)</span>
                      <span className="font-bold text-mineral-800 dark:text-mineral-200">{lhReport.metrics.firstContentfulPaint}</span>
                    </div>
                    <div className="flex justify-between border-b border-mineral-100 dark:border-mineral-850 pb-1">
                      <span className="text-mineral-500">Speed Index</span>
                      <span className="font-bold text-mineral-800 dark:text-mineral-200">{lhReport.metrics.speedIndex}</span>
                    </div>
                    <div className="flex justify-between border-b border-mineral-100 dark:border-mineral-850 pb-1">
                      <span className="text-mineral-500">Largest Contentful Paint (LCP)</span>
                      <span className="font-bold text-mineral-800 dark:text-mineral-200">{lhReport.metrics.largestContentfulPaint}</span>
                    </div>
                    <div className="flex justify-between border-b border-mineral-100 dark:border-mineral-850 pb-1">
                      <span className="text-mineral-500">Time to Interactive</span>
                      <span className="font-bold text-mineral-800 dark:text-mineral-200">{lhReport.metrics.interactive}</span>
                    </div>
                    <div className="flex justify-between border-b border-mineral-100 dark:border-mineral-850 pb-1 col-span-2">
                      <span className="text-mineral-500">Total Blocking Time</span>
                      <span className="font-bold text-emerald-500">{lhReport.metrics.totalBlockingTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={runRealAudit}
            disabled={isAuditing || isLoadingReport}
            className="w-full mt-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-1.5 shadow"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Recalcular Auditoría Lighthouse (Google API)</span>
          </button>
        </div>

      </div>

      {/* Technical API Stats */}
      <div className="mt-8 glass-card sci-box-gold p-6 space-y-6">

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
