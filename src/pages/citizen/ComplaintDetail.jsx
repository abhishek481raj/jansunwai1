import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check, MapPin, User, Building2, Tag, Calendar, Clock, MessageSquare, Loader, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { complaintsAPI } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import PriorityBadge from '../../components/PriorityBadge';
import SLACountdown from '../../components/SLACountdown';
import Timeline from '../../components/Timeline';
import LoadingSpinner from '../../components/LoadingSpinner';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-lg transition ${copied ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

function InfoCell({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
        <Icon size={15} className="text-gray-500" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
        <div className="text-sm font-semibold text-gray-800 leading-snug">{value || '—'}</div>
      </div>
    </div>
  );
}

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchComplaint = async () => {
    try {
      const data = await complaintsAPI.getById(id);
      setComplaint(data);
    } catch {
      toast.error('Complaint not found');
      navigate('/citizen/complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setSubmittingComment(true);
    try {
      const updated = await complaintsAPI.addComment(complaint.id, comment.trim(), user.id);
      setComplaint(updated);
      setComment('');
      toast.success('Comment added');
    } catch {
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!complaint) return null;

  const locationText = complaint.location?.address
    ? [complaint.location.address, complaint.location.city, complaint.location.pincode].filter(Boolean).join(', ')
    : null;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <button
        onClick={() => navigate('/citizen/complaints')}
        className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0C2340] transition"
      >
        <ArrowLeft size={16} />
        Back to My Complaints
      </button>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0C2340] leading-tight mb-2">{complaint.title}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-lg">
                {complaint.trackingId}
              </span>
              <CopyButton text={complaint.trackingId} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1"><Calendar size={12} /> Filed {formatDate(complaint.createdAt)}</span>
          {complaint.updatedAt !== complaint.createdAt && (
            <span className="flex items-center gap-1"><Clock size={12} /> Updated {formatDate(complaint.updatedAt)}</span>
          )}
        </div>
      </motion.div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-3 flex-wrap">
          <StatusBadge status={complaint.status} />
          <PriorityBadge priority={complaint.priority} />
          {complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
            <SLACountdown deadline={complaint.slaDeadline} />
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-[#0C2340] text-sm mb-3">Complaint Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoCell icon={Building2} label="Department" value={complaint.department?.name} />
          <InfoCell icon={Tag} label="Category" value={complaint.category?.name} />
          <InfoCell
            icon={User}
            label="Assigned Officer"
            value={complaint.officer ? complaint.officer.name : 'Not yet assigned'}
          />
          {locationText && (
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                <MapPin size={15} className="text-gray-500" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Location</div>
                <div className="text-sm font-semibold text-gray-800 leading-snug mb-2">{locationText}</div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${complaint.location.lat},${complaint.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                >
                  <MapPin size={12} />
                  Open Location
                  <ExternalLink size={10} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-[#0C2340] text-sm mb-3">Description</h3>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
      </div>

      {complaint.timeline && complaint.timeline.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="font-bold text-[#0C2340] text-sm mb-4">Activity Timeline</h3>
          <Timeline entries={complaint.timeline} />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-bold text-[#0C2340] text-sm mb-3 flex items-center gap-2">
          <MessageSquare size={16} />
          Add Comment
        </h3>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          rows={3}
          placeholder="Add a comment or provide additional information about this complaint..."
          className="w-full border border-gray-200 rounded-xl px-3.5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#FF9933] focus:border-[#FF9933] transition resize-none mb-3"
        />
        <div className="flex justify-end">
          <button
            onClick={handleAddComment}
            disabled={!comment.trim() || submittingComment}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition hover:opacity-90 disabled:opacity-50"
            style={{ background: 'linear-gradient(to right, #FF9933, #E8870D)' }}
          >
            {submittingComment ? <Loader size={14} className="animate-spin" /> : <MessageSquare size={14} />}
            {submittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </div>
    </div>
  );
}
