import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Bot, SendHorizontal } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

const ChatModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = { role: 'user', content: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/rag/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: newMessage,
          topK: 3,
          history: [...messages, userMessage],
        }),
      });

      console.log('Contact', [...messages, userMessage]);
      if (!response.ok) throw new Error('فشل في الحصول على الرد');

      const data = await response.json();

      const rawAnswer = data.answer || 'تعذر الحصول على إجابة';
      const cleanAnswer = rawAnswer
        .replace(/n1\/\/.*?(\n|$)/g, '')
        .replace(/\*\*/g, '')
        .trim();

      const botResponse: Message = {
        role: 'assistant',
        content: cleanAnswer,
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('حدث خطأ:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'حدث خطأ في الاتصال بالخادم',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
<div className="fixed bottom-8 left-8 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen   )}
        className="w-16 h-16 rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
      >
        <Bot className="h-8 w-8" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-full left-0 mb-4 w-80"
            >
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">المساعد الارشادي</h3>
                <button onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs p-3 rounded-lg text-sm ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}>
                      {message.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-gray-800 p-3 rounded-lg text-sm">
                      جاري البحث عن إجابة...
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                    placeholder="اكتب رسالتك..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={isLoading}
                  >
                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatModal;
