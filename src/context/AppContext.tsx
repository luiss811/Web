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
  chemistryElements: string; // space separated
  crystalSystems: string | null;
  imaNumber: string | null;
  imaStatus: string;
  relatedResourceURL: string | null;
  hasClassificationCodes: ClassificationCode[];
  hasVarieties: Variety[];
  
  // Simulated e-commerce fields
  price: number;
  rating: number;
  stock: number;
  rarity: 'Común' | 'Raro' | 'Exótico' | 'Legendario';
  accentColor: string;
}

export interface CartItem {
  mineral: Mineral;
  quantity: number;
}

export interface SiteStats {
  pageViews: Record<string, number>;
  searchesCount: number;
  itemsAddedToCart: number;
  totalSales: number;
  successfulOrders: number;
  apiLatency: number; // in ms
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
  
  // API State
  minerals: Mineral[];
  loading: boolean;
  error: string | null;
  apiPage: number;
  apiTotalPages: number;
  apiTotalItems: number;
  fetchMinerals: (page: number) => Promise<void>;
  
  // Search and Filter State
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Analytics
  stats: SiteStats;
  trackAction: (action: keyof Omit<SiteStats, 'pageViews' | 'apiLatency'>) => void;
  trackLatency: (ms: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to generate consistent simulated e-commerce properties based on mineral ID/name
const augmentMineral = (raw: any): Mineral => {
  // Simple hash function for name to get consistent random-like numbers
  let hash = 0;
  const str = raw.name || '';
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const absHash = Math.abs(hash);

  // Price between $15.00 and $499.00
  const price = 15 + (absHash % 485) + (absHash % 100) / 100;
  
  // Rating between 4.0 and 5.0
  const rating = 4.0 + (absHash % 11) / 10;
  
  // Stock between 1 and 15
  const stock = 1 + (absHash % 15);

  // Rarity determination
  let rarity: Mineral['rarity'] = 'Común';
  if (price > 350) rarity = 'Legendario';
  else if (price > 180) rarity = 'Exótico';
  else if (price > 75) rarity = 'Raro';

  // Aesthetic colors (HLS representation of beautiful minerals)
  const hues = [150, 220, 340, 45, 270, 15, 180]; // Emerald, Sapphire, Ruby, Gold, Amethyst, Amber, Turquoise
  const chosenHue = hues[absHash % hues.length];
  const accentColor = `hsl(${chosenHue}, 75%, ${rarity === 'Legendario' ? '60%' : '50%'})`;

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

  // API states
  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiPage, setApiPage] = useState<number>(100); // Start on page 100 as requested
  const [apiTotalPages, setApiTotalPages] = useState<number>(392);
  const [apiTotalItems, setApiTotalItems] = useState<number>(9779);
  
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Analytics Stats State
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

  // Synchronize Theme Class with HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save Cart to LocalStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save Stats to LocalStorage
  useEffect(() => {
    localStorage.setItem('stats', JSON.stringify(stats));
  }, [stats]);

  // Track Page Views
  useEffect(() => {
    setStats(prev => ({
      ...prev,
      pageViews: {
        ...prev.pageViews,
        [currentPage]: (prev.pageViews[currentPage] || 0) + 1
      }
    }));
  }, [currentPage]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (mineral: Mineral, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.mineral.identifier === mineral.identifier);
      if (existing) {
        // Enforce stock limit
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

  // Analytics helpers
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

  // Fetch from real API
  const fetchMinerals = async (page: number) => {
    setLoading(true);
    setError(null);
    setApiPage(page);
    
    const startTime = performance.now();
    
    // Increment API calls metric
    setStats(prev => ({ ...prev, apiCalls: prev.apiCalls + 1 }));

    try {
      const response = await fetch(`https://geoapis.io/api/v1/catalog/resource/mineral-names?page=${page}`);
      
      if (!response.ok) {
        throw new Error(`Error del Servidor API (Código: ${response.status}) - ${response.statusText}`);
      }

      const json = await response.json();
      
      if (json.data && Array.isArray(json.data)) {
        const augmented = json.data.map(augmentMineral);
        setMinerals(augmented);
        
        // Track Pagination Metadata from response
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
      // Increment API errors metric
      setStats(prev => ({ ...prev, apiErrors: prev.apiErrors + 1 }));
      setError(err.message || 'Error de conexión de red al intentar alcanzar la API de GeoAPIs.io. Por favor verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  // Initial API fetch
  useEffect(() => {
    fetchMinerals(apiPage);
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
      
      stats,
      trackAction,
      trackLatency
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
