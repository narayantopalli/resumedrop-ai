import { ReactNode } from "react";

interface SkillsLayoutProps {
  children: ReactNode;
}

export default function SkillsLayout({ children }: SkillsLayoutProps) {
  return (
    <>
      {children}
    </>
  );
} 