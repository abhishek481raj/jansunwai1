import React from 'react';

function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} />
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-start gap-4 overflow-hidden">
      <div className="w-1 h-full absolute left-0 top-0 bg-gray-200 dark:bg-gray-700 rounded-r" />
      <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-7 w-20 rounded" />
        <Skeleton className="h-4 w-32 rounded" />
      </div>
    </div>
  );
}

export function ComplaintCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 space-y-3">
      <div className="flex items-start gap-3 justify-between">
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-28 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full flex-shrink-0" />
      </div>
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-8 w-20 rounded-lg" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr>
      {[28, 48, 24, 20, 20, 16, 16, 20].map((w, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className={`h-4 w-${w} rounded`} />
        </td>
      ))}
    </tr>
  );
}

export function DashboardSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-64 rounded" />
        <Skeleton className="h-4 w-96 rounded" />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-48 rounded" />
        {Array.from({ length: rows }).map((_, i) => (
          <ComplaintCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;
