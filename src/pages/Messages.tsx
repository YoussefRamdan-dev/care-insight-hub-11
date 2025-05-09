
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { mockMessages, mockDoctors, mockPatients } from '../data/mockData';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { MessageSquare, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Messages = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState([...mockMessages]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [contacts, setContacts] = useState<Array<{ id: string; name: string; profileImage?: string }>>([]);
  
  useEffect(() => {
    if (!currentUser) return;

    // Get contacts based on user role
    const userMessages = messages.filter(
      msg => msg.senderId === currentUser.id || msg.receiverId === currentUser.id
    );

    const contactIds = userMessages.map(msg => {
      return msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
    });

    const uniqueContactIds = [...new Set(contactIds)];
    
    let userContacts: Array<{ id: string; name: string; profileImage?: string }> = [];
    
    if (currentUser.role === 'patient') {
      userContacts = mockDoctors
        .filter(doctor => uniqueContactIds.includes(doctor.id))
        .map(doctor => ({
          id: doctor.id,
          name: doctor.name,
          profileImage: doctor.profileImage
        }));
    } else {
      userContacts = mockPatients
        .filter(patient => uniqueContactIds.includes(patient.id))
        .map(patient => ({
          id: patient.id,
          name: patient.name,
          profileImage: patient.profileImage
        }));
    }

    setContacts(userContacts);
    
    // If there are contacts and none is selected, select the first one
    if (userContacts.length > 0 && !selectedContact) {
      setSelectedContact(userContacts[0].id);
    }
  }, [currentUser, messages, selectedContact]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser?.id || '',
      receiverId: selectedContact,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    toast({
      title: "Message Sent",
      description: "Your message has been sent successfully.",
    });
  };

  const getContactMessages = () => {
    if (!selectedContact || !currentUser) return [];
    
    return messages.filter(
      msg => (msg.senderId === currentUser.id && msg.receiverId === selectedContact) || 
             (msg.receiverId === currentUser.id && msg.senderId === selectedContact)
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };
  
  const getContactName = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!currentUser) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p>Please login to view your messages.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Messages</h1>

        <Card className="bg-white flex h-[calc(80vh-120px)] rounded-lg overflow-hidden">
          {/* Contacts Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-100">
            <div className="p-4 border-b">
              <h2 className="font-semibold">Conversations</h2>
            </div>
            <div className="overflow-y-auto h-[calc(80vh-170px)]">
              {contacts.length > 0 ? (
                contacts.map(contact => (
                  <div 
                    key={contact.id}
                    className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer ${
                      selectedContact === contact.id ? 'bg-primary-light' : ''
                    }`}
                    onClick={() => setSelectedContact(contact.id)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.profileImage} alt={contact.name} />
                      <AvatarFallback className="bg-primary-light text-primary-dark">
                        {contact.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-xs text-gray-500">
                        {currentUser.role === 'patient' ? 'Doctor' : 'Patient'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No conversations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="hidden md:flex flex-col flex-1">
            {selectedContact ? (
              <>
                {/* Message Header */}
                <div className="p-4 border-b flex items-center">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" alt={getContactName(selectedContact)} />
                    <AvatarFallback className="bg-primary-light text-primary-dark">
                      {getContactName(selectedContact).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="ml-3 font-semibold">{getContactName(selectedContact)}</h2>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {getContactMessages().map(msg => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.senderId === currentUser.id 
                            ? 'bg-primary text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.senderId === currentUser.id ? 'text-primary-50' : 'text-gray-500'
                        }`}>
                          {formatTimestamp(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                  {getContactMessages().length === 0 && (
                    <div className="h-full flex items-center justify-center">
                      <div className="text-center">
                        <MessageSquare size={40} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">No messages yet</p>
                        <p className="text-sm text-gray-400">Send a message to start the conversation</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="bg-primary hover:bg-primary-dark text-white"
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      <Send size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="font-medium text-gray-700">No conversation selected</h3>
                  <p className="text-gray-500 max-w-md mt-2">
                    Select a contact to start messaging or view your conversation history.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile message view placeholder */}
          <div className="flex flex-col flex-1 md:hidden items-center justify-center">
            <MessageSquare size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">
              Select a conversation to view on this device
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
