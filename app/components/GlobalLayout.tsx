import React, { ReactNode } from 'react';
import Navbar from './Navbar';

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
