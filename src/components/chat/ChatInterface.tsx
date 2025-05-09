
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User } from 'lucide-react';
import { Message } from '@/types';

interface ChatInterfaceProps {
  recipientId?: string;
  recipientName?: string;
  isAIAssistant?: boolean;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export default function ChatInterface({
  recipientId,
  recipientName = 'Chat',
  isAIAssistant = false,
  messages,
  onSendMessage,
}: ChatInterfaceProps) {
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px] border">
      {/* Chat Header */}
      <div className="px-4 py-3 border-b flex items-center gap-3">
        <Avatar className="h-9 w-9 bg-primary-light">
          {isAIAssistant ? (
            <Bot className="h-5 w-5 text-primary-dark" />
          ) : (
            <User className="h-5 w-5 text-primary-dark" />
          )}
        </Avatar>
        <div>
          <h3 className="font-medium">
            {isAIAssistant ? 'AI Assistant' : recipientName}
          </h3>
          <p className="text-xs text-gray-500">
            {isAIAssistant ? 'Medical AI Bot' : 'Online'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.length > 0 ? (
            messages.map((message) => {
              const isCurrentUser = message.senderId === currentUser?.id;
              const isAI = message.senderId === 'ai-bot';

              return (
                <div
                  key={message.id}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2 rounded-lg ${
                      isCurrentUser
                        ? 'bg-primary text-white rounded-br-none'
                        : isAI
                        ? 'bg-purple-100 text-gray-800 rounded-bl-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {isAI && (
                      <div className="flex items-center gap-1 mb-1 text-xs text-gray-500">
                        <Bot className="h-3.5 w-3.5" />
                        <span>AI Bot</span>
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs text-right mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>{isAIAssistant ? 'Ask the AI assistant a question' : 'Start a conversation'}</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-3 border-t flex items-center gap-2">
        <Input
          placeholder={isAIAssistant ? "Ask the AI a question..." : "Type a message..."}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1"
        />
        <Button 
          size="icon" 
          onClick={handleSendMessage} 
          disabled={!newMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
