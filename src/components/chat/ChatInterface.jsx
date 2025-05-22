
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { X, Send, Paperclip, Bot } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { nanoid } from 'nanoid';

const ChatInterface = ({ onClose, initialMessage, forDoctors }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);
  
  useEffect(() => {
    // Add initial AI message
    if (initialMessage) {
      setMessages([
        {
          id: nanoid(),
          content: initialMessage,
          sender: 'ai',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (input.trim() === '') return;

    // Add user message
    const userMessage = {
      id: nanoid(),
      content: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponses = {
        appointment: forDoctors 
          ? "I can help manage your patient schedule. Would you like to see upcoming appointments or create a new one?"
          : "I can help you book a doctor's appointment. What type of specialist do you need to see?",
        
        prescription: forDoctors
          ? "I can help draft medication prescriptions based on patient history and current symptoms."
          : "Would you like me to remind you about your medication schedule or help you understand your prescription?",
        
        generic: forDoctors
          ? "I'm here to assist with patient management, medical research, and clinical decision support. How can I help you today?"
          : "I'm here to help with your healthcare needs. Would you like information about symptoms, medications, or finding a doctor?"
      };
      
      // Generate response based on user input
      let responseText = aiResponses.generic;
      if (input.toLowerCase().includes('appointment')) {
        responseText = aiResponses.appointment;
      } else if (input.toLowerCase().includes('prescription') || input.toLowerCase().includes('medication')) {
        responseText = aiResponses.prescription;
      }
      
      const aiMessage = {
        id: nanoid(),
        content: responseText,
        sender: 'ai',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Bot size={20} className="text-primary" />
          <h3 className="font-medium">
            {forDoctors ? "Medical Assistant" : "Health Assistant"}
          </h3>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-muted">
                <div className="flex space-x-2 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={endOfMessagesRef} />
        </div>
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="icon" className="shrink-0">
            <Paperclip size={18} />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            size="icon" 
            disabled={input.trim() === '' || loading}
            className="shrink-0"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
