import React from 'react';
import { Building2 } from 'lucide-react';
import EmptyState from '../../components/EmptyState';

export default function Departments() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <EmptyState
        icon={Building2}
        title="Departments"
        description="View and manage government departments here."
      />
    </div>
  );
}
