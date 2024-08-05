import PropTypes from "prop-types";

export default function FormItem({
  children,
  label,
  className = "",
  error = "",
  htmlFor = "",
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      <label
        htmlFor={htmlFor}
        className={`text-xs text-gray-500 ${error && "text-red-700"}`}
      >
        {label}
      </label>
      {children}
      {error && <small className="text-red-500 text-[10px]">{error}</small>}
    </div>
  );
}

FormItem.propTypes = {
  children: PropTypes.any,
  label: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.string,
  htmlFor: PropTypes.string,
};
