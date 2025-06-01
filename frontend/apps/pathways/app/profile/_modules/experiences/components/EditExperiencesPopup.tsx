import React, { useState } from 'react';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { getExperiencesOptions } from '../api/queries/getExperiences';
import { ListItem } from '@workspace/ui/components/list-item/ListItem';
import { dehydrate, HydrationBoundary, useQuery } from '@tanstack/react-query';
import { AvatarCompany } from '@workspace/ui/components/avatar-company/AvatarCompany';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent
} from '@workspace/ui/components/dialog/Dialog';
import ExperienceForm from './ExperienceForm';
import DeleteExperiencePopup from './DeleteExperiencePopup';
import { Typography } from '@workspace/ui/components/typography';

export const EditExperiences = ({
  open,
  onOpenChange
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const queryClient = getQueryClient();
  const { data: experiences } = useQuery(getExperiencesOptions);
  const [openAddExperienceModal, setOpenAddExperienceModal] = useState(false);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
          <DialogHeader className="mt-12">
            <DialogTitle>
              <Typography variant="heading-md" className="text-primary-g-900">
                Edit your experience
              </Typography>
            </DialogTitle>
          </DialogHeader>
          {experiences && experiences?.length > 0 ? (
            experiences.map(experience => (
              <ListItem
                key={experience.id}
                title={experience.position_title}
                className="border-b border-neutral-300 last:border-b-0 p-0"
                subTitle={`${experience.company_name} • ${experience.employment_type}`}
                ContentImage={
                  <AvatarCompany
                    size="32px"
                    color={'blue'}
                    profileIMG={''}
                    AvatarType="alt"
                    avatarId={experience.id}
                    companyName={experience.company_name}
                  />
                }
                ListItemRight={
                  <div className="py-4 flex justify-between w-full flex-grow items-center">
                    <Typography variant="body">
                      {experience.start_year} -{' '}
                      {experience.end_year || 'Present'}
                    </Typography>
                    <div className="flex items-center ml-8 gap-2">
                      <div className="bg-neutral-n-200 rounded-full p-2">
                        <ExperienceForm isEditing={true} data={experience} />
                      </div>

                      <DeleteExperiencePopup id={experience.id} />
                    </div>
                  </div>
                }
              />
            ))
          ) : (
            <Typography variant="body" className="text-neutral-n-600 ml-0.5">
              No experiences added yet.
            </Typography>
          )}
        </DialogContent>
      </Dialog>
    </HydrationBoundary>
  );
};
