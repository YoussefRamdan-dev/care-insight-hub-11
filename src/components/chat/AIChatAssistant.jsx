
import { useState } from 'react';
import { nanoid } from 'nanoid';
import ChatInterface from './ChatInterface';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../ui/card';
import { Bot } from 'lucide-react';
import { Button } from '../ui/button';

const AIChatAssistant = ({ forDoctors }) => {
  const [showChat, setShowChat] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Mock AI responses
  const aiResponses = {
    greeting: forDoctors 
      ? "Hello doctor! I'm your AI medical assistant. How can I help with your patients today?"
      : "Hello! I'm your AI health assistant. How can I help you today?",
    appointment: forDoctors
      ? "I can help you schedule patient appointments efficiently. What date range would work for you?"
      : "I can help you schedule a doctor's appointment. Would you like me to show available slots?",
    symptoms: forDoctors
      ? "Based on the described symptoms and uploaded files, my analysis suggests possible conditions to consider."
      : "Based on the symptoms you've shared, here are some possible conditions. Please consult with a doctor for proper diagnosis."
  };

  const handleChatToggle = () => {
    setShowChat(!showChat);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {!showChat ? (
        <Button 
          onClick={handleChatToggle}
          className="rounded-full h-14 w-14 flex items-center justify-center bg-primary hover:bg-primary/90"
        >
          <Bot size={24} />
        </Button>
      ) : (
        <Card className="w-80 md:w-96 h-[500px] shadow-lg">
          <CardContent className="p-0">
            <ChatInterface 
              onClose={handleChatToggle} 
              initialMessage={aiResponses.greeting}
              forDoctors={forDoctors}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIChatAssistant;
