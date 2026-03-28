import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { File as FileEdit, Hash, UserCheck, CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '1',
    color: '#FF9933',
    shadow: 'rgba(255,153,51,0.35)',
    Icon: FileEdit,
    title: 'Submit Complaint',
    desc: 'File your grievance online with photos, voice recording, and GPS location',
  },
  {
    number: '2',
    color: '#2563EB',
    shadow: 'rgba(37,99,235,0.35)',
    Icon: Hash,
    title: 'Get Tracking ID',
    desc: 'Receive a unique GRV tracking number instantly via SMS',
  },
  {
    number: '3',
    color: '#7C3AED',
    shadow: 'rgba(124,58,237,0.35)',
    Icon: UserCheck,
    title: 'Auto-Assignment',
    desc: 'AI assigns the right department officer based on complaint type',
  },
  {
    number: '4',
    color: '#138808',
    shadow: 'rgba(19,136,8,0.35)',
    Icon: CheckCircle,
    title: 'Resolution & Feedback',
    desc: 'Get notified on resolution. Rate the service quality',
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 bg-white" ref={ref}>
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
            🔄 How It Works
          </span>
          <h2 className="font-extrabold text-[#0C2340] mb-1" style={{ fontSize: 'clamp(26px, 4vw, 40px)' }}>
            Four Simple Steps to
          </h2>
          <h2 className="font-extrabold" style={{ fontSize: 'clamp(26px, 4vw, 40px)', color: '#FF9933' }}>
            Get Your Issue Resolved
          </h2>
        </motion.div>

        <div className="relative">
          <div className="hidden md:flex items-start justify-between gap-0">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <motion.div
                  className="flex flex-col items-center flex-1"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-black text-white mb-4 relative z-10"
                    style={{
                      background: step.color,
                      boxShadow: `0 8px 25px ${step.shadow}`,
                    }}
                  >
                    {step.number}
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ background: `${step.color}15` }}
                  >
                    <step.Icon size={22} color={step.color} strokeWidth={2} />
                  </div>
                  <div className="text-lg font-bold text-[#0C2340] text-center">{step.title}</div>
                  <p className="text-sm text-gray-500 text-center mt-2" style={{ maxWidth: 200 }}>{step.desc}</p>
                </motion.div>
                {i < steps.length - 1 && (
                  <div className="flex items-start pt-10 flex-shrink-0 w-12">
                    <div className="w-full flex items-center gap-1">
                      {[0, 1, 2, 3, 4].map((dot) => (
                        <div
                          key={dot}
                          className="flex-1 h-0.5 rounded-full"
                          style={{ background: '#e2e8f0' }}
                        />
                      ))}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5H8M8 5L5 2M8 5L5 8" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="md:hidden flex flex-col gap-0">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <motion.div
                  className="flex items-start gap-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                >
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-black text-white"
                      style={{ background: step.color, boxShadow: `0 6px 18px ${step.shadow}` }}
                    >
                      {step.number}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-0.5 h-12 mt-2" style={{ background: '#e2e8f0' }} />
                    )}
                  </div>
                  <div className="pb-8">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                      style={{ background: `${step.color}15` }}
                    >
                      <step.Icon size={18} color={step.color} strokeWidth={2} />
                    </div>
                    <div className="text-base font-bold text-[#0C2340]">{step.title}</div>
                    <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <span
            className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full"
            style={{ background: 'rgba(19,136,8,0.08)', color: '#138808', border: '1px solid rgba(19,136,8,0.2)' }}
          >
            Average resolution in just 4.2 days
          </span>
        </motion.div>
      </div>
    </section>
  );
}
