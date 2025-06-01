import Link from "next/link";
import { Card, CardContent } from "../card/Card";
import { usePathname } from "next/navigation";
import { Typography } from "../typography";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

interface CardTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  pathwayId?: string;
  title: string;
  text: string;
  cardIMG?: string | undefined | null | StaticImageData;
}

function CardTemplate({ pathwayId, cardIMG, title, text, className }: CardTemplateProps) {
  const pathname = usePathname();

  return (
    <Link href={`${pathname}/${pathwayId}`}>
      <Card
        size="small"
        key={`job-${pathwayId}`}
        className={cn(` ${className}`, "relative flex flex-col justify-center items-center p-4")}
      >
        <CardContent className="p-0 text-center">
          {cardIMG && (
            <div className="mb-5 flex items-center justify-center">
              <Image src={cardIMG} alt="image" width={104} height={104} />
            </div>
          )}
          <Typography
            variant="body-strong"
            className="truncate mb-0 overflow-hidden max-w-[135px] ml-auto mr-auto"
          >
            {title}
          </Typography>
          <Typography variant="caption-strong" className="truncate">
            {text}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

export { CardTemplate };
