import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { TextProps } from "react-native-svg";
import clsx from "clsx";
import { createContext, useContext } from "react";
import { colors } from "@/styles/colors";

type Variants = "primary" | "secondary";

type ButtonProps = TouchableOpacityProps & {
  variant?: Variants;
  isLoading?: boolean;
};

const ThemeContext = createContext<{ variant?: Variants }>({});

function Button({
  variant = "primary",
  children,
  isLoading,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={clsx(
        "w - full h-11 flex-row items-center justify-center rounded-lg",
        {
          "bg-lime-300": variant === "primary",
          "bg-zinc-800": variant === "secondary",
        }
      )}
      disabled={isLoading}
      activeOpacity={0.7}
      {...rest}
    >
      <ThemeContext.Provider value={{ variant }}>
        {isLoading ? <ActivityIndicator className="text-lime-950" /> : children}
      </ThemeContext.Provider>
    </TouchableOpacity>
  );
}

function Title({ children }: TextProps) {
  const { variant } = useContext(ThemeContext);

  return (
    <Text
      className={clsx(
        "text-base font-semibold",
        { "text-lime-950": variant === "primary" },
        { "text-zinc-200": variant === "secondary" }
      )}
    >
      {children}
    </Text>
  );
}

Button.Title = Title;

export { Button };
