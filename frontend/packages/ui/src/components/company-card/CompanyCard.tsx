import Link from 'next/link';
import { Card } from '../card';
import { Typography } from '../typography';
import { Tag } from '../tag';
import { usePathname } from 'next/navigation';
import { PathwayTag } from '../pathways-tag/PathwaysTag';
import { ListStatus } from '../badges/list-status/ListStatus';
import { AvatarCompany } from '../avatar-company/AvatarCompany';
import { NoAvatarCompany } from '../no-avatar-company/NoAvatarCompany';

interface CompanyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  companyName: string;
  companyId: string;
  list?: any;
  QuantityJobs?: string;
  minimazeTag?: boolean;
  pathwayTag?: any;
  partner?: boolean;
  noLogo?: boolean;
  logoLetter?: boolean;
  logoCompany?: any;
  variantBG?: any;
}

function CompanyCard({
  companyName,
  companyId,
  list,
  QuantityJobs,
  pathwayTag,
  partner,
  logoLetter,
  noLogo = true,
  logoCompany,
  variantBG,
  minimazeTag
}: CompanyCardProps) {
  const pathname = usePathname();

  return (
    <Link href={`${pathname}/${companyId}`}>
      <Card size="skinny" key={`job-${companyId}`}>
        <div className="flex justify-between flex-col h-full">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between flex-row w-full items-start">
              <Typography
                variant="caption-strong"
                className="text-black text-2xl font-bold truncate tracking-[-0.48px]"
              >
                {companyName}
              </Typography>
              <div className="relative">
                {logoCompany && (
                  <>
                    <AvatarCompany
                      profileIMG={logoCompany}
                      AvatarType="alt"
                      avatarId={companyId}
                      size="32px"
                      color="blue"
                    />
                  </>
                )}
                {noLogo && (
                  <>
                    <NoAvatarCompany size="32px" avatarId={companyId} />
                  </>
                )}
                {logoLetter && (
                  <>
                    <AvatarCompany
                      profileIMG={logoCompany}
                      AvatarType={companyName}
                      avatarId={companyId}
                      size="32px"
                      color={variantBG}
                    />
                  </>
                )}

                {list && (
                  <span className="flex items-center justify-center flex-col absolute bottom-0 left-5 transform translate-y-1/4 w-6 h-6 bg-purple-p-200 rounded-full border-2 border-neutral-n-100">
                    <ListStatus variant={list} />
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            {pathwayTag && (
              <PathwayTag variant={pathwayTag} minimaze={minimazeTag} />
            )}
            {QuantityJobs && <Tag QuantityJobs={QuantityJobs} />}
            {partner && (
              <Tag className="bg-blue-b-100 text-blue-b-500 rounded-xl">
                <Typography variant="caption" className="font-bold">
                  Partner
                </Typography>
              </Tag>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}

export { CompanyCard };
export type { CompanyCardProps };
