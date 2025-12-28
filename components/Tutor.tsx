import React, { useState, useRef, useEffect } from 'react';
import { chatWithTutor } from '../services/geminiService';
import { ChatMessage } from '../types';

const Tutor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: '¡Hola! Soy tu tutor de Farmacología. ¿Tienes dudas sobre el tema 9 (Sistema Cardiovascular)? ¡Pregúntame sobre Digoxina, IC, o lo que necesites!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    const userMsg: ChatMessage = { role: 'user', text: currentInput };
    
    // Añadimos mensaje del usuario inmediatamente
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Preparar historial (excluyendo el mensaje que acabamos de añadir al estado visual, ya que lo enviaremos como 'message' actual)
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    // Llamada a la API
    const responseText = await chatWithTutor(history, currentInput);
    
    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      <div className="bg-teal-600 p-4 text-white font-bold flex items-center shadow-md shrink-0">
        <span className="text-2xl mr-2">👨‍⚕️</span>
        <div>
           <h2 className="text-lg">Tutor Virtual</h2>
           <p className="text-xs text-teal-200">Experto en Farmacología</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl shadow-sm text-sm md:text-base leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white rounded-tr-none' 
                : msg.text.includes('Error') || msg.text.includes('😵')
                  ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
             <div className="bg-gray-200 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-gray-500 text-sm">
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
               <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               <span>Pensando...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 bg-gray-100 border-t border-gray-200 flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ej: ¿Qué hace la Digoxina?"
          disabled={isLoading}
          className="flex-1 p-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:bg-gray-200"
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-teal-600 hover:bg-teal-700 text-white p-3 px-6 rounded-full font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default Tutor;