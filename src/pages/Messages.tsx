
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchIcon, Edit, Phone, ArrowRight, Plus, MessageSquare } from 'lucide-react';
import ChatInterface from "@/components/chat/ChatInterface";
import AIChatAssistant from '@/components/chat/AIChatAssistant';
import { PatientProfile, DoctorProfile, User } from '@/types';

// Mock data
const mockUsers = [
  { id: '1', name: 'Dr. Sarah Johnson', role: 'doctor' as const, specialty: 'Cardiologist', lastMessage: 'Hello, how can I help you today?', time: '10:30 AM', unread: 3 },
  { id: '2', name: 'Dr. Michael Chen', role: 'doctor' as const, specialty: 'Neurologist', lastMessage: 'Your test results look good.', time: 'Yesterday', unread: 0 },
  { id: '3', name: 'Dr. Emily Wilson', role: 'doctor' as const, specialty: 'Dermatologist', lastMessage: 'Please send the photos of the rash.', time: 'Jul 21', unread: 1 },
  { id: '4', name: 'John Smith', role: 'patient' as const, lastMessage: 'When can I schedule an appointment?', time: '11:45 AM', unread: 2 },
  { id: '5', name: 'Maria Garcia', role: 'patient' as const, lastMessage: 'Thank you for the prescription.', time: 'Yesterday', unread: 0 },
];

const Messages = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'ai-assistant'>('chats');
  
  // Filter users based on current user role and search term
  const filteredUsers = mockUsers.filter(user => {
    // Only show doctors to patients and patients to doctors
    const roleFilter = currentUser?.role === 'doctor' 
      ? user.role === 'patient' 
      : user.role === 'doctor';
      
    // Filter by search term
    const searchFilter = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return roleFilter && searchFilter;
  });
  
  const selectedUser = mockUsers.find(user => user.id === selectedUserId);
  
  if (!currentUser) {
    return (
      <Layout>
        <div className="container py-10">
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-10">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium mb-2">Sign in to access messages</h3>
              <p className="text-muted-foreground mb-4 text-center">
                You need to be logged in to view and send messages
              </p>
              <Button onClick={() => navigate('/login')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'chats' | 'ai-assistant')}>
          <TabsList className="mb-6">
            <TabsTrigger value="chats">Conversations</TabsTrigger>
            {currentUser.role === 'doctor' && (
              <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="chats">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1 overflow-hidden">
                <div className="p-4 border-b">
                  <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search messages..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="divide-y overflow-y-auto max-h-[70vh]">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                      <div 
                        key={user.id}
                        className={`flex items-start p-4 gap-3 cursor-pointer hover:bg-accent transition-colors ${selectedUserId === user.id ? 'bg-accent' : ''}`}
                        onClick={() => setSelectedUserId(user.id)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <h3 className="font-medium truncate">{user.name}</h3>
                            <span className="text-xs text-muted-foreground">{user.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {user.lastMessage}
                          </p>
                          {user.role === 'doctor' && (
                            <span className="text-xs text-primary">{user.specialty}</span>
                          )}
                        </div>
                        {user.unread > 0 && (
                          <span className="bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {user.unread}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-muted-foreground">
                      No conversations found
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    New Message
                  </Button>
                </div>
              </Card>
              
              <Card className="md:col-span-2">
                {selectedUser ? (
                  <>
                    <div className="p-4 border-b flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{selectedUser.name}</h3>
                          {selectedUser.role === 'doctor' && (
                            <span className="text-xs text-primary">{selectedUser.specialty}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <ChatInterface recipientId={selectedUser.id} recipientName={selectedUser.name} />
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[50vh]">
                    <MessageSquare className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium mb-1">No conversation selected</h3>
                    <p className="text-muted-foreground mb-4 text-center max-w-sm">
                      Choose a conversation from the list or start a new one
                    </p>
                    <Button>
                      Start a new conversation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="ai-assistant">
            {currentUser.role === 'doctor' && (
              <Card>
                <CardHeader>
                  <CardTitle>AI Medical Assistant</CardTitle>
                </CardHeader>
                <CardContent>
                  <AIChatAssistant />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Messages;
