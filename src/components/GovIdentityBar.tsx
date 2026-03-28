import React from 'react';

interface GovIdentityBarProps {
  textSize: number;
  onTextSizeChange: (size: number) => void;
  onScreenReaderClick: () => void;
}

export default function GovIdentityBar({ textSize, onTextSizeChange, onScreenReaderClick }: GovIdentityBarProps) {
  return (
    <div className="w-full bg-[#0C2340] py-1.5 px-4 md:px-8 flex items-center justify-between" style={{ marginTop: '5px' }}>
      <div className="flex items-center gap-2">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
          alt="Emblem of India"
          className="h-5 w-auto brightness-200"
        />
        <span className="text-xs text-gray-300 font-medium">भारत सरकार | Government of India</span>
      </div>
      <div className="hidden md:flex items-center gap-3 text-xs text-gray-400">
        <span
          onClick={onScreenReaderClick}
          className="cursor-pointer hover:text-white transition"
        >
          Screen Reader
        </span>
        <span className="text-gray-600">|</span>
        <span
          onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
          className="cursor-pointer hover:text-white transition"
        >
          Skip to Content
        </span>
        <span className="text-gray-600">|</span>
        <div className="flex items-center gap-1.5">
          <span
            onClick={() => { const s = Math.max(80, textSize - 10); onTextSizeChange(s); document.documentElement.style.fontSize = s + '%'; }}
            className="cursor-pointer hover:text-white transition text-[10px]"
          >
            A-
          </span>
          <span
            onClick={() => { onTextSizeChange(100); document.documentElement.style.fontSize = '100%'; }}
            className="cursor-pointer hover:text-white transition font-semibold"
          >
            A
          </span>
          <span
            onClick={() => { const s = Math.min(130, textSize + 10); onTextSizeChange(s); document.documentElement.style.fontSize = s + '%'; }}
            className="cursor-pointer hover:text-white transition text-base font-bold"
          >
            A+
          </span>
        </div>
      </div>
    </div>
  );
}
