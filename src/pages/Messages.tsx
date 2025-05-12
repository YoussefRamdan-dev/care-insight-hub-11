
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import ChatInterface from '@/components/chat/ChatInterface';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { mockDoctors } from '@/data/mockData';
import { Message, User } from '@/types';
import { v4 as uuidv4 } from 'uuid';

const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'doctor1',
    receiverId: 'patient1',
    content: 'Hello, how can I help you today?',
    timestamp: '2025-03-01T09:00:00Z',
    read: true
  },
  {
    id: '2',
    senderId: 'patient1',
    receiverId: 'doctor1',
    content: 'I\'ve been experiencing headaches for the past few days.',
    timestamp: '2025-03-01T09:05:00Z',
    read: true
  },
  {
    id: '3',
    senderId: 'doctor1',
    receiverId: 'patient1',
    content: 'I\'m sorry to hear that. Can you describe the pain and when it usually occurs?',
    timestamp: '2025-03-01T09:10:00Z',
    read: true
  },
  {
    id: '4',
    senderId: 'doctor2',
    receiverId: 'patient1',
    content: 'Your lab results look good. No concerns at this time.',
    timestamp: '2025-03-02T14:30:00Z',
    read: false
  }
];

const Messages = () => {
  const { currentUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [conversations, setConversations] = useState<User[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [recipientUser, setRecipientUser] = useState<User | null>(null);
  
  // Extract any passed recipient from navigation
  useEffect(() => {
    if (location.state?.recipientId) {
      setActiveChat(location.state.recipientId);
    }
  }, [location.state]);

  // Fetch conversations
  const { data: conversationsData } = useQuery({
    queryKey: ['conversations', currentUser?.id],
    queryFn: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would fetch actual conversation partners
      // For now, return some mock doctors or patients based on user role
      return mockDoctors.filter(user => 
        user.role !== currentUser?.role
      ).slice(0, 5);
    },
    enabled: !!currentUser
  });

  // Use effect to set initial conversations state
  useEffect(() => {
    if (conversationsData) {
      setConversations(conversationsData);
    }
  }, [conversationsData]);

  // Filter conversations based on search query
  const filteredConversations = conversations.filter(
    conversation => conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch messages for active chat
  useEffect(() => {
    if (activeChat && currentUser) {
      // In a real app, this would be an API call
      const fetchedMessages = mockMessages.filter(
        message => 
          (message.senderId === currentUser.id && message.receiverId === activeChat) ||
          (message.receiverId === currentUser.id && message.senderId === activeChat)
      );
      
      // Sort by timestamp
      fetchedMessages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
      
      setChatMessages(fetchedMessages);
      
      // Find recipient user data
      const recipient = mockDoctors.find(user => user.id === activeChat);
      if (recipient) {
        setRecipientUser(recipient);
      }
    }
  }, [activeChat, currentUser]);

  const handleSendMessage = (message: string) => {
    if (!activeChat || !currentUser || message.trim() === '') return;
    
    const newMessage: Message = {
      id: uuidv4(),
      senderId: currentUser.id,
      receiverId: activeChat,
      content: message,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    // Update UI immediately
    setChatMessages(prev => [...prev, newMessage]);
    
    // In a real app, this would make an API call to save the message
    console.log('Sending message:', newMessage);
  };

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Conversations List */}
          <div className="md:col-span-4">
            <Card className="h-[70vh] flex flex-col">
              <CardContent className="p-4 flex-grow flex flex-col">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search conversations..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex-grow overflow-y-auto">
                  {filteredConversations.length > 0 ? (
                    <div className="space-y-2">
                      {filteredConversations.map((conversation) => (
                        <div 
                          key={conversation.id}
                          className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                            activeChat === conversation.id ? 'bg-accent' : 'hover:bg-muted'
                          }`}
                          onClick={() => setActiveChat(conversation.id)}
                        >
                          <Avatar>
                            <AvatarImage src={conversation.profileImage} />
                            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-grow min-width-0">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">{conversation.name}</h3>
                              <span className="text-xs text-muted-foreground">12:30 PM</span>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.role === 'doctor' 
                                ? `Dr. ${conversation.name} - ${(conversation as any).specialty}` 
                                : 'Patient'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <p className="text-muted-foreground mb-2">No conversations found</p>
                      <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                        Clear search
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center"
                    onClick={() => navigate('/specialties')}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    New Conversation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Chat Interface */}
          <div className="md:col-span-8">
            <Card className="h-[70vh]">
              {activeChat && recipientUser ? (
                <ChatInterface 
                  messages={chatMessages} 
                  onSendMessage={handleSendMessage} 
                  recipientId={activeChat}
                  recipientName={recipientUser.name}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list or start a new one
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
