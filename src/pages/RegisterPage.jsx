import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Phone, Eye, EyeOff, User, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.password) {
      toast.error('Please fill in all required fields.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error(t('errors.password_mismatch'));
      return;
    }
    setLoading(true);
    try {
      const user = await register({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), password: form.password });
      toast.success('Account created! Welcome, ' + user.name + '!');
      navigate('/citizen');
    } catch (err) {
      toast.error(err?.response?.data?.message || t('errors.register_failed'));
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
            Join thousands of citizens making their voices heard. Register to file grievances and track their resolution in real time.
          </p>
          <div className="space-y-3">
            {[
              'File complaints in 3 languages',
              'Real-time status tracking',
              'SLA-based resolution timelines',
              'Voice complaint support',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 border border-white/20 text-left">
                <div className="w-2 h-2 rounded-full bg-[#FF9933] flex-shrink-0" />
                <span className="text-sm text-blue-100">{feat}</span>
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

          <h2 className="text-3xl font-extrabold text-[#0C2340] mb-1">{t('auth.create_account')}</h2>
          <p className="text-gray-500 mb-8 text-sm">{t('auth.create_sub')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('form.name')} *</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9933] focus-within:border-[#FF9933] transition">
                <div className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-gray-400">
                  <User size={15} />
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Enter your full name"
                  className="flex-1 px-3 py-3 text-sm outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('form.email')}</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9933] focus-within:border-[#FF9933] transition">
                <div className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-gray-400">
                  <Mail size={15} />
                </div>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="Enter your email (optional)"
                  className="flex-1 px-3 py-3 text-sm outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('form.phone')} *</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9933] focus-within:border-[#FF9933] transition">
                <div className="flex items-center gap-1.5 px-3 bg-gray-50 border-r border-gray-200 text-sm font-semibold text-gray-600 whitespace-nowrap">
                  <Phone size={15} />
                  +91
                </div>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="Enter your phone number"
                  className="flex-1 px-3 py-3 text-sm outline-none bg-white"
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('form.password')} *</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9933] focus-within:border-[#FF9933] transition">
                <div className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-gray-400">
                  <Lock size={15} />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="Create a password"
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">{t('form.confirm_password')} *</label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9933] focus-within:border-[#FF9933] transition">
                <div className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-gray-400">
                  <Lock size={15} />
                </div>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={set('confirmPassword')}
                  placeholder="Confirm your password"
                  className="flex-1 px-3 py-3 text-sm outline-none bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="px-3 bg-gray-50 border-l border-gray-200 text-gray-400 hover:text-gray-600 transition"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-bold text-base transition-all hover:shadow-lg hover:scale-[1.01] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ background: loading ? '#ccc' : 'linear-gradient(to right, #FF9933, #E8870D)' }}
            >
              {loading ? 'Creating account...' : t('form.register')}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            {t('auth.have_account')}{' '}
            <Link to="/login" className="text-[#FF9933] font-semibold hover:underline">
              {t('auth.login_link')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
