import type { Meta, StoryObj } from "@storybook/react";
import Company from "@/public/images/cards/agriculture.png";
import { CardTemplate } from "./CardTemplate";

const meta = {
  title: "Components/Cards/CardTemplate",
  component: CardTemplate,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CardTemplate>;

export default meta;
type Story = StoryObj<typeof CardTemplate>;

export const Default: Story = {
  args: {
    title: "Title Card",
    text: "Text Card",
    cardIMG: Company,
  },
};
