import { cn } from "@/lib/utils";
import { Typography } from "../typography";
import Image from "next/image";

type variantSize = "default" | "large";
type variantStack = "company" | "jobseeker";

type AvatarUsers = {
  src: any;
};

const radiusVariant = {
  default: "rounded-lg",
  large: "rounded-xl",
};

const sizesClasses = {
  default: "w-[32px] h-[32px]",
  large: "w-[48px] h-[48px]",
};

const imgSpace = {
  default: "-space-x-4",
  large: "-space-x-6",
};
export interface AvatarStackProps {
  /** Array of items to be displayed */
  logo: AvatarUsers[];
  className?: string;
  label: string;
  companyName?: string;
  size: variantSize;
  quantity?: string;
  type?: variantStack;
  colorText?: string;
  /** Component to be used to render data */
}

function AvatarStack({
  className,
  logo,
  size = "default",
  type = "company",
  companyName = "img",
  label = "Text string",
  colorText,
  ...props
}: AvatarStackProps) {
  return (
    <div className={(cn(className), "flex items-center gap-3 justify-start max-w-[279px] h-8")}>
      <div className={cn(imgSpace[size], "flex items-center")}>
        {logo.length < 4 && (
          <>
            {logo.map((item, index) => {
              return (
                <div
                  key={index}
                  className={cn(
                    sizesClasses[size],
                    type === "company" ? radiusVariant[size] : "rounded-full",
                    "relative border border-neutral-n-300  overflow-hidden bg-white"
                  )}
                >
                  <Image
                    src={item.src}
                    key={index}
                    alt={companyName}
                    fill={true}
                    className="object-contain"
                  />
                </div>
              );
            })}
          </>
        )}

        {logo.length > 3 && (
          <div className={cn(imgSpace[size], "flex justify-start items-center")}>
            <div
              className={cn(
                sizesClasses[size],
                type === "company" ? radiusVariant[size] : "rounded-full",
                "relative border border-neutral-n-300 overflow-hidden bg-white"
              )}
            >
              <Image src={logo[0]?.src} alt={companyName} fill={true} className="object-contain" />
            </div>
            <div
              className={cn(
                sizesClasses[size],
                type === "company" ? radiusVariant[size] : "rounded-full",
                "relative border border-neutral-n-300 overflow-hidden bg-white"
              )}
            >
              <Image src={logo[1]?.src} alt={companyName} fill={true} className="object-contain" />
            </div>
            <div
              className={cn(
                sizesClasses[size],
                type === "company" ? radiusVariant[size] : "rounded-full",
                "flex items-center z-0 border border-neutral-n-300 justify-center bg-blue-b-200"
              )}
            >
              <Typography
                variant={size === "default" ? "caption" : "body"}
                className="text-center font-bold text-primary-g-800"
              >
                3+
              </Typography>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center gap-[3px] flex-nowrap">
        {logo.length > 0 && (
          <Typography
            variant="caption"
            className={
              (cn(colorText) || "text-primary-g-800",
              "whitespace-nowrap tracking-[-0.28px] leading-5")
            }
          >
            {logo.length}
          </Typography>
        )}
        <Typography
          variant="caption"
          className={
            (cn(colorText) || "text-primary-g-800",
            "whitespace-nowrap tracking-[-0.28px] leading-5")
          }
        >
          {label}
        </Typography>
      </div>
    </div>
  );
}

export { AvatarStack };
