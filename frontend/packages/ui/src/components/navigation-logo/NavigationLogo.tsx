import Image from 'next/image';

export interface LogoNavigationProps
  extends React.HTMLAttributes<HTMLDivElement> {
  collapsed?: boolean;
}
function LogoNavigation({
  collapsed = false,
  ...props
}: LogoNavigationProps) {
  return (
    <div
      {...props}
      className="flex align-center justify-center px-8 py-6 border-b border-neutral-n-300 h-24 relative"
    >
      {collapsed === true ? (
        <Image
          src="/images/logo-small.png"
          alt="logo-minimized"
          width={22.209}
          height={32.9}
          style={{
            objectFit: 'contain',
            padding: 'auto'
          }}
        />
      ) : (
        <Image
          src="/images/logo-full.png"
          alt="logo-full"
          width={172}
          height={49.9}
        />
      )}
    </div>
  );
}

export { LogoNavigation };
