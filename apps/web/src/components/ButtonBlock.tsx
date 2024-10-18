"use client";

import React, { ReactElement } from "react";

interface ButtonBlockProps {
  onClick?: () => void;
  children: React.ReactNode;
}

// TODO: Unify with existing button component (other button needs to accept children)
export function ButtonBlock({
  onClick,
  children,
}: ButtonBlockProps): ReactElement {
  return (
    <>
      <button
        className="border-gray-250 h-full w-full rounded bg-black text-black"
        onClick={onClick}
      >
        <div className="flex items-center justify-center">{children}</div>
      </button>
    </>
  );
}
