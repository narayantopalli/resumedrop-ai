import { ReactNode } from "react";

interface EditorLayoutProps {
  children: ReactNode;
}

export default function EditorLayout({ children }: EditorLayoutProps) {
  return (
    <>
      {children}
    </>
  );
} 