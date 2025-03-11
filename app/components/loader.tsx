import { useTheme } from "next-themes";
import { BounceLoader } from "react-spinners";

interface LoaderComponentProps {
  size?: number;
}

export function LoaderComponent({ size = 50 }: LoaderComponentProps) {
  const { theme } = useTheme();
  if (!theme) {
    return <div></div>;
  }
  return (
    <div className="flex flex-col  justify-center items-center h-full">
      <div className="flex flex-col items-center justify-center h-full">
        <BounceLoader color={theme === "dark" ? "#fff" : "#000"} size={size} />
      </div>
    </div>
  );
}
