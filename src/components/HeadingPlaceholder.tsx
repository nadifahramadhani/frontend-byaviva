import React from "react";

interface HeadingProps {
  className?: string;
  contentClassName?: string;
  size?: string;
  text?: string;
  text1?: string;
}

export const HeadingPlaceholder = ({
  className,
  contentClassName,
  text,
  text1,
}: HeadingProps) => {
  return (
    <div className={`flex flex-col ${className || ""}`}>
      <div className={`${contentClassName || ""}`}>{text || text1}</div>
    </div>
  );
};
