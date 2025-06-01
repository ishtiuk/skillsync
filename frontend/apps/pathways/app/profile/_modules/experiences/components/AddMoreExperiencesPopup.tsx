import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription
} from '@workspace/ui/components/dialog/Dialog';

import { Button } from '@workspace/ui/components/button';

type AddExperiencePopupProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenAddExperienceFormPopup: (open: boolean) => void;
};

const AddExperiencePopup = ({
  open,
  onOpenChange,
  onOpenAddExperienceFormPopup
}: AddExperiencePopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
        <DialogHeader className="mt-12">
          <DialogTitle>Do you want to add more experiences?</DialogTitle>
          <DialogDescription>
            You can add more experiences to your profile by clicking the button
            below.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" label="Later" />
          </DialogClose>

          <Button
            onClick={() => {
              onOpenAddExperienceFormPopup(true);
              onOpenChange(false);
            }}
            label="Add Experience"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddExperiencePopup;
