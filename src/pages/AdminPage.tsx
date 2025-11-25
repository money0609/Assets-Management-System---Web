import React, { useState, useMemo, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import { authService } from '../features/auth/services/authService';
import type { User, UserRole } from '../features/auth/types/auth.types';
import type { RegisterRequest } from '../features/auth/types/auth-api.types';

const AdminPage: React.FC = () => {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('All');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(true);

    // Fetch users on mount
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoadingUsers(true);
                const allUsers = await authService.getAllUsers();
                setUsers(Array.isArray(allUsers) ? allUsers : []);
            } catch (err) {
                console.error('Failed to load users:', err);
                setUsers([]);
            } finally {
                setLoadingUsers(false);
            }
        };
        loadUsers();
    }, []);

    // Role options
    const roleOptions: UserRole[] = ['admin', 'manager', 'viewer'];

    // Get role display info
    const getRoleInfo = (role: UserRole) => {
        const roleMap: Record<UserRole, { name: string; bgColor: string }> = {
            admin: { name: 'Administrator', bgColor: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
            manager: { name: 'Manager', bgColor: 'bg-blue-100 text-blue-800 border-blue-200' },
            viewer: { name: 'Viewer', bgColor: 'bg-gray-100 text-gray-800 border-gray-200' },
            unknown: { name: 'Unknown', bgColor: 'bg-gray-100 text-gray-800 border-gray-200' },
        };
        return roleMap[role] || roleMap.unknown;
    };

    // Filter users based on search and role
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
            const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 fullName.includes(searchTerm.toLowerCase());
            const matchesRole = filterRole === 'All' || user.role === filterRole;
            return matchesSearch && matchesRole;
        });
    }, [users, searchTerm, filterRole]);

    const handleOpenCreateModal = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    const handleOpenEditModal = (user: User) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingUser(null);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            // TODO: Implement delete user API call
            setUsers(prev => prev.filter(u => u.id !== id));
        }
    };

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const formData = new FormData(e.currentTarget);
            const userData: RegisterRequest & { role?: UserRole } = {
                username: formData.get('username') as string,
                password: formData.get('password') as string,
                first_name: formData.get('first_name') as string,
                last_name: formData.get('last_name') as string,
                role: formData.get('role') as UserRole,
            };

            if (editingUser) {
                // TODO: Implement update user API call
                setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData } : u));
            } else {
                // Create new user (admin registration)
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await authService.register(userData, token);
                    const newUser = (response as unknown as { user: User }).user;
                    setUsers(prev => [...prev, newUser]);
                }
            }
            // Reload users after save
            const allUsers = await authService.getAllUsers();
            setUsers(Array.isArray(allUsers) ? allUsers : []);
            handleCloseModal();
        } catch (err) {
            console.error('Failed to save user:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by username or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                    >
                        <option value="All">All Roles</option>
                        {roleOptions.map(role => (
                            <option key={role} value={role}>{getRoleInfo(role).name}</option>
                        ))}
                    </select>
                    <button
                        onClick={handleOpenCreateModal}
                        className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add User</span>
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Username</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loadingUsers ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                                                    <Users className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {user.first_name} {user.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{user.username}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getRoleInfo(user.role).bgColor}`}>
                                                <Shield className="w-3 h-3 mr-1" />
                                                {getRoleInfo(user.role).name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(user)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                {user.id !== currentUser?.id && (
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for Add/Edit User */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="!p-2 !bg-white hover:!bg-gray-100 !rounded-lg !font-medium !transition-colors !border-0 !shadow-none focus:!outline-none focus-visible:!outline-none"
                                aria-label="Close modal"
                            >
                                <span className="text-gray-500 text-xl">×</span>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSave} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        defaultValue={editingUser?.first_name || ''}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        defaultValue={editingUser?.last_name || ''}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Role *
                                </label>
                                <select
                                    name="role"
                                    defaultValue={editingUser?.role || 'viewer'}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                                    required
                                >
                                    {roleOptions.map(role => (
                                        <option key={role} value={role}>{getRoleInfo(role).name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="!px-6 !py-3 !bg-white !text-gray-700 hover:!bg-gray-100 !rounded-lg !font-medium !transition-colors !border-0 !shadow-none focus:!outline-none focus-visible:!outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="!px-6 !py-3 !bg-indigo-600 hover:!bg-indigo-700 !text-white !rounded-lg !font-medium !transition-colors !shadow-sm !border-0 focus:!outline-none focus-visible:!outline-none disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;