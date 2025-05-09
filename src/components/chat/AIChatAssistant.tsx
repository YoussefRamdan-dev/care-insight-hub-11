
import { useState } from 'react';
import { nanoid } from 'nanoid';
import ChatInterface from './ChatInterface';
import { Message } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

// Mock AI responses
const aiResponses = {
  greeting: "Hello! I'm your AI medical assistant. How can I help you today?",
  appointment: "I can help you schedule an appointment. What date and time works best for you?",
  symptoms: "Could you describe your symptoms in more detail? This will help me provide better assistance.",
  medication: "Always take medications as prescribed by your doctor. Is there a specific medication you have questions about?",
  summary: "Based on your recent interactions, here's a summary of your condition and recommended next steps.",
};

// Function to generate AI response
const generateAIResponse = (message: string): string => {
  message = message.toLowerCase();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return aiResponses.greeting;
  } else if (message.includes('appointment') || message.includes('schedule') || message.includes('book')) {
    return aiResponses.appointment;
  } else if (message.includes('hurt') || message.includes('pain') || message.includes('feel')) {
    return aiResponses.symptoms;
  } else if (message.includes('medicine') || message.includes('drug') || message.includes('pill') || message.includes('medication')) {
    return aiResponses.medication;
  } else if (message.includes('summary') || message.includes('recap')) {
    return aiResponses.summary;
  } else {
    return "I'm here to help with any medical or appointment-related questions. Could you please provide more details about what you need?";
  }
};

interface AIChatAssistantProps {
  forDoctors?: boolean;
}

export default function AIChatAssistant({ forDoctors = false }: AIChatAssistantProps) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nanoid(),
      senderId: 'ai-bot',
      receiverId: currentUser?.id || 'user',
      content: forDoctors 
        ? "Hello Doctor! I'm your AI assistant. I can help you summarize patient history, suggest appointment times, or generate message drafts. How can I assist you today?"
        : "Hello! I'm your medical AI assistant. I can help answer questions about appointments, medications, or symptoms. How can I help you today?",
      timestamp: new Date().toISOString(),
      read: true
    }
  ]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      senderId: currentUser?.id || 'user',
      receiverId: 'ai-bot',
      content,
      timestamp: new Date().toISOString(),
      read: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate AI response after a short delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      
      const aiMessage: Message = {
        id: nanoid(),
        senderId: 'ai-bot',
        receiverId: currentUser?.id || 'user',
        content: aiResponse,
        timestamp: new Date().toISOString(),
        read: true
      };
      
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <ChatInterface 
      isAIAssistant
      messages={messages}
      onSendMessage={handleSendMessage}
    />
  );
}
