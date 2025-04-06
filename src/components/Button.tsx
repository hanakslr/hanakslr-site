const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...props}
      className="shadow-xs flex w-full justify-center rounded-lg bg-fuchsia-700 px-4 py-1.5 text-sm/6 font-semibold text-white hover:bg-fuchsia-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-700"
    />
  );
};

export default Button;
