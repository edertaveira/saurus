import PropTypes from "prop-types";

export default function Button({
  title,
  disabled = false,
  onClick = () => {},
  className = "",
}) {
  return (
    <button
      className={` w-full text-white rounded-lg p-2 
        ${disabled ? "bg-gray-400" : "bg-red-800"} 
        ${className}`}
      type="submit"
      disabled={disabled}
      onClick={onClick}
    >
      {title}
    </button>
  );
}

Button.propTypes = {
  title: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};
