const Logo = ({ className = "w-16 h-16" }) => {
  return (
    <div className={`${className} flex items-center justify-center`}>
      <img
        src="/images/logo.jpeg"
        alt="BIOPSYCHE Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;

