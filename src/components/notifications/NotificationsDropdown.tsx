
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
  {
    id: '4',
    type: 'message',
    title: 'Follow-up Reminder',
    description: 'You have a follow-up appointment scheduled for tomorrow',
    time: 'Yesterday',
    read: false,
    link: '/appointments',
    sender: {
      name: 'System Notification',
    }
  },
  {
    id: '5',
    type: 'interaction',
    title: 'Your post got 10 likes',
    description: 'Your article on "Managing Stress" has received 10 likes',
    time: '2 days ago',
    read: true,
    link: '/healthy-talk',
    sender: {
      name: 'Engagement Update',
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
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return '💬';
      case 'contribution':
        return '📝';
      case 'interaction':
        return '❤️';
      default:
        return '🔔';
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center transform translate-x-1/3 -translate-y-1/3 text-[10px]">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[calc(100vh-100px)] overflow-hidden flex flex-col">
        <DropdownMenuLabel className="flex justify-between items-center py-3">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-primary h-7 px-2"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup className="max-h-[400px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="py-4 px-2 text-center text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id}
                className={cn(
                  "p-3 cursor-pointer hover:bg-accent", 
                  !notification.read && "bg-accent/40"
                )}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex w-full gap-3">
                  <div className="flex-shrink-0 mt-1">
                    <span className="text-lg" role="img" aria-label={notification.type}>
                      {getNotificationIcon(notification.type)}
                    </span>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-1">
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                      {notification.description}
                    </p>
                    {notification.sender && (
                      <div className="flex items-center gap-1 mt-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={notification.sender.avatar} />
                          <AvatarFallback className="text-[8px]">
                            {notification.sender.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{notification.sender.name}</span>
                      </div>
                    )}
                  </div>
                </div>
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
