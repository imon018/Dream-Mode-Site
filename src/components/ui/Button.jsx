export default function Button({
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      {...props}
      className={`bg-primary hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl ${className}`}
    >
      {children}
    </button>
  );
}
