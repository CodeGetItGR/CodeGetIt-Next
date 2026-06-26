// Ultra-light Phosphor-style step icons
interface IconProps {
  size?: number;
  className?: string;
  'aria-hidden'?: boolean | 'true' | 'false';
}
export function DiscoverIcon({ size = 22, className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg aria-hidden={ariaHidden} className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
      <path d="M11 8v3l2 2" />
    </svg>
  );
}
export function DesignIcon({ size = 22, className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg aria-hidden={ariaHidden} className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}
export function BuildIcon({ size = 22, className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg aria-hidden={ariaHidden} className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
export function LaunchIcon({ size = 22, className, 'aria-hidden': ariaHidden }: IconProps) {
  return (
    <svg aria-hidden={ariaHidden} className={className} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13" />
      <path d="M22 2 15 22 11 13 2 9l20-7z" />
    </svg>
  );
}
