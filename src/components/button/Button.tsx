import { ButtonHTMLAttributes } from "react";

type ButtonVariants = {
  PRIMARY: string;
  ERROR: string;
  SECONDARY: string;
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variants?: keyof ButtonVariants;
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({
  variants,
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  const buttonWidth = fullWidth ? "w-full " : "w-fit ";
  const buttonBaseStyles =
    buttonWidth +
    "flex flex-row gap-2 items-center justify-center text-center px-2 py-2 rounded-md bg-opacity-95 hover:bg-opacity-100 disabled:bg-gray-300 disabled:text-gray-500 ";
  const buttonVariants = {
    PRIMARY: buttonBaseStyles + "bg-orange-900 text-white",
    SECONDARY: buttonBaseStyles + "bg-neutral-500 text-neutral-50",
    ERROR: buttonBaseStyles + "bg-red-950 text-white",
  };

  return (
    <button className={buttonVariants[variants ?? "PRIMARY"]} {...props}>
      {children}
    </button>
  );
}
