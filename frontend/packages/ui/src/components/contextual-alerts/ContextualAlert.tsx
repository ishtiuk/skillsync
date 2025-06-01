import { cn } from "@/lib/utils";
import { Typography } from "../typography";
import { PhosphorIcon } from "@/icons/PhosphorIcon";

type contextualAlertTypes = "critical" | "warning" | "success" | "neutral";

const industryTypeIconsMap: Record<contextualAlertTypes, JSX.Element> = {
  critical: <PhosphorIcon size={18} iconVariant={"Warning_fill"} />,
  warning: <PhosphorIcon size={18} iconVariant={"WarningDiamond_fill"} />,
  success: <PhosphorIcon size={18} iconVariant={"CheckCircle_fill"} />,
  neutral: <PhosphorIcon size={18} iconVariant={"Info_fill"} />,
};

const alertBg = {
  critical: "text-red-r-600",
  warning: "text-orange-o-500",
  success: "text-primary-g-600",
  neutral: "text-neutral-n-700",
};

export interface IndustryTagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: contextualAlertTypes;
  label: string;
  className?: string;
}
function ContextualAlert({
  className,
  variant = "neutral",
  label = "Info message content",
  ...props
}: IndustryTagProps) {
  return (
    <div
      className={cn(
        alertBg[variant],
        className,
        "flex items-center justify-start py-2 text-neutral-n-600 gap-1 rounded"
      )}
      {...props}
    >
      <div className={alertBg[variant]}>{industryTypeIconsMap[variant]}</div>
      <Typography variant="caption" className={cn(alertBg[variant], "font-medium")}>
        {label}
      </Typography>
    </div>
  );
}

export { ContextualAlert };
