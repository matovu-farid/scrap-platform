"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BounceLoader } from "react-spinners";

interface LoaderComponentProps {
  size?: number;
}

export function LoaderComponent({ size = 50 }: LoaderComponentProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col  justify-center items-center h-full">
      <div className="flex flex-col items-center justify-center h-full">
        <BounceLoader color={theme === "dark" ? "#fff" : "#000"} size={size} />
      </div>
    </div>
  );
}
