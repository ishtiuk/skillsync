import type { Meta, StoryObj } from "@storybook/react";
import { JobNoteCard } from "./JobNoteCard";
import People from "@/public/images/people/Female2.svg";

const meta = {
  title: "Components/Cards/JobNoteCard",
  component: JobNoteCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof JobNoteCard>;

export default meta;
type Story = StoryObj<typeof JobNoteCard>;

export const Default: Story = {
  args: {
    variant: "building-paths",
    title: "How to prep for your first interview.",
    size: "large",
    JobNoteCardId: "1",
    author: "Myna A.",
    profileIMG: People,
  },
};

export const TheSearch: Story = {
  args: {
    variant: "the-search",
    title: "How to prep for your first interview.",
    size: "large",
    JobNoteCardId: "1",
    author: "Myna A.",
    profileIMG: People,
  },
};

export const GrowthMindset: Story = {
  args: {
    variant: "growth-mindset",
    title: "How to prep for your first interview.",
    size: "large",
    JobNoteCardId: "1",
    author: "Myna A.",
    save: true,
    profileIMG: People,
  },
};

export const SkillBuilding: Story = {
  args: {
    variant: "skill-building",
    title: "How to prep for your first interview.",
    size: "large",
    JobNoteCardId: "1",
    author: "Myna A.",
    save: true,
    profileIMG: People,
  },
};

export const PrepTalk: Story = {
  args: {
    variant: "prep-talk",
    title: "How to prep for your first interview.",
    size: "large",
    JobNoteCardId: "1",
    author: "Myna A.",
    save: true,
    profileIMG: People,
  },
};

export const WriteYourStory: Story = {
  args: {
    variant: "write-your-story",
    title: "How to prep for your first interview.",
    size: "large",
    JobNoteCardId: "1",
    author: "Myna A.",
    save: true,
    profileIMG: People,
  },
};
