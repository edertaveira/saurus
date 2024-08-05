import PropTypes from "prop-types";
import { useNotification } from "../../NotificationContext";

const Notification = () => {
  const { notification } = useNotification();
  const { message, visible, position } = notification;

  if (!visible) return null;

  const positions = {
    top: "top-1 left-1/2 transform -translate-x-1/2",
    bottom: "bottom-1 left-1/2 transform -translate-x-1/2",
  };

  const positionClasses = positions[position] || positions.top;

  return (
    <div
      className={`fixed ${positionClasses} bg-gray-800 text-white px-5 py-2 rounded shadow-lg  text-xs opacity-80`}
    >
      {message}
    </div>
  );
};

export default Notification;
