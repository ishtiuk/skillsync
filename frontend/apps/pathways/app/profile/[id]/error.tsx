'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Typography } from '@workspace/ui/components/typography';

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className=" h-screen flex flex-col items-center justify-center gap-2">
      <Typography variant="heading-md">An error occurred</Typography>
      <Typography variant="body" className="text-neutral-n-700">
        Please try again later
      </Typography>

      <div className="flex gap-4">
        <Button onClick={() => reset()} label="Try Again" className="mt-4" />
        <Button
          className="mt-4"
          variant="secondary"
          label="Go to Login"
          onClick={() => (window.location.href = '/login/existing-user')}
        />
      </div>
    </div>
  );
}
