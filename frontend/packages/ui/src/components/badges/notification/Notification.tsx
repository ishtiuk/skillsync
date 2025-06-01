import { cn } from "@/lib/utils";
import { Tag } from "../../tag/Tag";
import { Typography } from "@/components/typography";

const colorVariants = {
  red: "bg-red-r-500 border-red-r-500 text-white",
  neutral: "bg-neutral-n-200 border-neutral-n-200 text-neutral-n-800",
};

const variantTypes = {
  alert: colorVariants["red"],
  count: colorVariants["neutral"],
};

export interface IndustryTagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: keyof typeof variantTypes;
  messages: string | number | undefined;
}
function Notification({ className, variant, messages = "0", ...props }: IndustryTagProps) {
  return (
    <Tag
      className={cn(
        variantTypes[variant],
        className,
        "border-0 min-w-5 h-5 flex-inline items-center justify-center rounded gap-0 p-0 text-center"
      )}
      {...props}
      minimaze={true}
      TypographyProps={{ variant: "caption-strong" }}
    >
      <Typography
        variant="caption"
        className="font-bold flex items-center justify-center text-center truncate"
      >
        {messages}
      </Typography>
    </Tag>
  );
}

export { Notification };
