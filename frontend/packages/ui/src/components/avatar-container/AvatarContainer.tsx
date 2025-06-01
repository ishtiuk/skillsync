import { cn } from "@/lib/utils";
import { AvatarCompany } from "../avatar-company/AvatarCompany";
import { ListStatus } from "../badges/list-status/ListStatus";
import { AvatarPeople } from "../avatar-people/AvatarPeople";

type variantSize = "default" | "large";

interface AvatarContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  companyId: string;
  list?: any;
  noLogo?: boolean;
  logoIMG?: string | undefined | null | any;
  size?: variantSize;
  className?: string;
  companyName?: string;
  bgAvatar?: any;
  badge?: boolean;
  type: string;
}

function AvatarContainer({
  className,
  companyId,
  list = "critical",
  badge,
  noLogo = true,
  logoIMG,
  companyName,
  bgAvatar,
  type,
  size = "default",
  ...props
}: AvatarContainerProps) {
  return (
    <div className={cn(className, "relative")}>
      {type === "company" && (
        <>
          <AvatarCompany
            profileIMG={logoIMG}
            AvatarType={companyName}
            avatarId={companyId}
            color={bgAvatar}
            size={size === "default" ? "32px" : "48px"}
          />
        </>
      )}
      {type === "people" && (
        <>
          <AvatarPeople
            profileIMG={logoIMG}
            AvatarType={companyName}
            avatarId={companyId}
            color={bgAvatar}
            size={size === "default" ? "32px" : "48px"}
          />
        </>
      )}
      {badge && (
        <span
          className={cn(
            `flex items-center justify-center flex-col w-[22px] h-[22px] absolute ${
              size === "default" ? "bottom-[0px] left-[14px]" : "bottom-[-1.7px] left-[30px]"
            } transform translate-y-1/4  bg-white rounded-full `
          )}
        >
          <ListStatus variant={list} />
        </span>
      )}
    </div>
  );
}

export { AvatarContainer };
