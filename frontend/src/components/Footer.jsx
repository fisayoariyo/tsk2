import React from 'react';
import {
  Globe,
  ChevronDown,
  Send,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  Linkedin
} from 'lucide-react';

export default function Footer() {
  const footerLinks = {
    Company: ['About Us', 'Careers', 'Press', 'Blog'],
    'Help & Support': ['Contact Us', 'FAQs', 'Booking Guide', 'Cancellation & Refunds'],
    'Travel Services': ['Flights', 'Stays', 'Cars', 'Deals & Offers'],
    Legal: ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Accessibility']
  };

  const socials = [
    { name: 'Facebook', Icon: Facebook },
    { name: 'Instagram', Icon: Instagram },
    { name: 'YouTube', Icon: Youtube },
    { name: 'X', Icon: Twitter },
    { name: 'LinkedIn', Icon: Linkedin }
  ];

  return (
    <footer className="w-full bg-[#0D1527] text-white pt-14 pb-8 border-t border-gray-800">
      <div className="max-w-[1320px] mx-auto px-6 sm:px-10 lg:px-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12">
          
          {/* Brand Info & Socials - 4 cols */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Logo */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF4500] flex items-center justify-center shadow-md">
                <Send className="w-4 h-4 text-white fill-white -rotate-45 translate-x-px" strokeWidth={2} />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Flyhigh
              </span>
            </div>

            <p className="text-gray-400 text-sm font-medium">
              Compare. Book. Fly.
            </p>

            {/* Social Icons */}
            <div className="flex items-center space-x-2.5 pt-2">
              {socials.map(({ name, Icon }) => (
                <a
                  key={name}
                  href={`#${name.toLowerCase()}`}
                  className="w-8 h-8 rounded-full bg-[#1E293B] hover:bg-[#FF5722] text-gray-300 hover:text-white flex items-center justify-center transition-colors duration-200"
                  title={name}
                >
                  <Icon className="w-4 h-4" strokeWidth={2} />
                </a>
              ))}
            </div>

          </div>

          {/* Links Columns - 8 cols */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-3.5">
                <h4 className="text-sm font-bold text-white tracking-wide">
                  {category}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 Flyhigh. All rights reserved.</p>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-gray-800 text-gray-300 hover:text-white transition text-xs">
              <Globe className="w-3.5 h-3.5" />
              <span>English (IN)</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            <button className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1E293B] hover:bg-gray-800 text-gray-300 hover:text-white transition text-xs">
              <span>🇮🇳</span>
              <span className="font-semibold">INR</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
