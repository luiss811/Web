import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MessageCircle, CreditCard } from 'lucide-react';

const FacebookIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const GithubIcon = () => (
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  const handleNav = (page: string) => {
    navigateTo(page);
  };

  return (
    <footer className="w-full bg-mineral-100 dark:bg-mineral-950 border-t border-mineral-200/50 dark:border-mineral-900/60 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-mineral-200/50 dark:border-mineral-900/50">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <div 
              onClick={() => handleNav('shop')} 
              className="flex items-center space-x-2.5 cursor-pointer group w-fit"
            >
              <div className="w-9 h-9 rounded-lg items-center justify-center">
                <img src="/src/assets/canek.png" alt="Canek Logo" className="w-8 h-8 relative z-10" />
              </div>
              <span className="text-xl font-black tracking-widest font-display bg-clip-text text-transparent">
                Canek
              </span>
            </div>
            <p className="text-sm text-mineral-500 dark:text-mineral-400 leading-relaxed">
              Descubre la belleza oculta de la naturaleza. Somos el portal líder en comercialización y difusión educativa de especies de minerales y gemas únicas.
            </p>
            {/* Redes Sociales */}
            <div className="flex items-center space-x-4 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 flex items-center justify-center text-mineral-500 hover:text-emerald-500 hover:border-emerald-500 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 flex items-center justify-center text-mineral-500 hover:text-gold-500 hover:border-gold-500 transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 flex items-center justify-center text-mineral-500 hover:text-ruby-500 hover:border-ruby-500 transition-colors"
                aria-label="GitHub"
              >
                <GithubIcon />
              </a>
            </div>
          </div>

          {/* Menú Simplificado */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-mineral-800 dark:text-mineral-200">
              Navegación
            </h3>
            <ul className="space-y-2.5">
              <li>
                <button 
                  onClick={() => handleNav('shop')} 
                  className="text-sm text-mineral-500 dark:text-mineral-400 hover:text-emerald-500 dark:hover:text-gold-400 transition-colors"
                >
                  Shop / Tienda
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('catalog')} 
                  className="text-sm text-mineral-500 dark:text-mineral-400 hover:text-emerald-500 dark:hover:text-gold-400 transition-colors"
                >
                  Catálogo Informativo
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('analytics')} 
                  className="text-sm text-mineral-500 dark:text-mineral-400 hover:text-emerald-500 dark:hover:text-gold-400 transition-colors"
                >
                  Estadísticas y Tráfico
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('contact')} 
                  className="text-sm text-mineral-500 dark:text-mineral-400 hover:text-emerald-500 dark:hover:text-gold-400 transition-colors"
                >
                  Formulario de Contacto
                </button>
              </li>
            </ul>
          </div>

          {/* Información de Contacto */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-mineral-800 dark:text-mineral-200">
              Atención al Cliente
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-4.5 h-4.5 text-emerald-500" />
                <a 
                  href="mailto:lalitorios81@gmail.com" 
                  className="text-sm text-mineral-650 dark:text-mineral-400 hover:underline hover:text-emerald-500"
                >
                  lalitorios81@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <MessageCircle className="w-4.5 h-4.5 text-emerald-500" />
                <a 
                  href="https://wa.me/524428364570" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-mineral-650 dark:text-mineral-400 hover:underline hover:text-emerald-500"
                >
                  WhatsApp: 442 836 4570
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4.5 h-4.5 text-gold-500" />
                <a 
                  href="tel:4464225541" 
                  className="text-sm text-mineral-650 dark:text-mineral-400 hover:underline hover:text-gold-500"
                >
                  Llamadas: 446 422 5541
                </a>
              </li>
            </ul>
          </div>

          {/* Métodos de Pago */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-mineral-800 dark:text-mineral-200">
              Pagos Seguros
            </h3>
            <p className="text-xs text-mineral-500 dark:text-mineral-400">
              Aceptamos las siguientes plataformas de pago con encriptación SSL de 256 bits para tu total seguridad.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-2">
              <span className="px-2.5 py-1 rounded bg-white dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 text-xs font-semibold text-mineral-600 dark:text-mineral-300 flex items-center">
                <CreditCard className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Visa
              </span>
              <span className="px-2.5 py-1 rounded bg-white dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 text-xs font-semibold text-mineral-600 dark:text-mineral-300 flex items-center">
                <CreditCard className="w-3.5 h-3.5 mr-1 text-gold-500" /> Mastercard
              </span>
              <span className="px-2.5 py-1 rounded bg-white dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 text-xs font-semibold text-mineral-600 dark:text-mineral-300">
                PayPal
              </span>
              <span className="px-2.5 py-1 rounded bg-white dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 text-xs font-semibold text-mineral-600 dark:text-mineral-300">
                SPEI / Oxxo
              </span>
            </div>
          </div>

        </div>

        {/* Footer Bottom (Legal and copyright) */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 space-y-4 md:space-y-0 text-xs text-mineral-500 dark:text-mineral-400">
          <div>
            &copy; {new Date().getFullYear()} Mineralia S.A. de C.V. Todos los derechos reservados.
          </div>
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => handleNav('legal')} 
              className="hover:underline hover:text-emerald-500 transition-colors"
            >
              Aviso de Privacidad
            </button>
            <button 
              onClick={() => handleNav('legal')} 
              className="hover:underline hover:text-emerald-500 transition-colors"
            >
              Términos de Uso
            </button>
            <span className="text-mineral-300 dark:text-mineral-800">|</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
