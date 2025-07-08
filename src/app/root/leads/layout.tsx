import { ReactNode } from "react";

interface LeadsLayoutProps {
  children: ReactNode;
}

export default function LeadsLayout({ children }: LeadsLayoutProps) {
  return (
    <>
      {children}
    </>
  );
} 