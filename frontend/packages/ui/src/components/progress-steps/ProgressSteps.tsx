import { cn } from '@/lib/utils';
import { Typography } from '../typography';
import { PhosphorIcon } from '@/icons/PhosphorIcon';

const PROGRESS_STEP_SHARED_STYLE_CLASS =
  'rounded-lg min-w-[224px] h-[125px] bg-neutral-n-300 grow basis-0 flex gap-1 flex-col items-center justify-center text-neutral-n-600';

export interface ProgressStepsProps {
  saved?: number;
  applied?: number;
  interview?: number;
  offer?: number;
  accepted?: boolean;
}
function ProgressSteps({
  saved = 0,
  applied = 0,
  interview = 0,
  offer = 0,
  accepted,
  ...props
}: ProgressStepsProps) {
  return (
    <div
      className={cn('flex items-center justify-stretch -space-x-3')}
      {...props}
    >
      <div
        className={cn(
          PROGRESS_STEP_SHARED_STYLE_CLASS,
          '[clip-path:polygon(0%_0%,_84%_0%,_100%_50%,_84%_100%,_0%_100%)]',
          saved > 0 ? 'text-blue-b-600 bg-blue-b-200' : ''
        )}
      >
        <Typography variant="heading-lg">
          {saved > 0 ? <>{saved}</> : '-'}
        </Typography>
        <Typography variant="body-strong">Saved</Typography>
      </div>
      <div
        className={cn(
          PROGRESS_STEP_SHARED_STYLE_CLASS,
          '[clip-path:polygon(84%_0%,_100%_50%,_84%_100%,_0%_100%,_15%_50%,_0%_0%)]',
          applied > 0 ? 'text-purple-p-600 bg-purple-p-200' : ''
        )}
      >
        <Typography variant="heading-lg">
          {applied > 0 ? <>{applied}</> : '-'}
        </Typography>
        <Typography variant="body-strong">Applied</Typography>
      </div>
      <div
        className={cn(
          PROGRESS_STEP_SHARED_STYLE_CLASS,
          '[clip-path:polygon(84%_0%,_100%_50%,_84%_100%,_0%_100%,_15%_50%,_0%_0%)]',
          interview > 0 ? 'text-orange-o-600 bg-orange-o-200' : ''
        )}
      >
        <Typography variant="heading-lg">
          {interview > 0 ? <>{interview}</> : '-'}
        </Typography>
        <Typography variant="body-strong">Interview</Typography>
      </div>
      <div
        className={cn(
          PROGRESS_STEP_SHARED_STYLE_CLASS,
          '[clip-path:polygon(84%_0%,_100%_50%,_84%_100%,_0%_100%,_15%_50%,_0%_0%)]',
          offer > 0 ? 'text-primary-g-600 bg-primary-g-200' : ''
        )}
      >
        <Typography variant="heading-lg">
          {offer > 0 ? <>{offer}</> : '-'}
        </Typography>
        <Typography variant="body-strong">
          Offer{offer === 1 ? '' : 's'}
        </Typography>
      </div>
      <div
        className={cn(
          PROGRESS_STEP_SHARED_STYLE_CLASS,
          '[clip-path:polygon(0_0%,_100%_0%,_100%_100%,_0%_100%,_15%_50%)]',
          accepted ? 'text-neutral-n-800 bg-gradient-rainbow-200' : ''
        )}
      >
        <PhosphorIcon iconVariant="Confetti_fill" size={48} />
        <Typography variant="body-strong">Hired</Typography>
      </div>
    </div>
  );
}

export { ProgressSteps };
