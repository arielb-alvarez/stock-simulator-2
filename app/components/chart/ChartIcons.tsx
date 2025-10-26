// components/chart/ChartIcons.tsx
import React from 'react';

interface IconProps {
  className?: string;
}

export const CandleIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 6h18M6 12h12M9 18h6" strokeWidth="2" strokeLinecap="round"/>
    <rect x="8" y="4" width="2" height="4" fill="currentColor"/>
    <rect x="14" y="8" width="2" height="8" fill="currentColor"/>
    <rect x="10" y="14" width="2" height="6" fill="currentColor"/>
  </svg>
);

export const LineIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 12h3l3-6 3 6 3-6 3 6h3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AreaIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M3 12h3l3-6 3 6 3-6 3 6h3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2"/>
  </svg>
);

export const BarIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="4" y="4" width="2" height="16" fill="currentColor"/>
    <rect x="10" y="8" width="2" height="12" fill="currentColor"/>
    <rect x="16" y="12" width="2" height="8" fill="currentColor"/>
  </svg>
);

export const ChevronDown: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M6 9l6 6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const EditIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);