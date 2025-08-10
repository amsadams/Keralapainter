import React from 'react';
import { X, User, MapPin, Phone, MessageCircle, Calendar, Clock } from 'lucide-react';
import EditRegistrationModal from './EditRegistrationModal';

import { useState } from 'react';
const ViewDetailsModal = ({ isOpen, onClose, registration }) => {
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

const [showEditModal, setShowEditModal] = useState(false);



  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 flex items-center justify-center">
              <User className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Registration Details</h2>
              <p className="text-white/60 text-sm">View complete registration information</p>
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
          <div className="space-y-6">
            
            {/* Personal Information Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <User className="w-5 h-5 text-emerald-400 mr-2" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="mt-4">
                <label className="block text-white/60 text-sm font-medium mb-1">Full Name</label>
                <div className="px-4 py-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-blue-500/20 rounded-xl">
                  <span className="text-white font-semibold text-lg">
                    {registration.first_name} {registration.last_name}
                  </span>
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
                  <label className="block text-white/60 text-sm font-medium mb-1">District</label>
                  <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center">
                    <MapPin className="w-4 h-4 text-purple-300 mr-2" />
                    <span className="text-white font-medium">{registration.district}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Local Body</label>
                  <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                    <span className="text-white font-medium">{registration.local_body}</span>
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Phone Number</label>
                  <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center">
                    <Phone className="w-4 h-4 text-blue-300 mr-2" />
                    <span className="text-white font-medium">{registration.phone_number}</span>
                    <a 
                      href={`tel:${registration.phone_number}`}
                      className="ml-auto px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors text-xs"
                    >
                      Call
                    </a>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">WhatsApp Number</label>
                  <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center">
                    <MessageCircle className="w-4 h-4 text-green-300 mr-2" />
                    <span className="text-white font-medium">{registration.whatsapp_number}</span>
                    <a 
                      href={`https://wa.me/91${registration.whatsapp_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-colors text-xs"
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Registration ID</label>
                  <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
                    <span className="text-white/80 font-mono text-sm">{registration.id}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-1">Registration Date</label>
                  <div className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center">
                    <Calendar className="w-4 h-4 text-orange-300 mr-2" />
                    <span className="text-white font-medium">
                      {new Date(registration.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-white/60 text-sm font-medium mb-1">Full Registration DateTime</label>
                <div className="px-4 py-3 bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-500/20 rounded-xl flex items-center">
                  <Clock className="w-4 h-4 text-orange-300 mr-2" />
                  <span className="text-white font-medium">
                    {formatDate(registration.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Section */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">Active Registration</span>
                </div>
                
                <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <span className="text-green-300 font-medium text-sm">Verified</span>
                </div>
              </div>
              
              <div className="mt-3 text-white/60 text-sm">
                Registration submitted on {formatTime(registration.created_at)}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer - Always Visible */}
        <div className="flex items-center justify-between p-6 border-t-2 border-white/20 bg-white/10 backdrop-blur-md flex-shrink-0">
          <div className="text-white/80 text-sm font-medium">
            ID: <span className="font-mono text-blue-300">{registration.id.slice(0, 8)}...</span>
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

export default ViewDetailsModal;