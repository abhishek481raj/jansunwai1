import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search } from 'lucide-react';

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="cta"
      ref={ref}
      className="py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(to right, #FF9933, #E8870D, #FF9933)',
      }}
    >
      <div
        className="absolute top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.08)', transform: 'translate(-40%, -40%)', filter: 'blur(40px)' }}
      />
      <div
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.08)', transform: 'translate(30%, 40%)', filter: 'blur(40px)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'rgba(255,255,255,0.05)', transform: 'translate(-50%, -50%)', filter: 'blur(30px)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-extrabold text-white mb-4" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>
            Ready to Make Your Voice Heard?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join 15 lakh+ citizens who have successfully resolved their grievances
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-2 font-bold px-10 py-4 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                background: 'white',
                color: '#0C2340',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
              }}
            >
              File a Complaint Now
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => navigate('/track')}
              className="flex items-center gap-2 font-semibold px-10 py-4 rounded-xl transition-all duration-300 hover:bg-white/10 cursor-pointer"
              style={{
                border: '2px solid white',
                color: 'white',
                background: 'transparent',
              }}
            >
              <Search size={18} />
              Track Existing Complaint
            </button>
          </div>

          <p className="text-white/70 text-sm mt-6 tracking-wide">
            🔒 100% Secure &nbsp;|&nbsp; 📱 Works on all devices &nbsp;|&nbsp; 🆓 Completely Free
          </p>
        </motion.div>
      </div>
    </section>
  );
}
