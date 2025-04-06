"use client";

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';

interface Message {
  text: string;
  isBot: boolean;
  isCode?: boolean;
}

interface ChatBotProps {
  currentCode: string;
}

export default function ChatBot({ currentCode }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Hi! I'm here to help you with your coding problems. How can I assist you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setIsLoading(true);

    try {
      const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: input,
          code: currentCode
        })
      });

      setIsLoading(false);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prev => [...prev, {
        text: data.response,
        isBot: true,
        isCode: data.isCode || false
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, there was an error processing your request.',
        isBot: true
      }]);
    }
  };

  return (
    <div className={`fixed bottom-4 ${windowWidth <= 800 ? 'inset-x-4' : 'right-4'} z-50`}>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 flex items-center gap-2"
      >
        <FaRobot size={20} />
        {!isOpen && <span>Chat with AI</span>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`absolute bottom-16 ${windowWidth <= 800 ? 'inset-x-0' : 'right-0 w-[800px]'} h-[500px] bg-white rounded-lg shadow-xl flex flex-col`}
        >
          <style jsx global>{`
            .chat-message pre {
              background: #f0f0f0;
              padding: 0.5rem;
              border-radius: 4px;
              overflow-x: auto;
              margin: 0.5rem 0;
            }
            .chat-message code {
              background: #f0f0f0;
              padding: 0.2rem 0.4rem;
              border-radius: 3px;
              font-size: 0.9em;
            }
            .chat-message p {
              margin: 0.5rem 0;
            }
          `}</style>
          {/* Header */}
          <div className="p-4 bg-purple-600 text-white rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaRobot />
              <span>AI Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={async () => {
                  try {
                    await fetch('/chat/reset', { method: 'POST' });
                    setMessages([{
                      text: "Chat history has been reset. How can I help you with your code?",
                      isBot: true
                    }]);
                  } catch (error) {
                    console.error('Error resetting chat:', error);
                  }
                }}
                className="text-white hover:text-gray-200 transition-colors px-3 py-1 rounded border border-white/30 text-sm mr-2"
              >
                Reset Chat
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`chat-message max-w-[90%] p-3 rounded-lg whitespace-pre-wrap ${message.isBot
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-purple-600 text-white'
                    }`}
                >
                  <ReactMarkdown>
                    {message.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-center">
                <div className="spinner-border animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-purple-600"
              />
              <button
                type="submit"
                className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
