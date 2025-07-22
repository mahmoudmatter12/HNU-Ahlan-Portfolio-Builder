'use client';

import { Bell, Search, User, LogOut, Settings, HelpCircle, Moon, Sun, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useCurrentUser, useUser } from '@/context/userContext';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';

interface HeaderProps {
  notifications?: {
    id: string;
    title: string;
    description: string;
    time: string;
    read: boolean;
  }[];
  onNotificationClick?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  searchPlaceholder?: string;
  className?: string;
}

export function Header({
  notifications = [],
  onNotificationClick,
  onMarkAllAsRead,
  searchPlaceholder = "Search...",
  className,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const { locale } = useParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };


  const { user } = useUser();

  return (
    <header className={cn(
      "flex h-16 items-center justify-between border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60 px-4 sm:px-6",
      className
    )}>

      {/* Search Bar */}
      {/* <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
        <div className={cn(
          "relative transition-all duration-200",
          isSearchFocused ? "w-full" : "w-full sm:w-80"
        )}>
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-400 focus:border-gray-600 focus:ring-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
              onClick={() => setSearchQuery('')}
            >
              <span className="sr-only">Clear search</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </Button>
          )}
        </div>
      </form> */}

      {/* TODO: ADD LOGO */}

      {/* project name and version */}
      <div className="flex items-center space-x-2">
        <h1 className="text-sm md:text-2xl  font-bold">HNU Collage Portfolio Builder</h1>
        {/* badge for version */}
        <Badge variant="outline" className="text-xs bg-yellow-500/70 text-white">v1.2.0</Badge>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        {/* Theme Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-300 hover:text-white hover:bg-gray-900">
              {mounted ? (
                theme === 'dark' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
            <DropdownMenuItem onClick={() => setTheme("light")} className="text-gray-300 hover:text-white hover:bg-gray-800">
              <Sun className="mr-2 h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="text-gray-300 hover:text-white hover:bg-gray-800">
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="text-gray-300 hover:text-white hover:bg-gray-800">
              <Settings className="mr-2 h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help Center */}
        {/* TODO: GO TO DOCUMENTATION */}
        <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-300 hover:text-white hover:bg-gray-900">
          <HelpCircle className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative text-gray-300 hover:text-white hover:bg-gray-900">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadNotifications}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 sm:w-96 bg-gray-900 border-gray-700">
            <DropdownMenuLabel className="flex justify-between items-center text-white">
              <span>Notifications</span>
              {unreadNotifications > 0 && (
                <Button
                  variant="link"
                  size="sm"
                  className="h-6 text-xs text-blue-400 hover:text-blue-300"
                  onClick={onMarkAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <div className="space-y-1 max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      "flex flex-col items-start p-3 rounded-lg cursor-pointer text-gray-300 hover:text-white hover:bg-gray-800",
                      !notification.read && "bg-gray-800/50"
                    )}
                    onClick={() => onNotificationClick?.(notification.id)}
                  >
                    <div className="flex justify-between w-full">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <time className="text-xs text-gray-400">{notification.time}</time>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{notification.description}</p>
                    {!notification.read && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-400" />
                    )}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-gray-400">
                  No notifications
                </div>
              )}
            </div>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="justify-center text-sm text-blue-400 hover:text-blue-300">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-auto rounded-full pl-2 pr-3 space-x-2 text-gray-300 hover:text-white hover:bg-gray-900">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image} alt={user?.name} />
                <AvatarFallback className="bg-gray-800 text-white">
                  {user?.name?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:flex sm:items-center">
                <div className="text-left">
                  <p className="text-sm font-medium truncate max-w-[120px]">{user?.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{user?.userType}</p>
                </div>
                <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
            <DropdownMenuLabel className="font-normal text-white">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
              <User className="mr-2 h-4 w-4" />
              <Link href={`/${locale}/admin/profile`}>Profile</Link>
            </DropdownMenuItem>
            {user?.userType === "OWNER" && (
              <DropdownMenuItem className="text-gray-300 hover:text-white hover:bg-gray-800">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="text-gray-300 hover:text-white hover:bg-gray-800">
                <Sun className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="bg-gray-900 border-gray-700">
                  <DropdownMenuItem onClick={() => setTheme("light")} className="text-gray-300 hover:text-white hover:bg-gray-800">
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")} className="text-gray-300 hover:text-white hover:bg-gray-800">
                    Dark
                  </DropdownMenuItem>
                  {/* TODO: ADD THEME TOGGLE */}
                  <DropdownMenuItem onClick={() => setTheme("system")} className="text-gray-300 hover:text-white hover:bg-gray-800">
                    System
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator className="bg-gray-700" />
            <SignOutButton
              redirectUrl="/">
              <Button
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-gray-800">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Button>
            </SignOutButton>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}