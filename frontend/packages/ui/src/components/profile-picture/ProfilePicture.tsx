import { cn } from '@/lib/utils';
import { AvatarPeople, AvatarPeopleProps } from '../avatar-people/AvatarPeople';
import { IconButton } from '../icon-button/IconButton';

export interface ProfilePicture extends AvatarPeopleProps {
  onEdit: () => void;
  className?: string;
}

function ProfilePicture({ onEdit, className, ...props }: ProfilePicture) {
  return (
    <div
      className={cn(
        'relative h-32 w-32 flex justify-center items-center',
        className
      )}
    >
      <div
        className={
          'rounded-full border-[6px] border-white w-[128px] h-[128px] flex justify-center items-center box-content'
        }
      >
        <AvatarPeople
          {...props}
          size="128px"
          color="purple"
          avatarId="profile-picture"
        />
      </div>
      <IconButton
        onClick={onEdit}
        iconVariant={'PencilSimple_fill'}
        size="small"
        className={'bottom-0 right-0 absolute'}
        variant="secondary"
      />
    </div>
  );
}

export default ProfilePicture;
