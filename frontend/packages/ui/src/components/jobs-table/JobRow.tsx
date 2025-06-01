import React from 'react';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { cn } from '@/lib/utils';
import { AvatarCompany } from '../avatar-company/AvatarCompany';
import { Typography } from '../typography';
import { JobStatus, MigrateTo } from '../migrate-to/MigratoTo';
import { EmojiReaction } from '../emoji-reaction/EmojiReaction';
import { COLUMN_STYLES, Job } from './types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Reaction } from '../emoji-reaction/types';

// given unix timestamp, convert to a readable string
/**
 *
 * @param time
 * Options: 1-59 min, 1-23 hours ago, yesterday, this week, last week, date
 */
export const calculateActivityString = (time: number, comp?: number) => {
  const activityDate = new Date(time);
  const now = !!comp ? new Date(comp) : new Date();
  const ms = now.getTime();
  const nowDay = now.getDay();
  const activityDay = activityDate.getDay();
  const timeDiffMs = ms - time;
  const timeDiffMin = Math.round(timeDiffMs / 60000);
  const timeDiffHr = Math.round(timeDiffMin / 60);
  const yesterday =
    nowDay - activityDay === 1 || (nowDay === 0 && activityDay === 6);
  const timeDiffDay = Math.round(timeDiffHr / 24);
  const timeDiffWeek = Math.round(timeDiffDay / 7);
  switch (true) {
    case timeDiffMin < 60:
      return `${timeDiffMin} ${timeDiffMin > 1 ? 'mins' : 'min'} ago`;
    case yesterday && timeDiffDay < 2:
      return 'Yesterday';
    case timeDiffHr < 23:
      const single = timeDiffHr <= 1;
      return `${single ? 'An' : timeDiffHr} ${single ? 'hour' : 'hours'} ago`;
    case timeDiffDay < 7:
      return 'This week';
    case timeDiffWeek < 2:
      return 'Last week';
    default:
      return activityDate.toLocaleDateString();
  }
};

export type JobRowProps = {
  element: { id?: string } & Job;
  onStatusChange?: (element: Job, status: JobStatus) => void;
  onReactionChange?: (element: Job, reaction: Reaction) => void;
  onFavouriteChange?: (element: Job, is_favourite: boolean) => void;
};

// for a given job, create row for jobs table
// TODO: add onclick handlers for favoriting and navigating to notes page
export const JobRow = ({
  element,
  onStatusChange,
  onReactionChange,
  onFavouriteChange
}: JobRowProps) => {
  const pathname = usePathname();
  const jobNoteLink = `${pathname}/${element.id}?jobId=${element.jobId}`;

  const onFavorite: React.MouseEventHandler = event => {
    event?.preventDefault();
    onFavouriteChange?.(element, !element.is_favourite);
  };

  const onReact = (reaction: Reaction) => {
    onReactionChange?.(element, reaction);
  };

  return (
    <div
      className="flex border-b border-neutral-n-300 last:border-b-0 w-full min-w-0"
      role="row"
    >
      <Link
        data-testid="job-title-cell"
        href={jobNoteLink}
        className={cn(
          'gap-3 justify-start py-6 pl-6 pr-3 flex items-center shrink truncate min-w-0',
          COLUMN_STYLES['job']?.flexRatio
        )}
        role="cell"
      >
        <div className="cursor-pointer shrink-0" onClick={onFavorite}>
          <PhosphorIcon
            iconVariant="Star_fill"
            className={cn(
              'hover:fill-yellow-400',
              !!element.is_favourite ? 'fill-yellow-400' : 'fill-neutral-n-200'
            )}
          />
        </div>
        <AvatarCompany
          size="32px"
          profileIMG={element.image}
          avatarId={element.title}
          className="shrink-0"
          companyName={element.company}
        />

        <Typography variant="caption" className="truncate shrink min-w-0">
          {element.title}
        </Typography>
      </Link>
      <Link
        href={jobNoteLink}
        data-testid="company-cell"
        className={cn(
          'flex justify-start px-3 py-6 items-center truncate min-w-0 shrink',
          COLUMN_STYLES['company']?.flexRatio
        )}
        role="cell"
      >
        <Typography
          variant="caption"
          className="text-neutral-n-600 truncate shrink min-w-0"
        >
          {element.company}
        </Typography>
      </Link>

      <div
        data-testid="migrateTo-cell"
        className={cn(
          'flex justify-center px-3 py-[20px] items-center shrink-0',
          COLUMN_STYLES['stage']?.flexRatio
        )}
        role="cell"
      >
        <MigrateTo
          jobId={element.jobId}
          dynamicJobStatuses={Object.keys(element.stages)}
          onStatusChange={status => onStatusChange?.(element, status)}
          initialStage={(element?.stage?.toLowerCase() as JobStatus) || 'saved'}
        />
      </div>
      <div
        data-testid="activity-cell"
        className={cn(
          'flex py-6 px-3 justify-center items-center shrink-0',
          COLUMN_STYLES['activity']?.flexRatio
        )}
        role="cell"
      >
        <Typography variant="caption" className="text-neutral-n-600">
          {calculateActivityString(element.lastEdited)}
        </Typography>
      </div>
      <div
        data-testid="reaction-cell"
        className={cn(
          'py-6 justify-center items-center shrink-0',
          COLUMN_STYLES['reaction']?.flexRatio
        )}
        role="cell"
      >
        <EmojiReaction
          initialReaction={(element.reaction as Reaction) || 'nervous'}
          onSelectFeeling={onReact}
        />
      </div>
    </div>
  );
};
