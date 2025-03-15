import Link from "next/link";
import { Button } from "../ui/button";

export function CTAButton({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) {
  return (
    <Button asChild>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
