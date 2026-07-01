import { ClipLoader } from "react-spinners";

interface LoaderProps {
  size?: number;
  color?: string;
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({
  size = 40,
  color = "#1565C0",
  fullScreen = false,
  text,
}: LoaderProps) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <ClipLoader color={color} size={size} />
      {text && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/70 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {content}
    </div>
  );
}