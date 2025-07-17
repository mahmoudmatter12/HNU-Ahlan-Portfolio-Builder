'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  GraduationCap,
  FileText,
  Calendar,
  Database,
  UserCog,
  Layout,
  ChevronLeft,
  ChevronRight,
  Home,
  Bookmark,
  Layers,
  FileSearch,
  Bell,
  HelpCircle,
  LogOut,
  Zap,
  Rocket,
  Server,
  Lock,
  Globe,
  Code,
  Palette,
  Mail,
  FileStack,
  ClipboardList
} from 'lucide-react';

interface SidebarProps {
  userRole: 'admin' | 'superadmin';
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  notificationsCount?: number;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<any>;
  role?: 'admin' | 'superadmin';
  children?: NavItem[];
  badge?: string;
  isNew?: boolean;
}

const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: Home,
  },
  {
    title: 'Students',
    href: '/admin/students',
    icon: GraduationCap,
  },
  {
    title: 'Portfolios',
    href: '/admin/portfolios',
    icon: BookOpen,
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: FileStack,
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: Mail,
    badge: '5',
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Events',
    href: '/admin/events',
    icon: Calendar,
  },
  {
    title: 'Templates',
    href: '/admin/templates',
    icon: Layers,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

const superAdminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/superadmin',
    icon: Home,
  },
  {
    title: 'User Management',
    href: '/superadmin/users',
    icon: Users,
    children: [
      { 
        title: 'All Users', 
        href: '/superadmin/users', 
        icon: Users,
        badge: '42'
      },
      { 
        title: 'Admins', 
        href: '/superadmin/users/admins', 
        icon: UserCog,
        badge: '5'
      },
      { 
        title: 'Students', 
        href: '/superadmin/users/students', 
        icon: GraduationCap,
        badge: '37'
      },
    ],
  },
  {
    title: 'Content',
    href: '/superadmin/content',
    icon: Bookmark,
    children: [
      { 
        title: 'Portfolios', 
        href: '/superadmin/content/portfolios', 
        icon: BookOpen,
      },
      { 
        title: 'Projects', 
        href: '/superadmin/content/projects', 
        icon: FileText 
      },
      { 
        title: 'Templates', 
        href: '/superadmin/content/templates', 
        icon: Layout 
      },
      { 
        title: 'Audit Logs', 
        href: '/superadmin/content/audit', 
        icon: ClipboardList,
        badge: '12'
      },
    ],
  },
  {
    title: 'System',
    href: '/superadmin/system',
    icon: Server,
    children: [
      { 
        title: 'Analytics', 
        href: '/superadmin/system/analytics', 
        icon: BarChart3 
      },
      { 
        title: 'Database', 
        href: '/superadmin/system/database', 
        icon: Database 
      },
      { 
        title: 'API', 
        href: '/superadmin/system/api', 
        icon: Code 
      },
      { 
        title: 'Performance', 
        href: '/superadmin/system/performance', 
        icon: Zap 
      },
    ],
  },
  {
    title: 'Security',
    href: '/superadmin/security',
    icon: Shield,
    children: [
      { 
        title: 'Access Control', 
        href: '/superadmin/security/access', 
        icon: Lock 
      },
      { 
        title: 'Audit Trail', 
        href: '/superadmin/security/audit', 
        icon: FileSearch 
      },
      { 
        title: 'Firewall', 
        href: '/superadmin/security/firewall', 
        icon: Globe 
      },
    ],
  },
  {
    title: 'Appearance',
    href: '/superadmin/appearance',
    icon: Palette,
  },
  {
    title: 'Notifications',
    href: '/superadmin/notifications',
    icon: Bell,
    badge: '3',
  },
];


export function Sidebar({ 
  userRole, 
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeHover, setActiveHover] = useState<string | null>(null);
  const pathname = usePathname();

  const navItems = userRole === 'superadmin' ? superAdminNavItems : adminNavItems;

  // Auto-collapse on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={cn(
        'flex h-full flex-col border-r bg-background transition-all duration-300 ease-in-out',
        collapsed ? 'w-16 md:w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed ? (
          <Link href={userRole === 'superadmin' ? '/superadmin' : '/admin'} className="flex items-center gap-2">
            <Rocket className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold text-primary">
              {userRole === 'superadmin' ? 'SuperAdmin Pro' : 'Admin Portal'}
            </h2>
          </Link>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={userRole === 'superadmin' ? '/superadmin' : '/admin'} className="flex items-center justify-center w-full">
                <Rocket className="h-6 w-6 text-primary" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              {userRole === 'superadmin' ? 'SuperAdmin Pro' : 'Admin Portal'}
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 p-0 hover:bg-accent/50"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? 'Expand' : 'Collapse'}
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* <Separator /> */}
      
      {/* User Profile */}
      {/* {!collapsed ? (
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={userAvatar} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                  <Bell className="h-4 w-4" />
                  {notificationsCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                      {notificationsCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Notifications
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center py-3 gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-9 w-9">
                <AvatarImage src={userAvatar} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-muted-foreground text-xs">{userEmail}</p>
              </div>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4" />
                {notificationsCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                    {notificationsCount}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Notifications
            </TooltipContent>
          </Tooltip>
        </div>
      )} */}
      
      <Separator />
      
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-4">
          {navItems.map((item, index) => (
            <NavItemComponent
              key={index}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              activeHover={activeHover}
              setActiveHover={setActiveHover}
            />
          ))}
        </div>
      </ScrollArea>
      
      <div className="p-2 mt-auto">
        <Separator className="mb-2" />
        {!collapsed ? (
          <div className="space-y-1">
            <Link href="/help">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <HelpCircle className="h-4 w-4" />
                <span>Help & Support</span>
              </Button>
            </Link>
            <Link href="/logout">
              <Button variant="ghost" className="w-full justify-start gap-2 text-red-500 hover:text-red-500">
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/help">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                Help & Support
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/logout">
                  <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:text-red-500">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                Log Out
              </TooltipContent>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
}

interface NavItemComponentProps {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  activeHover: string | null;
  setActiveHover: (value: string | null) => void;
}

function NavItemComponent({ item, collapsed, pathname, activeHover, setActiveHover }: NavItemComponentProps) {
  const [expanded, setExpanded] = useState(false);
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                size="icon"
                className="h-9 w-9 mx-auto relative"
                onClick={() => setExpanded(!expanded)}
                onMouseEnter={() => setActiveHover(item.href)}
                onMouseLeave={() => setActiveHover(null)}
              >
                <item.icon className="h-4 w-4" />
                {item.badge && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[8px]">
                    {item.badge}
                  </Badge>
                )}
               
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {item.title}
              {item.badge && (
                <span className="ml-1 text-xs text-muted-foreground">({item.badge})</span>
              )}
            </TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant={isActive ? 'secondary' : 'ghost'}
            className="w-full justify-start relative"
            onClick={() => setExpanded(!expanded)}
          >
            <item.icon className="h-4 w-4" />
            <span className="ml-2">{item.title}</span>
            {item.badge && (
              <Badge variant="outline" className="ml-auto">
                {item.badge}
              </Badge>
            )}
           
            <ChevronRight
              className={cn(
                'ml-2 h-4 w-4 transition-transform',
                expanded && 'rotate-90'
              )}
            />
          </Button>
        )}
        {!collapsed && expanded && (
          <div className="ml-4 mt-1 space-y-1">
            {item.children?.map((child, index) => (
              <NavItemComponent
                key={index}
                item={child}
                collapsed={collapsed}
                pathname={pathname}
                activeHover={activeHover}
                setActiveHover={setActiveHover}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return collapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={item.href}>
          <Button
            variant={isActive ? 'secondary' : 'ghost'}
            size="icon"
            className="h-9 w-9 mx-auto relative"
            onMouseEnter={() => setActiveHover(item.href)}
            onMouseLeave={() => setActiveHover(null)}
          >
            <item.icon className="h-4 w-4" />
            {item.badge && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full p-0 flex items-center justify-center text-[8px]">
                {item.badge}
              </Badge>
            )}
           
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">
        {item.title}
        {item.badge && (
          <span className="ml-1 text-xs text-muted-foreground">({item.badge})</span>
        )}
      </TooltipContent>
    </Tooltip>
  ) : (
    <Link href={item.href}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        className="w-full justify-start relative"
      >
        <item.icon className="h-4 w-4" />
        <span className="ml-2">{item.title}</span>
        {item.badge && (
          <Badge variant="outline" className="ml-auto">
            {item.badge}
          </Badge>
        )}
       
      </Button>
    </Link>
  );
}