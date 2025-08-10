import React, { useState } from 'react';
import { X, Save, User, MapPin, Phone, MessageCircle, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const EditRegistrationModal = ({ isOpen, onClose, registration, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: registration?.first_name || '',
    last_name: registration?.last_name || '',
    district: registration?.district || '',
    local_body: registration?.local_body || '',
    phone_number: registration?.phone_number || '',
    whatsapp_number: registration?.whatsapp_number || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Kerala districts for dropdown
  const districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  // Reset form data when registration changes
  React.useEffect(() => {
    if (registration) {
      setFormData({
        first_name: registration.first_name || '',
        last_name: registration.last_name || '',
        district: registration.district || '',
        local_body: registration.local_body || '',
        phone_number: registration.phone_number || '',
        whatsapp_number: registration.whatsapp_number || ''
      });
    }
    setError(null);
    setSuccess(false);
  }, [registration]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(false);
  };

  const validateForm = () => {
    const { first_name, last_name, district, local_body, phone_number, whatsapp_number } = formData;
    
    if (!first_name.trim() || !last_name.trim() || !district || !local_body.trim() || !phone_number.trim() || !whatsapp_number.trim()) {
      return 'All fields are required';
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone_number)) {
      return 'Phone number must be 10 digits';
    }
    
    if (!phoneRegex.test(whatsapp_number)) {
      return 'WhatsApp number must be 10 digits';
    }
    
    return null;
  };

  const handleSave = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from('registrations')
        .update({
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          district: formData.district,
          local_body: formData.local_body.trim(),
          phone_number: formData.phone_number.trim(),
          whatsapp_number: formData.whatsapp_number.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', registration.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setSuccess(true);
      
      // Call onUpdate callback to refresh parent data
      if (onUpdate) {
        onUpdate(data);
      }

      // Auto close after 1.5 seconds
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error('Error updating registration:', err);
      setError('Failed to update registration: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (registration) {
      setFormData({
        first_name: registration.first_name || '',
        last_name: registration.last_name || '',
        district: registration.district || '',
        local_body: registration.local_body || '',
        phone_number: registration.phone_number || '',
        whatsapp_number: registration.whatsapp_number || ''
      });
    }
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    if (isSubmitting) return; // Prevent closing while saving
    setError(null);
    setSuccess(false);
    onClose();
  };

  if (!isOpen || !registration) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-sm rounded-2xl border border-emerald-500/30 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Registration</h2>
              <p className="text-white/60 text-sm">Update registration information</p>
            </div>
          </div>
          
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 group disabled:opacity-50"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mx-6 mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
            <span className="text-red-100 text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-green-100 text-sm">Registration updated successfully!</span>
          </div>
        )}

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            
            {/* Personal Information Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 text-emerald-400 mr-2" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="Enter first name"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <MapPin className="w-5 h-5 text-purple-400 mr-2" />
                Location Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">District *</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                  >
                    <option value="" className="bg-gray-800 text-white">Select District</option>
                    {districts.map((district) => (
                      <option key={district} value={district} className="bg-gray-800 text-white">
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Panchayat / Municipality / Corporation *</label>
                  <input
                    type="text"
                    name="local_body"
                    value={formData.local_body}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="Enter your local body name"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Phone className="w-5 h-5 text-green-400 mr-2" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="9876543210"
                    pattern="[0-9]{10}"
                    maxLength="10"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">WhatsApp Number *</label>
                  <input
                    type="tel"
                    name="whatsapp_number"
                    value={formData.whatsapp_number}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    placeholder="9876543210"
                    pattern="[0-9]{10}"
                    maxLength="10"
                  />
                </div>
              </div>
            </div>

            {/* Registration Info (Read-only) */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Registration Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white/60">
                <div>
                  <span className="text-sm">Registration ID:</span>
                  <div className="font-mono text-xs text-blue-300 mt-1">{registration.id}</div>
                </div>
                <div>
                  <span className="text-sm">Created:</span>
                  <div className="text-sm mt-1">{new Date(registration.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer - Always Visible */}
        <div className="flex items-center justify-between p-6 border-t-2 border-white/20 bg-white/10 backdrop-blur-md flex-shrink-0">
          <div className="text-white/80 text-sm font-medium">
            Editing: <span className="text-emerald-300">{registration.first_name} {registration.last_name}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-white/30 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm disabled:opacity-50 flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/40 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 border-2 border-emerald-400/50 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-xl disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-green-400/10 to-transparent rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default EditRegistrationModal;