import Link from 'next/link';
import { redirect } from 'next/navigation';

export default function AuthButton() {
  return (
    <Link
      href="/login/existing-user"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  );
}
