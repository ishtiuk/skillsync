import { Button } from '@/components/button';

type PageSectionButton = {
  label: string;
};

type PageSectionProps = {
  title: string;
  button?: PageSectionButton;
  children?: React.ReactNode;
};

function PageSection({ title, button, children }: PageSectionProps) {
  return (
    <div className="flex justify-between flex-row w-full mt-4">
      <h2>{title}</h2>
      {button && (
        <Button
          label={button.label}
          size="default"
          variant="secondary"
          rightIcon="ArrowCircleRight_fill"
        />
      )}
      {children}
    </div>
  );
}

export { PageSection };
