import type { Meta, StoryObj } from "@storybook/react";
import { AvatarCompany } from "./AvatarCompany";
import Company from "@/public/images/example.png";

const meta = {
  title: "Components/Avatars/Avatar Company",
  component: AvatarCompany,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AvatarCompany>;

export default meta;
type Story = StoryObj<typeof AvatarCompany>;

export const AvatarWithNoImg: Story = {
  args: {
    size: "48px",
    avatarId: "0",
    AvatarType: "alt",
    color: "blue",
  },
};

export const CompanyAvatarWithImg: Story = {
  args: {
    size: "128px",
    avatarId: "kk",
    AvatarType: "2",
    profileIMG: Company,
    className: "bg-white",
  },
};
