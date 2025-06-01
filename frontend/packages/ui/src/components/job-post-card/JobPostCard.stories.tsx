import type { Meta, StoryObj } from "@storybook/react";
import company from "@/public/images/company2.svg";
import { JobPostCard } from "./JobPostCard";

const meta = {
  title: "Components/Cards/JobPostCard",
  component: JobPostCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof JobPostCard>;

export default meta;
type Story = StoryObj<typeof JobPostCard>;

export const Default: Story = {
  args: {
    companyName: "Company Name",
    jobPostId: "test-job-id",
    jobPostName: "Job Post Name",
    workplace: "onsite",
    jobType: "full_time",
    pathway: "agriculture",
    logoVariant: "default",
  },
};

export const Featured: Story = {
  args: {
    companyName: "Company Name",
    jobPostId: "test-job-id",
    jobPostName: "Job Post Name",
    workplace: "onsite",
    jobType: "full_time",
    pathway: "media",
    badge: "featured",
  },
};

export const BIPOCOwned: Story = {
  args: {
    companyName: "Yellowstone to Yukon Conservation Initiative (Y2Y)",
    jobPostId: "test-job-id",
    jobPostName: "Job Post Name",
    workplace: "onsite",
    jobType: "full_time",
    pathway: "energy",
    badge: "bipoc",
  },
};

export const ClosingSoon: Story = {
  args: {
    companyName: "Company Name",
    jobPostId: "test-job-id",
    jobPostName: "Job Post Name",
    workplace: "remote",
    jobType: "internship",
    pathway: "energy",
    badge: "closing",
  },
};

export const CompanyIconLogoLetter: Story = {
  args: {
    companyName: "Company Name",
    jobPostId: "test-job-id",
    jobPostName: "Job Post Name",
    workplace: "onsite",
    jobType: "full_time",
    pathway: "energy",
    badge: "closing",

    logoLetter: true,
    logoVariant: "blue",
  },
};

export const CompanyIconLogoIMG: Story = {
  args: {
    companyName: "Yellowstone to Yukon Conservation Initiative (Y2Y)",
    jobPostId: "test-job-id",
    jobPostName: "Job Post Name",
    workplace: "onsite",
    jobType: "full_time",
    pathway: "energy",
    badge: "closing",
    logoVariant: "default",
    companyLogo: company,
  },
};
