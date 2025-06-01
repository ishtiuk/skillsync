/* eslint-disable prettier/prettier */
import React from 'react';
import { Typography } from '../typography';
import { PhosphorIcon } from '@/icons/PhosphorIcon';
import { Tag } from '../tag';
import { IndustryTag } from '../industry-tag';
import { IndustryType, industryTypes } from '../industry-tag/IndustryTag';
import { JobCategory, JobCategoryTag } from '../job-category-tag/JobCategoryTag';

interface OverviewCardProps {
    industry: IndustryType;
    jobType: JobCategory;
    salary: string;
    education: string;
    level: string;
    city: string;
    state: string;
    workplace: string;
}

const OverviewCard: React.FC<OverviewCardProps> = ({
    industry,
    jobType,
    salary,
    education,
    level,
    city,
    state,
    workplace
}) => {
    return (
        <div className="flex flex-col items-start self-stretch w-full bg-white border border-neutral-n-300 rounded-[16px]">
            <div className="flex justify-start items-center px-6 py-4 gap-2 self-stretch">
                <PhosphorIcon iconVariant="Briefcase_fill" className='fill-neutral-n-500' />
                <Typography variant="body-strong">Overview</Typography>
            </div>
            <div className='flex flex-col px-6 py-4 gap-2 items-start self-stretch'>
                <div className="flex items-center justify-between w-full pb-3 border-b border-neutral-n-100">
                    <Typography variant="caption">Industry</Typography>
                    <IndustryTag industryType={industry} />
                </div>
                <div className="flex items-center justify-between w-full pb-3 border-b border-neutral-n-100">
                    <Typography variant="caption">Job Type</Typography>
                    <JobCategoryTag variant={jobType} />
                </div>
                <div className="flex items-center justify-between w-full pb-3 border-b border-neutral-n-100">
                    <Typography variant="caption">Salary</Typography>
                    <Tag label={salary} />
                </div>
                <div className="flex items-center justify-between w-full pb-3 border-b border-neutral-n-100">
                    <Typography variant="caption">Education</Typography>
                    <Tag label={education} />
                </div>
                <div className="flex items-center justify-between w-full pb-3 border-b border-neutral-n-100">
                    <Typography variant="caption">Level</Typography>
                    <Tag label={level} />
                </div>
                <div className="flex items-center justify-between w-full pb-3 border-b border-neutral-n-100">
                    <Typography variant="caption">Location</Typography>
                    <div className="flex gap-3">
                        <Tag label={city} />
                        <Tag label={state} />
                    </div>
                </div>
                <div className="flex items-center justify-between w-full pb-3 border-b border-neutral-n-100">
                    <Typography variant="caption">Workplace</Typography>
                    <Tag label={workplace} />
                </div>
            </div>
        </div>
    );
};

export { OverviewCard };
export type { OverviewCardProps };
