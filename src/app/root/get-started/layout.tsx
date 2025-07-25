import { ReactNode } from "react";

interface GetStartedLayoutProps {
  children: ReactNode;
}

export default function GetStartedLayout({ children }: GetStartedLayoutProps) {
  return (
    <>
      {children}
    </>
  );
} 