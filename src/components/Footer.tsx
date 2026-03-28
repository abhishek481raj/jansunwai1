import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Twitter, Facebook, Youtube, Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const socialIcons = [
  { Icon: Twitter, label: 'Twitter' },
  { Icon: Facebook, label: 'Facebook' },
  { Icon: Youtube, label: 'YouTube' },
  { Icon: Instagram, label: 'Instagram' },
];

export default function Footer() {
  const navigate = useNavigate();

  const quickLinkHandlers: Record<string, () => void> = {
    'File Complaint': () => navigate('/register'),
    'Track Complaint': () => navigate('/track'),
    'View Statistics': () => scrollTo('stats'),
    'FAQs': () => scrollTo('faq'),
    'Contact Us': () => scrollTo('footer'),
    'Sitemap': () => {},
  };

  return (
    <footer id="footer" style={{ background: '#070F1B' }}>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
                alt="Emblem of India"
                className="h-10 w-auto brightness-200"
              />
              <div>
                <h3 className="text-white font-bold text-lg">JanSunwai</h3>
                <p className="text-gray-400 text-xs">जनसुनवाई | National Grievance Portal</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              National Public Grievance Redressal Portal. An initiative under Digital India Programme for transparent and accountable governance.
            </p>
            <div className="flex items-center gap-2">
              {socialIcons.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#FF9933'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <Icon size={16} color="white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {Object.keys(quickLinkHandlers).map((link) => (
                <li key={link}>
                  <button
                    onClick={quickLinkHandlers[link]}
                    className="text-gray-400 text-sm transition-colors duration-200 hover:text-[#FF9933] cursor-pointer bg-transparent border-none p-0 text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Departments</h4>
            <ul className="space-y-3">
              {['Public Works Department', 'Water Supply & Sanitation', 'Electricity & Power'].map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollTo('departments')}
                    className="text-gray-400 text-sm transition-colors duration-200 hover:text-[#FF9933] cursor-pointer bg-transparent border-none p-0 text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => scrollTo('departments')}
                  className="text-sm font-semibold transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
                  style={{ color: '#FF9933' }}
                >
                  View All Departments →
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} color="#FF9933" className="mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm leading-relaxed">
                  Grievance Cell, North Block,<br />New Delhi - 110001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} color="#FF9933" className="flex-shrink-0" />
                <span className="text-gray-400 text-sm">Toll Free: 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} color="#FF9933" className="flex-shrink-0" />
                <span className="text-gray-400 text-sm">support@jansunwai.gov.in</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock size={15} color="#FF9933" className="flex-shrink-0" />
                <span className="text-gray-400 text-sm">Mon-Sat, 9:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }} />

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © 2024 JanSunwai — National Public Grievance Portal. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Privacy Policy', 'Terms of Service', 'Accessibility Statement'].map((link, i) => (
              <React.Fragment key={link}>
                <button onClick={() => {}} className="text-gray-500 text-xs hover:text-gray-300 transition cursor-pointer bg-transparent border-none p-0">{link}</button>
                {i < 2 && <span className="text-gray-700 text-xs">|</span>}
              </React.Fragment>
            ))}
          </div>
          <p className="text-gray-500 text-xs text-center md:text-right">
            An Initiative under Digital India Programme 🇮🇳
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-[11px]">
            Visitors: 18,47,293 &nbsp;|&nbsp; Last Updated: December 2024
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <span className="text-gray-600 text-[11px]">Powered by Digital India 🇮🇳</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
