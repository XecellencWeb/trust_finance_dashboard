import React from 'react';
import { User, Phone, Mail, MapPin, Calendar, CreditCard, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';


const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No User Data</h2>
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAccountType = (type) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const ProfileField = ({ icon: Icon, label, value }) => (
    <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex-shrink-0 mt-1">
        <Icon className="w-5 h-5 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <p className="text-gray-900 font-medium">{value || 'Not provided'}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600">@{user.username}</p>
                {user.isAdmin && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mt-2">
                    <Shield className="w-3 h-3 mr-1" />
                    Administrator
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Member Since:</span> {formatDate(user.createdAt)}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {formatDate(user.updatedAt)}
              </div>
              <div>
                <span className="font-medium">Account Type:</span> {formatAccountType(user.accountType)}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            
            <ProfileField
              icon={Mail}
              label="Email Address"
              value={user.email}
            />
            
            <ProfileField
              icon={Phone}
              label="Phone Number"
              value={user.phone}
            />
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            
            <ProfileField
              icon={User}
              label="First Name"
              value={user.firstName}
            />
            
            <ProfileField
              icon={User}
              label="Last Name"
              value={user.lastName}
            />
            
            <ProfileField
              icon={Calendar}
              label="Date of Birth"
              value={formatDate(user.dateOfBirth)}
            />
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h2>
            
            <ProfileField
              icon={MapPin}
              label="Street Address"
              value={user.address}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <ProfileField
                icon={MapPin}
                label="City"
                value={user.city}
              />
              
              <ProfileField
                icon={MapPin}
                label="State"
                value={user.state}
              />
            </div>
            
            <ProfileField
              icon={MapPin}
              label="ZIP Code"
              value={user.zipCode}
            />
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>
            
            <ProfileField
              icon={User}
              label="Username"
              value={user.username}
            />
            
            <ProfileField
              icon={CreditCard}
              label="Account Type"
              value={formatAccountType(user.accountType)}
            />
            
            <ProfileField
              icon={Shield}
              label="SSN"
              value={user.ssn}
            />
          </div>
        </div>

        {/* Account Status */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Account Active</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Email Verified</span>
            </div>
            {user.isAdmin && (
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Admin Privileges</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;