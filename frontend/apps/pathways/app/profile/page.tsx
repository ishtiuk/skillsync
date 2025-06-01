'use client';
import { ReactElement, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Files } from './_modules/files/components/Files';
import { Typography } from '@workspace/ui/components/typography';
import { NavigationPageWrapper } from '@workspace/ui/components/navigation-page-wrapper';

import { cn } from '@workspace/ui/lib/utils';
import { Tag } from '@workspace/ui/components/tag';
import { Goals } from './_modules/goals/components/Goals';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { Button } from '@workspace/ui/components/button';
import SocialsForm from './_modules/common/components/SocialsForm';
import SummaryForm from './_modules/common/components/SummaryForm';
import ContactInfoForm from './_modules/common/components/ContactInfoForm';
import ShareProfilePopup from './_modules/common/components/ShareProfilePopup';
import ProfilePhotoPopup from './_modules/profile-photo/components/ProfilePhotoPopup';
import { Experiences } from './_modules/experiences/components/Experiences';
import BackgroundPhotoPopup from './_modules/common/components/BackgroundPhotoPopup';

import useProfile from '@/hooks/useProfile';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { navigationItems } from '@/lib/constants/navigationItems';
import Loader from '@workspace/ui/components/loader/Loader';
import Skills from '../onboarding/_modules/components/Skills';
import { IconButton } from '@workspace/ui/components/icon-button/IconButton';
import { AvatarPeople } from '@workspace/ui/components/avatar-people/AvatarPeople';
import { typographyVariants } from '@workspace/ui/components/typography/Typography';

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent
} from '@workspace/ui/components/dialog/Dialog';

export default function ProfilePage(): ReactElement {
  const router = useRouter();
  const queryClient = getQueryClient();
  const [runSubmit, setRunSubmit] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [openSkillsFormDialog, setOpenSkillsFormDialog] = useState(false);
  const [openSummaryFormDialog, setOpenSummaryFormDialog] = useState(false);
  const [openProfilePhotoPopup, setOpenProfilePhotoPopup] = useState(false);
  const [openShareProfilePopup, setOpenShareProfilePopup] = useState(false);
  const [openBackgroundPhotoPopup, setOpenBackgroundPhotoPopup] =
    useState(false);

  const {
    userData,
    isLoading,
    profilePhoto: presignedProfilePhoto
  } = useProfile();

  const [backgroundPhoto, setBackgroundPhoto] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const onLogout = () => {
    sessionStorage.clear();
    window.location.href = '/login/existing-user';
  };

  useEffect(() => {
    if (userData && userData?.skills?.length > 0) {
      setSkills(userData?.skills);
    }
  }, [userData]);

  if (isLoading) return <Loader />;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NavigationPageWrapper
        items={navigationItems}
        onClickCustom={onLogout}
        profile={sessionStorage.getItem('profilePhoto') || ''}
      >
        <div
          data-testid="profile-background"
          className="h-64 p-12 flex flex-row gap-x-4 justify-end relative z-10"
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundImage: `url('${userData?.background_image_url ?? '/images/backgrounds/nature-01.png'}')`
          }}
        >
          <IconButton
            variant={'tertiary'}
            iconVariant="PencilSimpleLine_fill"
            onClick={() => setOpenBackgroundPhotoPopup(true)}
          />

          <IconButton
            variant={'tertiary'}
            iconVariant="UploadSimple_bold"
            onClick={() => setOpenShareProfilePopup(true)}
          />

          <BackgroundPhotoPopup
            data={userData ?? null}
            open={openBackgroundPhotoPopup}
            setBackgroundImage={setBackgroundPhoto}
            onOpenChange={setOpenBackgroundPhotoPopup}
            backgroundImage={userData?.background_image_url ?? ''}
          />

          <ShareProfilePopup
            open={openShareProfilePopup}
            onOpenChange={setOpenShareProfilePopup}
          />
        </div>

        <div
          data-testid="profile-content"
          className="bg-white relative -top-20 px-12 flex flex-col align-items-start align-self-stretch gap-3 py-6 -mb-20"
        >
          <div
            className={cn(
              'relative h-32 w-32 flex justify-center items-center z-20'
            )}
          >
            <div className="rounded-full border-[6px] border-white w-[128px] h-[128px] flex justify-center items-center box-content">
              <AvatarPeople
                size="128px"
                color="purple"
                avatarId="profile-picture"
                profileIMG={
                  profilePhoto ||
                  sessionStorage.getItem('profilePhoto') ||
                  undefined
                }
              />
            </div>

            <ProfilePhotoPopup
              open={openProfilePhotoPopup}
              setProfilePhoto={setProfilePhoto}
              onOpenChange={setOpenProfilePhotoPopup}
              profilePhoto={sessionStorage.getItem('profilePhoto')}
            />
          </div>

          <div className="flex flex-row items-center gap-2">
            <Typography variant="heading-lg">
              {userData?.first_name} {userData?.last_name}
            </Typography>

            <Tag
              minimaze={false}
              className="bg-blue-b-100 border-blue-b-100 text-blue-b-500 border-2 rounded-[23px] p-2 flex gap-2"
              TypographyProps={{ variant: 'caption-strong' }}
            >
              <Typography variant="caption-strong" className="font-bold">
                🎓 {userData?.current_career}
              </Typography>
            </Tag>
          </div>

          <div className="flex gap-1 align-self-stretch align-items-center">
            <Typography variant="body" className="text-neutral-n-600">
              {userData?.city && `${userData?.city}, `}
              {userData?.state && `${userData?.state}, `}
              {userData?.country && `${userData?.country} • `}
            </Typography>

            {!userData?.city && !userData?.country && !userData?.state && (
              <Typography variant="body" className="text-neutral-500">
                Add your information •
              </Typography>
            )}

            <ContactInfoForm />
          </div>

          <div className="flex flex-row items-center">
            {userData?.instagram_url ||
            userData?.linkedin_url ||
            userData?.x_twitter_url ||
            userData?.facebook_url ||
            userData?.personal_website_url ? (
              <div className="flex gap-4 mr-4">
                {!!userData?.facebook_url && (
                  <a
                    href={userData?.facebook_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="/images/socials/facebook-icon.svg"
                      alt="facebook"
                      width={18}
                      height={18}
                    />
                  </a>
                )}
                {!!userData?.linkedin_url && (
                  <a
                    href={userData.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="/images/socials/linkedin-icon.svg"
                      alt="linkedin"
                      width={18}
                      height={18}
                    />
                  </a>
                )}
                {!!userData?.instagram_url && (
                  <a
                    href={userData?.instagram_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="/images/socials/instagram-icon.svg"
                      alt="instagram"
                      width={18}
                      height={18}
                    />
                  </a>
                )}
                {!!userData?.x_twitter_url && (
                  <a
                    href={userData.x_twitter_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="/images/socials/x-icon.svg"
                      alt="twitter"
                      width={18}
                      height={18}
                    />
                  </a>
                )}
                {!!userData?.personal_website_url && (
                  <a
                    href={userData.personal_website_url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src="/images/socials/personal-website-icon.svg"
                      alt="website"
                      width={18}
                      height={18}
                    />
                  </a>
                )}
              </div>
            ) : null}

            <SocialsForm />
          </div>

          <div className="flex pt-6 pr-6 relative items-center self-stretch gap-4 w-full justify-between rounded-2xl bg-white">
            <div className="w-full flex justify-between bg-purple-p-100 rounded-2xl p-6 h-[200px]">
              <div
                className={`overflow-auto w-full flex flex-col items-start gap-2 ${
                  !!!userData?.career_summary && 'mt-3'
                }`}
              >
                <div className="flex justify-between w-full items-center">
                  <Typography variant="body-strong">
                    {!!userData?.career_summary
                      ? 'Your Summary'
                      : 'Add a summary about yourself'}
                  </Typography>

                  {!!userData?.career_summary && (
                    <Button
                      size="default"
                      variant="tertiary"
                      label="Edit your summary"
                      leftIcon={'PencilSimpleLine_fill'}
                      onClick={() => setOpenSummaryFormDialog(true)}
                      className="flex px-3 py-4 justify-center items-center gap-1 bg-transparent rounded-[48px] border-none"
                    />
                  )}
                </div>

                <Typography
                  variant="caption"
                  className={`${!!!userData?.career_summary && `w-[80%]`}`}
                >
                  {!!userData?.career_summary
                    ? userData?.career_summary
                    : ' Tell your career story, and show recruiters what you’re made of!'}
                </Typography>

                {!userData?.career_summary && (
                  <Button
                    size="default"
                    variant="tertiary"
                    label="Write Your Story"
                    onClick={() => setOpenSummaryFormDialog(true)}
                    className="-ml-1 mt-1"
                  >
                    {typographyVariants['caption-strong']}
                  </Button>
                )}
              </div>

              {!userData?.career_summary && (
                <Image
                  width={166}
                  height={138}
                  alt="decorative-bio-image"
                  src="/images/bio-section-image.svg"
                />
              )}
            </div>

            <div className="w-full flex justify-between bg-neutral-n-100 rounded-2xl p-6 h-[200px]">
              <div
                className={`overflow-auto w-full flex flex-col items-start gap-2 ${
                  skills.length === 0 && 'mt-3'
                }`}
              >
                <div className="flex justify-between w-full items-center">
                  <Typography variant="body-strong">
                    {skills.length > 0 ? 'Skills' : 'Add your skills'}
                  </Typography>

                  {skills.length > 0 && (
                    <Button
                      size="default"
                      variant="tertiary"
                      label="Edit skills"
                      leftIcon={'PencilSimpleLine_fill'}
                      onClick={() => setOpenSkillsFormDialog(true)}
                      className="flex px-3 py-4 justify-center items-center gap-1 bg-transparent rounded-[48px] border-none"
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 overflow-auto">
                  {skills.length > 0 ? (
                    skills.map(skill => (
                      <Tag
                        key={skill}
                        minimaze={false}
                        TypographyProps={{ variant: 'caption' }}
                        className="bg-neutral-n-200 text-neutral-n-800 border-2 rounded-[8px] p-2 flex gap-2"
                      >
                        <Typography variant="caption" className="font-medium">
                          {skill}
                        </Typography>
                      </Tag>
                    ))
                  ) : (
                    <Typography
                      variant="caption"
                      className={` ${skills.length === 0 && `w-[80%]`}`}
                    >
                      {
                        'Quickly add relevant skills to your profile, showcasing your expertise to help you stand out in a competitive landscape.'
                      }
                    </Typography>
                  )}
                </div>

                {skills.length === 0 && (
                  <Button
                    size="default"
                    variant="tertiary"
                    label="Add Skills"
                    className="-ml-1 mt-1"
                    onClick={() => setOpenSkillsFormDialog(true)}
                  >
                    {typographyVariants['caption-strong']}
                  </Button>
                )}
              </div>

              {skills.length === 0 && (
                <div className="absolute right-0 bottom-0">
                  <Image
                    width={130}
                    height={130}
                    alt="decorative-skills-image"
                    src="/images/skills-section-image.svg"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className="bg-neutral-100 flex flex-col gap-12 px-12 py-12"
          data-testid="application-data"
        >
          <Goals />
          <Experiences />
          <Files />
        </div>

        <SummaryForm
          open={openSummaryFormDialog}
          onOpenChange={setOpenSummaryFormDialog}
        />

        <Dialog
          open={openSkillsFormDialog}
          onOpenChange={setOpenSkillsFormDialog}
        >
          <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
            <DialogHeader className="mt-12">
              <DialogTitle>
                <Typography variant="heading-md" className="text-primary-g-900">
                  Add skills
                </Typography>
              </DialogTitle>
            </DialogHeader>

            <Skills
              onboarding={false}
              runSubmit={runSubmit}
              setRunSubmit={setRunSubmit}
              onOpenChange={setOpenSkillsFormDialog}
            />

            <DialogFooter className="sm:justify-end mt-8">
              <DialogClose asChild>
                <Button type="button" variant="tertiary" label="Cancel" />
              </DialogClose>

              <Button
                type="button"
                variant="primary"
                label="Add Skill"
                onClick={() => setRunSubmit(true)}
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </NavigationPageWrapper>
    </HydrationBoundary>
  );
}
