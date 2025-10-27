// components/chart/ChartIcons.tsx
import React from 'react';

interface IconProps {
  className?: string;
}

export const CandleIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {/* Binance-style candlestick icon - two candlesticks */}
    <path d="M7 6V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="6" y="8" width="2" height="3" fill="currentColor"/>
    <path d="M7 14V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    
    <path d="M12 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="11" y="6" width="2" height="8" fill="currentColor"/>
    <path d="M12 16V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    
    <path d="M17 8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="16" y="10" width="2" height="6" fill="currentColor"/>
    <path d="M17 18V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const LineIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {/* Binance-style line chart icon */}
    <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const AreaIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {/* Binance-style area chart icon */}
    <path d="M3 17L9 11L13 15L21 7V21H3V17Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const BarIcon: React.FC<IconProps> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    {/* Binance-style bar chart icon - three bars of different heights */}
    <rect x="4" y="4" width="3" height="16" fill="currentColor"/>
    <rect x="10" y="8" width="3" height="12" fill="currentColor"/>
    <rect x="16" y="12" width="3" height="8" fill="currentColor"/>
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