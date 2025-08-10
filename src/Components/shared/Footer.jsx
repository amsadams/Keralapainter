import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  ArrowRight
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="page-content relative bg-gradient-to-br from-gray-900 via-slate-800 to-black overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/3 rounded-full blur-3xl"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative z-10 bg-white/5 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-3xl font-bold text-white mb-4">Stay Updated</h4>
            <p className="text-white/70 text-lg mb-8">Get the latest updates on policies and coverage options directly to your inbox.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-center sm:text-left"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg font-semibold text-white flex items-center justify-center space-x-2">
                <span>Subscribe</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-white/60 text-sm">
                © 2024 Kerala Painters Protection Policy. All rights reserved.
              </p>
              <p className="text-white/40 text-xs mt-1">
                Licensed Insurance Provider | IRDAI License No. KL/2008/001234
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-white/60 text-sm mr-2">Follow us:</span>
              {[
                { icon: Facebook, href: 'https://facebook.com/keralapainters', color: 'hover:text-blue-400' },
                { icon: Twitter, href: 'https://twitter.com/keralapainters', color: 'hover:text-sky-400' },
                { icon: Instagram, href: 'https://instagram.com/keralapainters', color: 'hover:text-pink-400' },
                { icon: Linkedin, href: 'https://linkedin.com/company/keralapainters', color: 'hover:text-blue-300' }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-white/70 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/20`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-xs">
              <a href="/privacy" className="text-white/60 hover:text-white transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="/terms" className="text-white/60 hover:text-white transition-colors duration-300">
                Terms of Service
              </a>
              <a href="/cookies" className="text-white/60 hover:text-white transition-colors duration-300">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;