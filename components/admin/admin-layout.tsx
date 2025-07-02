"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    ChevronLeft,
    ChevronRight,
    FolderOpen,
    Home,
    Menu,
    Users,
    Award,
    Briefcase,
    BarChart3,
    LogOut,
    Settings,
    Shield,
    Database,
    BookOpen,
    GraduationCap,
    ClipboardList,
    Layers
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
// import { UserContext } from "@/context/user-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Header } from "./header"
import { useLocale } from "next-intl";

interface AdminLayoutProps {
    children: React.ReactNode
}

interface NavItem {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string
    description?: string
    dynamicBadge?: boolean
    roles?: ('admin' | 'superadmin')[]
}

interface NavSection {
    title: string
    items: NavItem[]
}

// Mock user data
const mockUsers = {
    admin: {
        id: "1",
        name: "University Admin",
        email: "admin@university.edu",
        role: "admin",
        avatar: "/avatars/admin.png",
        unreadMessages: 3,
        lastLogin: new Date().toISOString()
    },
    superadmin: {
        id: "0",
        name: "System Superadmin",
        email: "superadmin@university.edu",
        role: "superadmin",
        avatar: "/avatars/superadmin.png",
        unreadMessages: 5,
        lastLogin: new Date().toISOString()
    }
}

// Navigation configuration with role-based access
const navigationSections: NavSection[] = [
    {
        title: "Home",
        items: [
            {
                title: "Main Site",
                href: "/",
                icon: Home,
                description: "Return to the university website",
                roles: ['admin', 'superadmin']
            }
        ]
    },
    {
        title: "Dashboard",
        items: [
            {
                title: "Overview",
                href: "/admin",
                icon: Home,
                description: "University dashboard and analytics",
                roles: ['admin', 'superadmin']
            },
            {
                title: "Analytics",
                href: "/admin/analytics",
                icon: BarChart3,
                description: "University statistics and insights",
                roles: ['admin', 'superadmin']
            }
        ]
    },
    {
        title: "Student Management",
        items: [
            {
                title: "Students",
                href: "/admin/students",
                icon: GraduationCap,
                description: "Manage student profiles",
                roles: ['admin', 'superadmin']
            },
            {
                title: "Portfolios",
                href: "/admin/portfolios",
                icon: BookOpen,
                description: "View and manage student portfolios",
                roles: ['admin', 'superadmin'],
                dynamicBadge: true
            },
            {
                title: "Projects",
                href: "/admin/projects",
                icon: FolderOpen,
                description: "Student projects and research",
                roles: ['admin', 'superadmin']
            },
            {
                title: "Achievements",
                href: "/admin/achievements",
                icon: Award,
                description: "Student awards and certifications",
                roles: ['admin', 'superadmin']
            }
        ]
    },
    {
        title: "Academic Content",
        items: [
            {
                title: "Courses",
                href: "/admin/courses",
                icon: ClipboardList,
                description: "Manage university courses",
                roles: ['admin', 'superadmin']
            },
            {
                title: "Templates",
                href: "/admin/templates",
                icon: Layers,
                description: "Portfolio templates for students",
                roles: ['superadmin']
            },
            {
                title: "Departments",
                href: "/admin/departments",
                icon: Briefcase,
                description: "Manage academic departments",
                roles: ['superadmin']
            }
        ]
    },
    {
        title: "System",
        items: [
            {
                title: "User Management",
                href: "/admin/users",
                icon: Users,
                description: "Manage admin users and permissions",
                roles: ['superadmin']
            },
            {
                title: "Database",
                href: "/admin/database",
                icon: Database,
                description: "System database administration",
                roles: ['superadmin']
            },
            {
                title: "Security",
                href: "/admin/security",
                icon: Shield,
                description: "Security and access controls",
                roles: ['superadmin']
            },
            {
                title: "Settings",
                href: "/admin/settings",
                icon: Settings,
                description: "System configuration",
                roles: ['superadmin']
            }
        ]
    }
]

function SidebarContent({
    collapsed,
    onNavigate,
    user,
    locale
}: {
    collapsed: boolean;
    onNavigate?: () => void;
    user: typeof mockUsers.admin | typeof mockUsers.superadmin;
    locale: string;
}) {
    const pathname = usePathname()
    return (
        <div className="flex h-full flex-col ">
            {/* Header */}
            <div className="flex h-16 items-center border-b px-4">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <GraduationCap className="h-4 w-4" />
                    </div>
                    {!collapsed && (
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">University Admin</span>
                            <span className="text-xs text-muted-foreground">
                                {user.role === 'superadmin' ? 'System Administrator' : 'Department Admin'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-6 px-3">
                    {navigationSections.map((section) => {
                        // Filter items based on user role
                        const filteredItems = section.items.filter(item =>
                            !item.roles || item.roles.includes(user.role as 'admin' | 'superadmin')
                        )

                        if (filteredItems.length === 0) return null

                        return (
                            <div key={section.title}>
                                {!collapsed && (
                                    <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {section.title}
                                    </h3>
                                )}
                                <div className="space-y-1">
                                    {filteredItems.map((item) => {
                                        const isActive = pathname === `/${locale}${item.href}`
                                        const Icon = item.icon
                                        const isDisabled = item.badge === "Soon"
                                        // console.log(locale, item.href)
                                        // console.log("is active:", isActive)
                                        console.log("item:", `/${locale}${item.href}`, pathname, isActive)

                                        // Get the badge value - either static or dynamic
                                        let badgeValue = item.badge
                                        if (item.dynamicBadge) {
                                            if (item.title === "Portfolios") {
                                                badgeValue = "0" // Mock pending review count
                                            } else if (item.title === "Messages") {
                                                badgeValue = user.unreadMessages > 0 ? user.unreadMessages.toString() : undefined
                                            }
                                        }

                                        if (collapsed) {
                                            return (
                                                <Tooltip key={item.href}>
                                                    <TooltipTrigger asChild>
                                                        <Link
                                                            href={isDisabled ? "#" : `/${locale}${item.href}`}
                                                            onClick={onNavigate}
                                                            className={cn(
                                                                "flex items-center justify-center rounded-lg p-2 text-sm transition-all hover:bg-blue-500/40",
                                                                isActive && "bg-blue-500/40 text-accent-foreground",
                                                                isDisabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
                                                            )}
                                                        >
                                                            <Icon className="h-4 w-4 flex-shrink-0" />
                                                        </Link>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right">
                                                        {item.title}
                                                        {item.description && (
                                                            <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                                        )}
                                                    </TooltipContent>
                                                </Tooltip>
                                            )
                                        }

                                        return (
                                            <Link
                                                key={item.href}
                                                href={isDisabled ? "#" : `/${locale}${item.href}`}
                                                onClick={onNavigate}
                                                className={cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-blue-500/40",
                                                    isActive && "bg-blue-500/40 text-accent-foreground",
                                                    isDisabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
                                                )}
                                            >
                                                <Icon className="h-4 w-4 flex-shrink-0" />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium">{item.title}</span>
                                                        {badgeValue && (
                                                            <Badge
                                                                variant={badgeValue === "Soon" ? "secondary" : "default"}
                                                                className="h-5 text-xs"
                                                            >
                                                                {badgeValue}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                                {!collapsed && <Separator className="mt-4" />}
                            </div>
                        )
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="border-t p-4">
                <div className={cn("flex items-center gap-3", collapsed ? "justify-center" : "justify-between")}>
                    <Button
                        variant="ghost"
                        size={collapsed ? "icon" : "default"}
                        className={cn("text-red-500 hover:text-red-600", collapsed ? "h-8 w-8" : "h-8")}
                    >
                        <LogOut className="h-4 w-4" />
                        {!collapsed && <span className="ml-2">Logout</span>}
                    </Button>
                </div>
            </div>
        </div>
    )
}

function DesktopSidebar({
    collapsed,
    setCollapsed,
    user,
    locale
}: {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    user: typeof mockUsers.admin | typeof mockUsers.superadmin;
    locale: string;
}) {
    return (
        <div
            className={cn(
                "relative hidden border-r bg-background transition-all duration-300 lg:block",
                collapsed ? "w-16" : "w-64",
            )}
        >
            <SidebarContent collapsed={collapsed} user={user} locale={locale} />

            {/* Collapse Toggle */}
            <Button
                variant="ghost"
                size="sm"
                className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background p-0 shadow-md"
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
                <span className="sr-only">Toggle sidebar</span>
            </Button>
        </div>
    )
}

function MobileSidebar({ user, locale }: { user: typeof mockUsers.admin | typeof mockUsers.superadmin; locale: string }) {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
                <SidebarContent collapsed={false} onNavigate={() => setOpen(false)} user={user} locale={locale} />
            </SheetContent>
        </Sheet>
    )
}

export function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const locale = useLocale()
    // const t = useTranslations('AdminLayout')

    // In a real app, you would use the UserContext like this:
    // const { user } = useContext(UserContext)
    // For this example, we'll use mock data
    const user = mockUsers.superadmin // Change to mockUsers.admin to see admin view

    return (
        <div className="flex h-screen bg-background">
            {/* Desktop Sidebar */}
            <DesktopSidebar
                collapsed={sidebarCollapsed}
                setCollapsed={setSidebarCollapsed}
                user={user}
                locale={locale} // Pass locale to sidebar if needed
            />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* header */}
                <Header user={{
                    name: "Admin User",
                    email: "admin@example.com",
                    avatar: "https://via.placeholder.com/150",
                    role: "admin",
                }} onLogout={() => { }} />
                {/* Mobile Header */}
                <header className="flex h-16 items-center gap-4 border-b bg-background px-4 lg:hidden">
                    <MobileSidebar user={user} locale={locale} />
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold">University Admin</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold tracking-tight">
                            Welcome back, {user.name.split(' ')[0]}!
                        </h2>
                        <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="capitalize">
                                {user.role}
                            </Badge>
                        </div>
                    </div>
                    {children}
                </main>
            </div>
        </div>
    )
}