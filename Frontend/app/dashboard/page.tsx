"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Mail, Calendar, Shield, AlertCircle, Edit2, Check, X } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editData, setEditData] = useState<{ name: string; email: string }>({ name: '', email: '' });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Should be handled by ProtectedRoute but extra safety
        router.push('/signin');
        return;
      }

      try {
        const data = await api.get('/me');
        setUserData(data);
      } catch (err: any) {
        setError(err.message);
        // If auth fails, logout
        if (err.message.includes('token') || err.message.includes('authorization') || err.message.includes('401')) {
           localStorage.removeItem('token');
           localStorage.removeItem('isAuthenticated');
           localStorage.removeItem('userEmail');
           localStorage.removeItem('userName');
           router.push('/signin');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    router.push('/signin');
  };

  const handleEdit = () => {
    if (userData) {
      setEditData({ name: userData.name, email: userData.email });
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({ name: '', email: '' });
  };

  const handleSave = async () => {
    if (!userData) return;

    // Validate inputs
    if (!editData.name || editData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (!editData.email || !editData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSaving(true);
    try {
      const updatePayload: { name?: string; email?: string } = {};
      
      if (editData.name.trim() !== userData.name) {
        updatePayload.name = editData.name.trim();
      }
      
      if (editData.email.trim() !== userData.email) {
        updatePayload.email = editData.email.trim();
      }

      if (Object.keys(updatePayload).length === 0) {
        toast.error('No changes to save');
        setIsEditing(false);
        setIsSaving(false);
        return;
      }

      const data = await api.put('/me', updatePayload);
      
      setUserData(data.user);
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('userEmail', data.user.email);
      
      toast.success(data.message || 'Profile updated successfully');
      setIsEditing(false);
    } catch (err: any) {
      console.error('Update error:', err);
      const errorMessage = err.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <p>Loading...</p>
          </div>
      );
  }

  if (error) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                  <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                  <p className="text-red-500">{error}</p>
                  <button onClick={handleLogout} className="mt-4 text-indigo-600 underline">Go to Sign In</button>
              </div>
          </div>
      );
  }

  const userName = userData?.name || 'User';
  const userEmail = userData?.email || 'user@example.com';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-indigo-600">MyApp</h1>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-indigo-600">{userName.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="ml-4">
                      <h2 className="text-2xl font-bold text-gray-900">Welcome, {userName}!</h2>
                      <p className="text-gray-500">Manage your profile and settings</p>
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={handleEdit}
                      className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  )}
                  {isEditing && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center justify-between">
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Full Name
                        </span>
                        {isEditing && (
                          <Edit2 className="w-4 h-4 text-indigo-600" />
                        )}
                      </dt>
                      {isEditing ? (
                        <dd className="mt-1">
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Enter your name"
                          />
                        </dd>
                      ) : (
                        <dd className="mt-1 text-sm text-gray-900">{userName}</dd>
                      )}
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center justify-between">
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          Email Address
                        </span>
                        {isEditing && (
                          <Edit2 className="w-4 h-4 text-indigo-600" />
                        )}
                      </dt>
                      {isEditing ? (
                        <dd className="mt-1">
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                            placeholder="Enter your email"
                          />
                        </dd>
                      ) : (
                        <dd className="mt-1 text-sm text-gray-900">{userEmail}</dd>
                      )}
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Member Since
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">November 2023</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Shield className="w-4 h-4 mr-2" />
                        Account Status
                      </dt>
                      <dd className="mt-1 text-sm text-green-600 font-semibold">Active</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default UserDashboard;
