import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

const colorVariants = {
  blue: "bg-blue-b-500 text-blue-b-100 fill-blue-b-100",
  green: "bg-primary-g-500 text-primary-g-100 fill-primary-g-100",
  orange: "bg-orange-o-500 text-orange-o-100 fill-orange-o-100",
  purple: "bg-purple-p-500 text-purple-p-100 fill-purple-p-100",
  red: "bg-red-r-500 text-red-r-500 fill-red-r-100",
  yellow: "bg-yellow-y-500 text-yellow-y-100 fill-yellow-y-100",
};

const sizesVariants = {
  "24px": "w-[24px] h-[24px] p-1",
  "32px": "w-[32px] h-[32px] p-2",
  "48px": "w-[48px] h-[48px] p-3",
  "64px": "w-[64px] h-[64px] p-4",
  "96px": "w-[96px] h-[96px] p-5",
  "128px": "w-[128px] h-[128px] p-5",
};

const sizesSVG = {
  "24px": "w-[18px] h-[18px]",
  "32px": "w-[24px] h-[24px]",
  "48px": "w-[36px] h-[36px]",
  "64px": "w-[48px] h-[48px]",
  "96px": "w-[64px] h-[64px]",
  "128px": "w-[84px] h-[84px]",
};

export interface AvatarPeopleProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: keyof typeof colorVariants;
  size?: keyof typeof sizesVariants;
  className?: string;
  profileIMG?: string | undefined | null | StaticImageData;
  avatarId?: string;
  AvatarType?: string;
}
function AvatarPeople({
  className,
  profileIMG,
  avatarId,
  color = "purple",
  size = "48px",
  AvatarType = "company",
  ...props
}: AvatarPeopleProps) {
  return (
    <div key={`avatar-${avatarId}`} {...props}>
      {profileIMG ? (
        <div
          className={cn(
            sizesVariants[size],
            "border border-neutral-n-300 rounded-full flex-inline items-center justify-center relative overflow-hidden",
            className
          )}
        >
          <Image
            src={profileIMG}
            fill={true}
            alt={AvatarType}
            className="rounded-full block object-cover"
          />
        </div>
      ) : (
        <div
          className={cn(
            sizesVariants[size],
            colorVariants[color],
            className,
            "border border-neutral-n-300 rounded-full flex-inline items-center justify-center relative overflow-hidden"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="auto"
            viewBox="0 0 84 84"
            fill="none"
            className={cn(
              colorVariants[color],
              sizesSVG[size],
              "block object-fill absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4"
            )}
          >
            <path
              d="M25.5717 28.185C25.5717 18.42 33.1457 10.5 42.4889 10.5C51.8321 10.5 59.406 18.4125 59.406 28.185C59.406 37.9574 51.8321 45.8699 42.4889 45.8699C33.1457 45.8699 25.5717 37.9499 25.5717 28.185Z"
              fill=""
            />
            <path
              d="M13.3072 73.4998H70.6914C71.082 73.5045 71.4694 73.429 71.8295 73.278C72.1896 73.127 72.5146 72.9038 72.7844 72.6223C73.0445 72.3576 73.2423 72.0386 73.3634 71.6884C73.4845 71.3381 73.5259 70.9654 73.4845 70.5973C73.4818 70.5798 73.4774 70.5478 73.4711 70.5023C73.3042 69.2971 71.8189 58.5669 65.2029 53.7973C63.0209 52.2245 60.3985 51.3733 57.7052 51.3639C55.0119 51.3545 52.3836 52.1873 50.1906 53.7448C44.5816 57.1198 38.9426 57.1198 32.9798 53.7448C30.676 52.0198 25.0746 49.9348 18.9462 53.6848C11.7562 58.0498 10.6269 69.3973 10.5065 70.6798C10.4803 71.0445 10.534 71.4105 10.664 71.7524C10.794 72.0943 10.9972 72.4039 11.2593 72.6598C11.528 72.9277 11.8473 73.1398 12.1988 73.284C12.5503 73.4282 12.927 73.5015 13.3072 73.4998Z"
              fill=""
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export { AvatarPeople };
