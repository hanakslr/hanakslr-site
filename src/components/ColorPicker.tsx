interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const ColorPicker = ({ className = "", ...props }: InputProps) => {
  const currentColor: string =
    props.value?.toString() || props.defaultValue?.toString() || "#FFFF";
  return (
    <input
      type="color"
      style={{ backgroundColor: currentColor }}
      className={`h-8 w-8 cursor-pointer rounded-md border-none [&::-webkit-color-swatch-wrapper]:rounded-md [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none ${className}`}
      {...props}
    />
  );
};

export default ColorPicker;
