import React, { useState } from 'react';
import { Shield, User, Mail, Phone, MapPin, Briefcase, FileText, ArrowRight, CheckCircle } from 'lucide-react';
import RegistrationForm from '../Components/ui/RegistrationForm';

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    businessType: '',
    coverage: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden page-content">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-slate-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
          <div className="absolute top-40 right-32 w-80 h-80 bg-sky-300/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-72 h-72 bg-blue-500/12 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-cyan-400/8 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s', animationDelay: '3s' }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Trust Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fadeInUp opacity-0" style={{ animation: 'fadeInUp 1s ease-out 0.2s forwards' }}>
            <Shield className="w-5 h-5 text-blue-300 mr-2" />
            <span className="text-white/90 text-sm font-medium">Secure Registration Process</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight animate-slideInLeft opacity-0" style={{ animation: 'slideInLeft 1s ease-out 0.4s forwards' }}>
            Apply for Your
            <span className="block text-transparent bg-gradient-to-r from-blue-200 via-sky-100 to-cyan-200 bg-clip-text">
              Protection Policy
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed animate-fadeIn opacity-0" style={{ animation: 'fadeIn 1s ease-out 0.6s forwards' }}>
            Join thousands of professional painters in Kerala who trust us with their business protection. 
            <span className="block mt-2 text-blue-200 font-medium">
              Complete your registration in just a few simple steps.
            </span>
          </p>
        </div>

        {/* Registration Form */}
        <RegistrationForm />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .page-content {
          padding-top: 6rem;
        }

        @media (min-width: 768px) {
          .page-content {
            padding-top: 7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default RegistrationPage;