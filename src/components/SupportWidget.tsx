import React, { useState, useEffect, useRef } from 'react';
import { X, Send, User, Compass, HelpCircle, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

export const SupportWidget: React.FC = () => {
  const { navigateTo } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: 'Puedes consultar tus dudas sobre nuestra tienda.',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = (e?: React.SubmitEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = 'Nuestro equipo de soporte te respondera en seguida.';

      const query = userMsg.text.toLowerCase();
      if (query.includes('precio') || query.includes('comprar') || query.includes('costo')) {
        replyText = 'Puedes ver todos nuestros minerales y sus precios en la sección de "Shop"';
      } else if (query.includes('catalogo') || query.includes('minerales') || query.includes('lista')) {
        replyText = 'Contamos con una amplia variedad de minerales clasificados en nuestra sección de "Catálogo"';
      } else if (query.includes('envio') || query.includes('entregar') || query.includes('mexico')) {
        replyText = 'Realizamos envíos a todo México.';
      } else if (query.includes('hola') || query.includes('buenas')) {
        replyText = 'Estoy para ayudarte con tus dudas sobre minerales, envíos o pedidos. ¿Qué mineral tienes en mente?';
      }

      setMessages(prev => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: replyText,
          timestamp: new Date()
        }
      ]);
    }, 1500);
  };

  const handleQuickOption = (option: string) => {
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: option,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = '';

      if (option === 'Catalogo') {
        replyText = 'Explora nuestro catalogo cientifico de minerales.';
        navigateTo('catalog');
      } else if (option === 'WhatsApp') {
        replyText = 'Redirigiendo a WhatsApp...';
        window.open('https://wa.me/524428364570', '_blank');
      } else if (option === 'Horarios de Tienda') {
        replyText = 'La tienda fisica abre de Lunes a Viernes de 11:00 AM a 4:00 pm y Sabados de 11:00 AM a 3:00 pm.';
      } else {
        replyText = '¿Te puedo ayudar en algo mas?';
      }

      setMessages(prev => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          text: replyText,
          timestamp: new Date()
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group w-14 h-14 bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
        >
          <span className="absolute top-0 right-0 block h-3.5 w-3.5 rounded-full ring-2 ring-white dark:ring-mineral-950 bg-emerald-400"></span>
          <span className="absolute right-16 scale-0 transition-all duration-200 origin-right group-hover:scale-100 bg-mineral-800 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap">
            Chat para dudas
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[360px] sm:w-[380px] h-[500px] bg-white dark:bg-mineral-900 border border-mineral-200 dark:border-mineral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h3 className="font-bold text-sm tracking-wide">Canek - Soporte</h3>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto bg-slate-50 dark:bg-mineral-950/40 space-y-4">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-end space-x-2 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${msg.sender === 'user'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-mineral-200 text-mineral-700 dark:bg-mineral-800 dark:text-mineral-300'
                    }`}>
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : ''}
                  </div>

                  {/* Bubble */}
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.sender === 'user'
                      ? 'bg-emerald-500 text-white rounded-br-none'
                      : 'bg-white dark:bg-mineral-850 text-mineral-800 dark:text-mineral-100 border border-mineral-100 dark:border-mineral-800 rounded-bl-none'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-end space-x-2 max-w-[80%]">
                  <div className="p-3 bg-white dark:bg-mineral-850 border border-mineral-100 dark:border-mineral-800 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-mineral-450 dark:bg-mineral-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-mineral-450 dark:bg-mineral-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-mineral-450 dark:bg-mineral-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions Panel */}
          <div className="px-4 py-2 border-t border-mineral-100 dark:border-mineral-800 bg-white dark:bg-mineral-900 flex flex-wrap gap-1.5">
            <button
              onClick={() => handleQuickOption('WhatsApp')}
              className="px-2.5 py-1 text-3xs font-semibold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900 rounded-full hover:bg-emerald-100 transition-colors flex items-center space-x-1"
            >
              <PhoneCall className="w-2.5 h-2.5" />
              <span>Soporte WhatsApp</span>
            </button>
            <button
              onClick={() => handleQuickOption('Catalogo')}
              className="px-2.5 py-1 text-3xs font-semibold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900 rounded-full hover:bg-indigo-100 transition-colors flex items-center space-x-1"
            >
              <Compass className="w-2.5 h-2.5" />
              <span>Catálogo</span>
            </button>
            <button
              onClick={() => handleQuickOption('Horarios de Tienda')}
              className="px-2.5 py-1 text-3xs font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-900 rounded-full hover:bg-amber-100 transition-colors flex items-center space-x-1"
            >
              <HelpCircle className="w-2.5 h-2.5" />
              <span>Horarios</span>
            </button>
          </div>

          {/* Form Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-mineral-100 dark:border-mineral-800 bg-white dark:bg-mineral-900 flex items-center space-x-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Escribe tu consulta tecnica..."
              className="flex-grow px-3 py-2 text-xs bg-slate-50 dark:bg-mineral-950/50 border border-mineral-200 dark:border-mineral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-mineral-800 dark:text-mineral-100"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 transition-colors flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
