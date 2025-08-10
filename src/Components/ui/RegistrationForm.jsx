
import React, { useState } from 'react';
import { User, MapPin, Phone, MessageCircle, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase'; // Adjust path as needed

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    district: '',
    localBody: '',
    phoneNumber: '',
    whatsappNumber: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', null

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const { firstName, lastName, district, localBody, phoneNumber, whatsappNumber } = formData;
    
    if (!firstName.trim() || !lastName.trim() || !district || !localBody.trim() || !phoneNumber.trim() || !whatsappNumber.trim()) {
      return 'All fields are required';
    }
    
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return 'Phone number must be 10 digits';
    }
    
    if (!phoneRegex.test(whatsappNumber)) {
      return 'WhatsApp number must be 10 digits';
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Insert data into Supabase
      const { data, error } = await supabase
        .from('registrations')
        .insert([
          {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            district: formData.district,
            local_body: formData.localBody.trim(),
            phone_number: formData.phoneNumber.trim(),
            whatsapp_number: formData.whatsappNumber.trim()
          }
        ])
        .select();

      if (error) {
        throw error;
      }

      console.log('Registration successful:', data);
      setSubmitStatus('success');
      
      // Reset form after successful submission
      setFormData({
        firstName: '',
        lastName: '',
        district: '',
        localBody: '',
        phoneNumber: '',
        whatsappNumber: ''
      });

    } catch (error) {
      console.error('Error submitting registration:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const districts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
    'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
  ];

  return (
    <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 sm:p-12 shadow-2xl max-w-2xl mx-auto">
      {/* Inner Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-500/10 rounded-3xl"></div>
      
      <div className="relative z-10">
        {/* Form Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-blue-300 mr-3" />
            <h3 className="text-3xl font-bold text-white">Registration Form</h3>
          </div>
          <p className="text-white/70 text-lg">Fill in your details to apply for protection policy</p>
        </div>

        {/* Status Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
            <span className="text-green-100">Registration submitted successfully! We'll contact you soon.</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
            <span className="text-red-100">Something went wrong. Please try again.</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                placeholder="Enter first name"
              />
            </div>
            
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                placeholder="Enter last name"
              />
            </div>
          </div>

          {/* District */}
          <div>
            <label className="flex items-center text-white/80 text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 text-emerald-300 mr-2" />
              District *
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
            >
              <option value="" className="bg-gray-800 text-white">Select District</option>
              {districts.map((district) => (
                <option key={district} value={district} className="bg-gray-800 text-white">
                  {district}
                </option>
              ))}
            </select>
          </div>

          {/* Local Body */}
          <div>
            <label className="block text-white/80 text-sm font-medium mb-2">
              Panchayat / Municipality / Corporation *
            </label>
            <input
              type="text"
              name="localBody"
              value={formData.localBody}
              onChange={handleInputChange}
              required
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
              placeholder="Enter your local body name"
            />
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-white/80 text-sm font-medium mb-2">
                <Phone className="w-4 h-4 text-blue-300 mr-2" />
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
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
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 disabled:opacity-50"
                placeholder="9876543210"
                pattern="[0-9]{10}"
                maxLength="10"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative overflow-hidden px-12 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/30 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 flex items-center space-x-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:translate-y-0"
            >
              <span className="relative z-10">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </span>
              {!isSubmitting && (
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
              )}
              {isSubmitting && (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin relative z-10"></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            </button>
            
            <p className="text-white/60 text-sm mt-4">
              By submitting this form, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </form>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-xl"></div>
    </div>
  );
};
export default RegistrationForm;