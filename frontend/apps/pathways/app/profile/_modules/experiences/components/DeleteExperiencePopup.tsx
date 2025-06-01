import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTrigger,
  DialogDescription
} from '@workspace/ui/components/dialog/Dialog';
import { PhosphorIcon } from '@workspace/ui/icons/PhosphorIcon';
import { deleteExperience } from '../api/mutations/deleteExperience';
import { useMutation } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/api/getQueryClient';
import { getExperiencesOptions } from '../api/queries/getExperiences';

const DeleteExperiencePopup = ({ id }: { id: string }) => {
  const queryClient = getQueryClient();

  const mutation = useMutation({
    mutationFn: deleteExperience,
    onError: error => console.log(error),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
    }
  });

  const onSubmit = () => {
    mutation.mutate(id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span>
          <PhosphorIcon
            size={24}
            iconVariant="Trash_fill"
            className="text-primary-g-700 cursor-pointer transition-colors duration-200 hover:text-primary-g-800"
          />
        </span>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[640px] max-h-[98%] overflow-auto">
        <DialogHeader className="mt-12">
          <DialogTitle>
            Are you sure you want to delete this experience?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to delete this
            experience from your profile?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary" label="Cancel">
              Close
            </Button>
          </DialogClose>

          <Button onClick={onSubmit} label="Delete" />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteExperiencePopup;
