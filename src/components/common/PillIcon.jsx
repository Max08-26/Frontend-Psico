const PillIcon = ({ size = 64, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >

      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>

      <path
        d="M 50 20 Q 25 20 25 50 Q 25 80 50 80 L 50 20"
        fill="#FF6B6B"
        filter="url(#shadow)"
      />

      <path
        d="M 50 20 Q 75 20 75 50 Q 75 80 50 80 L 50 20"
        fill="#FFD966"
        filter="url(#shadow)"
      />

      <path
        d="M 50 20 Q 25 20 25 50 Q 25 80 50 80"
        stroke="#D64545"
        strokeWidth="2"
        fill="none"
      />

      <path
        d="M 50 20 Q 75 20 75 50 Q 75 80 50 80"
        stroke="#E6B800"
        strokeWidth="2"
        fill="none"
      />

      <line x1="50" y1="20" x2="50" y2="80" stroke="#2C3E50" strokeWidth="2" />

      <ellipse cx="32" cy="32" rx="6" ry="8" fill="white" opacity="0.4" />
      <ellipse cx="68" cy="32" rx="6" ry="8" fill="white" opacity="0.3" />
    </svg>
  );
};

export default PillIcon;

