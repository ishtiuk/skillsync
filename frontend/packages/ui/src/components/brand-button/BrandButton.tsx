import { cn } from "@/lib/utils";
import { Typography } from "../typography";
import Image from "next/image";

type brandButtonTypes = "facebook" | "google";
type textTypes = "signup" | "login";

const brandVariants = {
  facebook: "bg-blue-b-500 text-white hover:bg-blue-b-600",
  google: "bg-white text-black border border-neutral-n-300 hover:bg-neutral-n-100",
};

const textVariants = {
  facebook: {
    login: "Login with Facebook",
    signup: "Sign up with Facebook",
  },
  google: {
    login: "Login with Google",
    signup: "Sign up with Google",
  },
};

const brandIcons = {
  facebook: <Image src="/images/Facebook.svg" alt="Facebook" width={24} height={24} />,
  google: <Image src="/images/Google.png" alt="Google" width={24} height={24} />,
};

const brandSize = {
  default: "px-12 py-3",
  large: "px-12 py-4",
};

export interface brandButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: brandButtonTypes;
  iconOnly?: boolean;
  size?: keyof typeof brandSize;
  textVariant: textTypes;
}

function BrandButton({
  variant = "facebook",
  size = "default",
  iconOnly = false,
  textVariant = "signup",
  onClick,
  ...props
}: brandButtonProps) {
  return (
    <button
      className={cn(
        brandSize[size],
        brandVariants[variant],
        "flex items-center gap-2 justify-center rounded-[48px] group transition-all duration-300 w-full "
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 justify-center">
        <div className="relative w-[24px] h-[24px]">{brandIcons[variant]}</div>
        {iconOnly === true ? (
          <></>
        ) : (
          <>
            <Typography variant={`${size === "default" ? "caption-strong" : "body-strong"}`}>
              {textVariants[variant][textVariant]}
            </Typography>
          </>
        )}
      </div>
    </button>
  );
}

export { BrandButton };
