export function Spinner({ size = 'w-4 h-4', className = '' }: { size?: string; className?: string }) {
  return (
    <div className={`${size} rounded-full border border-accent border-t-transparent animate-spin ${className}`} />
  );
}
