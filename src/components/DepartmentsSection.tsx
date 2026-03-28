import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Droplets, Zap, ArrowRight } from 'lucide-react';

const departments = [
  {
    accent: '#FF9933',
    accentBg: 'rgba(255,153,51,0.1)',
    Icon: Building2,
    code: 'PWD',
    name: 'Public Works Department',
    desc: 'Roads, bridges, infrastructure and public construction projects across the nation.',
    active: 342,
    resolved: 1247,
  },
  {
    accent: '#2563EB',
    accentBg: 'rgba(37,99,235,0.1)',
    Icon: Droplets,
    code: 'WSS',
    name: 'Water Supply & Sanitation',
    desc: 'Water supply, drainage systems, and sanitation facilities for all citizens.',
    active: 218,
    resolved: 893,
  },
  {
    accent: '#F59E0B',
    accentBg: 'rgba(245,158,11,0.1)',
    Icon: Zap,
    code: 'E&P',
    name: 'Electricity & Power',
    desc: 'Power supply, street lighting, meter issues, and electrical infrastructure.',
    active: 189,
    resolved: 756,
  },
];

export default function DepartmentsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="departments" className="py-24 bg-[#F0F4F8]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <span
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(255,153,51,0.1)', color: '#FF9933', border: '1px solid rgba(255,153,51,0.25)' }}
          >
            🏢 Departments
          </span>
          <h2 className="font-extrabold text-[#0C2340] mb-2" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>
            Government Departments
          </h2>
          <p className="text-gray-500 text-lg">Select a department to file or view complaints</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              onClick={() => navigate('/register')}
              className="bg-white rounded-2xl overflow-hidden relative group cursor-pointer transition-all duration-500 hover:-translate-y-2"
              style={{
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 40px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)';
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                style={{ background: dept.accent }}
              />

              <div className="p-8 pl-9">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{ background: dept.accentBg }}
                  >
                    <dept.Icon size={28} color={dept.accent} strokeWidth={1.8} />
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: dept.accentBg, color: dept.accent }}
                  >
                    {dept.code}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#0C2340] mb-2">{dept.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">{dept.desc}</p>

                <div className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(255,153,51,0.1)', color: '#E8870D' }}
                  >
                    {dept.active} Active
                  </span>
                  <span
                    className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: 'rgba(19,136,8,0.08)', color: '#138808' }}
                  >
                    {dept.resolved.toLocaleString()} Resolved
                  </span>
                </div>
              </div>

              <div
                className="border-t px-9 py-4 flex items-center justify-between group/link"
                style={{ borderColor: '#f1f5f9' }}
              >
                <span className="text-sm font-semibold" style={{ color: dept.accent }}>
                  View Department
                </span>
                <ArrowRight
                  size={16}
                  color={dept.accent}
                  className="transition-transform duration-200 group-hover/link:translate-x-1"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
