import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

const COLOR_VARIANTS = ["blue", "green", "orange", "purple", "red", "yellow", "neutral"] as const;
type AvatarColor = (typeof COLOR_VARIANTS)[number];

const colorVariants: Record<AvatarColor, string> = {
  blue: "bg-blue-b-500 text-blue-b-100",
  green: "bg-primary-g-500 text-primary-g-100",
  orange: "bg-orange-o-500 text-orange-o-100",
  purple: "bg-purple-p-500 text-purple-p-100",
  red: "bg-red-r-500 text-red-r-100",
  yellow: "bg-yellow-y-500 text-yellow-y-100",
  neutral: "bg-neutral-n-700 text-neutral-n-200",
};

const sizesVariants = {
  "24px": "w-[24px] h-[24px] rounded text-[20px] leading-normal",
  "32px": "w-[32px] h-[32px] rounded-[8px] text-[24px] leading-normal",
  "48px": "w-[48px] h-[48px] rounded-[12px] text-[32px] leading-normal",
  "64px": "w-[64px] h-[64px] rounded-[12px] text-[48px] leading-normal",
  "96px": "w-[96px] h-[96px] rounded-[16px] text-[84px] leading-normal",
  "128px": "w-[128px] h-[128px] rounded-[24px] text-[100px] leading-normal",
};

const getSemiRandomColor = (company: string) => {
  return COLOR_VARIANTS[company.charCodeAt(0) % 7];
};

export interface AvatarCompanyProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: AvatarColor;
  size: keyof typeof sizesVariants;
  className?: string;
  profileIMG?: string | undefined | StaticImageData;
  avatarId: string;
  AvatarType?: string;
  companyName?: string;
}
function AvatarCompany({
  className,
  profileIMG,
  avatarId,
  color = "blue",
  size = "48px",
  AvatarType = "company",
  companyName = "C",
  ...props
}: AvatarCompanyProps) {
  return (
    <div key={`avatar-${avatarId}`} {...props}>
      {profileIMG ? (
        <div
          className={cn(
            sizesVariants[size],
            className,
            "flex items-center border border-neutral-n-300 justify-center relative overflow-hidden"
          )}
        >
          <Image
            src={profileIMG}
            fill={true}
            layout="fill"
            className="block object-center object-contain"
            alt={AvatarType}
            priority={true}
          />
        </div>
      ) : (
        <div
          className={cn(
            sizesVariants[size],
            colorVariants[getSemiRandomColor(companyName)],
            className,
            "flex b-white items-center border border-neutral-n-300 justify-center relative overflow-hidden"
          )}
        >
          <p className="text-center align-top font-medium">{companyName.charAt(0).toUpperCase()}</p>
        </div>
      )}
    </div>
  );
}

export { AvatarCompany };
