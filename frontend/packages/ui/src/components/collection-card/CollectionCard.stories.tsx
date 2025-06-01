import type { Meta, StoryObj } from "@storybook/react";
import { CollectionCard, CollectionCardData } from "./CollectionCard";
import logo from "@/public/images/stack.png";
import User from "@/public/images/people/user.png";
const data: CollectionCardData[] = [
  {
    logo: [logo, logo, logo],
    label: "Collection Title",
    quantity: "5",
    badges: ["energy", "conservation"],
    stackAvatar: "company",
    stackText: "Companies Featured",
    jobs: "12",
    colorText: "text-black",
  },
  {
    logo: [User, logo, logo, User],
    label: "Text Text Text",
    quantity: "5",
    badges: ["energy"],
    stackAvatar: "company",
    stackText: "Companies Featured",
    jobs: "12",
    colorText: "text-white",
  },
  {
    logo: [User, User],
    label: "Text Text Text",
    quantity: "5",
    badges: ["energy"],
    stackAvatar: "jobseeker",
    stackText: "Companies Featured",
    jobs: "12",
    colorText: "text-white",
  },
];

const data2: CollectionCardData[] = [
  {
    logo: [logo, logo, logo],
    label: "Future Discovery",
    quantity: "5",
    badges: ["energy", "conservation"],
    stackAvatar: "company",
    stackText: "Companies Featured",
    jobs: "12",
    colorText: "text-white",
    gradient: "gradient-blue-b100",
  },
  {
    logo: [User, logo, logo, User],
    label: "Planet-wide Solutions",
    quantity: "5",
    badges: ["energy"],
    stackAvatar: "company",
    stackText: "Companies Featured",
    jobs: "12",
    colorText: "text-white",
    gradient: "gradient-purple-P300",
  },
  {
    logo: [User],
    label: "Planet-wide Solutions",
    quantity: "120",
    badges: ["sports"],
    stackAvatar: "jobseeker",
    stackText: "Curated by ",
    jobs: "12",
    colorText: "text-white",
    gradient: "gradient-red-r200",
  },
];
const meta = {
  title: "Components/Cards/CollectionCard",
  component: CollectionCard,

  tags: ["autodocs"],
} satisfies Meta<typeof CollectionCard>;

export default meta;
type Story = StoryObj<typeof CollectionCard>;

export const Default: Story = {
  args: { data: data },
};

export const Gradient: Story = {
  args: { data: data2 },
};
