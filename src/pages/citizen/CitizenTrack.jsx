import React from 'react';
import { MapPin } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

export default function CitizenTrack() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <EmptyState
        icon={MapPin}
        title="Track Complaint"
        description="Enter your tracking ID to see the status of your complaint."
      />
    </div>
  );
}
