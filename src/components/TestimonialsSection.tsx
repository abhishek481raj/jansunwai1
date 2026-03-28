import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote:
      'Filed a complaint about broken road near my house. Got resolved in just 3 days! The tracking system kept me informed at every step.',
    name: 'Ramesh Verma',
    location: 'Lucknow, Uttar Pradesh',
    initials: 'RV',
    gradient: 'linear-gradient(135deg, #FF9933, #E8870D)',
  },
  {
    quote:
      'The voice complaint feature is amazing. My mother who can\'t type was able to file her water supply complaint easily and it got resolved.',
    name: 'Anjali Devi',
    location: 'Hyderabad, Telangana',
    initials: 'AD',
    gradient: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
  },
  {
    quote:
      'As a government officer, this portal has streamlined my workflow. I can manage and resolve complaints much faster now.',
    name: 'Sanjay Mehta',
    location: 'New Delhi',
    initials: 'SM',
    gradient: 'linear-gradient(135deg, #138808, #15803D)',
  },
];

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-[#0C2340]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(255,153,51,0.1)',
              color: '#FF9933',
              border: '1px solid rgba(255,153,51,0.3)',
            }}
          >
            💬 Citizen Voices
          </span>
          <h2 className="font-extrabold text-white mb-3" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>
            What Citizens Say
          </h2>
          <p className="text-gray-400 text-lg">Real stories from real people across India</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="rounded-2xl p-8 flex flex-col"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={16} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>

              <p className="text-white/90 italic leading-relaxed text-sm flex-1 mb-6">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ background: t.gradient }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{t.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
