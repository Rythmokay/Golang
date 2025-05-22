import React, { useState, useEffect } from 'react';
import { profileService } from '../services/profileService';

const Profile = () => {
  const [profile, setProfile] = useState({
    id: '',
    name: '',
    role: '',
    address: '',
    phone_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId');
        console.log('User ID from localStorage:', userId);
        
        if (!userId) {
          alert('Please login to view your profile');
          setLoading(false);
          return;
        }
        
        // Fetch profile data
        console.log('Attempting to fetch profile for user ID:', userId);
        const data = await profileService.getProfile(userId);
        
        // Handle null or empty data
        if (!data) {
          console.error('Received empty profile data');
          throw new Error('No profile data received');
        }
        
        console.log('Profile data received:', data);
        setProfile({
          id: data.id || userId,
          name: data.name || '',
          role: data.role || localStorage.getItem('role') || '',
          address: data.address || '',
          phone_number: data.phone_number || ''
        });
      } catch (error) {
        console.error('Profile fetch error:', error);
        
        // Create fallback profile from localStorage if fetch fails
        const fallbackProfile = {
          id: localStorage.getItem('userId') || '',
          name: localStorage.getItem('username') || '',
          role: localStorage.getItem('role') || '',
          address: '',
          phone_number: ''
        };
        
        console.log('Using fallback profile:', fallbackProfile);
        setProfile(fallbackProfile);
        
        // Show error message but don't block the UI
        alert('Could not load profile from server: ' + error.message + '\nUsing local data instead.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      console.log('Profile data to update:', profile);
      
      // Update profile via API
      await profileService.updateProfile(profile);
      
      // Update local storage with the new name for immediate UI update
      localStorage.setItem('username', profile.name);
      
      // Show success message
      alert('Profile updated successfully');
    } catch (error) {
      alert('Failed to update profile: ' + error.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <br/>
      <br/>
      <br/>
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Email field removed as requested */}
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              name="address"
              value={profile.address || ''}
              onChange={handleChange}
              rows="3"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">
              Phone Number
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="phone_number"
              type="tel"
              name="phone_number"
              value={profile.phone_number || ''}
              onChange={handleChange}
              placeholder="e.g., +1 (123) 456-7890"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
