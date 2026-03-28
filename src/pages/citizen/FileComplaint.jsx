import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, MapPin, Copy, ChevronRight, ChevronLeft, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { complaintsAPI, publicAPI } from '../../services/api';
import AudioRecorder from '../../components/AudioRecorder';
import LoadingSpinner from '../../components/LoadingSpinner';
import PriorityBadge from '../../components/PriorityBadge';

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'border-gray-300 text-gray-600', active: 'border-gray-500 bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'border-blue-300 text-blue-600', active: 'border-blue-500 bg-blue-50 text-blue-800' },
  { value: 'high', label: 'High', color: 'border-orange-300 text-orange-600', active: 'border-orange-500 bg-orange-50 text-orange-800' },
  { value: 'urgent', label: 'Urgent', color: 'border-red-300 text-red-600', active: 'border-red-500 bg-red-50 text-red-800' },
];

function ProgressBar({ step }) {
  const steps = ['Details', 'Location', 'Review'];
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((label, idx) => {
        const stepNum = idx + 1;
        const isCompleted = step > stepNum;
        const isActive = step === stepNum;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 text-white'
                    : isActive
                    ? 'border-[#FF9933] bg-[#FF9933] text-white'
                    : 'border-gray-300 bg-white text-gray-400'
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : stepNum}
              </div>
              <span className={`text-xs font-semibold ${isActive ? 'text-[#FF9933]' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div className={`h-0.5 w-16 sm:w-24 mx-2 mb-5 transition-colors ${step > stepNum ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SuccessScreen({ trackingId, onFileAnother, onViewComplaints }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(trackingId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-10 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <Check size={36} className="text-green-600" strokeWidth={3} />
      </div>
      <h2 className="text-2xl font-bold text-[#0C2340] mb-2">Complaint Filed Successfully!</h2>
      <p className="text-gray-500 text-sm mb-6 max-w-sm">
        Your complaint has been registered. Use the tracking ID below to monitor its progress.
      </p>
      <div className="bg-gray-50 border border-gray-200 rounded-2xl px-8 py-5 mb-6 w-full max-w-sm">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tracking ID</div>
        <div className="font-mono text-2xl font-extrabold text-[#0C2340] tracking-widest mb-3">{trackingId}</div>
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-sm font-semibold transition ${
            copied ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy ID'}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <button
          onClick={onFileAnother}
          className="flex-1 py-3 rounded-xl border-2 border-[#FF9933] text-[#FF9933] font-semibold text-sm hover:bg-orange-50 transition"
        >
          File Another
        </button>
        <button
          onClick={onViewComplaints}
          className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition"
          style={{ background: 'linear-gradient(to right, #FF9933, #E8870D)' }}
        >
          View Complaints
        </button>
      </div>
    </motion.div>
  );
}

export default function FileComplaint() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [successTrackingId, setSuccessTrackingId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  const [form, setForm] = useState({
    departmentId: '',
    categoryId: '',
    title: '',
    description: '',
    priority: 'medium',
    audioBlob: null,
    imageFile: null,
    videoFile: null,
    lat: '',
    lng: '',
    address: '',
    city: '',
    pincode: '',
  });
  const [errors, setErrors] = useState({});
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    publicAPI.getDepartments()
      .then(setDepartments)
      .catch(() => toast.error('Failed to load departments'))
      .finally(() => setLoadingDepts(false));
  }, []);

  useEffect(() => {
    if (form.departmentId) {
      publicAPI.getCategories(form.departmentId)
        .then(setCategories)
        .catch(() => toast.error('Failed to load categories'));
    } else {
      setCategories([]);
    }
  }, [form.departmentId]);

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }
    set('imageFile', file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Video size must be less than 50MB');
      return;
    }
    set('videoFile', file);
    const url = URL.createObjectURL(file);
    setVideoPreview(url);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
          );
          const data = await response.json();

          if (data && data.address) {
            const addr = data.address;
            const fullAddress = data.display_name || '';
            const city = addr.city || addr.town || addr.village || addr.state_district || '';
            const pincode = addr.postcode || '';

            setForm(prev => ({
              ...prev,
              lat,
              lng,
              address: fullAddress,
              city: city,
              pincode: pincode,
            }));

            toast.success('Location and address detected successfully');
          } else {
            setForm(prev => ({
              ...prev,
              lat,
              lng,
            }));
            toast.success('Location detected. Please enter address manually.');
          }
        } catch (error) {
          setForm(prev => ({
            ...prev,
            lat,
            lng,
          }));
          toast.success('Location detected. Could not fetch address automatically.');
        }

        setLocating(false);
      },
      () => {
        toast.error('Could not detect location');
        setLocating(false);
      }
    );
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.departmentId) e.departmentId = 'Select a department';
    if (!form.categoryId) e.categoryId = 'Select a category';
    if (!form.title || form.title.trim().length < 10) e.title = 'Title must be at least 10 characters';
    if (!form.description || form.description.trim().length < 50) e.description = 'Description must be at least 50 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.address.trim()) e.address = 'Address is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await complaintsAPI.create({
        title: form.title,
        description: form.description,
        departmentId: form.departmentId,
        categoryId: form.categoryId,
        priority: form.priority,
        location: {
          lat: parseFloat(form.lat) || 0,
          lng: parseFloat(form.lng) || 0,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        },
      }, user.id);
      setSuccessTrackingId(result.trackingId);
    } catch {
      toast.error('Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      departmentId: '', categoryId: '', title: '', description: '',
      priority: 'medium', audioBlob: null, imageFile: null, videoFile: null,
      lat: '', lng: '', address: '', city: '', pincode: '',
    });
    setErrors({});
    setImagePreview(null);
    setVideoPreview(null);
    setStep(1);
    setSuccessTrackingId(null);
  };

  const getDeptName = () => departments.find(d => d.id === form.departmentId)?.name || '—';
  const getCatName = () => categories.find(c => c.id === form.categoryId)?.name || '—';

  if (successTrackingId) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <SuccessScreen
            trackingId={successTrackingId}
            onFileAnother={resetForm}
            onViewComplaints={() => navigate('/citizen/complaints')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-[#0C2340] mb-6 text-center">File a New Complaint</h2>
        <ProgressBar step={step} />

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department <span className="text-red-500">*</span></label>
                {loadingDepts ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400 py-2"><LoadingSpinner size={16} /> Loading departments...</div>
                ) : (
                  <select
                    value={form.departmentId}
                    onChange={e => { set('departmentId', e.target.value); set('categoryId', ''); }}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition bg-white ${errors.departmentId ? 'border-red-400' : 'border-gray-200'}`}
                  >
                    <option value="">Select a department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                )}
                {errors.departmentId && <p className="text-red-500 text-xs mt-1">{errors.departmentId}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category <span className="text-red-500">*</span></label>
                <select
                  value={form.categoryId}
                  onChange={e => set('categoryId', e.target.value)}
                  disabled={!form.departmentId}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition bg-white disabled:bg-gray-50 disabled:text-gray-400 ${errors.categoryId ? 'border-red-400' : 'border-gray-200'}`}
                >
                  <option value="">{form.departmentId ? 'Select a category' : 'Select department first'}</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  placeholder="Brief title of your complaint (min 10 characters)"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-gray-700">Description <span className="text-red-500">*</span></label>
                  <span className={`text-xs font-medium ${form.description.length < 50 ? 'text-red-400' : 'text-green-600'}`}>
                    {form.description.length} chars {form.description.length < 50 ? `(${50 - form.description.length} more needed)` : ''}
                  </span>
                </div>
                <textarea
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={4}
                  placeholder="Provide a detailed description of your complaint (min 50 characters)"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition resize-none ${errors.description ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRIORITIES.map(p => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => set('priority', p.value)}
                      className={`py-2.5 rounded-xl border-2 text-xs font-bold transition ${form.priority === p.value ? p.active : `${p.color} hover:opacity-80`}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Voice Recording <span className="text-gray-400 font-normal">(optional)</span></label>
                <AudioRecorder onRecordingChange={blob => set('audioBlob', blob)} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Media <span className="text-gray-400 font-normal">(optional)</span></label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-[#FF9933] transition cursor-pointer"
                    onClick={() => imageRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="preview" className="w-full h-32 object-cover rounded-lg" />
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setImagePreview(null); set('imageFile', null); }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <div className="text-2xl mb-1">📷</div>
                        <p className="text-xs text-gray-600 font-semibold">Upload Image</p>
                        <p className="text-xs text-gray-400 mt-0.5">Up to 10MB</p>
                      </div>
                    )}
                  </div>

                  <div
                    className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-[#FF9933] transition cursor-pointer"
                    onClick={() => videoRef.current?.click()}
                  >
                    {videoPreview ? (
                      <div className="relative">
                        <video src={videoPreview} className="w-full h-32 object-cover rounded-lg" controls />
                        <button
                          type="button"
                          onClick={e => { e.stopPropagation(); setVideoPreview(null); set('videoFile', null); }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-2">
                        <div className="text-2xl mb-1">🎥</div>
                        <p className="text-xs text-gray-600 font-semibold">Upload Video</p>
                        <p className="text-xs text-gray-400 mt-0.5">Up to 50MB</p>
                      </div>
                    )}
                  </div>
                </div>
                <input ref={imageRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <input ref={videoRef} type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-5"
            >
              <button
                type="button"
                onClick={detectLocation}
                disabled={locating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-blue-400 bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition disabled:opacity-60"
              >
                {locating ? <Loader size={16} className="animate-spin" /> : <MapPin size={16} />}
                {locating ? 'Detecting location...' : 'Detect My Location'}
              </button>

              {(form.lat || form.lng) && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                  <MapPin size={16} className="text-green-600 flex-shrink-0" />
                  <span className="text-sm text-green-700 font-mono font-semibold">
                    {form.lat}, {form.lng}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Latitude</label>
                  <input
                    type="text"
                    value={form.lat}
                    onChange={e => set('lat', e.target.value)}
                    placeholder="e.g. 17.3850"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Longitude</label>
                  <input
                    type="text"
                    value={form.lng}
                    onChange={e => set('lng', e.target.value)}
                    placeholder="e.g. 78.4867"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address <span className="text-red-500">*</span></label>
                <textarea
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  rows={3}
                  placeholder="Enter the full address of the complaint location"
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition resize-none ${errors.address ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pincode</label>
                  <input
                    type="text"
                    value={form.pincode}
                    onChange={e => set('pincode', e.target.value)}
                    placeholder="e.g. 500001"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Department & Category</div>
                    <div className="font-semibold text-gray-900 text-sm">{getDeptName()}</div>
                    <div className="text-sm text-gray-500">{getCatName()}</div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-semibold text-[#FF9933] hover:underline">Edit</button>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Title</div>
                    <div className="font-semibold text-gray-900 text-sm">{form.title}</div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-0.5">Description</div>
                    <div className="text-sm text-gray-600 leading-relaxed">{form.description}</div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-semibold text-[#FF9933] hover:underline flex-shrink-0">Edit</button>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Priority</div>
                    <PriorityBadge priority={form.priority} />
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs font-semibold text-[#FF9933] hover:underline">Edit</button>
                </div>

                <div className="border-t border-gray-200 pt-4 flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Location</div>
                    <div className="flex items-start gap-1.5">
                      <MapPin size={14} className="text-[#FF9933] flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-800">{form.address}</div>
                        {form.city && <div className="text-xs text-gray-500">{form.city}{form.pincode ? ` - ${form.pincode}` : ''}</div>}
                        {form.lat && form.lng && (
                          <div className="text-xs text-gray-400 font-mono mt-0.5">{form.lat}, {form.lng}</div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setStep(2)} className="text-xs font-semibold text-[#FF9933] hover:underline flex-shrink-0">Edit</button>
                </div>

                {(imagePreview || videoPreview) && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Attached Media</div>
                    <div className="grid grid-cols-2 gap-3">
                      {imagePreview && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Image</p>
                          <img src={imagePreview} alt="attachment" className="w-full h-32 object-cover rounded-xl" />
                        </div>
                      )}
                      {videoPreview && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Video</p>
                          <video src={videoPreview} className="w-full h-32 object-cover rounded-xl" controls />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {form.audioBlob && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Voice Recording</div>
                    <audio controls src={URL.createObjectURL(form.audioBlob)} className="w-full h-10" />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
            >
              <ChevronLeft size={16} />
              Back
            </button>
          )}
          <div className="flex-1" />
          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90"
              style={{ background: 'linear-gradient(to right, #FF9933, #E8870D)' }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold text-sm transition hover:opacity-90 disabled:opacity-60"
              style={{ background: 'linear-gradient(to right, #FF9933, #E8870D)' }}
            >
              {submitting ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
