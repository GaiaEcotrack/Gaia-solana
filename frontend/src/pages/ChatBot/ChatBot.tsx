import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAccount } from "@gear-js/react-hooks";

type Message = {
  sender: 'user' | 'bot';
  content: string;
  timestamp?: Date;
};

const Chatbot = () => {
  const { account } = useAccount();
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      content: '¡Hola! Soy el asistente de Gaia Ecotrack. ¿Cómo puedo ayudarte con sostenibilidad hoy?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const api = process.env.VITE_APP_API_EXPRESS;

  // Cargar mensajes guardados al montar
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      try {
        const parsedMessages: Message[] = JSON.parse(savedMessages);
        // Reconstruir fechas (porque localStorage guarda todo como string)
        parsedMessages.forEach(msg => {
          if (msg.timestamp) {
            msg.timestamp = new Date(msg.timestamp);
          }
        });
        setMessages(parsedMessages);
      } catch (e) {
        console.error('Error al parsear mensajes guardados:', e);
      }
    }
  }, []);

  // Guardar mensajes en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll al final
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleChat = () => {
    setChatOpen(!chatOpen);
    if (!chatOpen) {
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput === '') return;

    const newMessage: Message = {
      sender: 'user',
      content: trimmedInput,
      timestamp: new Date()
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInput('');
    setLoading(true);

    const wallet = account?.decodedAddress || '';
    try {
      const response = await axios.post(`${api}/chatbot`, {
        message: trimmedInput,
        data: {
          wallet: wallet,
          history: messages, // enviamos todo el historial
        }
      });

      const botMessage: Message = {
        sender: 'bot',
        content: response.data.message,
        timestamp: new Date()
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        sender: 'bot',
        content: 'Lo siento, hubo un error procesando tu solicitud. Por favor, inténtalo de nuevo más tarde.',
        timestamp: new Date()
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className=" hidden fixed bottom-4 right-4 z-50 font-sans">
      {/* Botón para abrir/cerrar chat */}
      <button
        onClick={toggleChat}
        aria-label="Abrir chat de Gaia Ecotrack"
        className="relative bg-green-600 text-white rounded-full p-4 shadow-lg hover:bg-green-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
      >
        💬
        {!chatOpen && messages.length > 1 && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
      </button>

      {/* Contenedor del chat */}
      {chatOpen && (
        <div className="absolute bottom-16 right-0 bg-white border border-gray-200 rounded-lg shadow-xl w-80 h-[32rem] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-3 flex justify-between items-center">
            <h2 className="font-semibold text-lg">gAIa Beta</h2>
            <button
              onClick={toggleChat}
              aria-label="Cerrar chat"
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              ×
            </button>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender === 'user'
                    ? 'bg-green-600 text-white rounded-tr-none'
                    : 'bg-gray-200 text-gray-800 rounded-tl-none'}`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg rounded-tl-none max-w-xs">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de input */}
          <div className="p-3 border-t border-gray-200 text-black bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500"
                placeholder="Escribe tu mensaje..."
                aria-label="Escribe tu mensaje"
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
                disabled={loading || input.trim() === ''}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  '→'
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Gaia Ecotrack · {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
