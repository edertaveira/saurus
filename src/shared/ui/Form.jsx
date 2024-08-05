import { Children, cloneElement, isValidElement, useState } from "react";
import PropTypes from "prop-types";
import FormItem from "./FormItem";

export default function Form({ onSubmit, children, className }) {
  const [formData, setFormData] = useState({});

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData);
  };

  const render = (children) => {
    return Children.map(children, (child) => {
      if (isValidElement(child) && child.type === FormItem) {
        return cloneElement(child, {
          children: Children.map(child.props.children, (nestedChild) => {
            if (isValidElement(nestedChild)) {
              return cloneElement(nestedChild, {
                onChange: (value) => {
                  if (nestedChild.props?.onChange) nestedChild.props?.onChange(value);
                  handleChange(nestedChild.props.name, value);
                },
                value: formData[nestedChild.props.name] || "",
              });
            }
            return nestedChild;
          }),
        });
      } else if (isValidElement(child) && child.props.name) {
        return cloneElement(child, {
          onChange: (e) => {
            child.props.onChange(e);
            handleChange(child.props.name, e.target.value);
          },
          value: formData[child.props.name] || "",
        });
      }
      return child;
    });
  };

  return (
    <form onSubmit={handleSubmit} className={className} data-testid="form">
      {render(children)}
    </form>
  );
}

Form.propTypes = {
  children: PropTypes.any,
  onSubmit: PropTypes.func,
  className: PropTypes.string,
};
