import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ClassificationCode {
  classificationCode: string;
  classificationCodeLabel: string;
  classificationSystem: string;
}

export interface Variety {
  identifier: string;
  variety: string;
  description: string;
  varietyOf: string;
}

export interface Mineral {
  '@id': string;
  identifier: string;
  name: string;
  nameVariant: string;
  description: string | null;
  chemicalFormula: string | null;
  chemistryElements: string;
  crystalSystems: string | null;
  imaNumber: string | null;
  imaStatus: string;
  relatedResourceURL: string | null;
  hasClassificationCodes: ClassificationCode[];
  hasVarieties: Variety[];
  
  price: number;
  rating: number;
  stock: number;
  rarity: 'Comun' | 'Raro' | 'Exotico' | 'Unico';
  accentColor: string;
}

export interface CartItem {
  mineral: Mineral;
  quantity: number;
}

export interface ScheduledEvent {
  id: string;
  name: string;
  startDate: string; // "MM-DD" format
  endDate: string;   // "MM-DD" format
  themeClass: string;
  bannerTitle: string;
  bannerDesc: string;
  accentColors: {
    from: string;
    to: string;
    glow: string;
    badge: string;
  };
}

export const campaigns: ScheduledEvent[] = [
  {
    id: 'gaia',
    name: 'Día de Gaia',
    startDate: '04-18',
    endDate: '04-25',
    themeClass: 'theme-earth',
    bannerTitle: 'Día de Gaia',
    bannerDesc: 'Celebra la asombrosa geoda de nuestro planeta. 10% de todas las ventas de especímenes ecológicos serán donadas a fundaciones de conservación ambiental.',
    accentColors: {
      from: 'from-emerald-600',
      to: 'to-teal-600',
      glow: 'rgba(16, 185, 129, 0.15)',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
    }
  },
  {
    id: 'muertos',
    name: 'Día de Muertos',
    startDate: '10-25',
    endDate: '11-02',
    themeClass: 'theme-halloween',
    bannerTitle: 'Día de Muertos',
    bannerDesc: 'Descubre el poder de los minerales oscuros y protectores. Descuentos místicos en obsidiana arcoíris, amatistas profundas y turmalinas negras.',
    accentColors: {
      from: 'from-purple-650',
      to: 'to-orange-550',
      glow: 'rgba(139, 92, 246, 0.15)',
      badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
    }
  }
];

export interface SiteStats {
  pageViews: Record<string, number>;
  searchesCount: number;
  itemsAddedToCart: number;
  totalSales: number;
  successfulOrders: number;
  apiLatency: number;
  apiCalls: number;
  apiErrors: number;
}

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currentPage: string;
  navigateTo: (page: string) => void;
  cart: CartItem[];
  addToCart: (mineral: Mineral, qty?: number) => void;
  removeFromCart: (identifier: string) => void;
  updateCartQuantity: (identifier: string, qty: number) => void;
  clearCart: () => void;
  
  minerals: Mineral[];
  loading: boolean;
  error: string | null;
  apiPage: number;
  apiTotalPages: number;
  apiTotalItems: number;
  fetchMinerals: (page: number) => Promise<void>;
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCrystalSystem: string;
  setSelectedCrystalSystem: (system: string) => void;
  activeCampaign: ScheduledEvent | null;
  eventoCalendarizadoId: string;
  setEventoCalendarizadoId: (campaignId: string) => void;
  
  stats: SiteStats;
  trackAction: (action: keyof Omit<SiteStats, 'pageViews' | 'apiLatency'>) => void;
  trackLatency: (ms: number) => void;

  esStatus: 'connected' | 'disconnected' | 'checking';
  isElasticsearchActive: boolean;
  setIsElasticsearchActive: (active: boolean) => void;
  searchElasticsearch: (query: string) => Promise<Mineral[]>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const augmentMineral = (raw: any): Mineral => {
  let hash = 0;
  const str = raw.name || '';
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);
  const price = 15 + (absHash % 485) + (absHash % 100) / 100;
  const rating = 4.0 + (absHash % 11) / 10;  
  const stock = 1 + (absHash % 15);

  let rarity: Mineral['rarity'] = 'Comun';
  if (price > 350) rarity = 'Unico';
  else if (price > 180) rarity = 'Exotico';
  else if (price > 75) rarity = 'Raro';

  const hues = [150, 220, 340, 45, 270, 15, 180]; 
  const chosenHue = hues[absHash % hues.length];
  const accentColor = `hsl(${chosenHue}, 75%, ${rarity === 'Unico' ? '60%' : '50%'})`;

  return {
    ...raw,
    price,
    rating,
    stock,
    rarity,
    accentColor
  };
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  const [currentPage, setCurrentPage] = useState<string>('shop');
  const [cart, setCart] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('cart');
    return stored ? JSON.parse(stored) : [];
  });

  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiPage, setApiPage] = useState<number>(100);
  const [apiTotalPages, setApiTotalPages] = useState<number>(392);
  const [apiTotalItems, setApiTotalItems] = useState<number>(9779);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCrystalSystem, setSelectedCrystalSystem] = useState<string>('all');
  const [eventoCalendarizadoId, setEventoCalendarizadoId] = useState<string>('system');

  const getActiveCampaignByDate = (): ScheduledEvent | null => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const md = `${month}-${day}`; // "MM-DD"

    for (const campaign of campaigns) {
      if (campaign.startDate <= campaign.endDate) {
        if (md >= campaign.startDate && md <= campaign.endDate) {
          return campaign;
        }
      } else {
        if (md >= campaign.startDate || md <= campaign.endDate) {
          return campaign;
        }
      }
    }
    return null;
  };

  const getActiveCampaign = (): ScheduledEvent | null => {
    if (eventoCalendarizadoId === 'none') return null;
    if (eventoCalendarizadoId === 'gaia') return campaigns.find(c => c.id === 'gaia') || null;
    if (eventoCalendarizadoId === 'muertos') return campaigns.find(c => c.id === 'muertos') || null;
    return getActiveCampaignByDate();
  };

  const activeCampaign = getActiveCampaign();

  const [esStatus, setEsStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');
  const [isElasticsearchActive, setIsElasticsearchActive] = useState<boolean>(true);

  const checkElasticsearch = async () => {
    try {
      const response = await fetch('/elasticsearch');
      if (response.ok) {
        setEsStatus('connected');
        console.log("Connected to Elasticsearch");
      } else {
        setEsStatus('disconnected');
      }
    } catch (err) {
      setEsStatus('disconnected');
    }
  };

  const indexMineralsInElasticsearch = async (items: Mineral[]) => {
    try {
      await Promise.all(items.map(async (mineral) => {
        await fetch(`/elasticsearch/minerals/_doc/${mineral.identifier}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: mineral.name,
            nameVariant: mineral.nameVariant,
            description: mineral.description,
            chemicalFormula: mineral.chemicalFormula,
            chemistryElements: mineral.chemistryElements,
            crystalSystems: mineral.crystalSystems,
            imaNumber: mineral.imaNumber,
            imaStatus: mineral.imaStatus,
            price: mineral.price,
            rating: mineral.rating,
            stock: mineral.stock,
            rarity: mineral.rarity,
            accentColor: mineral.accentColor
          })
        });
      }));
      console.log(`Indexed ${items.length} minerals in Elasticsearch`);
    } catch (err) {
      console.error("Error indexing minerals in Elasticsearch:", err);
    }
  };

  const searchElasticsearch = async (query: string): Promise<Mineral[]> => {
    if (!query.trim()) return [];
    try {
      const response = await fetch('/elasticsearch/minerals/_search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: {
            multi_match: {
              query: query,
              fields: ['name^3', 'chemicalFormula^2', 'chemistryElements', 'crystalSystems'],
              fuzziness: 'AUTO'
            }
          },
          size: 50
        })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.hits && data.hits.hits) {
          return data.hits.hits.map((hit: any) => ({
            identifier: hit._id,
            ...hit._source
          }));
        }
      }
    } catch (err) {
      console.error("Search error in Elasticsearch:", err);
    }
    return [];
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkElasticsearch();
  }, []);

  useEffect(() => {
    if (esStatus === 'connected' && minerals.length > 0) {
      indexMineralsInElasticsearch(minerals);
    }
  }, [minerals, esStatus]);

  const [stats, setStats] = useState<SiteStats>(() => {
    const stored = localStorage.getItem('stats');
    return stored ? JSON.parse(stored) : {
      pageViews: { shop: 1, catalog: 0, analytics: 0, contact: 0, legal: 0 },
      searchesCount: 0,
      itemsAddedToCart: 0,
      totalSales: 0,
      successfulOrders: 0,
      apiLatency: 0,
      apiCalls: 0,
      apiErrors: 0
    };
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setStats(prev => ({
      ...prev,
      pageViews: {
        ...prev.pageViews,
        [page]: (prev.pageViews[page] || 0) + 1
      }
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (mineral: Mineral, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.mineral.identifier === mineral.identifier);
      if (existing) {
        const newQty = Math.min(existing.quantity + qty, mineral.stock);
        return prev.map(item => item.mineral.identifier === mineral.identifier ? { ...item, quantity: newQty } : item);
      }
      return [...prev, { mineral, quantity: Math.min(qty, mineral.stock) }];
    });
    trackAction('itemsAddedToCart');
  };

  const removeFromCart = (identifier: string) => {
    setCart(prev => prev.filter(item => item.mineral.identifier !== identifier));
  };

  const updateCartQuantity = (identifier: string, qty: number) => {
    setCart(prev => prev.map(item => {
      if (item.mineral.identifier === identifier) {
        return { ...item, quantity: Math.max(1, Math.min(qty, item.mineral.stock)) };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  const trackAction = (action: keyof Omit<SiteStats, 'pageViews' | 'apiLatency'>) => {
    setStats(prev => ({
      ...prev,
      [action]: (prev[action] as number) + 1
    }));
  };

  const trackLatency = (ms: number) => {
    setStats(prev => ({
      ...prev,
      apiLatency: prev.apiLatency === 0 ? ms : Math.round((prev.apiLatency + ms) / 2)
    }));
  };

  const fetchMinerals = async (page: number) => {
    setLoading(true);
    setError(null);
    setApiPage(page);
    
    const startTime = performance.now();
    
    setStats(prev => ({ ...prev, apiCalls: prev.apiCalls + 1 }));

    try {
      const response = await fetch(`https://geoapis.io/api/v1/catalog/resource/mineral-names?page=${page}`);
      
      if (!response.ok) {
        throw new Error(`Error del Servidor (Código: ${response.status}) - ${response.statusText}`);
      }

      const json = await response.json();
      
      if (json.data && Array.isArray(json.data)) {
        const augmented = json.data.map(augmentMineral);
        setMinerals(augmented);
        
        if (json.metadata && json.metadata.pagination) {
          const pag = json.metadata.pagination;
          setApiTotalPages(pag.lastPage || 392);
          setApiTotalItems(pag.totalItems || 9779);
        }
      } else {
        throw new Error('Estructura de respuesta inválida: falta el arreglo "data"');
      }

      const endTime = performance.now();
      trackLatency(Math.round(endTime - startTime));
      
    } catch (err: any) {
      console.error("API Fetch Error:", err);
      setStats(prev => ({ ...prev, apiErrors: prev.apiErrors + 1 }));
      setError(err.message || 'Error de conexión de red al intentar alcanzar la API de GeoAPIs.io. Por favor verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMinerals(apiPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContext.Provider value={{
      theme,
      toggleTheme,
      currentPage,
      navigateTo,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      
      minerals,
      loading,
      error,
      apiPage,
      apiTotalPages,
      apiTotalItems,
      fetchMinerals,
      
      searchQuery,
      setSearchQuery,
      selectedCrystalSystem,
      setSelectedCrystalSystem,
      activeCampaign,
      eventoCalendarizadoId,
      setEventoCalendarizadoId,
      
      stats,
      trackAction,
      trackLatency,

      esStatus,
      isElasticsearchActive,
      setIsElasticsearchActive,
      searchElasticsearch
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp debe ser usado dentro de un AppProvider');
  }
  return context;
};
