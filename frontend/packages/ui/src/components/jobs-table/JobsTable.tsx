import React, { useEffect, useState } from 'react';
import SectionHeader from '../section-header/SectionHeader';
import { PhosphorIcon, PhosphorIconProps } from '@/icons/PhosphorIcon';
import { TableHeader } from './TableHeader';
import { JobRow } from './JobRow';
import { cn } from '@/lib/utils';
import { Job, JobStage, JOB_STAGE_STYLES } from './types';
import { Reaction } from '../emoji-reaction/types';
import { Typography } from '../typography';
import { Button } from '../button';

export interface JobsTableProps {
  variant: JobStage;
  jobs: Array<Job>;
  onStatusChange?: (element: Job, status: JobStage) => void;
  onReactionChange?: (element: Job, reaction: Reaction) => void;
  onFavoriteChange?: (element: Job, is_favourite: boolean) => void;
}

/**
 * TODO:
 * - add proper animations for expansion
 * - limit table to 10 elements, scroll the rest
 *  */

function JobsTable({
  variant,
  jobs,
  onStatusChange,
  onReactionChange,
  onFavoriteChange
}: JobsTableProps) {
  const hasJobs = jobs.length > 0;
  const [expanded, setExpanded] = useState<boolean>(jobs.length > 0);
  const [tableHeight, setTableHeight] = useState<number>(0);

  const onClickDropdown = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    if (jobs?.length > 0) {
      setExpanded(true);
    }
  }, [jobs]);

  if (!hasJobs)
    return (
      <div
        className={cn(
          'rounded-2xl border-neutral-n-300 border flex flex-col w-full transition-all duration-200 ease origin-top bg-white',
          expanded ? 'min-h-[64px]' : 'max-h-[64px]'
        )}
        role="table"
        ref={el => {
          setTableHeight(el?.getBoundingClientRect().height || 0);
        }}
      >
        <SectionHeader
          hasDropdown={true}
          count={jobs.length}
          onClickDropdown={onClickDropdown}
          title={JOB_STAGE_STYLES[variant].title}
          defaultState={jobs?.length > 0 ? 'open' : 'closed'}
          leftIconProps={JOB_STAGE_STYLES[variant].iconProps}
          className={cn('pb-0 pt-3 px-3', !expanded && 'pb-3')}
        />

        <div
          className={cn(
            'flex flex-col items-center justify-center w-full text-neutral-n-500 py-8',
            expanded ? 'visible opacity-100' : 'invisible opacity-0'
          )}
        >
          <div
            className={cn(
              'rounded-md group-hover:border-0 flex items-center justify-center h-6 w-6 mb-2',
              JOB_STAGE_STYLES[variant]?.emptyState?.className
            )}
          >
            <PhosphorIcon
              size={18}
              className={cn(JOB_STAGE_STYLES[variant]?.emptyState?.className)}
              iconVariant={
                JOB_STAGE_STYLES[variant]?.iconProps
                  .iconVariant as PhosphorIconProps['iconVariant']
              }
            />
          </div>

          <Typography
            variant="body-strong"
            className={cn(
              'text-neutral-n-700',
              expanded ? 'visible opacity-100' : 'invisible opacity-0'
            )}
          >
            {JOB_STAGE_STYLES[variant]?.emptyState?.title || 'No jobs found'}
          </Typography>

          <Typography
            variant="caption"
            className={cn(
              'text-neutral-n-600 text-center w-[30%]',
              expanded ? 'visible opacity-100' : 'invisible opacity-0'
            )}
          >
            {JOB_STAGE_STYLES[variant]?.emptyState?.description ||
              'No jobs found in this stage.'}
          </Typography>

          {JOB_STAGE_STYLES[variant]?.title === 'Saved' && (
            <Button
              className="mt-4"
              variant="tertiary"
              label="Explore Jobs"
              onClick={() => (window.location.href = '/jobs')}
            />
          )}
        </div>
      </div>
    );

  return (
    <div
      className={cn(
        'rounded-2xl border-neutral-n-300 border flex flex-col w-full transition-all duration-200 ease origin-top bg-white',
        expanded ? 'min-h-[64px]' : 'max-h-[64px]'
      )}
      role="table"
      ref={el => {
        setTableHeight(el?.getBoundingClientRect().height || 0);
      }}
    >
      <SectionHeader
        hasDropdown={true}
        count={jobs.length}
        defaultState={'open'}
        onClickDropdown={onClickDropdown}
        title={JOB_STAGE_STYLES[variant].title}
        leftIconProps={JOB_STAGE_STYLES[variant].iconProps}
        className={cn('pb-0 pt-3 px-3', !expanded && 'pb-3')}
      />

      {jobs.length > 0 ? (
        <div
          className={cn(
            expanded ? 'visible opacity-100' : 'invisible opacity-0'
          )}
        >
          <TableHeader />
          <div role="rowgroup" className={cn('flex flex-col w-full')}>
            {jobs.map(job => (
              <JobRow
                element={job}
                key={job.jobId}
                onStatusChange={onStatusChange}
                onReactionChange={onReactionChange}
                onFavouriteChange={onFavoriteChange}
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'flex flex-col items-center justify-center w-full text-neutral-n-500 py-8',
            expanded ? 'visible opacity-100' : 'invisible opacity-0'
          )}
        >
          <div
            className={cn(
              'rounded-md group-hover:border-0 flex items-center justify-center h-6 w-6 mb-2',
              JOB_STAGE_STYLES[variant]?.emptyState?.className
            )}
          >
            <PhosphorIcon
              size={18}
              className={cn(JOB_STAGE_STYLES[variant]?.emptyState?.className)}
              iconVariant={
                JOB_STAGE_STYLES[variant]?.iconProps
                  .iconVariant as PhosphorIconProps['iconVariant']
              }
            />
          </div>

          <Typography
            variant="body-strong"
            className={cn(
              'text-neutral-n-700',
              expanded ? 'visible opacity-100' : 'invisible opacity-0'
            )}
          >
            {JOB_STAGE_STYLES[variant]?.emptyState?.title || 'No jobs found'}
          </Typography>

          <Typography
            variant="caption"
            className={cn(
              'text-neutral-n-600 text-center w-[30%]',
              expanded ? 'visible opacity-100' : 'invisible opacity-0'
            )}
          >
            {JOB_STAGE_STYLES[variant]?.emptyState?.description ||
              'No jobs found in this stage.'}
          </Typography>

          {JOB_STAGE_STYLES[variant]?.title === 'Saved' && (
            <Button
              className="mt-4"
              variant="tertiary"
              label="Explore Jobs"
              onClick={() => (window.location.href = '/jobs')}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default JobsTable;
