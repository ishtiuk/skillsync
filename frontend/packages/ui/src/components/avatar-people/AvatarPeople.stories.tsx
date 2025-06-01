import type { Meta, StoryObj } from "@storybook/react";
import { AvatarPeople } from "./AvatarPeople";
import ProfileIMG from "@/public/images/people/user.png";

const meta = {
  title: "Components/Avatars/Avatar People",
  component: AvatarPeople,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AvatarPeople>;

export default meta;
type Story = StoryObj<typeof AvatarPeople>;

export const PeopleNoIMG: Story = {
  args: {
    size: "48px",
    color: "purple",
    avatarId: "kk",
    AvatarType: "img",
  },
};

export const PeopleWithIMG: Story = {
  args: {
    size: "64px",
    profileIMG: ProfileIMG,
    avatarId: "99",
    AvatarType: "img",
  },
};
