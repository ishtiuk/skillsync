import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "./Button";
import { PhosphorIconList } from "@/icons/PhosphorIcon";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  //   argTypes: {
  //     leftIcon: {
  //       control: {
  //         type: "select",
  //         options: Object.keys(PhosphorIconList).map((icon) => `${icon}_bold`), // Adjust as needed
  //       },
  //     },
  //     rightIcon: {
  //       control: {
  //         type: "select",
  //         options: Object.keys(PhosphorIconList).map((icon) => `${icon}_bold`), // Adjust as needed
  //       },
  //     },
  //   },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const PrimaryLarge: Story = {
  args: { label: "Primary Button", size: "large" },
};

export const PrimaryDefault: Story = {
  args: { label: "Primary Button" },
};

export const Secondarylarge: Story = {
  args: { label: "Secondary Button", variant: "secondary", size: "large" },
};

export const SecondaryDefault: Story = {
  args: { label: "Secondary Button", variant: "secondary" },
};

export const TertiaryLarge: Story = {
  args: { label: "Tertiary Button", variant: "tertiary", size: "large" },
};

export const TertiaryDefault: Story = {
  args: { label: "Tertiary Button", variant: "tertiary" },
};

export const PrimaryLargeWithIconLeft: Story = {
  args: { label: "Primary Button", leftIcon: "Export_bold", size: "large" },
};

export const PrimaryDefaultWithIconLeft: Story = {
  args: { label: "Primary Button", leftIcon: "Export_bold" },
};

export const PrimaryLargeWithIconRight: Story = {
  args: { label: "Primary Button", rightIcon: "Export_bold", size: "large" },
};

export const PrimaryDefaultWithIconRight: Story = {
  args: { label: "Primary Button", rightIcon: "Export_bold" },
};
