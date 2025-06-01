import Link from 'next/link';
import { Card, CardContent } from '../card/Card';
import { Typography } from '../typography';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export type PathwayCardType =
  | 'agriculture'
  | 'conservation'
  | 'construction'
  | 'education'
  | 'energy'
  | 'finance'
  | 'forestry'
  | 'manufacturing'
  | 'medical'
  | 'policy'
  | 'real-estate'
  | 'research'
  | 'sports'
  | 'technology'
  | 'tourism'
  | 'transportation'
  | 'urban-planning'
  | 'water'
  | 'waste-management'
  | 'arts-culture';

const industryTypeLabelMap: Record<PathwayCardType, string> = {
  agriculture: 'Agriculture',
  conservation: 'Conservation',
  construction: 'Construction',
  energy: 'Energy',
  education: 'Education',
  finance: 'Finance',
  forestry: 'Forestry',
  manufacturing: 'Manufacturing',
  'arts-culture': 'Arts & Culture',
  'real-estate': 'Real Estate',
  medical: 'Medical',
  policy: 'Policy',
  research: 'Research',
  sports: 'Sports',
  tourism: 'Tourism',
  transportation: 'Transportation',
  technology: 'Technology',
  'urban-planning': 'Urban Planning',
  'waste-management': 'Waste Management',
  water: 'Water'
};

interface PathwayCardProps extends React.HTMLAttributes<HTMLDivElement> {
  url?: string;
  jobs?: number;
  pathwayId?: string;
  variant?: PathwayCardType;
}

function PathwayCard({
  jobs,
  pathwayId,
  className,
  url = '/jobs',
  variant = 'agriculture'
}: PathwayCardProps) {
  return (
    <Link href={url} key={variant}>
      <Card
        size="small"
        key={`job-${pathwayId}`}
        className={cn(
          ` ${className}`,
          'relative flex flex-col justify-center items-center p-4'
        )}
      >
        <CardContent className="p-0 text-center">
          <div className="mb-5 flex items-center justify-center">
            <Image
              src={`/images/cards/${variant}.png`}
              alt={industryTypeLabelMap[variant]}
              width={104}
              height={104}
            />
          </div>
          <Typography
            variant="body-strong"
            className="truncate mb-0 overflow-hidden max-w-[135px] ml-auto mr-auto"
          >
            {industryTypeLabelMap[variant]}
          </Typography>
          <Typography variant="caption-strong" className="truncate">
            {jobs === 0 ? 'No' : jobs}{' '}
            <span>{jobs === 1 ? 'Job' : 'Jobs'}</span>
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export { PathwayCard };
