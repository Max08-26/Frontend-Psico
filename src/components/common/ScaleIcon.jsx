const ScaleIcon = ({ size = 64, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >

      <circle cx="50" cy="60" r="35" fill="#E8F4F8" stroke="#2C3E50" strokeWidth="2" />

      <line x1="30" y1="60" x2="70" y2="60" stroke="#2C3E50" strokeWidth="1" opacity="0.3" />
      <line x1="33" y1="50" x2="67" y2="50" stroke="#2C3E50" strokeWidth="1" opacity="0.3" />
      <line x1="33" y1="70" x2="67" y2="70" stroke="#2C3E50" strokeWidth="1" opacity="0.3" />

      <rect x="47" y="20" width="6" height="45" fill="#2C3E50" />

      <g>

        <rect x="15" y="15" width="12" height="50" fill="#F5F5F5" stroke="#2C3E50" strokeWidth="1.5" rx="1" />

        <line x1="15" y1="20" x2="27" y2="20" stroke="#2C3E50" strokeWidth="1" />
        <line x1="18" y1="25" x2="27" y2="25" stroke="#2C3E50" strokeWidth="0.5" />
        <line x1="15" y1="30" x2="27" y2="30" stroke="#2C3E50" strokeWidth="1" />
        <line x1="18" y1="35" x2="27" y2="35" stroke="#2C3E50" strokeWidth="0.5" />
        <line x1="15" y1="40" x2="27" y2="40" stroke="#2C3E50" strokeWidth="1" />
        <line x1="18" y1="45" x2="27" y2="45" stroke="#2C3E50" strokeWidth="0.5" />
        <line x1="15" y1="50" x2="27" y2="50" stroke="#2C3E50" strokeWidth="1" />
        <line x1="18" y1="55" x2="27" y2="55" stroke="#2C3E50" strokeWidth="0.5" />
        <line x1="15" y1="60" x2="27" y2="60" stroke="#2C3E50" strokeWidth="1" />

        <circle cx="21" cy="30" r="2.5" fill="#FF6B6B" />
        <line x1="21" y1="18" x2="21" y2="32" stroke="#FF6B6B" strokeWidth="2" />
      </g>

      <g>

        <circle cx="50" cy="45" r="4" fill="#2C3E50" />

        <line x1="50" y1="49" x2="50" y2="58" stroke="#2C3E50" strokeWidth="2" />

        <line x1="45" y1="52" x2="55" y2="52" stroke="#2C3E50" strokeWidth="2" />
      </g>
    </svg>
  );
};

export default ScaleIcon;

