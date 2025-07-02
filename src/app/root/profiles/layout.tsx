import { ReactNode } from "react";

interface MatchesLayoutProps {
  children: ReactNode;
}

export default function MatchesLayout({ children }: MatchesLayoutProps) {
  return (
    <>
      {children}
    </>
  );
} 