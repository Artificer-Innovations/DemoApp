import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@shared/contexts/AuthContext';
import { useProfile } from '@shared/hooks/useProfile';
import { supabase } from '@/lib/supabase';
// Import Profile Display Components - Vite will automatically resolve .web.tsx files
import { ProfileHeader } from '@shared/components/profile/ProfileHeader.web';
import { ProfileStats } from '@shared/components/profile/ProfileStats.web';
// Import ProfileEditor - Vite will automatically resolve .web.tsx file
import { ProfileEditor } from '@shared/components/profile/ProfileEditor.web';

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = useAuthContext();
  const profile = useProfile(supabase, auth.user);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            </div>
            <div className="flex items-center space-x-4">
              {auth.user && (
                <span className="text-sm text-gray-600">{auth.user.email}</span>
              )}
              <Link
                to="/dashboard"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Loading State */}
          {profile.loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading profile...</p>
            </div>
          )}

          {/* Error State */}
          {profile.error && !profile.loading && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading profile
                  </h3>
                  <p className="mt-2 text-sm text-red-700">{profile.error.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile Content */}
          {!profile.loading && (
            <div className="space-y-6">
              {/* Profile Header Section */}
              <div className="bg-white shadow rounded-lg p-6">
                <ProfileHeader profile={profile.profile} />
              </div>

              {/* Profile Stats Section */}
              {profile.profile && (
                <div className="bg-white shadow rounded-lg p-6">
                  <ProfileStats profile={profile.profile} />
                </div>
              )}

              {/* Profile Editor Section - Show when profile exists or when no profile */}
              <div className="bg-white shadow rounded-lg p-6">
                {profile.profile ? (
                  <>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Edit Profile
                    </h2>
                    <ProfileEditor
                      supabaseClient={supabase}
                      user={auth.user}
                      onSuccess={() => {
                        // Refresh profile data after successful update
                        profile.refreshProfile();
                      }}
                      onError={(error) => {
                        console.error('Profile save error:', error);
                      }}
                    />
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No profile found. Create one below.</p>
                    <ProfileEditor
                      supabaseClient={supabase}
                      user={auth.user}
                      onSuccess={() => {
                        // Refresh profile data after successful creation
                        profile.refreshProfile();
                      }}
                      onError={(error) => {
                        console.error('Profile creation error:', error);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

