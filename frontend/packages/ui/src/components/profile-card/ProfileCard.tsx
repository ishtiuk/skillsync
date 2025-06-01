/* eslint-disable prettier/prettier */
import React from 'react';
import { Tag } from '../tag/Tag';
import { Typography } from '../typography';

interface ProfileCardProps {
  label: string;
  content: string;
}

const ProfileCard = ({ label, content }: ProfileCardProps) => {
  return (
    <div className="flex flex-col p-4 gap-4 rounded-2xl bg-neutral-n-200 items-start justify-between self-stretch h-44 grow basis-0">
      <Tag className="bg-transparent-t-50 bl">{label}</Tag>
      <Typography variant="heading-sm">{content}</Typography>
    </div>
  );
};

export default ProfileCard;
