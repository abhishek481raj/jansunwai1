import React from 'react';

export default function TricolorStrip() {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: '5px',
        background: 'linear-gradient(to right, #FF9933 33%, #FFFFFF 33%, #FFFFFF 66%, #138808 66%)',
      }}
    />
  );
}
