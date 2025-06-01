import type { Meta, StoryObj } from "@storybook/react";

import Company from "@/public/images/company2.svg";

import User from "@/public/images/people/user.png";
import { AvatarStack } from "./AvatarStack";

const meta = {
  title: "Components/Avatars/Avatar Stack",
  component: AvatarStack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AvatarStack>;

export default meta;
type Story = StoryObj<typeof AvatarStack>;

export const CompanyStack: Story = {
  args: {
    size: "default",
    label: "Text string",
    quantity: "51",
    type: "company",
    logo: [Company],
  },
};

export const TwoPeopleStack: Story = {
  args: {
    size: "default",
    label: "Text string",
    quantity: "51",
    type: "jobseeker",
    logo: [User, User],
  },
};

export const TwoCompanyStack: Story = {
  args: {
    size: "default",
    label: "Text string",
    quantity: "51",
    type: "company",
    logo: [Company, Company],
  },
};
export const MoreThan3PeopleStack: Story = {
  args: {
    size: "default",
    label: "Text string",
    quantity: "51",
    type: "jobseeker",
    logo: [User, User, User, User],
  },
};

export const MoreThan3CompanyStack: Story = {
  args: {
    size: "large",
    label: "Text string",
    quantity: "51",
    type: "company",
    logo: [Company, Company, Company, Company],
  },
};
