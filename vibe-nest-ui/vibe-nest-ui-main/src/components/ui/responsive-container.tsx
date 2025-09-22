import React from "react";
import { cn } from "@/lib/utils";

interface ResponsiveContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function ResponsiveContainer({
  children,
  className,
  as: Component = "div",
  ...props
}: ResponsiveContainerProps) {
  return (
    <Component
      className={cn(
        "w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10",
        "max-w-7xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}