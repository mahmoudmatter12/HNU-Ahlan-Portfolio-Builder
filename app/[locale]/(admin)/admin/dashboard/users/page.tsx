"use client"

import React, { useState } from 'react'
import { useLocale } from 'next-intl'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Eye,
    Edit,
    Crown,
    Shield,
    User as UserIcon,
    Search,
    Filter,
    RefreshCw
} from 'lucide-react'
import { UserService } from '@/services/user-service'
import { CollegeService } from '@/services/collage-service'
import { User } from '@/types/user'
import { College } from '@/types/Collage'
import { toast } from 'sonner'

interface UserWithCollages extends User {
    collegesCreated?: College[]
    _count?: {
        collegesCreated: number
    }
}

interface EditUserData {
    name: string
    email: string
    userType: 'ADMIN' | 'SUPERADMIN' | "GUEST"
}

function UsersPage() {
    const locale = useLocale()
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState<string>('all')
    const [editingUser, setEditingUser] = useState<UserWithCollages | null>(null)
    const [editData, setEditData] = useState<EditUserData>({
        name: '',
        email: '',
        userType: 'GUEST'
    })
    const [viewingUserCollages, setViewingUserCollages] = useState<UserWithCollages | null>(null)

    // Fetch users with React Query
    const {
        data: usersData,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['users', 'all'],
        queryFn: () => UserService.getUsers({ includeCollege: true }),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
    })

    const users = usersData?.users || []

    // Fetch user collages with React Query
    const {
        data: userCollages,
        isLoading: collagesLoading
    } = useQuery({
        queryKey: ['user-collages', viewingUserCollages?.id],
        queryFn: () => CollegeService.getColleges({ createdById: viewingUserCollages?.id || '' }),
        enabled: !!viewingUserCollages?.id,
        staleTime: 1000 * 60 * 2, // 2 minutes
    })

    // Update user mutation
    const updateUserMutation = useMutation({
        mutationFn: ({ userId, updates }: { userId: string; updates: EditUserData }) =>
            UserService.updateUser(userId, updates),
        onSuccess: () => {
            toast.success('User updated successfully')
            setEditingUser(null)
            // Invalidate and refetch users
            queryClient.invalidateQueries({ queryKey: ['users', 'all'] })
        },
        onError: (error: any) => {
            console.error('Error updating user:', error)
            toast.error(error.response?.data?.error || 'Failed to update user')
        },
    })

    // Handle view collages
    const handleViewCollages = (user: UserWithCollages) => {
        setViewingUserCollages(user)
    }

    // Filter users
    const filteredUsers = users.filter((user: UserWithCollages) => {
        const matchesSearch =
            user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesRole = roleFilter === 'all' || user.userType === roleFilter

        return matchesSearch && matchesRole
    })

    // Initialize edit form
    const handleEditUser = (user: UserWithCollages) => {
        setEditingUser(user)
        setEditData({
            name: user.name || '',
            email: user.email,
            userType: user.userType
        })
    }

    // Handle update user
    const handleUpdateUser = () => {
        if (!editingUser) return
        updateUserMutation.mutate({ userId: editingUser.id, updates: editData })
    }

    const getRoleIcon = (userType: string) => {
        switch (userType) {
            case 'SUPERADMIN':
                return <Crown className="w-4 h-4 text-yellow-500" />
            case 'ADMIN':
                return <Shield className="w-4 h-4 text-blue-500" />
            case 'GUEST':
                return <UserIcon className="w-4 h-4 text-gray-500" />
            default:
                return <UserIcon className="w-4 h-4 text-gray-500" />
        }
    }

    const getRoleBadge = (userType: string) => {
        switch (userType) {
            case 'SUPERADMIN':
                return <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">Super Admin</Badge>
            case 'ADMIN':
                return <Badge variant="secondary">Admin</Badge>
            case 'GUEST':
                return <Badge variant="outline">Guest</Badge>
            default:
                return <Badge variant="outline">User</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Failed to load users</p>
                    <Button onClick={() => refetch()} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                    <p className="text-muted-foreground">
                        Manage all users, their roles, and view their created collages
                    </p>
                </div>
                <Button onClick={() => refetch()} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Label htmlFor="search">Search Users</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-48">
                            <Label htmlFor="role-filter">Filter by Role</Label>
                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All roles" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Roles</SelectItem>
                                    <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="GUEST">Guest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users ({filteredUsers.length})</CardTitle>
                    <CardDescription>
                        All registered users with their roles and collage counts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Collages Created</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user: UserWithCollages) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={user.image || ''} alt={user.name || ''} />
                                                <AvatarFallback>
                                                    {user.name?.charAt(0) || user.email.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.name || 'No name'}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getRoleIcon(user.userType)}
                                            {getRoleBadge(user.userType)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {user._count?.collegesCreated || user.collegesCreated?.length || 0}
                                            </span>
                                            <span className="text-muted-foreground">collages</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(user.createdAt).toLocaleDateString(locale)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleViewCollages(user)}
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl">
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Collages by {user.name || user.email}
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            View all collages created by this user
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="max-h-96 overflow-y-auto">
                                                        {collagesLoading ? (
                                                            <div className="flex items-center justify-center py-8">
                                                                <RefreshCw className="w-6 h-6 animate-spin" />
                                                            </div>
                                                        ) : userCollages && userCollages.length > 0 ? (
                                                            <div className="grid gap-4">
                                                                {userCollages.map((collage) => (
                                                                    <Card key={collage.id}>
                                                                        <CardContent className="p-4">
                                                                            <div className="flex items-center justify-between">
                                                                                <div>
                                                                                    <h4 className="font-medium">{collage.name}</h4>
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                        {collage.slug}
                                                                                    </p>
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        Created: {new Date(collage.createdAt).toLocaleDateString(locale)}
                                                                                    </p>
                                                                                </div>
                                                                                <Badge variant="outline">{collage.type}</Badge>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center py-8 text-muted-foreground">
                                                                No collages created yet
                                                            </div>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            No users found matching your criteria
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit User Dialog */}
            <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>
                            Update user information and role
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                placeholder="Enter user name"
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editData.email}
                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                placeholder="Enter user email"
                            />
                        </div>
                        <div>
                            <Label htmlFor="role">Role</Label>
                            <Select
                                value={editData.userType}
                                onValueChange={(value: 'ADMIN' | 'SUPERADMIN' | "GUEST") =>
                                    setEditData({ ...editData, userType: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-4 h-4" />
                                            Admin
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="SUPERADMIN">
                                        <div className="flex items-center gap-2">
                                            <Crown className="w-4 h-4" />
                                            Super Admin
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="GUEST">
                                        <div className="flex items-center gap-2">
                                            <UserIcon className="w-4 h-4" />
                                            Guest
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingUser(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateUser}
                            disabled={updateUserMutation.isPending}
                        >
                            {updateUserMutation.isPending ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                'Update User'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UsersPage