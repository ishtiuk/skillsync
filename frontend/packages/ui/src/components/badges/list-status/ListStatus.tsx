import { cn } from "@/lib/utils";
import { Tag } from "../../tag/Tag";
import {
  WarningIcon,
  BookmarkIcon,
  CheckCircleIcon,
  HeartIcon,
  StarIcon,
} from "../../../icons/index";

const colorVariants = {
  blue: "bg-blue-b-100 border-blue-b-100 text-blue-b-500",
  green: "bg-primary-g-200 border-primary-g-200 text-primary-g-600",
  orange: "bg-orange-o-100 border-orange-o-100 text-orange-o-500",
  purple: "bg-purple-p-200 border-purple-p-200 text-purple-p-600",
  red: "bg-red-r-100 border-red-r-100 text-red-r-500",
  yellow: "bg-yellow-y-100 border-yellow-y-100 text-yellow-y-400",
};

const industryTypes = {
  critical: colorVariants["red"],
  bookmark: colorVariants["blue"],
  success: colorVariants["green"],
  favorite: colorVariants["yellow"],
  BIPOCOwned: colorVariants["purple"],
};

const industryTypeIconsMap: Record<keyof typeof industryTypes, JSX.Element> = {
  critical: <WarningIcon size={14} className="w-[10px] h-[9.4px]" />,
  bookmark: <BookmarkIcon size={14} className="w-[7.875px] h-[10.937px]" />,
  success: <CheckCircleIcon size={14} className="w-[11.375px] h-[11.375px]" />,
  favorite: <StarIcon size={14} className="w-[12.258px] h-[11.811px]" />,
  BIPOCOwned: <HeartIcon size={14} className="w-[12.251px] h-[10.504px]" />,
};

export interface IndustryTagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant: keyof typeof industryTypes;
  className?: string;
}
function ListStatus({ className, variant, ...props }: IndustryTagProps) {
  return (
    <Tag
      className={cn(
        industryTypes[variant],
        className,
        "border-0 w-5 h-5 p-0 overflow-hidden flex items-center justify-center m-auto rounded-full"
      )}
      {...props}
      minimaze={true}
      TypographyProps={{ variant: "caption-strong" }}
    >
      {industryTypeIconsMap[variant]}
    </Tag>
  );
}

export { ListStatus };
