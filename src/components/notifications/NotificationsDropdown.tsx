
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'message' | 'contribution' | 'interaction';
  title: string;
  description: string;
  time: string;
  read: boolean;
  link: string;
  sender?: {
    name: string;
    avatar?: string;
  };
}

// Mock notifications data - in a real app, this would come from an API
const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'message',
    title: 'New Message',
    description: 'Dr. Smith sent you a message regarding your appointment',
    time: '5 minutes ago',
    read: false,
    link: '/messages',
    sender: {
      name: 'Dr. Smith',
      avatar: '',
    }
  },
  {
    id: '2',
    type: 'contribution',
    title: 'New Article Published',
    description: 'Dr. Johnson published a new article: "Managing Hypertension"',
    time: '2 hours ago',
    read: false,
    link: '/healthy-talk',
    sender: {
      name: 'Dr. Johnson',
      avatar: '',
    }
  },
  {
    id: '3',
    type: 'interaction',
    title: 'New Comment',
    description: 'Jane commented on your post about diabetes management',
    time: 'Yesterday',
    read: true,
    link: '/healthy-talk',
    sender: {
      name: 'Jane Doe',
      avatar: '',
    }
  },
];

const NotificationsDropdown = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };
  
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    navigate(notification.link);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-primary"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup className="max-h-[300px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-4 px-2 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={cn(
                  "p-3 cursor-pointer flex flex-col items-start gap-1", 
                  !notification.read && "bg-accent"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground">{notification.description}</div>
                <div className="text-xs text-muted-foreground">{notification.time}</div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="p-2 cursor-pointer flex justify-center text-primary"
          onClick={() => navigate('/notifications')}
        >
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsDropdown;
