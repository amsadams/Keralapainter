import React from 'react';
import { Shield, ArrowRight, ChevronDown } from 'lucide-react';
import Header from '../Components/shared/Header';
import { Link } from 'react-router-dom';

// HomePage Component
const Home = () => {
    
  return (
    <>
   
    <div className="page-content  min-h-screen relative overflow-hidden">
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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Glassmorphism Container */}
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Glassmorphism Card */}
          <div className="relative bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 p-8 sm:p-12 lg:p-16 shadow-2xl">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-blue-500/10 rounded-3xl"></div>
            
            {/* Content */}
            <div className="relative z-10">
              {/* Trust Badge */}
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8 animate-fadeInUp opacity-0" style={{ animation: 'fadeInUp 1s ease-out 0.2s forwards' }}>
                <Shield className="w-5 h-5 text-blue-300 mr-2" />
                <span className="text-white/90 text-sm font-medium">Trusted Protection Since 2008</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-tight">
                <span className="block animate-slideInLeft opacity-0" style={{ animation: 'slideInLeft 1s ease-out 0.4s forwards' }}>
                  Kerala Painter
                </span>
                <span className="block text-transparent bg-gradient-to-r from-blue-200 via-sky-100 to-cyan-200 bg-clip-text animate-slideInRight opacity-0" style={{ animation: 'slideInRight 1s ease-out 0.6s forwards' }}>
                  Protection Policy
                </span>
              </h1>

              {/* Description */}
              <div className="animate-fadeIn opacity-0 mb-12" style={{ animation: 'fadeIn 1s ease-out 0.8s forwards' }}>
                <p className="text-xl sm:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed font-light">
                  Comprehensive insurance coverage designed specifically for professional painters in Kerala. 
                  <span className="block mt-3 text-blue-200 font-medium">
                    Protect your business, tools, and future with our specialized protection policy.
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInUp opacity-0" style={{ animation: 'fadeInUp 1s ease-out 1s forwards' }}>
                {/* Primary Button */}

                <Link to="/registration">
                <button className="group relative overflow-hidden px-10 py-5 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-lg rounded-2xl shadow-2xl hover:shadow-blue-500/20 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 flex items-center space-x-3 min-w-80 justify-center">
                  <span className="relative z-10">Apply for Your Insurance</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </button>
               </Link>


                {/* Secondary Button */}
                <button className="group relative px-10 py-5 bg-transparent border-2 border-white/30 text-white font-semibold text-lg rounded-2xl backdrop-blur-sm hover:bg-white/5 hover:border-white/50 transform transition-all duration-500 hover:scale-105 hover:-translate-y-1 flex items-center space-x-3 min-w-80 justify-center overflow-hidden">
                  <span className="relative z-10">Learn More</span>
                  <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform duration-300 relative z-10" />
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-white/5 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></div>
                </button>
              </div>

              {/* Features */}
              <div className="mt-16 animate-fadeInUp opacity-0" style={{ animation: 'fadeInUp 1s ease-out 1.2s forwards' }}>
                <div className="flex flex-wrap justify-center gap-8 text-white/70">
                  {[
                    "Complete Tool Protection",
                    "Liability Coverage", 
                    "24/7 Claim Support",
                    "Kerala-wide Network"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 group hover:text-white/90 transition-colors duration-300">
                      <div className="w-2 h-2 bg-blue-300 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
                      <span className="font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-br from-cyan-400/20 to-transparent rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-12 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-4 bg-white/50 rounded-full mt-2 animate-pulse"></div>
          </div>
          <p className="text-white/60 text-xs mt-2 font-medium text-center">Explore</p>
        </div>
      </section>

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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
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
          }
        }
      `}</style>
    </div>
    </>
  );
};

export default Home;