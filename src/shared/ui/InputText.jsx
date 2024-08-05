import PropTypes from "prop-types";
import { getRandomString } from "../utils";

export default function InputText({
  value = "",
  onChange = () => {},
  name,
  className,
  disabled = false,
  placeholder = "",
  type = "text",
  isError = false,
  id,
  autoComplete = "off", 
  ...props
}) {
  return (
    <input
      {...props}
      onChange={(e) => onChange(e.target.value)}
      value={value}
      type={type}
      id={id}
      name={name ? name : getRandomString(1000)}
      disabled={disabled}
      placeholder={placeholder}
      autoComplete={autoComplete}
      className={`border border-gray-400 w-full bg-gray-100 focus:bg-white rounded-lg text-xs p-2 placeholder-gray-400 ${className} ${
        isError ? "border-red-400" : ""
      }`}
    />
  );
}

InputText.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  isError: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  autoComplete: PropTypes.string, 
};
