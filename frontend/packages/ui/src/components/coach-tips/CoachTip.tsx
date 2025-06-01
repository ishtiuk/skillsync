import { cn } from "@/lib/utils";
import { Typography } from "../typography/Typography";
import { Button } from "../button/Button";
import { useState } from "react";

const positionTips = {
  bottom: "absolute bottom-[-12.752px] left-[50%] translate-x-[-50%]",
  top: "absolute top-[-12.752px] left-[50%] translate-x-[-50%] rotate-180",
  right: "absolute right-[-19px] top-[50%] translate-y-[-50%] rotate-[-90deg]",
  left: "absolute left-[-19px] top-[50%] translate-y-[-50%] rotate-[90deg]",
};

const TipsTypes = {
  top: positionTips["top"],
  bottom: positionTips["bottom"],
  left: positionTips["left"],
  right: positionTips["right"],
};

export interface IndustryTagProps extends React.HTMLAttributes<HTMLDivElement> {
  position: keyof typeof TipsTypes;
  title?: string;
  text?: any;
  onClose?: () => void;
}

function CoachTip({
  className,
  onClose,
  position = "bottom",
  title,
  text = "",
  ...props
}: IndustryTagProps) {
  const textLength = text.length;
  const [page, setPage] = useState(1);
  const prevlePages = () => {
    if (page == 1) {
      return;
    } else {
      setPage(page - 1);
    }
  };
  const nextPages = () => {
    if (page > textLength - 1) {
      return;
    } else {
      setPage(page + 1);
    }
  };

  return (
    <div {...props} className={className}>
      <div className="relative max-w-[300px] w-[300px] rounded-[8px] p-6 bg-white shadow-customShadowCoach">
        <div className="flex flex-col">
          <span className="absolute right-6 top-6 cursor-pointer" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="25"
              viewBox="0 0 24 25"
              fill="none"
            >
              <path
                d="M17.7465 17.2867C17.9074 17.4476 17.9979 17.6659 17.9979 17.8935C17.9979 18.1212 17.9074 18.3395 17.7465 18.5004C17.5855 18.6614 17.3672 18.7518 17.1396 18.7518C16.912 18.7518 16.6937 18.6614 16.5327 18.5004L11.9996 13.9659L7.46515 18.499C7.30419 18.6599 7.08589 18.7504 6.85826 18.7504C6.63064 18.7504 6.41234 18.6599 6.25138 18.499C6.09042 18.338 6 18.1197 6 17.8921C6 17.6645 6.09042 17.4462 6.25138 17.2852L10.7859 12.7522L6.25281 8.21766C6.09185 8.05671 6.00143 7.8384 6.00143 7.61078C6.00143 7.38315 6.09185 7.16485 6.25281 7.00389C6.41376 6.84294 6.63207 6.75251 6.85969 6.75251C7.08732 6.75251 7.30562 6.84294 7.46658 7.00389L11.9996 11.5384L16.5341 7.00318C16.6951 6.84222 16.9134 6.7518 17.141 6.7518C17.3686 6.7518 17.5869 6.84222 17.7479 7.00318C17.9089 7.16414 17.9993 7.38244 17.9993 7.61006C17.9993 7.83769 17.9089 8.05599 17.7479 8.21695L13.2134 12.7522L17.7465 17.2867Z"
                fill="#1F1D1C"
              />
            </svg>
          </span>
          <div className="flex justify-between items-center max-w-[216px]">
            {title && (
              <Typography variant="body-strong" className="tracking-[-0.36px] mb-3">
                {title}
              </Typography>
            )}
          </div>
          <div>
            {text && (
              <>
                <Typography variant="body" className="max-w-[220px]">
                  {text[page - 1]}
                </Typography>
              </>
            )}
          </div>
          {text.length > 1 && (
            <div className="flex justify-between items-center gap-2 h-[44px] mt-3">
              <div className="max-w-[107px] w-full flex items-center justify-start">
                <Typography
                  variant="caption"
                  className="font-medium text-neutral-n-600 tracking-[-0.28px]"
                >
                  {page} of {text?.length}
                </Typography>
              </div>
              <div className="flex justify-center items-center gap-2">
                <Button label="Back" size="default" variant="tertiary" onClick={prevlePages} />
                <Button label="Next" size="default" variant="tertiary" onClick={nextPages} />
              </div>
            </div>
          )}
        </div>
        <div className={cn(TipsTypes[position])}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="13"
            viewBox="0 0 26 13"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.92712 11.3125C11.5263 13.2316 14.4737 13.2316 16.0729 11.3125L25.5 1.90735e-06L0.5 0L9.92712 11.3125Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export { CoachTip };
