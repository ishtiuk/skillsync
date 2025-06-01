import Image from "next/image";
import { cn } from "@/lib/utils";
import Template from "@/public/images/template.png";

const sizesVariants = {
  "24px": "w-[24px] h-[24px] p-1",
  "32px": "w-[32px] h-[32px] p-2",
  "48px": "w-[48px] h-[48px] p-3",
  "64px": "w-[64px] h-[64px] p-4",
  "96px": "w-[96px] h-[96px] p-5",
  "128px": "w-[128px] h-[128px] p-5",
};

export interface AvatarTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  size: keyof typeof sizesVariants;
  className?: string;
  avatarId?: string;
  alt?: string;
}
function AvatarTemplate({
  className,
  avatarId,
  alt = "no logo",
  size = "48px",
  ...props
}: AvatarTemplateProps) {
  return (
    <div
      key={`avatar-${avatarId}`}
      className={cn(
        sizesVariants[size],
        className,
        "rounded-full border border-neutral-n-300 flex-inline items-center justify-center relative overflow-hidden"
      )}
      {...props}
    >
      <Image src={Template} fill={true} alt={alt} />
    </div>
  );
}

export { AvatarTemplate };
