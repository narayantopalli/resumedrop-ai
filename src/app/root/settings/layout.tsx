import { ReactNode } from "react";

interface SettingsLayoutProps {
  children: ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 ">
      {children}
    </div>
  );
} 