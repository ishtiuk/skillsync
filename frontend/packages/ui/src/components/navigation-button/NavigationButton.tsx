import { ActiveLink, ActiveLinkContext } from '@/components/active-link';
import { ComponentType, ComponentPropsWithRef, useContext } from 'react';
import { Typography } from '../typography/Typography';
import { Notification } from '../badges/notification/Notification';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AvatarPeople } from '../avatar-people/AvatarPeople';
import { IconVariant, PhosphorIcon } from '@/icons/PhosphorIcon';

export type NavigationButtonProps = {
  person?: string;
  iconVariant?: IconVariant;
  pathname: string;
  status?: boolean;
  label: string;
  collapsed: boolean;
  notifications?: string | undefined | number;
  jobs?: string | number | undefined;
};

function NavigationButton({
  iconVariant,
  pathname,
  label,
  status = false,
  notifications,
  jobs,
  person,
  collapsed
}: NavigationButtonProps) {
  const activeLinkProps = useContext(ActiveLinkContext);
  const pathnameButton = usePathname();
  return (
    <ActiveLink
      href={`\\${pathname}`}
      className={cn(
        `${collapsed === true ? 'justify-center' : 'justify-start'}`,
        pathname === 'profile' ? 'py-3' : 'py-[14px]',
        'group px-4 rounded-lg w-full fill-navigation-btn-foreground hover:text-primary-g-800 flex'
      )}
      activeClassName={
        'fill-navigation-btn-foreground-active block text-primary-g-800 bg-white border-navigation-btn-foreground-active text-primary-g-700 bg-neutral-n-300 block shadow-customShadowBar rounded-lg'
      }
    >
      <button
        className={cn(
          `${collapsed === true ? 'gap-0' : 'gap-2 '}`,
          `${collapsed === true && notifications ? 'relative block after:absolute after:w-2 after:h-2  after:top-3 after:right-3 after:block after:rounded-full after:bg-red-r-500' : ''}`,
          'transition-all flex items-center'
        )}
      >
        {pathname === 'profile' && !iconVariant ? (
          <div
            className={cn(
              'relative',
              `${status === true ? 'after:w-[10px] after:h-[10px] after:absolute after:top-[-6px] after:right-[-2px] z-10 after:block after:rounded-full after:bg-red-r-500 after:border-2 after:border-neutral-n-200' : ''}`
            )}
          >
            <AvatarPeople
              AvatarType="img"
              avatarId="kk"
              profileIMG={person}
              color="purple"
              size="24px"
              className={cn(
                pathnameButton === '/profile'
                  ? 'border !border-primary-g-700'
                  : '',
                'group-hover:border transition-all group-hover:!border-primary-g-700'
              )}
            />
          </div>
        ) : (
          iconVariant && <PhosphorIcon size={20} iconVariant={iconVariant} />
        )}
        {collapsed === true ? (
          <></>
        ) : (
          <>
            <Typography variant="caption-strong" className="nowrap flex gap-2">
              {label}
              {pathname === 'your-jobs' && jobs && (
                <span className="text-neutral-800 bg-neutral-n-100 px-[2px] rounded">
                  {jobs}
                </span>
              )}
            </Typography>

            {notifications && (
              <Notification
                variant="alert"
                messages={notifications}
                className="ml-auto"
              />
            )}
          </>
        )}
      </button>
    </ActiveLink>
  );
}

export { NavigationButton };
