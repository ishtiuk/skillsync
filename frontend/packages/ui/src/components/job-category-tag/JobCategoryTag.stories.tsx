import type { Meta, StoryObj } from '@storybook/react';
import { JobCategoryTag } from './JobCategoryTag';

const meta = {
  title: 'Components/Tags/JobCategoryTag',
  component: JobCategoryTag,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof JobCategoryTag>;

export default meta;
type Story = StoryObj<typeof JobCategoryTag>;

export const SoftwareEngineering: Story = {
  args: { variant: 'software-engineering' }
};

export const SupplyChain: Story = {
  args: { variant: 'supply-chain' }
};

export const HR: Story = {
  args: { variant: 'HR' }
};

export const AdvocacyPolicy: Story = {
  args: { variant: 'advocacy-policy' }
};

export const ClimateSustainability: Story = {
  args: { variant: 'climate-sustainability' }
};

export const Investment: Story = {
  args: { variant: 'investment' }
};

export const SalesAccountManagement: Story = {
  args: { variant: 'sales-account-management' }
};

export const Content: Story = {
  args: { variant: 'content' }
};

export const MarketingDesign: Story = {
  args: { variant: 'marketing-design' }
};

export const Product: Story = {
  args: { variant: 'product' }
};

export const Data: Story = {
  args: { variant: 'data' }
};

export const Education: Story = {
  args: { variant: 'education' }
};

export const FinanceLegalCompliance: Story = {
  args: { variant: 'finance-legal-compliance' }
};

export const OperationsProgramManagementStrategy: Story = {
  args: { variant: 'operations-program-management-strategy' }
};

export const Science: Story = {
  args: { variant: 'science' }
};
