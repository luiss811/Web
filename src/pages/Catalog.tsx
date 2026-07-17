import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { Mineral } from '../context/AppContext';
import { MineralVisual } from './Shop';
import { Search, Info, ChevronLeft, ChevronRight, ExternalLink, RefreshCw, X, ShieldAlert, Layers } from 'lucide-react';

export const Catalog: React.FC = () => {
  const {
    minerals,
    loading,
    error,
    apiPage,
    apiTotalPages,
    apiTotalItems,
    fetchMinerals,
    searchQuery,
    setSearchQuery,
    trackAction,
    esStatus,
    isElasticsearchActive,
    setIsElasticsearchActive,
    searchElasticsearch
  } = useApp();

  const [selectedMineral, setSelectedMineral] = useState<Mineral | null>(null);
  const [crystalSystemFilter, setCrystalSystemFilter] = useState<string>('all');
  const [searchInput, setSearchInput] = useState<string>(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState<string>(searchQuery);
  const [esResults, setEsResults] = useState<Mineral[]>([]);
  const [isSearchingEs, setIsSearchingEs] = useState<boolean>(false);

  // Sync global context search query with local search input
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setSearchInput(searchQuery);
  }

  // Run Elasticsearch query when searchQuery changes
  useEffect(() => {
    const runSearch = async () => {
      if (esStatus === 'connected' && isElasticsearchActive && searchQuery.trim()) {
        setIsSearchingEs(true);
        const results = await searchElasticsearch(searchQuery);
        setEsResults(results);
        setIsSearchingEs(false);
      } else {
        setEsResults([]);
      }
    };
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, esStatus, isElasticsearchActive]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    trackAction('searchesCount');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= apiTotalPages) {
      fetchMinerals(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Determine if we are actively searching with Elasticsearch
  const isUsingEs = esStatus === 'connected' && isElasticsearchActive && searchQuery.trim();
  const displayMinerals = isUsingEs ? esResults : minerals;

  // Filter display list (by system and, if not using ES, also matches local search text)
  const filteredMinerals = displayMinerals.filter(mineral => {
    const matchesSearch = isUsingEs || 
      mineral.name.toLowerCase().includes(searchInput.toLowerCase()) || 
      (mineral.chemicalFormula || '').toLowerCase().includes(searchInput.toLowerCase()) ||
      (mineral.chemistryElements || '').toLowerCase().includes(searchInput.toLowerCase());
      
    const matchesCrystal = crystalSystemFilter === 'all' || 
      (mineral.crystalSystems || '').toLowerCase().includes(crystalSystemFilter.toLowerCase());
      
    return matchesSearch && matchesCrystal;
  });

  const crystalSystemsList = [
    { value: 'all', label: 'Cualquier Sistema' },
    { value: 'cubic', label: 'Cúbico (Isométrico)' },
    { value: 'hexagonal', label: 'Hexagonal' },
    { value: 'monoclinic', label: 'Monoclínico' },
    { value: 'triclinic', label: 'Triclínico' },
    { value: 'orthorhombic', label: 'Ortorrómbico' },
    { value: 'tetragonal', label: 'Tetragonal' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Intro Header */}
      <div className="space-y-4 mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-mineral-800 dark:text-mineral-100">
          Catálogo de Minerales
        </h1>
        <p className="text-sm text-mineral-500 dark:text-mineral-400 leading-relaxed">
          Consulta y estudia las propiedades cristaloquímicas oficiales de las especies aprobadas por la CNMNC (Asociación Mineralógica Internacional). Datos sincrónicos obtenidos en tiempo real de GeoAPIs.io.
        </p>
      </div>

      {/* Query Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 bg-white dark:bg-mineral-900 p-5 rounded-2xl border border-mineral-200/50 dark:border-mineral-800/50 shadow-sm">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative md:col-span-2">
          <input
            type="text"
            placeholder="Buscar por nombre, elementos (K, Mg, Au) o fórmula química..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 text-sm rounded-xl border border-mineral-200 dark:border-mineral-800 bg-mineral-50/50 dark:bg-mineral-950/50 text-mineral-800 dark:text-mineral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-mineral-450" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 shadow"
          >
            Buscar
          </button>
        </form>

        {/* Crystal filter */}
        <div>
          <select
            value={crystalSystemFilter}
            onChange={(e) => setCrystalSystemFilter(e.target.value)}
            className="w-full bg-mineral-50/50 dark:bg-mineral-950/50 text-mineral-700 dark:text-mineral-200 border border-mineral-200 dark:border-mineral-800 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {crystalSystemsList.map(sys => (
              <option key={sys.value} value={sys.value}>{sys.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Status details bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-mineral-500 mb-6 bg-mineral-100/50 dark:bg-mineral-900/20 px-4 py-3 rounded-xl border border-mineral-200/20 dark:border-mineral-800/20 gap-3">
        <div>
          {isUsingEs ? (
            <span>
              Mostrando <span className="font-bold text-emerald-500">{filteredMinerals.length}</span> coincidencias de Elasticsearch para <span className="font-semibold">"{searchQuery}"</span>
            </span>
          ) : (
            <span>
              Mostrando página <span className="font-bold text-mineral-800 dark:text-mineral-200">{apiPage}</span> de <span className="font-bold text-mineral-800 dark:text-mineral-200">{apiTotalPages}</span> | Total de especies catalogadas: <span className="font-bold text-mineral-800 dark:text-mineral-200">{apiTotalItems}</span>
            </span>
          )}
        </div>
        
        {/* Elasticsearch Switch Control */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-2xs uppercase tracking-wide">Buscador:</span>
          {esStatus === 'connected' ? (
            <button
              onClick={() => setIsElasticsearchActive(!isElasticsearchActive)}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-3xs font-bold transition-all border ${
                isElasticsearchActive 
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20' 
                  : 'bg-mineral-150 text-mineral-500 border-mineral-200 hover:bg-mineral-200 dark:bg-mineral-800 dark:text-mineral-450 dark:border-mineral-700 dark:hover:bg-mineral-750'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isElasticsearchActive ? 'bg-emerald-500 animate-pulse' : 'bg-mineral-400'}`}></span>
              <span>Elasticsearch {isElasticsearchActive ? 'Activo (Puerto 9200)' : 'Pausado'}</span>
            </button>
          ) : (
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full text-3xs font-bold bg-ruby-500/10 text-ruby-500 border border-ruby-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-ruby-500"></span>
              <span>Elasticsearch Inactivo</span>
            </span>
          )}
        </div>
      </div>

      {/* Main List Area */}
      {loading || isSearchingEs ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <RefreshCw className="w-10 h-10 text-emerald-500 animate-spin" />
          <p className="text-sm text-mineral-500 dark:text-mineral-450">
            {isSearchingEs ? 'Consultando índice Elasticsearch...' : 'Descargando registros oficiales...'}
          </p>
        </div>
      ) : error ? (
        <div className="bg-ruby-50 dark:bg-ruby-950/20 border border-ruby-200 dark:border-ruby-900/50 rounded-2xl p-8 text-center max-w-xl mx-auto my-12 shadow">
          <ShieldAlert className="w-12 h-12 text-ruby-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-ruby-600 dark:text-ruby-400 mb-2">Error de Sincronización API</h2>
          <p className="text-sm text-mineral-600 dark:text-mineral-400 leading-relaxed mb-6">
            {error}
          </p>
          <button
            onClick={() => fetchMinerals(apiPage)}
            className="px-6 py-2 bg-ruby-600 hover:bg-ruby-750 text-white font-bold rounded-xl transition-all shadow"
          >
            Reintentar Consulta
          </button>
        </div>
      ) : (
        <>
          {/* Mineral Species List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMinerals.length === 0 ? (
              <div className="col-span-full text-center py-20 text-mineral-400">
                No se encontraron especies en la página actual que cumplan los criterios de búsqueda.
              </div>
            ) : (
              filteredMinerals.map(mineral => (
                <div 
                  key={mineral.identifier}
                  className="glass-card spotlight-card sci-box p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-mineral-100 dark:bg-mineral-950 text-mineral-500 border border-mineral-200/50 dark:border-mineral-800/50">
                        ID: {mineral.imaNumber || 'PRE-IMA'}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20 rounded">
                        {mineral.crystalSystems || 'Desconocido'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-mineral-800 dark:text-mineral-100 font-display">
                      {mineral.name}
                    </h3>
                    
                    <p className="text-xs text-mineral-450 dark:text-mineral-500 line-clamp-3 leading-relaxed">
                      {mineral.description || 'Sin descripción adicional. Consulta la ficha técnica completa en el botón informativo.'}
                    </p>

                    {/* Chemical elements representation */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {(mineral.chemistryElements || '').split(' ').filter(Boolean).slice(0, 7).map((el, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 text-2xs font-bold rounded bg-mineral-200/50 dark:bg-mineral-850 text-mineral-600 dark:text-mineral-300"
                        >
                          {el}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-mineral-150 dark:border-mineral-800/40">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold font-mono truncate max-w-[150px] bg-emerald-500/5 px-2 py-0.5 border border-emerald-500/10 rounded">
                      FML: {mineral.chemicalFormula || 'N/D'}
                    </span>
                    <button
                      onClick={() => setSelectedMineral(mineral)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-mineral-100 dark:bg-mineral-800 text-mineral-700 dark:text-mineral-200 hover:bg-emerald-500 hover:text-white transition-colors flex items-center space-x-1 font-mono uppercase tracking-wider"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Ficha</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls (Prezi Layout Requirements) */}
          {!isUsingEs && (
            <div className="flex justify-between items-center mt-12 bg-white dark:bg-mineral-900 border border-mineral-200/40 dark:border-mineral-800/40 px-6 py-4 rounded-2xl shadow-sm">
              <button
                onClick={() => handlePageChange(apiPage - 1)}
                disabled={apiPage <= 1}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-mineral-100 dark:bg-mineral-800 text-mineral-700 dark:text-mineral-200 hover:bg-mineral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              {/* Quick jump to target page 100 as requested */}
              <div className="hidden sm:flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(1)} 
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${apiPage === 1 ? 'bg-emerald-500 text-white' : 'hover:bg-mineral-100 dark:hover:bg-mineral-800'}`}
                >
                  1
                </button>
                {apiPage > 3 && <span className="text-mineral-400 text-xs">...</span>}
                
                {apiPage > 2 && apiPage < apiTotalPages && (
                  <button 
                    onClick={() => handlePageChange(apiPage - 1)}
                    className="w-8 h-8 rounded-lg text-xs font-bold hover:bg-mineral-100 dark:hover:bg-mineral-800"
                  >
                    {apiPage - 1}
                  </button>
                )}

                {apiPage !== 1 && apiPage !== apiTotalPages && (
                  <button 
                    className="w-8 h-8 rounded-lg text-xs font-black bg-emerald-500 text-white shadow-sm"
                  >
                    {apiPage}
                  </button>
                )}

                {apiPage < apiTotalPages - 1 && (
                  <button 
                    onClick={() => handlePageChange(apiPage + 1)}
                    className="w-8 h-8 rounded-lg text-xs font-bold hover:bg-mineral-100 dark:hover:bg-mineral-800"
                  >
                    {apiPage + 1}
                  </button>
                )}
                
                {apiPage < apiTotalPages - 2 && <span className="text-mineral-400 text-xs">...</span>}
                <button 
                  onClick={() => handlePageChange(apiTotalPages)} 
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${apiPage === apiTotalPages ? 'bg-emerald-500 text-white' : 'hover:bg-mineral-100 dark:hover:bg-mineral-800'}`}
                >
                  {apiTotalPages}
                </button>
              </div>

              <div className="sm:hidden text-xs font-semibold text-mineral-500">
                Pág. {apiPage} / {apiTotalPages}
              </div>

              <button
                onClick={() => handlePageChange(apiPage + 1)}
                disabled={apiPage >= apiTotalPages}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-mineral-100 dark:bg-mineral-800 text-mineral-700 dark:text-mineral-200 hover:bg-mineral-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5"
              >
                <span>Siguiente</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* 3. TECHNICAL SPECIFICATIONS MODAL */}
      {selectedMineral && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-mineral-950/80 backdrop-blur-md">
          <div className="glass border-2 border-emerald-500/20 max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-2xl space-y-6 shadow-2xl relative text-mineral-805 dark:text-mineral-100 sci-box">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedMineral(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-mineral-450 hover:bg-mineral-100 dark:hover:bg-mineral-800 transition-colors"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Modal Title */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 border-b border-mineral-200/50 dark:border-mineral-800/50 pb-5">
              <div className="w-20 h-20 rounded-xl bg-mineral-950 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 relative overflow-hidden sci-box sci-crosshairs shadow-inner">
                <MineralVisual mineral={selectedMineral} size="sm" />
                <div className="absolute top-1 left-1 text-[7px] font-mono text-emerald-500/50 uppercase select-none"></div>
                <div className="absolute bottom-1 right-1 text-[7px] font-mono text-emerald-500/50 uppercase select-none"></div>
              </div>
              <div>
                <span className="text-[9px] font-display font-bold text-emerald-500 uppercase tracking-widest block">
                  Análisis Cristalográfico Oficial
                </span>
                <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-mineral-800 dark:text-mineral-100">
                  {selectedMineral.name}
                </h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Left Column: Chemistry & Crystals */}
              <div className="space-y-4">
                <div>
                  <span className="text-2xs font-display font-bold text-mineral-700 dark:text-mineral-300 uppercase tracking-wider block mb-1">Fórmula Química:</span>
                  <span className="text-sm font-mono font-bold bg-mineral-100 dark:bg-mineral-900/60 px-3 py-1.5 rounded-lg block border border-mineral-200/30 dark:border-mineral-800/30">
                    {selectedMineral.chemicalFormula || 'No especificada'}
                  </span>
                </div>

                <div>
                  <span className="text-2xs font-bold text-mineral-700 dark:text-mineral-300 uppercase tracking-wider block mb-1">Elementos Presentes:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedMineral.chemistryElements || '').split(' ').filter(Boolean).map((el, i) => (
                      <span key={i} className="px-2 py-1 text-2xs font-display font-black rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {el}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-2xs font-bold text-mineral-700 dark:text-mineral-300 uppercase tracking-wider block mb-1">Sistema de Cristalización:</span>
                  <span className="text-sm font-semibold capitalize flex items-center space-x-1.5 text-mineral-700 dark:text-mineral-200">
                    <Layers className="w-4 h-4 text-gold-500" />
                    <span>{selectedMineral.crystalSystems || 'Desconocido / Amorfo'}</span>
                  </span>
                </div>

                <div>
                  <span className="text-2xs font-bold text-mineral-700 dark:text-mineral-300 uppercase tracking-wider block mb-1">Estatus IMA (CNMNC):</span>
                  <span className="inline-block px-3 py-1 text-2xs font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {selectedMineral.imaStatus || 'Sin registro'}
                  </span>
                  {selectedMineral.imaNumber && (
                    <span className="text-xs font-mono text-mineral-600 dark:text-mineral-400 ml-2">
                      Código: {selectedMineral.imaNumber}
                    </span>
                  )}
                </div>
              </div>

              {/* Right Column: Classifications & Varieties */}
              <div className="space-y-4">
                <div>
                  <span className="text-2xs font-bold text-mineral-700 dark:text-mineral-300 uppercase tracking-wider block mb-1">Códigos de Clasificación:</span>
                  <div className="space-y-2">
                    {selectedMineral.hasClassificationCodes && selectedMineral.hasClassificationCodes.length > 0 ? (
                      selectedMineral.hasClassificationCodes.map((code, index) => (
                        <div key={index} className="text-xs p-2 rounded-lg bg-mineral-50/50 dark:bg-mineral-950/20 border border-mineral-200/30 dark:border-mineral-800/30">
                          <div className="font-bold text-mineral-650 dark:text-mineral-300">{code.classificationSystem}</div>
                          <div className="text-mineral-500 font-mono mt-0.5">{code.classificationCodeLabel}: {code.classificationCode}</div>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-mineral-450 dark:text-mineral-500 font-light block">Sin clasificaciones indexadas.</span>
                    )}
                  </div>
                </div>

                {/* Varieties */}
                <div>
                  <span className="text-2xs font-display font-bold text-mineral-700 dark:text-mineral-300 uppercase tracking-wider block mb-1">Variedades del Mineral:</span>
                  {selectedMineral.hasVarieties && selectedMineral.hasVarieties.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedMineral.hasVarieties.map((v, i) => (
                        <span key={i} className="px-2.5 py-1 text-2xs font-semibold rounded bg-gold-500/10 text-gold-500 border border-gold-500/20">
                          {v.variety}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-mineral-450 dark:text-mineral-500 font-light block">No posee variedades registradas.</span>
                  )}
                </div>
              </div>

            </div>

            {/* Description area */}
            {selectedMineral.description && (
              <div className="p-4 rounded-xl bg-mineral-50 dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 text-xs text-mineral-600 dark:text-mineral-300 leading-relaxed">
                <span className="font-bold uppercase tracking-wider text-2xs text-mineral-400 block mb-1.5">Anotaciones Adicionales:</span>
                <p dangerouslySetInnerHTML={{ __html: selectedMineral.description }}></p>
              </div>
            )}

            {/* Footer External Reference Link */}
            {selectedMineral.relatedResourceURL && (
              <div className="border-t border-mineral-200/50 dark:border-mineral-800/50 pt-5 flex justify-end">
                <a
                  href={selectedMineral.relatedResourceURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Ver Ficha en Mindat.org</span>
                </a>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
