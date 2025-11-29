"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Mail, Calendar, Shield, AlertCircle } from 'lucide-react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { api } from '../../utils/api';

const UserDashboard = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        // Should be handled by ProtectedRoute but extra safety
        return;
      }

      try {
        const data = await api.get(`/me?email=${email}`);
        setUserData(data.user);
      } catch (err: any) {
        setError(err.message);
        // If auth fails, maybe logout?
        if (err.message === 'Not authenticated' || err.message === 'User not found') {
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
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    router.push('/signin');
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
                <div className="flex items-center mb-6">
                  <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">{userName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome, {userName}!</h2>
                    <p className="text-gray-500">Manage your profile and settings</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Full Name
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{userName}</dd>
                    </div>
                    <div className="sm:col-span-1">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Email Address
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">{userEmail}</dd>
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
