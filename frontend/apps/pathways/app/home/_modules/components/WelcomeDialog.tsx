import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { Button } from '@workspace/ui/components/button';

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger
} from '@workspace/ui/components/dialog/Dialog';

import { Typography } from '@workspace/ui/components/typography';
import { LinkComponent } from '@workspace/ui/components/link/LinkComponent';

const SocialsForm = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <LinkComponent
          href={''}
          size="large"
          label="Add Your Socials"
          leftIcon={'PlusCircle_fill'}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            <Typography variant="heading-md" className="text-primary-g-900">
              Add Your Socials
            </Typography>
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(event?: BaseSyntheticEvent) => event?.preventDefault()}
          noValidate
        >
          <div id="socialsInfo" className="flex flex-col gap-4 mt-4">
            <div className="flex flex-col gap-4"></div>
          </div>
        </form>

        <DialogFooter className="sm:justify-end mt-8">
          <DialogClose asChild>
            <Button type="button" variant="tertiary" label="Cancel" />
          </DialogClose>

          <Button
            type="button"
            variant="primary"
            label="Save Your Changes"
            onClick={() => console.log('submitting')}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SocialsForm;
