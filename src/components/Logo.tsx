interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function Logo({ className = '', size = 'md', showSubtitle = true }: LogoProps) {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  }[size];

  const titleSize = {
    sm: 'text-lg',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl'
  }[size];

  return (
    <div id="brand-logo" className={`flex items-center gap-3 select-none ${className}`}>
      <div className={`relative shrink-0 ${iconDimensions} rounded-xl bg-gradient-to-br from-blue-50 to-slate-100 p-1 shadow-sm border border-slate-200/80`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="45" fill="#f0f4f8" />
          <path
            d="M35,65 C35,45 45,35 65,35"
            stroke="#0f4c81"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M45,65 C45,52 52,45 65,45"
            stroke="#1d70b8"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="65" cy="35" r="7" fill="#e67e22" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-extrabold tracking-tight text-slate-900 leading-none ${titleSize}`}>
          Chia<span className="text-[#1d70b8]">-SN</span>
        </span>
        {showSubtitle && (
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">
            Compta & Conseil Fiscal
          </span>
        )}
      </div>
    </div>
  );
}
