import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import ProtectedRoute from "./shared/components/ProtectesRoute";
import Payment from "./pages/Payment";
import { NotificationProvider } from "./NotificationContext";
import Notification from "./shared/ui/Notification";

const App = () => {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Notification />
      </Router>
    </NotificationProvider>
  );
};

export default App;
