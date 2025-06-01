import { cn } from '@/lib/utils';
import { Typography } from '../typography';
import { useState } from 'react';
import { IconVariant, PhosphorIcon } from '@/icons/PhosphorIcon';

interface MigrateToProps {
  jobId: string;
  dropdown?: boolean;
  initialStage: JobStatus;
  dynamicJobStatuses?: string[];
  onStatusChange?: (status: JobStatus) => void;
}

// 6 states for the dropdown
export const jobStatuses = [
  'saved',
  'applied',
  'interview',
  'offer',
  'hired',
  'past-roles',
  'ineligible'
] as const;

// export type JobStatus = (typeof jobStatuses)[number] | `interview-${number}`;
export type JobStatus = (typeof jobStatuses)[number];

export const statusStyles = {
  saved: {
    title: 'Saved',
    background: 'group-hover:bg-blue-b-500',
    iconProps: {
      iconVariant: 'BookmarkSimple_fill' as IconVariant,
      className: 'fill-white group-hover:fill-white',
      selected: 'bg-blue-b-500'
    },
    style:
      'border-blue-b-300 bg-blue-b-200 text-blue-b-600 hover:border-blue-b-300 fill-blue-b-600 border-[2px] border-transparent',
    hover: 'hover:bg-blue-b-200',
    textHover: 'group-hover:text-blue-b-600',
    selected: 'bg-blue-b-200',
    text: 'text-blue-b-600',
    rank: 0
  },
  applied: {
    title: 'Applied',
    background: 'group-hover:bg-purple-p-500',
    iconProps: {
      iconVariant: 'PaperPlaneTilt_fill' as IconVariant,
      className: 'fill-white group-hover:fill-white',
      selected: 'bg-purple-p-500'
    },
    style:
      'border-purple-p-300 bg-purple-p-200 text-purple-p-600  hover:border-purple-p-300 fill-purple-p-600 border-[2px] border-transparent',
    hover: 'hover:bg-purple-p-100',
    textHover: 'group-hover:text-purple-p-500',
    selected: 'bg-purple-p-100',
    text: 'text-purple-p-500',
    rank: 1
  },
  interview: {
    title: 'Interview',
    background: 'group-hover:bg-orange-o-500',
    iconProps: {
      iconVariant: 'ChatCircleDots_fill' as IconVariant,
      className: 'fill-white group-hover:fill-white',
      selected: 'bg-orange-o-500'
    },
    style:
      'border-orange-o-300 bg-orange-o-200 text-orange-o-600 hover:border-orange-o-300 fill-orange-o-600 border-[2px] border-transparent',
    hover: 'hover:bg-orange-o-100',
    textHover: 'group-hover:text-orange-o-500',
    selected: 'bg-orange-o-100',
    text: 'text-orange-o-500',
    rank: 2
  },
  offer: {
    title: 'Offer',
    background: 'group-hover:bg-primary-g-500',
    iconProps: {
      iconVariant: 'SealCheck_fill' as IconVariant,
      className: 'fill-white group-hover:fill-white',
      selected: 'bg-primary-g-500'
    },
    style:
      'border-primary-g-300 bg-primary-g-200 text-primary-g-600 hover:border-primary-g-300 fill-primary-g-600 border-[2px] border-transparent',
    hover: 'hover:bg-primary-g-100',
    textHover: 'group-hover:text-primary-g-500',
    selected: 'bg-primary-g-100',
    text: 'text-primary-g-500',
    rank: 3
  },
  hired: {
    title: 'Hired',
    background: 'group-hover:bg-white',
    iconProps: {
      iconVariant: 'Confetti_fill' as IconVariant,
      className: 'group-hover:fill-black',
      selected: 'bg-white fill-black'
    },
    style:
      'border-red-r-300 bg-gradient-rainbow-200 text-neutral-n-800 border-[2px] border-transparent',
    hover: 'hover:bg-gradient-rainbow-200',
    selected: 'bg-gradient-rainbow-200',
    text: '',
    textHover: '',
    rank: 4
  },
  //   hired: {
  //     title: 'Hired',
  //     background: 'group-hover:bg-white',
  //     iconProps: {
  //       iconVariant: 'Confetti_fill' as IconVariant,
  //       className: 'group-hover:fill-black',
  //       selected: 'bg-white fill-black'
  //     },
  //     style: 'bg-white text-neutral-n-800 border-[2px] border-transparent',
  //     hover: 'hover:bg-white',
  //     selected: 'bg-white',
  //     text: '',
  //     textHover: '',
  //     rank: 4
  //   },
  'past-roles': {
    title: 'Past Roles',
    background: 'group-hover:bg-yellow-y-500',
    iconProps: {
      iconVariant: 'ClockCounterClockwise_regular' as IconVariant,
      className: 'fill-white group-hover:fill-white',
      selected: 'bg-yellow-y-500'
    },
    style:
      'bg-yellow-y-200 text-yellow-y-600 hover:border-yellow-y-300 fill-yellow-y-600 border-[2px] border-transparent',
    hover: 'hover:bg-yellow-y-100',
    textHover: 'group-hover:text-yellow-y-500',
    selected: 'bg-yellow-y-100',
    text: 'text-yellow-y-500',
    rank: 5
  },
  ineligible: {
    title: 'Ineligible',
    background: 'group-hover:bg-red-r-500',
    iconProps: {
      iconVariant: 'X_regular' as IconVariant,
      className: 'fill-white group-hover:fill-white',
      selected: 'bg-red-r-500'
    },
    style:
      'bg-red-r-200 text-red-r-600 hover:border-red-r-300 fill-red-r-600 border-[2px] border-transparent',
    hover: 'hover:bg-red-r-100',
    textHover: 'group-hover:text-red-r-500',
    selected: 'bg-red-r-100',
    text: 'text-red-r-500',
    rank: 6
  }
};

function MigrateTo({
  initialStage,
  jobId,
  onStatusChange,
  dropdown = true,
  dynamicJobStatuses
}: MigrateToProps) {
  const getInitialStage = () => {
    if (initialStage.startsWith('interview-')) {
      return initialStage.split('-')[0] as JobStatus;
    }

    return initialStage as JobStatus;
  };

  const [open, setOpen] = useState(dropdown ? false : true);
  const [jobStatus, setJobStatus] = useState<JobStatus>(getInitialStage());

  const getStatusStyle = (status: string) => {
    if (status.startsWith('interview-')) {
      return statusStyles['interview'];
    }

    return statusStyles[status as keyof typeof statusStyles];
  };

  const getOridanilityFromCardinality = (number: string) => {
    const ordinality = [
      '1st',
      '2nd',
      '3rd',
      '4th',
      '5th',
      '6th',
      '7th',
      '8th',
      '9th',
      '10th'
    ];
    return ordinality[parseInt(number) - 1];
  };

  const getStatusTitle = (status: string) => {
    if (status.startsWith('interview-')) {
      const interviewNumber = status.split('-')[1];
      return `${getOridanilityFromCardinality(interviewNumber)} Interview`;
    }

    return statusStyles[status as keyof typeof statusStyles]?.title;
  };

  const getStatus = (status: string) => {
    if (status.startsWith('interview-')) {
      return status.split('-')[0] as JobStatus;
    }

    return status as JobStatus;
  };

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const chooseStatus = (status: JobStatus) => {
    // setJobStatus(status);
    onStatusChange?.(status);
    if (dropdown) setOpen(false);
  };

  return (
    <div className="relative w-full">
      {dropdown && (
        <div
          onClick={handleClickOpen}
          className={cn(
            'inline-flex items-center justify-between h-10 w-full gap-1 py-2 px-2 rounded-[8px] transition-all cursor-pointer',
            statusStyles[jobStatus]?.style
          )}
        >
          <Typography variant="caption-strong" className="whitespace-nowrap">
            {statusStyles[jobStatus]?.title}
          </Typography>

          <PhosphorIcon iconVariant="CaretDown_bold" size={24} />
        </div>
      )}

      {open && (
        <div
          className={`w-full bg-white rounded-[8px] flex flex-col gap-3 transition-all ${
            dropdown
              ? `p-4 absolute top-12  shadow-customShadowFilter max-w-[220px] min-w-[220px] z-30`
              : `w-full`
          }`}
        >
          {dropdown && (
            <Typography
              variant="caption-strong"
              className="whitespace-nowrap text-neutral-n-600 mb-1"
            >
              Stage:
            </Typography>
          )}

          {dynamicJobStatuses?.length ? (
            dynamicJobStatuses.map((status, rank) => {
              const style = getStatusStyle(status);
              const title = getStatusTitle(status);

              return (
                <div
                  key={status}
                  onClick={() => chooseStatus(status as JobStatus)}
                  className={cn(
                    'flex group transition-all cursor-pointer items-center h-[40px]  justify-start p-2 gap-3 rounded-[8px]',
                    style.hover,
                    rank < statusStyles[jobStatus]?.rank && 'bg-neutral-n-100',
                    getStatus(status) === jobStatus && style.selected
                  )}
                >
                  <div className="relative">
                    <div
                      className={cn(
                        'rounded-md border-4 group-hover:border-0 flex items-center border-neutral-n-300 justify-center h-6 w-6',
                        rank < statusStyles[jobStatus]?.rank &&
                          'bg-neutral-n-300',
                        style.background,
                        getStatus(status) === jobStatus && 'border-0',
                        getStatus(status) === jobStatus &&
                          style.iconProps.selected
                      )}
                    >
                      <PhosphorIcon
                        className={cn(
                          style.iconProps.className,
                          rank > statusStyles[jobStatus]?.rank && 'fill-none',
                          rank < statusStyles[jobStatus]?.rank &&
                            'fill-neutral-n-600'
                        )}
                        iconVariant={style.iconProps.iconVariant}
                        size={18}
                      />
                    </div>
                  </div>
                  <Typography
                    variant="body"
                    className={cn(
                      'text-neutral-n-800',
                      style.textHover,
                      getStatus(status) === jobStatus && style.text
                    )}
                  >
                    {title}
                  </Typography>
                </div>
              );
            })
          ) : (
            <div
              className={cn(
                'flex items-center justify-center w-full h-[64px] text-neutral-n-500'
              )}
            >
              <PhosphorIcon
                size={24}
                className="fill-neutral-n-500"
                iconVariant="ArrowCircleRight_bold"
              />
              <p className="text-sm">No other stages available</p>
            </div>
          )}

          {/* {jobStatuses.map((status, rank) => (
            <div
              key={status}
              onClick={() => chooseStatus(status)}
              className={cn(
                'flex group transition-all cursor-pointer items-center h-[40px]  justify-start p-2 gap-3 rounded-[8px]',
                rank < statusStyles[jobStatus]?.rank && 'bg-neutral-n-100',
                statusStyles[status].hover,
                status === jobStatus && statusStyles[status].selected
              )}
            >
              <div className="relative">
                <div
                  className={cn(
                    'rounded-md border-4 group-hover:border-0 flex items-center border-neutral-n-300 justify-center h-6 w-6',
                    rank < statusStyles[jobStatus]?.rank && 'bg-neutral-n-300',
                    statusStyles[status].background,
                    status === jobStatus &&
                      statusStyles[status].iconProps.selected,
                    status === jobStatus && 'border-0'
                  )}
                >
                  <PhosphorIcon
                    className={cn(
                      statusStyles[status].iconProps.className,
                      rank < statusStyles[jobStatus]?.rank &&
                        'fill-neutral-n-600',
                      rank > statusStyles[jobStatus]?.rank && 'fill-none'
                    )}
                    iconVariant={statusStyles[status].iconProps.iconVariant}
                    size={18}
                  />
                </div>
              </div>
              <Typography
                variant="body"
                className={cn(
                  'text-neutral-n-800',
                  statusStyles[status].textHover,
                  status === jobStatus && statusStyles[status].text
                )}
              >
                {statusStyles[status].title}
              </Typography>
            </div>
          ))} */}
        </div>
      )}
    </div>
  );
}

export { MigrateTo };
