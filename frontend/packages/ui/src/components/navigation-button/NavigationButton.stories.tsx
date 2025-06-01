import { Meta, StoryObj } from "@storybook/react";
import { NavigationButton, NavigationButtonProps } from "./NavigationButton";

function Render(args: NavigationButtonProps) {
    return (
        <div style={{ width: '300px' }}
        className="bg-navigation">
            <NavigationButton {...args}/>
        </div>
    )
}

export const Default: Story = {
    args: {
      iconVariant: "HouseSimple_fill",
      pathname: "home",
      label: "Home",
      collapsed: false
    }
};

const meta = {
    title: 'Components/NavigationButton',
    component: NavigationButton,
    parameters: {
      layout: 'centered'
    },
    tags: ['autodocs'],
    render: Render
  } satisfies Meta<typeof NavigationButton>;
  
export default meta;
type Story = StoryObj<typeof NavigationButton>;