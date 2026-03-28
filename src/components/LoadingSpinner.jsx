import React from 'react';

export default function LoadingSpinner({ fullPage = false, size = 32 }) {
  const spinner = (
    <div
      className="rounded-full border-4 border-gray-200 animate-spin"
      style={{
        width: size,
        height: size,
        borderTopColor: '#FF9933',
      }}
    />
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center gap-4">
          {spinner}
          <p className="text-sm text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return spinner;
}
