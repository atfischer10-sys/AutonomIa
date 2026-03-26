import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Message, Action } from '../types';
import { Send, Sparkles, X, ChevronUp, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const Copilot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu Copiloto Fiscal. He detectado que tienes 3 gastos sin categorizar de esta semana. También puedes conectar tu banco para automatizar todo. ¿Qué prefieres hacer?',
      timestamp: new Date(),
      actions: [
        { id: 'a1', label: 'Categorizar gastos', type: 'categorize_expense' },
        { id: 'a2', label: 'Conectar Banco', type: 'connect_bank' },
        { id: 'a3', label: 'Ver resumen IVA', type: 'prepare_tax' }
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: input }] }
        ],
        config: {
          systemInstruction: `Eres AutonomIA, un copiloto fiscal experto para autónomos en España en el año 2026. 
          Tu tono es profesional, cercano y proactivo. 
          Ayudas con IVA, IRPF, facturación electrónica (Ley Crea y Crece), Veri*factu y conciliación bancaria.
          Si el usuario pide algo relacionado con facturas, bancos o impuestos, ofrece acciones concretas.
          Responde siempre en español.`
        }
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text || 'Lo siento, no pude procesar tu solicitud.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95, x: 20 }}
            className="glass-morphism w-[400px] h-[600px] rounded-2xl flex flex-col overflow-hidden mb-4 shadow-2xl"
          >
            {/* Header */}
            <div className="bg-brand-primary p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Sparkles size={20} className="text-brand-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">AutonomIA Copilot</h3>
                  <p className="text-xs text-blue-100">Tu piloto automático fiscal</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", 
                    msg.role === 'assistant' ? "bg-brand-primary text-white" : "bg-slate-200 text-slate-600")}>
                    {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                  </div>
                  <div className="space-y-2 max-w-[80%]">
                    <div className={cn("p-3 rounded-2xl text-sm", 
                      msg.role === 'assistant' ? "bg-white text-slate-800 shadow-sm" : "bg-brand-primary text-white")}>
                      <div className="markdown-body">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                    {msg.actions && (
                      <div className="flex flex-wrap gap-2">
                        {msg.actions.map(action => (
                          <button
                            key={action.id}
                            onClick={() => {
                              setMessages(prev => [...prev, {
                                id: Date.now().toString(),
                                role: 'user',
                                content: action.label,
                                timestamp: new Date()
                              }]);
                              // Simulate processing
                              setIsLoading(true);
                              setTimeout(() => {
                                setMessages(prev => [...prev, {
                                  id: (Date.now() + 1).toString(),
                                  role: 'assistant',
                                  content: `Entendido. He iniciado el proceso de **${action.label}**. ¿Quieres que te muestre los detalles?`,
                                  timestamp: new Date()
                                }]);
                                setIsLoading(false);
                              }, 1000);
                            }}
                            className="text-xs bg-blue-50 text-brand-primary border border-blue-100 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors font-medium"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center">
                    <Bot size={18} />
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                    <Loader2 size={18} className="animate-spin text-brand-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pregúntame cualquier cosa..."
                  className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2 group"
      >
        <Sparkles size={24} className={cn("group-hover:rotate-12 transition-transform", isOpen && "rotate-180")} />
        {!isOpen && <span className="font-semibold pr-2">Copilot</span>}
      </button>
    </div>
  );
};
