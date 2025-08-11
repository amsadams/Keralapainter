import React, { useState } from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  Clock,
  Home,
  Mail,
  Pin,
  CakeIcon,
  Building,
  Landmark
} from 'lucide-react';
import EditRegistrationModal from './EditRegistrationModal';

const EnhancedViewDetailsModal = ({ isOpen, onClose, registration, onUpdate }) => {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isOpen || !registration) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getLocalBodyIcon = (type) => {
    switch (type) {
      case 'panchayath': return Home;
      case 'municipality': return Building;
      case 'corporation': return Landmark;
      default: return Home;
    }
  };

  const LocalBodyIcon = getLocalBodyIcon(registration.local_body_type);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Complete Registration Details</h2>
              <p className="text-white/60 text-sm">View comprehensive registration information</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all duration-300 group"
          >
            <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
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
                      <label className="block text-white/60 text-sm font-medium mb-1">First Name</label>
                      <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                        <span className="text-white font-medium">{registration.first_name}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-1">Last Name</label>
                      <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                        <span className="text-white font-medium">{registration.last_name}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-1">Full Name</label>
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl">
                      <span className="text-white font-semibold text-lg">
                        {registration.first_name} {registration.last_name}
                      </span>
                    </div>
                  </div>

                  {registration.date_of_birth && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white/60 text-sm font-medium mb-1">Date of Birth</label>
                        <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center">
                          <CakeIcon className="w-4 h-4 text-pink-300 mr-2" />
                          <span className="text-white font-medium">
                            {new Date(registration.date_of_birth).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-white/60 text-sm font-medium mb-1">Age</label>
                        <div className="px-4 py-3 bg-gradient-to-r from-pink-500/10 to-purple-500/10 backdrop-blur-sm border border-pink-500/20 rounded-xl">
                          <span className="text-white font-semibold text-lg">
                            {calculateAge(registration.date_of_birth)} years
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
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
                    <label className="block text-white/60 text-sm font-medium mb-1">House Name/Number</label>
                    <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                      <span className="text-white font-medium">{registration.house_name_number || 'Not provided'}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-1">Place</label>
                      <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                        <span className="text-white font-medium">{registration.place || 'Not provided'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-1">Post Office</label>
                      <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center">
                        <Mail className="w-4 h-4 text-cyan-300 mr-2" />
                        <span className="text-white font-medium">{registration.post_office || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-1">PIN Code</label>
                    <div className="px-4 py-3 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-xl flex items-center">
                      <Pin className="w-4 h-4 text-cyan-300 mr-2" />
                      <span className="text-white font-semibold text-lg">{registration.pincode || 'Not provided'}</span>
                    </div>
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
                    <label className="block text-white/60 text-sm font-medium mb-1">District</label>
                    <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center">
                      <MapPin className="w-4 h-4 text-purple-300 mr-2" />
                      <span className="text-white font-medium">{registration.district}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-1">Local Body Type</label>
                    <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center">
                      <LocalBodyIcon className="w-4 h-4 text-emerald-300 mr-2" />
                      <span className="text-white font-medium capitalize">{registration.local_body_type}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-1">
                      {registration.local_body_type === 'panchayath' ? 'Panchayath' : 
                       registration.local_body_type === 'municipality' ? 'Municipality' : 'Corporation'}
                    </label>
                    <div className="px-4 py-3 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-xl">
                      <span className="text-white font-semibold">{registration.local_body}</span>
                    </div>
                  </div>
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
                    <label className="block text-white/60 text-sm font-medium mb-1">Phone Number</label>
                    <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-between">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-blue-300 mr-2" />
                        <span className="text-white font-medium">{registration.phone_number}</span>
                      </div>
                      <a 
                        href={`tel:${registration.phone_number}`}
                        className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors text-xs"
                      >
                        Call
                      </a>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-1">WhatsApp Number</label>
                    <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 text-green-300 mr-2" />
                        <span className="text-white font-medium">{registration.whatsapp_number}</span>
                      </div>
                      <a 
                        href={`https://wa.me/91${registration.whatsapp_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors text-xs"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registration Information Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 text-orange-400 mr-2" />
                  Registration Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-1">Registration ID</label>
                    <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                      <span className="text-white/80 font-mono text-sm">{registration.id}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-1">Registration Date</label>
                      <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center">
                        <Calendar className="w-4 h-4 text-orange-300 mr-2" />
                        <span className="text-white font-medium">
                          {new Date(registration.created_at).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-1">Registration Time</label>
                      <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center">
                        <Clock className="w-4 h-4 text-orange-300 mr-2" />
                        <span className="text-white font-medium">
                          {formatTime(registration.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/60 text-sm font-medium mb-1">Full Registration DateTime</label>
                    <div className="px-4 py-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/20 rounded-xl">
                      <span className="text-white font-medium">
                        {formatDate(registration.created_at)}
                      </span>
                    </div>
                  </div>

                  {registration.updated_at && registration.updated_at !== registration.created_at && (
                    <div>
                      <label className="block text-white/60 text-sm font-medium mb-1">Last Updated</label>
                      <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                        <span className="text-white/80 font-medium text-sm">
                          {formatDate(registration.updated_at)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Section */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Registration Status</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white font-medium">Active Registration</span>
                    </div>
                    
                    <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <span className="text-green-300 font-medium text-sm">Verified</span>
                    </div>
                  </div>
                  
                  <div className="text-white/60 text-sm">
                    Registration submitted on {formatTime(registration.created_at)}
                  </div>

                  {/* Data Completeness Indicator */}
                  <div className="mt-4">
                    <label className="block text-white/60 text-sm font-medium mb-2">Data Completeness</label>
                    <div className="space-y-2">
                      {[
                        { field: 'Personal Info', complete: !!(registration.first_name && registration.last_name && registration.date_of_birth) },
                        { field: 'Address Info', complete: !!(registration.house_name_number && registration.place && registration.post_office && registration.pincode) },
                        { field: 'Location Info', complete: !!(registration.district && registration.local_body_type && registration.local_body) },
                        { field: 'Contact Info', complete: !!(registration.phone_number && registration.whatsapp_number) }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-white/70 text-sm">{item.field}</span>
                          <div className={`w-3 h-3 rounded-full ${item.complete ? 'bg-green-400' : 'bg-red-400'}`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer - Always Visible */}
        <div className="flex items-center justify-between p-6 border-t-2 border-white/20 bg-white/10 backdrop-blur-md flex-shrink-0">
          <div className="text-white/80 text-sm font-medium">
            ID: <span className="font-mono text-blue-300">{registration.id.slice(0, 8)}...</span>
            {registration.date_of_birth && (
              <span className="ml-4">
                Age: <span className="text-pink-300">{calculateAge(registration.date_of_birth)} years</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-white/20 hover:bg-white/30 border-2 border-white/30 hover:border-white/40 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-lg backdrop-blur-sm"
            >
              Close
            </button>
            
            <button 
              onClick={() => setShowEditModal(true)}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 border-2 border-blue-400/50 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Edit Registration
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full blur-xl"></div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <EditRegistrationModal 
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          registration={registration}
          onUpdate={(updatedData) => {
            // Call the parent's onUpdate function
            if (onUpdate) {
              onUpdate(updatedData);
            }
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
};

export default EnhancedViewDetailsModal;