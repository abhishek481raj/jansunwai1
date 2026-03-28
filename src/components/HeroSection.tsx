import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Search, Bell, CheckCircle, TrendingUp } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: 'easeOut' },
});

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section
      id="hero"
      className="relative overflow-hidden"
      style={{
        minHeight: '680px',
        background: 'linear-gradient(135deg, #0C2340 0%, #1B3A5C 50%, #0C2340 100%)',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />

      <div
        className="absolute top-0 right-1/3 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'rgba(255,153,51,0.04)', filter: 'blur(80px)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'rgba(19,136,8,0.05)', filter: 'blur(60px)' }}
      />

      <div
        className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full pointer-events-none opacity-10"
        style={{
          background: 'linear-gradient(135deg, transparent, rgba(255,153,51,0.15))',
          transform: 'rotate(-30deg)',
          filter: 'blur(40px)',
        }}
      />

      <img
        src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
        alt=""
        className="absolute right-10 top-1/2 -translate-y-1/2 h-[400px] w-auto opacity-[0.03] pointer-events-none select-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex items-center gap-12">
        <div className="flex-1 lg:w-[55%]">
          <motion.div {...fadeUp(0)}>
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8"
              style={{
                background: 'rgba(255,153,51,0.1)',
                border: '1px solid rgba(255,153,51,0.3)',
                boxShadow: '0 0 15px rgba(255,153,51,0.15)',
              }}
            >
              <span className="text-base">🏛️</span>
              <span className="text-sm font-semibold text-[#FF9933] tracking-wide">
                Official Government Initiative
              </span>
            </div>
          </motion.div>

          <div className="space-y-1">
            <motion.div {...fadeUp(0.1)}>
              <div
                className="font-black leading-[1.05] tracking-tight"
                style={{ fontSize: 'clamp(42px, 6vw, 72px)', color: 'white' }}
              >
                Your Voice
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.2)}>
              <div
                className="font-black leading-[1.05] tracking-tight"
                style={{ fontSize: 'clamp(42px, 6vw, 72px)', color: '#FF9933' }}
              >
                Matters.
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.3)} className="pt-2">
              <div
                className="font-extrabold leading-[1.05] tracking-tight"
                style={{ fontSize: 'clamp(34px, 5vw, 60px)', color: 'rgba(255,255,255,0.9)' }}
              >
                Every Complaint,
              </div>
            </motion.div>
            <motion.div {...fadeUp(0.4)}>
              <div
                className="font-extrabold leading-[1.05] tracking-tight"
                style={{ fontSize: 'clamp(34px, 5vw, 60px)', color: '#138808' }}
              >
                Resolved.
              </div>
            </motion.div>
          </div>

          <motion.p {...fadeUp(0.5)} className="mt-8 text-lg text-gray-300/90 leading-relaxed max-w-lg">
            The national platform for filing, tracking, and resolving public grievances. Empowering 1.4 billion citizens
            with transparent, accountable governance through technology.
          </motion.p>

          <motion.div {...fadeUp(0.6)} className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate('/register')}
              className="flex items-center gap-3 text-white font-bold text-lg px-8 py-4 rounded-xl pulse-saffron transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{
                background: 'linear-gradient(to right, #FF9933, #E8870D)',
              }}
            >
              File a Complaint
              <ArrowRight size={20} />
            </button>
            <button
              onClick={() => navigate('/track')}
              className="flex items-center gap-3 text-white font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 cursor-pointer"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(8px)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.6)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.3)';
              }}
            >
              <Search size={20} />
              Track Complaint
            </button>
          </motion.div>

          <motion.div {...fadeUp(0.7)} className="mt-8 flex flex-wrap gap-6">
            {['100% Free', 'Track Anytime', '15L+ Resolved'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle size={15} color="#138808" fill="#138808" />
                <span className="text-sm text-gray-400">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="hidden lg:flex lg:w-[45%] relative items-center justify-center" style={{ minHeight: '520px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative w-80"
          >
            <div
              className="w-80 rounded-3xl p-4"
              style={{
                border: '2px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-white text-xs font-semibold">JanSunwai Portal</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#138808]" />
                  <span className="text-gray-300 text-xs">Online</span>
                </div>
              </div>

              <div
                className="rounded-xl p-4 mb-3"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-gray-400 tracking-wider">GRV-2024-00153</span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(19,136,8,0.2)', color: '#4ade80' }}
                  >
                    Resolved ✓
                  </span>
                </div>
                <div className="text-white text-sm font-semibold mb-3">Road pothole near MG Road</div>
                <div className="flex items-center gap-2">
                  {['Filed', 'Assigned', 'Resolved'].map((step, i) => (
                    <React.Fragment key={step}>
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ background: i < 3 ? '#138808' : 'rgba(255,255,255,0.2)' }}
                        />
                        <span className="text-[9px] text-gray-400">{step}</span>
                      </div>
                      {i < 2 && (
                        <div className="flex-1 h-px" style={{ background: '#138808' }} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl p-3"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="text-[10px] text-gray-400 mb-1">Today's Activity</div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold text-lg">47</span>
                    <span className="text-gray-400 text-xs ml-1">new complaints</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#4ade80] text-xs">
                    <TrendingUp size={12} />
                    <span>+8%</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute -top-4 -right-8 rounded-xl p-3 float-a"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div className="text-white font-black text-xl">12,456</div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-gray-300 text-xs">Resolved</span>
                <TrendingUp size={11} color="#4ade80" />
              </div>
            </div>

            <div
              className="absolute -bottom-4 -left-8 rounded-xl p-3 float-b"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="text-white font-bold">4.8/5</span>
              </div>
              <div className="text-gray-400 text-xs mt-0.5">Citizen Rating</div>
            </div>

            <div
              className="absolute top-8 -left-12 rounded-xl p-2.5 float-c"
              style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <div className="flex items-center gap-1.5">
                <Bell size={13} color="#FF9933" />
                <span className="text-white text-xs font-medium whitespace-nowrap">Your complaint resolved!</span>
              </div>
            </div>

            {[
              { top: '15%', left: '12%', delay: '0s' },
              { top: '70%', right: '8%', delay: '0.8s' },
              { bottom: '25%', left: '5%', delay: '1.4s' },
            ].map((pos, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  ...pos,
                  background: '#FF9933',
                  animation: `pulseSaffron 2s ease-in-out infinite ${pos.delay}`,
                  boxShadow: '0 0 8px rgba(255,153,51,0.8)',
                }}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
