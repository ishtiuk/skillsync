import React from "react";
import { Typography } from "../typography";
import { cn } from "@/lib/utils";
import { IconButton } from "../icon-button/IconButton";
import { COLUMN_STYLES, COLUMN_TITLES } from "./types";

export const TableHeader = () => {
  return (
    <div className="border-b border-neutral-n-300 w-full flex" role="thead">
      {COLUMN_TITLES.map((header) => (
        <div
          className={cn(
            "flex border-r border-neutral-n-300 last:border-r-0 items-center p-3 first:pl-6",
            COLUMN_STYLES[header]?.style,
            COLUMN_STYLES[header]?.flexRatio
          )}
          key={header}
          role="columnheader"
        >
          <Typography variant="body">{COLUMN_STYLES[header]?.title}</Typography>
          {!!COLUMN_STYLES[header]?.filters && (
            <IconButton variant="tertiary" iconVariant="CaretDown_bold" size="small" />
          )}
        </div>
      ))}
    </div>
  );
};
