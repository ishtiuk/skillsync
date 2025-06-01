import { cn } from '@/lib/utils';
import Image from 'next/image';

const sizesVariants = {
  '32px': 'w-[32px] h-[32px] rounded-[8px] text-[24px] leading-normal',
  '48px': 'w-[48px] h-[48px] rounded-[12px] text-[32px] leading-normal',
  '64px': 'w-[64px] h-[64px] rounded-[12px] text-[48px] leading-normal',
  '96px': 'w-[96px] h-[96px] rounded-[16px] text-[84px] leading-normal',
  '128px': 'w-[128px] h-[128px] rounded-[24px] text-[100px] leading-normal'
};

const radiusVariant = {
  '32px': 'rounded-[8px]',
  '48px': 'rounded-[12px]',
  '64px': 'rounded-[12px]',
  '96px': 'rounded-[16px]',
  '128px': 'rounded-[24px]'
};

export interface NoLogoCompanyProps
  extends React.HTMLAttributes<HTMLDivElement> {
  size: keyof typeof sizesVariants;
  className?: string;
  avatarId: string;
  altAvatar?: string;
}
function NoAvatarCompany({
  className,
  avatarId,
  size = '48px',
  altAvatar = 'company',
  ...props
}: NoLogoCompanyProps) {
  return (
    <div
      key={`avatar-${avatarId}`}
      className={cn(
        sizesVariants[size],
        className,
        'flex bg-neutral-n-100 items-center border border-neutral-n-300 justify-center relative overflow-hidden'
      )}
      {...props}
    >
      <div
        className={cn(
          radiusVariant[size],
          'w-full relative h-full flex items-center justify-center flex-col p-1'
        )}
      >
        <Image
          src="/images/defaultCompanyCard.png"
          alt={altAvatar}
          fill={true}
          className={cn(radiusVariant[size])}
        />
      </div>
    </div>
  );
}

export { NoAvatarCompany };
