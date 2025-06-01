import type { Meta, StoryObj } from "@storybook/react";
import { CompanyCard } from "./CompanyCard";
import company from "@/public/images/company2.svg";
const meta = {
  title: "Components/Cards/CompanyCard",
  component: CompanyCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CompanyCard>;

export default meta;
type Story = StoryObj<typeof CompanyCard>;

export const Default: Story = {
  args: {
    companyName: "Company Name",
    companyId: "1",
    partner: false,
    pathwayTag: "conservation",
  },
};

export const TagMinimaze: Story = {
  args: {
    companyName: "Company Name",
    companyId: "1",
    list: "critical",
    partner: false,
    pathwayTag: "conservation",
    minimazeTag: true,
  },
};

export const ListStatus: Story = {
  args: {
    companyName: "Carbon Collective",
    companyId: "1",
    list: "BIPOCOwned",
    partner: false,
    pathwayTag: "conservation",
    logoCompany: company,
    noLogo: false,
  },
};

export const Partner: Story = {
  args: {
    companyName: "The Sunrise Project",
    companyId: "1",
    partner: true,
    pathwayTag: "conservation",
    logoCompany: company,
    noLogo: false,
  },
};

export const Jobs: Story = {
  args: {
    companyName: "The Sunrise Project",
    companyId: "1",
    partner: true,
    pathwayTag: "energy",
    QuantityJobs: "10",
    logoCompany: company,
    noLogo: false,
  },
};
