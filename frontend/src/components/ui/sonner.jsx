import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={{
        "--normal-bg": "#ffffff", // Default background
        "--normal-text": "#000000", // Default text
        "--normal-border": "#ddd",

        "--success-bg": "#4caf50", // Success bg
        "--success-text": "#ffffff", // Success text
        "--error-bg": "#f44336", // Error bg
        "--error-text": "#ffffff", // Error text
      }}
      {...props}
    />
  );
};

export { Toaster };
