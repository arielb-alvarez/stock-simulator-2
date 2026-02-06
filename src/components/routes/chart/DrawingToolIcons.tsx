// components/chart/DrawingToolIcons.tsx

// Trigger icons
export const ArrowRightIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
    <path d="M2 1l3 3-3 3" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/>
  </svg>
);

export const ArrowLeftIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
    <path d="M6 1L3 4l3 3" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/>
  </svg>
);

export const ArrowDownIcon = () => (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
    <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round"/>
  </svg>
);

// Drawing tools icons
export const LineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 13L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const HorizontalLineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const VerticalLineIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const RayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3 13L8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M8 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const RectangleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="4" y="4" width="8" height="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const CircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
  </svg>
);

export const TextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <text x="3" y="12" fontSize="9" fontFamily="Arial, sans-serif">A</text>
  </svg>
);