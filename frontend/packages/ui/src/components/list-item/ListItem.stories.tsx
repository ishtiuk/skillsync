import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ListItem, ListItemProps } from "./ListItem";
import { AvatarCompany } from "../avatar-company/AvatarCompany";
import User from "@/public/images/people/user.png";
import { AvatarStack } from "../avatar-stack/AvatarStack";
import { Badge } from "../badges/badge/Badge";
import { Button } from "../button";

const ParentContainer: React.FC<ListItemProps> = (props) => {
  return (
    <div className="border border-neutral-n-400 w-[520px]">
      <ListItem {...props} />
    </div>
  );
};

const meta = {
  title: "Components/ListItem",
  component: ParentContainer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ListItem>;
export default meta;

type Story = StoryObj<typeof ListItem>;

const TestButton = <Button variant="secondary" size="default" label={"Apply Now"} />;
const TestButton2 = <Button variant="tertiary" size="default" label={"Explore More"} />;

export const Default: Story = {
  args: {
    title: "Product Manager of Environmental Works",
    subTitle: "Some company title",
    header: "Jan 30",
    footer: "Some footer text",
  },
};

export const ListItemWithCompanyImage: Story = {
  args: {
    title: "Product Manager of Environmental Works",
    subTitle: "Some company title",
    header: "Jan 30",
    footer: "40 people viewed",
    ContentImage: <AvatarCompany size={"48px"} avatarId={""} />,
  },
};

export const ListItemWithRightSide: Story = {
  args: {
    title: "Product Manager of Environmental Works",
    subTitle: "Some company title",
    header: "Jan 30",
    footer: "Some footer text",
    ContentImage: <AvatarCompany size={"48px"} avatarId={""} />,
    ListItemRight: TestButton,
  },
};

export const ListItemWithFooterImage: Story = {
  args: {
    title: "Product Manager of Environmental Works",
    subTitle: "Some company title",
    header: "Jan 30",
    footer: (
      <AvatarStack
        size="default"
        label="Applicants Applied"
        quantity={"40"}
        logo={[User, User, User, User]}
        type="jobseeker"
      />
    ),
    ContentImage: <AvatarCompany size={"48px"} avatarId={""} />,
    ListItemRight: TestButton,
  },
};

export const ListItemWithBadge: Story = {
  args: {
    title: "Product Manager of Environmental Works",
    subTitle: "Some company title",
    header: "Jan 30",
    footer: "40 people viewed",
    Badge: <Badge variant="feature" text="Just Added" />,
    ContentImage: <AvatarCompany size={"48px"} avatarId={""} />,
    ListItemRight: TestButton,
  },
};

export const ListItemMinimal: Story = {
  args: {
    title: "Product Manager of Environmental Works",
    subTitle: "Some company title",
    ContentImage: <AvatarCompany size={"48px"} avatarId={""} />,
    ListItemRight: TestButton2,
    className: "items-center",
  },
};
