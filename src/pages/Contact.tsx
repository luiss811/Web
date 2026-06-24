import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, MapPin, Send, CheckCircle2, Compass } from 'lucide-react';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'El nombre es obligatorio.';
    if (!formData.email.trim()) {
      errs.email = 'El correo electrónico es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'El correo electrónico no es válido.';
    }
    if (!formData.subject.trim()) errs.subject = 'El asunto es obligatorio.';
    if (!formData.message.trim()) errs.message = 'El mensaje es obligatorio.';
    
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Simulate form submission success
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Intro */}
      <div className="space-y-4 mb-10 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-mineral-800 dark:text-mineral-100">
          Formulario de <span className="bg-clip-text text-transparent">Contacto</span> y Ubicación
        </h1>
        <p className="text-sm text-mineral-500 dark:text-mineral-400 leading-relaxed">
          ¿Tienes dudas sobre un espécimen mineral, clasificaciones cristalográficas o envíos internacionales? Escríbenos directamente o visítanos en nuestro laboratorio de exhibición.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Contact Form */}
        <div className="glass-card sci-box p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-mineral-200/40 dark:border-mineral-800/40 pb-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold font-display text-mineral-800 dark:text-mineral-100">Envíanos un Mensaje</h2>
            </div>
            <span className="text-[9px] font-mono text-mineral-450 dark:text-mineral-500 uppercase tracking-wider">// COM_INBOX</span>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-mineral-800 dark:text-mineral-100">¡Mensaje Enviado con Éxito!</h3>
              <p className="text-sm text-mineral-500 dark:text-mineral-400 max-w-sm mx-auto leading-relaxed">
                Agradecemos tu comunicación. Uno de nuestros gemólogos especializados responderá a tu solicitud en menos de 24 horas hábiles.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow transition-colors"
              >
                Enviar Otro Mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-wide mb-1.5">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-mineral-50/50 dark:bg-mineral-950/50 text-mineral-800 dark:text-mineral-100 placeholder-mineral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.name ? 'border-ruby-500' : 'border-mineral-200 dark:border-mineral-800'
                  }`}
                />
                {errors.name && <p className="text-2xs text-ruby-500 mt-1 font-semibold">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-wide mb-1.5">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ejemplo@correo.com"
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-mineral-50/50 dark:bg-mineral-950/50 text-mineral-800 dark:text-mineral-100 placeholder-mineral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.email ? 'border-ruby-500' : 'border-mineral-200 dark:border-mineral-800'
                  }`}
                />
                {errors.email && <p className="text-2xs text-ruby-500 mt-1 font-semibold">{errors.email}</p>}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-wide mb-1.5">
                  Asunto de Consulta
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ej. Dudas sobre autenticidad de Hureaulita"
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-mineral-50/50 dark:bg-mineral-950/50 text-mineral-800 dark:text-mineral-100 placeholder-mineral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.subject ? 'border-ruby-500' : 'border-mineral-200 dark:border-mineral-800'
                  }`}
                />
                {errors.subject && <p className="text-2xs text-ruby-500 mt-1 font-semibold">{errors.subject}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-mineral-500 dark:text-mineral-400 uppercase tracking-wide mb-1.5">
                  Mensaje / Consulta Técnica
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Escribe detalladamente tu mensaje aquí..."
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border bg-mineral-50/50 dark:bg-mineral-950/50 text-mineral-800 dark:text-mineral-100 placeholder-mineral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.message ? 'border-ruby-500' : 'border-mineral-200 dark:border-mineral-800'
                  }`}
                ></textarea>
                {errors.message && <p className="text-2xs text-ruby-500 mt-1 font-semibold">{errors.message}</p>}
              </div>

              {/* CTA Send */}
              <button
                type="submit"
                  className="w-full py-3 hover:from-emerald-600 hover:to-gold-600 text-mineral-950 font-black rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Solicitud</span>
              </button>

            </form>
          )}
        </div>

        {/* 2. LOCATOR MAP & CONTACT DETAILS (Prezi elements) */}
        <div className="space-y-6">
          
          {/* Contact Details */}
          <div className="glass-card p-6 space-y-4">
            <h2 className="text-lg font-bold font-display text-mineral-800 dark:text-mineral-100 border-b border-mineral-200/40 dark:border-mineral-800/40 pb-4">
              Canales de Atención Directa
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-mineral-50 dark:bg-mineral-950/20 border border-mineral-200/30 dark:border-mineral-800/30 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-500">
                  <Mail className="w-4.5 h-4.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Correo Electrónico</span>
                </div>
                <a href="mailto:lalitorios81@gmail.com" className="text-sm font-semibold text-mineral-700 dark:text-mineral-250 hover:underline">
                  lalitorios81@gmail.com
                </a>
              </div>

              <div className="p-4 rounded-xl bg-mineral-50 dark:bg-mineral-950/20 border border-mineral-200/30 dark:border-mineral-800/30 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-xs font-bold uppercase tracking-wider">WhatsApp Soporte</span>
                </div>
                <a href="https://wa.me/524428364570" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-mineral-700 dark:text-mineral-250 hover:underline">
                  442 836 4570
                </a>
              </div>

              <div className="p-4 rounded-xl bg-mineral-50 dark:bg-mineral-950/20 border border-mineral-200/30 dark:border-mineral-800/30 space-y-2">
                <div className="flex items-center space-x-2 text-gold-500">
                  <Phone className="w-4.5 h-4.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Línea de Llamadas</span>
                </div>
                <a href="tel:4464225541" className="text-sm font-semibold text-mineral-700 dark:text-mineral-250 hover:underline">
                  446 422 5541
                </a>
              </div>

              <div className="p-4 rounded-xl bg-mineral-50 dark:bg-mineral-950/20 border border-mineral-200/30 dark:border-mineral-800/30 space-y-2">
                <div className="flex items-center space-x-2 text-gold-500">
                  <MapPin className="w-4.5 h-4.5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Exhibición y Laboratorio</span>
                </div>
                <span className="text-xs font-semibold text-mineral-700 dark:text-mineral-250">
                  Querétaro, México (C.P. 76000)
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Styled Mock Map */}
          <div className="glass-card overflow-hidden h-[300px] relative group border border-mineral-200 dark:border-mineral-800 sci-box">
            {/* Grid Pattern Background simulating map topography */}
            <div className="absolute inset-0 bg-mineral-950 flex items-center justify-center overflow-hidden">
              {/* Fake topography contours using styled circles */}
              <div className="absolute w-[600px] h-[600px] border border-emerald-500/10 rounded-full"></div>
              <div className="absolute w-[450px] h-[450px] border border-gold-500/5 rounded-full"></div>
              <div className="absolute w-[300px] h-[300px] border border-white/5 rounded-full"></div>
              <div className="absolute w-[150px] h-[150px] border border-emerald-500/5 rounded-full"></div>
              
              {/* Fake roads and coordinates lines */}
              <div className="absolute top-[20%] left-0 w-full h-[0.5px] bg-mineral-800/40"></div>
              <div className="absolute top-[60%] left-0 w-full h-[0.5px] bg-mineral-800/40"></div>
              <div className="absolute left-[30%] top-0 w-[0.5px] h-full bg-mineral-800/40"></div>
              <div className="absolute left-[75%] top-0 w-[0.5px] h-full bg-mineral-800/40"></div>

              {/* Pin indicator */}
              <div className="absolute top-[48%] left-[48%] flex flex-col items-center justify-center z-10">
                <div className="w-8 h-8 rounded-full bg-emerald-500/30 border border-emerald-500 flex items-center justify-center relative shadow-lg">
                  <MapPin className="w-4.5 h-4.5 text-white" />
                </div>
                {/* Floating tooltip */}
                <div className="mt-2.5 px-3 py-1.5 rounded-lg glass text-3xs font-black text-mineral-800 dark:text-mineral-100 flex items-center space-x-1.5 shadow-md">
                  <Compass className="w-3 h-3 text-gold-500" />
                  <span>Sede Mineralia HQ</span>
                </div>
              </div>
              
              {/* Map overlays / zoom mock controls */}
              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded bg-mineral-950/80 text-[10px] font-mono text-mineral-400 border border-mineral-800">
                Lat: 20.5888° N, Long: 100.3899° W
              </div>

              <div className="absolute top-3 right-3 flex flex-col space-y-1">
                <button className="w-7 h-7 rounded bg-mineral-950/80 text-white font-bold border border-mineral-800 text-xs flex items-center justify-center hover:bg-mineral-800">+</button>
                <button className="w-7 h-7 rounded bg-mineral-950/80 text-white font-bold border border-mineral-800 text-xs flex items-center justify-center hover:bg-mineral-800">-</button>
              </div>
            </div>
            
            {/* Map footer card */}
            <div className="absolute bottom-3 right-3 glass px-3 py-2 rounded-xl border border-white/10 max-w-[200px] pointer-events-none">
              <span className="text-[9px] font-bold text-emerald-500 block uppercase">Centro de Investigación</span>
              <p className="text-[10px] text-mineral-600 dark:text-mineral-300 font-light leading-tight mt-0.5">
                Calle Geología Real #100, Querétaro, Qro.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
