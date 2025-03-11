import { useTheme } from "next-themes";
import { CircleLoader } from "react-spinners";

export function LoaderComponent() {
  const theme = useTheme();
  return (
    <div className="flex justify-center items-center h-full">
      <div className="flex flex-col items-center justify-center">
        <CircleLoader
          color={theme.theme === "dark" ? "#fff" : "#000"}
          size={50}
        />
      </div>
    </div>
  );
}
