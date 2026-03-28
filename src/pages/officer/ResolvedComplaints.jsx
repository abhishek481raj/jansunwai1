import React from 'react';
import { CheckSquare } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

export default function ResolvedComplaints() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <EmptyState
        icon={CheckSquare}
        title="Resolved Complaints"
        description="Complaints you have resolved will appear here."
      />
    </div>
  );
}
