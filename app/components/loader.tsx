import { useTheme } from "next-themes";
import { BounceLoader } from "react-spinners";

interface LoaderComponentProps {
  size?: number;
}

export function LoaderComponent({ size = 50 }: LoaderComponentProps) {
  const theme = useTheme();

  return (
    <div className="flex flex-col  justify-center items-center h-full">
      <div className="flex flex-col items-center justify-center h-full">
        <BounceLoader
          color={theme.theme === "dark" ? "#000" : "#fff"}
          size={size}
        />
      </div>
    </div>
  );
}
