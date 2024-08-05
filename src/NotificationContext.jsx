import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const NotificationContext = createContext();

export const useNotification = () => {
  return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    message: "",
    visible: false,
    position: "top",
  });

  const showNotification = (message, position = "top") => {
    setNotification({ message, visible: true, position });
    setTimeout(() => {
      setNotification({ message: "", visible: false, position });
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.any,
};
