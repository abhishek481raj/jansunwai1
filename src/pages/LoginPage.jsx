import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Phone, Eye, EyeOff, User, Lock, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ROLE_REDIRECT = {
  citizen: '/citizen/dashboard',
  officer: '/officer/dashboard',
  admin: '/admin/dashboard',
};

const DEMO_USERS = [
  { label: 'Citizen', phone: '9876543210', icon: '👤', color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' },
  { label: 'Officer', phone: '9876543213', icon: '👮', color: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' },
  { label: 'Admin', phone: '9876543216', icon: '🔑', color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
];

export default function LoginPage() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!phone.trim()) { toast.error(t('errors.phone_required')); return; }
    setLoading(true);
    try {
      const user = await login(phone.trim(), password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(ROLE_REDIRECT[user.role] || '/');
    } catch (err) {
      toast.error(err?.response?.data?.message || t('errors.login_failed'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoPhone) => {
    setLoading(true);
    try {
      const user = await login(demoPhone, 'password123');
      toast.success(`Welcome, ${user.name}!`);
      navigate(ROLE_REDIRECT[user.role] || '/');
    } catch (err) {
      toast.error(err?.response?.data?.message || t('errors.login_failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0C2340 0%, #1a3a5c 50%, #0C2340 100%)' }}
      >
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white/30"
              style={{
                width: `${60 + i * 30}px`,
                height: `${60 + i * 30}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-12 max-w-md">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #FF9933, #E8870D)' }}
          >
            <Shield size={42} color="white" strokeWidth={2} />
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">JanSunwai</h1>
          <p className="text-lg text-[#FF9933] font-semibold mb-4">जनसुनवाई</p>
          <p className="text-blue-200 text-base leading-relaxed mb-8">
            National Grievance Redressal Portal — Empowering citizens to file, track, and resolve civic issues with complete transparency.
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '15K+', label: 'Complaints' },
              { value: '94%', label: 'Resolved' },
              { value: '4.2d', label: 'Avg Time' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-[#FF9933]">{stat.value}</div>
                <div className="text-xs text-blue-200 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'linear-gradient(to right, #FF9933, #FFFFFF, #138808)' }} />
      </div>

      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF9933, #E8870D)' }}
            >
              <Shield size={26} color="white" />
            </div>
            <span className="text-2xl font-extrabold text-[#0C2340]">JanSunwai</span>
          </div>

          <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-[#FF671F] mb-6 transition-colors w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>

          <h2 className="text-3xl font-extrabold text-[#0C2340] mb-1">{t('auth.welcome_back')}</h2>
          <p className="text-gray-500 mb-8 text-sm">{t('auth.welcome_sub')}</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('form.phone')}</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9933] focus-within:border-[#FF9933] transition">
                <div className="flex items-center gap-1.5 px-3 bg-gray-50 border-r border-gray-200 text-sm font-semibold text-gray-600 whitespace-nowrap">
                  <Phone size={15} />
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="flex-1 px-3 py-3 text-sm outline-none bg-white"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('form.password')}</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9933] focus-within:border-[#FF9933] transition">
                <div className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-gray-400">
                  <Lock size={15} />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="flex-1 px-3 py-3 text-sm outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="px-3 bg-gray-50 border-l border-gray-200 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-base transition-all hover:shadow-lg hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ background: loading ? '#ccc' : 'linear-gradient(to right, #FF9933, #E8870D)' }}
            >
              {loading ? 'Signing in...' : t('form.login')}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">— {t('auth.demo_access')} —</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="grid grid-cols-3 gap-2">
            {DEMO_USERS.map((demo) => (
              <button
                key={demo.label}
                onClick={() => handleDemo(demo.phone)}
                disabled={loading}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border text-xs font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${demo.color}`}
              >
                <span className="text-lg">{demo.icon}</span>
                <span>{demo.label}</span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-gray-500">
            {t('auth.no_account')}{' '}
            <Link to="/register" className="text-[#FF9933] font-semibold hover:underline">
              {t('auth.register_link')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
