import React from 'react';

export default function GlassCard({ children, className = '', hoverEffect = true, ...props }) {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
        hoverEffect ? 'glass-panel-hover' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
