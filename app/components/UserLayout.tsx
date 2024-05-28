import React, { ReactNode } from 'react';
import Navbar from './UserNavbar';

interface GlobalLayoutProps {
  children: ReactNode;
}

export default function GlobalLayout({ children }: GlobalLayoutProps) {
  return (
    <>
      <Navbar>{children}</Navbar>
    </>
  );
}
