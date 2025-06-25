import { ReactNode } from "react";
import LayoutClient from "./layoutClient";

interface ProfileLayoutProps {
  children: ReactNode;
}

export default function ProfileLayout({ children }: ProfileLayoutProps) {
  return (
    <LayoutClient>
      {children}
    </LayoutClient>
  );
}