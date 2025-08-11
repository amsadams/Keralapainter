import React, { useState } from 'react';
import { 
  X, 
  Save, 
  User, 
  MapPin, 
  Phone, 
  MessageCircle, 
  RotateCcw,
  Calendar,
  Home,
  Mail,
  Pin,
  CakeIcon,
  Building,
  Landmark
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { KERALA_LOCAL_BODIES } from '../../data/keralaLocalBodies';

const EnhancedEditRegistrationModal = ({ isOpen, onClose, registration, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: registration?.first_name || '',
    last_name: registration?.last_name || '',
    date_of_birth: registration?.date_of_birth || '',
    house_name_number: registration?.house_name_number || '',
    place: registration?.place || '',
    post_office: registration?.post_office || '',
    pincode: registration?.pincode || '',
    district: registration?.district || '',
    local_body_type: registration?.local_body_type || '',
    local_body: registration?.local_body || '',
    phone_number: registration?.phone_number || '',
    whatsapp_number: registration?.whatsapp_number || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Kerala districts for dropdown
  const districts = Object.keys(KERALA_LOCAL_BODIES).sort();

  // Reset form data when registration changes
  React.useEffect(() => {
    if (registration) {
      setFormData({
        first_name: registration.first_name || '',
        last_name: registration.last_name || '',
        date_of_birth: registration.date_of_birth || '',
        house_name_number: registration.house_name_number || '',
        place: registration.place || '',
        post_office: registration.post_office || '',
        pincode: registration.pincode || '',
        district: registration.district || '',
        local_body_type: registration.local_body_type || '',
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
    
    // Reset dependent fields when parent field changes
    if (name === 'district') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        local_body_type: '',
        local_body: ''
      }));
    } else if (name === 'local_body_type') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        local_body: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    setError(null);
    setSuccess(false);
  };

  // Get available local body types for selected district
  const getAvailableLocalBodyTypes = () => {
    if (!formData.district || !KERALA_LOCAL_BODIES[formData.district]) return [];
    
    const districtData = KERALA_LOCAL_BODIES[formData.district];
    const types = [];
    
    if (districtData.panchayaths.length > 0) types.push({ value: 'panchayath', label: 'Panchayath' });
    if (districtData.municipalities.length > 0) types.push({ value: 'municipality', label: 'Municipality' });
    if (districtData.corporations.length > 0) types.push({ value: 'corporation', label: 'Corporation' });
    
    return types;
  };

  // Get available local bodies for selected district and type
  const getAvailableLocalBodies = () => {
    if (!formData.district || !formData.local_body_type || !KERALA_LOCAL_BODIES[formData.district]) return [];
    
    const districtData = KERALA_LOCAL_BODIES[formData.district];
    
    switch (formData.local_body_type) {
      case 'panchayath':
        return districtData.panchayaths;
      case 'municipality':
        return districtData.municipalities;
      case 'corporation':
        return districtData.corporations;
      default:
        return [];
    }
  };

  const validateForm = () => {
    const { 
      first_name, 
      last_name, 
      date_of_birth,
      house_name_number,
      place,
      post_office,
      pincode,
      district, 
      local_body_type, 
      local_body, 
      phone_number, 
      whatsapp_number 
    } = formData;
    
    if (!first_name.trim() || !last_name.trim() || !district || !local_body_type || !local_body.trim() || !phone_number.trim() || !whatsapp_number.trim()) {
      return 'Name, location, and contact fields are required';
    }

    // Validate date of birth if provided
    if (date_of_birth) {
      const dob = new Date(date_of_birth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0) || 
          (age === 18 && monthDiff === 0 && today.getDate() < dob.getDate())) {
        return 'Applicant must be at least 18 years old';
      }
    }

    // Validate PIN code if provided
    if (pincode && !/^[0-9]{6}$/.test(pincode)) {
      return 'PIN code must be exactly 6 digits';
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
          date_of_birth: formData.date_of_birth || null,
          house_name_number: formData.house_name_number.trim() || null,
          place: formData.place.trim() || null,
          post_office: formData.post_office.trim() || null,
          pincode: formData.pincode.trim() || null,
          district: formData.district,
          local_body_type: formData.local_body_type,
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
        date_of_birth: registration.date_of_birth || '',
        house_name_number: registration.house_name_number || '',
        place: registration.place || '',
        post_office: registration.post_office || '',
        pincode: registration.pincode || '',
        district: registration.district || '',
        local_body_type: registration.local_body_type || '',
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

  // Calculate max date (18 years ago from today)
  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // Calculate min date (reasonable minimum age of 80 years ago)
  const getMinDate = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 80, today.getMonth(), today.getDate());
    return minDate.toISOString().split('T')[0];
  };

  if (!isOpen || !registration) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-500/20 backdrop-blur-sm rounded-2xl border border-emerald-500/30 flex items-center justify-center">
              <User className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Edit Complete Registration</h2>
              <p className="text-white/60 text-sm">Update all registration information</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              
              {/* Personal Information Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <User className="w-5 h-5 text-emerald-400 mr-2" />
                  Personal Information
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
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

                  <div>
                    <label className="flex items-center text-white/80 text-sm font-medium mb-2">
                      <CakeIcon className="w-4 h-4 text-pink-300 mr-2" />
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      min={getMinDate()}
                      max={getMaxDate()}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                    />
                    <p className="text-white/50 text-xs mt-1">Must be at least 18 years old</p>
                  </div>
                </div>
              </div>

              {/* Address Information Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Home className="w-5 h-5 text-orange-400 mr-2" />
                  Address Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">House Name/Number</label>
                    <input
                      type="text"
                      name="house_name_number"
                      value={formData.house_name_number}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter house name or number"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Place</label>
                      <input
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                        placeholder="Enter place/locality"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center text-white/80 text-sm font-medium mb-2">
                        <Mail className="w-4 h-4 text-cyan-300 mr-2" />
                        Post Office
                      </label>
                      <input
                        type="text"
                        name="post_office"
                        value={formData.post_office}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                        placeholder="Enter post office"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center text-white/80 text-sm font-medium mb-2">
                      <Pin className="w-4 h-4 text-cyan-300 mr-2" />
                      PIN Code
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      pattern="[0-9]{6}"
                      maxLength="6"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      placeholder="Enter 6-digit PIN code"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Location Information Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MapPin className="w-5 h-5 text-purple-400 mr-2" />
                  Administrative Location
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
                  
                  {formData.district && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Local Body Type *</label>
                      <select
                        name="local_body_type"
                        value={formData.local_body_type}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      >
                        <option value="" className="bg-gray-800 text-white">Select Local Body Type</option>
                        {getAvailableLocalBodyTypes().map((type) => (
                          <option key={type.value} value={type.value} className="bg-gray-800 text-white">
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {formData.district && formData.local_body_type && (
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        {formData.local_body_type === 'panchayath' ? 'Panchayath' : 
                         formData.local_body_type === 'municipality' ? 'Municipality' : 'Corporation'} *
                      </label>
                      <select
                        name="local_body"
                        value={formData.local_body}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                      >
                        <option value="" className="bg-gray-800 text-white">
                          Select {formData.local_body_type === 'panchayath' ? 'Panchayath' : 
                                   formData.local_body_type === 'municipality' ? 'Municipality' : 'Corporation'}
                        </option>
                        {getAvailableLocalBodies().map((localBody) => (
                          <option key={localBody} value={localBody} className="bg-gray-800 text-white">
                            {localBody}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Phone className="w-5 h-5 text-green-400 mr-2" />
                  Contact Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="flex items-center text-white/80 text-sm font-medium mb-2">
                      <Phone className="w-4 h-4 text-blue-300 mr-2" />
                      Phone Number *
                    </label>
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
                    <label className="flex items-center text-white/80 text-sm font-medium mb-2">
                      <MessageCircle className="w-4 h-4 text-green-300 mr-2" />
                      WhatsApp Number *
                    </label>
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
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-orange-400 mr-2" />
                  Registration Information
                </h3>
                <div className="space-y-3 text-white/60">
                  <div>
                    <span className="text-sm">Registration ID:</span>
                    <div className="font-mono text-xs text-blue-300 mt-1">{registration.id}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm">Created:</span>
                      <div className="text-sm mt-1">{new Date(registration.created_at).toLocaleDateString()}</div>
                    </div>
                    {registration.updated_at && registration.updated_at !== registration.created_at && (
                      <div>
                        <span className="text-sm">Last Updated:</span>
                        <div className="text-sm mt-1">{new Date(registration.updated_at).toLocaleDateString()}</div>
                      </div>
                    )}
                  </div>
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

export default EnhancedEditRegistrationModal;