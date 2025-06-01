import React, { useState } from 'react';
import ExperienceForm from './ExperienceForm';
import { getQueryClient } from '@/lib/api/getQueryClient';

import { getExperiencesOptions } from '../api/queries/getExperiences';

import { ListItem } from '@workspace/ui/components/list-item/ListItem';
import SectionHeader from '@workspace/ui/components/section-header/SectionHeader';
import { AvatarCompany } from '@workspace/ui/components/avatar-company/AvatarCompany';

import EmptyState from '@/components/EmptyState';
import { EditExperiences } from './EditExperiencesPopup';
import { Button } from '@workspace/ui/components/button';
import AddExperiencePopup from './AddMoreExperiencesPopup';
import { useQuery, dehydrate, HydrationBoundary } from '@tanstack/react-query';

type ExperiencesProps = {};

export const Experiences = ({}: ExperiencesProps) => {
  const queryClient = getQueryClient();
  const [openAddExperienceModal, setOpenAddExperienceModal] = useState(false);
  const [openAddExperiencePopup, setOpenAddExperiencePopup] = useState(false);
  const [openEditExperienceModal, setOpenEditExperienceModal] = useState(false);

  const { data: experiences } = useQuery(getExperiencesOptions);

  if (!experiences) return null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col border rounded-[16px] border-neutral-300 overflow-clip bg-white">
        <SectionHeader
          count={
            experiences && experiences?.length > 0
              ? experiences?.length
              : undefined
          }
          title={'Your work experience'}
          leftIconProps={{
            className: 'text-blue-b-400',
            iconVariant: 'Briefcase_fill'
          }}
          rightButtonProps={{
            variant: 'tertiary',
            label:
              experiences && experiences?.length > 0
                ? 'Edit your experience'
                : 'Add your experience',
            leftIcon:
              experiences && experiences?.length > 0
                ? 'PencilSimple_fill'
                : 'PlusCircle_bold',
            onClick: () =>
              experiences && experiences?.length > 0
                ? setOpenEditExperienceModal(true)
                : setOpenAddExperienceModal(true)
          }}
          className="w-full"
        />

        {experiences && experiences?.length > 0 ? (
          experiences.map(experience => (
            <ListItem
              key={experience.id}
              title={experience.position_title}
              className="border-b border-neutral-300 last:border-b-0"
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
                <div className="py-4">
                  {experience.start_year} - {experience.end_year || 'Present'}
                </div>
              }
            />
          ))
        ) : (
          <EmptyState
            callToAction={
              <Button
                className="w-fit"
                variant="secondary"
                label="Add Experiences"
                onClick={() => setOpenAddExperienceModal(true)}
              />
            }
            title={'Tell us about your experiences.'}
            imageUrl="/images/empty-state-experiences.svg"
            description={
              'Increase visibility by letting recruiters know your achievements or if you’re open to work.'
            }
          />
        )}

        <div className="p-4">
          {experiences && experiences?.length > 0 && (
            <Button
              className="w-fit"
              variant="secondary"
              leftIcon="PlusCircle_bold"
              label="Add more experiences"
              onClick={() => setOpenAddExperienceModal(true)}
            />
          )}

          <ExperienceForm
            open={openAddExperienceModal}
            onOpenChange={setOpenAddExperienceModal}
            onOpenAddExperiencePopup={() => setOpenAddExperiencePopup(true)}
          />

          <EditExperiences
            open={openEditExperienceModal}
            onOpenChange={setOpenEditExperienceModal}
          />

          <AddExperiencePopup
            open={openAddExperiencePopup}
            onOpenChange={setOpenAddExperiencePopup}
            onOpenAddExperienceFormPopup={setOpenAddExperienceModal}
          />
        </div>
      </div>
    </HydrationBoundary>
  );
};
