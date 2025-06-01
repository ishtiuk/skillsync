import Link from 'next/link';
import { Card, CardFooter, CardHeader } from '../card/Card';
import { usePathname } from 'next/navigation';
import { Typography } from '../typography';
import { cn } from '@/lib/utils';
import { BookmarkIcon } from '../../icons/index';
import { JobNoteTag } from '../job-note-tag';
import { AvatarPeople } from '../avatar-people/AvatarPeople';

type colorVariants =
  | 'building-paths'
  | 'the-search'
  | 'growth-mindset'
  | 'skill-building'
  | 'prep-talk'
  | 'write-your-story';

const PathwayVariantClasses: Record<colorVariants, string> = {
  'building-paths': 'text-primary-g-700 bg-primary-g-200',
  'the-search': 'text-orange-o-700 bg-orange-o-200',
  'growth-mindset': 'text-yellow-y-700 bg-yellow-y-200',
  'skill-building': 'text-red-r-700 bg-red-r-200',
  'prep-talk': 'text-purple-p-700 bg-purple-p-200',
  'write-your-story': 'text-blue-b-700 bg-blue-b-200'
};

const colorSaveIcon = {
  'building-paths': 'text-white bg-primary-g-700',
  'the-search': 'text-white bg-orange-o-700',
  'growth-mindset': 'text-white bg-yellow-y-700',
  'skill-building': 'text-white bg-red-r-700',
  'prep-talk': 'text-white bg-purple-p-700',
  'write-your-story': 'text-white bg-blue-b-700'
};

const cardSizes = {
  skinny: 'w-[21.875rem] h-[7.75rem] p-4',
  small: 'w-[10.438rem] h-[12.5rem] p-4',
  medium: 'w-[21.875rem] h-[12.5rem] p-4',
  large: 'w-[21.875rem] h-[26rem] p-6',
  fill: 'w-full h-auto p-6'
};

interface PathwayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  JobNoteCardId: string;
  authorID: string;
  variant?: colorVariants;
  className?: string;
  save?: boolean;
  profileIMG?: string | null | undefined;
  size?: keyof typeof cardSizes;
  author?: string;
  variantAvatar?: any;
}

function JobNoteCard({
  title = 'How to prep for your first interview.',
  variant = 'building-paths',
  JobNoteCardId,
  save = false,
  size,
  profileIMG,
  className,
  author,
  authorID,
  variantAvatar
}: PathwayCardProps) {
  const pathname = usePathname();
  return (
    <Link href={`${pathname}/${JobNoteCardId}`}>
      <Card
        size={size}
        key={`job-${JobNoteCardId}`}
        className={cn(
          PathwayVariantClasses[variant],
          className,
          'relative flex flex-col justify-between'
        )}
        variant="gradient"
      >
        <CardHeader className="p-0 ">
          <div>
            <JobNoteTag category={variant} className="whitespace-nowrap mb-1" />
            {size === 'large' && (
              <Typography variant="heading-lg">{title}</Typography>
            )}
            {size === 'fill' && (
              <Typography variant="heading-sm">{title}</Typography>
            )}
            {size === 'medium' && (
              <Typography variant="heading-sm">{title}</Typography>
            )}
            {size === 'skinny' && (
              <div className="flex items-center justify-between">
                <Typography variant="body-strong" className="truncate">
                  {title}
                </Typography>
                {save && (
                  <div
                    className={cn(
                      /* colorSaveIcon[variant], */
                      'bg-white w-10 h-10 rounded-full flex items-center justify-center hover:shadow-lg'
                    )}
                  >
                    <BookmarkIcon size={24} color="#0E5249" />
                  </div>
                )}
              </div>
            )}
            {size === 'small' && (
              <Typography
                variant="heading-sm"
                className="overflow-hidden h-[84px]"
              >
                {title}
              </Typography>
            )}
          </div>
        </CardHeader>
        {size === 'small' ? (
          <CardFooter className="flex items-end justify-between p-0">
            {save === false ? (
              <div className="flex items-center justify-start gap-1">
                <AvatarPeople
                  AvatarType="alt"
                  avatarId={authorID}
                  profileIMG={profileIMG}
                  size="32px"
                  color={variantAvatar}
                />
                <Typography variant="caption">{author}</Typography>
              </div>
            ) : (
              <div
                className={cn(
                  /* colorSaveIcon[variant], */
                  'bg-white w-10 h-10 rounded-full flex items-center justify-center hover:shadow-lg ml-auto'
                )}
              >
                <BookmarkIcon size={24} color="#0E5249" />
              </div>
            )}
          </CardFooter>
        ) : (
          <CardFooter className="flex items-end justify-between p-0">
            <div className="flex items-center justify-start gap-1">
              <AvatarPeople
                AvatarType="alt"
                avatarId={authorID}
                profileIMG={profileIMG}
                size="32px"
                color={variantAvatar}
              />
              <Typography variant="caption">{author}</Typography>
            </div>
            {size === 'skinny' ? null : (
              <>
                {save && (
                  <div
                    className={cn(
                      /* colorSaveIcon[variant], */
                      cn(
                        size === 'large' && 'medium' ? 'w-12 h-12' : 'w-10 h-10'
                      ),
                      'bg-white rounded-full flex items-center justify-center hover:shadow-lg'
                    )}
                  >
                    <BookmarkIcon size={24} color="#0E5249" />
                  </div>
                )}
              </>
            )}
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}

export { JobNoteCard };
