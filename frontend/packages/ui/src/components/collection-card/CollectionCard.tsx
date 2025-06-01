import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "../card/Card";
import { Typography } from "../typography/Typography";
import { AvatarStack } from "../avatar-stack/AvatarStack";
import { Tag } from "../tag/Tag";
import { PathwayBadge } from "../badges/pathway-badge/PathwayBadge";

type variantStack = "company" | "jobseeker";
type variantGradient =
  | "default"
  | "gradient-blue-b100"
  | "gradient-purple-P300"
  | "gradient-green-g300"
  | "gradient-yellow-y500"
  | "gradient-yellow-y200"
  | "gradient-orange-o400"
  | "gradient-red-r200"
  | "gradient-green-g100";

const gradientBG = {
  default: "bg-gradient-135 from-[rgba(242,237,233,0)] to-[rgba(163,157,150,1)]",
  "gradient-blue-b100": "bg-gradient-blue-b100",
  "gradient-purple-P300": "bg-gradient-purple-P300",
  "gradient-green-g300": "bg-gradient-green-g300",
  "gradient-yellow-y500": "bg-gradient-yellow-y500",
  "gradient-yellow-y200": "bg-gradient-yellow-y200",
  "gradient-orange-o400": "bg-gradient-orange-o400",
  "gradient-red-r200": "bg-gradient-red-r200",
  "gradient-green-g100": "bg-gradient-green-g100",
};

type CollectionCardData = {
  className?: string;
  label?: string;
  logo?: any;
  stackAvatar?: variantStack;
  stackText: string;
  jobs?: string;
  badges?: any[];
  quantity?: string;
  colorText?: string;
  colorsBG?: string[];
  gradient?: variantGradient;
};

export interface CollectionCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: CollectionCardData[];
}

function CollectionCard({ data, className, ...props }: CollectionCardProps) {
  return (
    <div className="flex justify-center items-center gap-5">
      {data.map((item, index) => {
        return (
          <Card
            key={index}
            size="large"
            className={
              (cn(className, item.colorText),
              cn(gradientBG[item.gradient || "default"], "flex flex-col"))
            }
          >
            <CardHeader className="p-0 h-24 mb-3">
              <Typography variant="heading-lg" className={`${item.colorText} `}>
                {item.label}
              </Typography>
            </CardHeader>
            <CardContent className="p-0 text-white">
              <AvatarStack
                size="default"
                type={item.stackAvatar}
                label={item.stackText}
                logo={item.logo}
                quantity={item.quantity}
                colorText={item.colorText}
              />
            </CardContent>
            <CardFooter className="flex flex-row gap-2 align-bottom justify-start p-0 mt-auto">
              {item.jobs && <Tag QuantityJobs={item.jobs} />}
              {item.badges && (
                <>
                  {item.badges.map((item, index) => {
                    return <PathwayBadge key={index} variant={item} />;
                  })}
                </>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export { CollectionCard };
export type { CollectionCardData };
