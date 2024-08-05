/**
 * @jest-environment jsdom
 */

import React from "react";
import { act, render, screen } from "@testing-library/react";
import Notification from "./Notification";
import {
  NotificationProvider,
  useNotification,
} from "../../NotificationContext";

const TestComponent = ({ message, visible, position }) => {
  const { showNotification } = useNotification();

  React.useEffect(() => {
    act(() => {
      showNotification(message, position, visible);
    });
  }, [showNotification, message, position, visible]);

  return null;
};

test("renders Notification component with message when visible is true", () => {
  render(
    <NotificationProvider>
      <Notification />
      <TestComponent
        message="Test Notification"
        visible={true}
        position="top"
      />
    </NotificationProvider>
  );

  expect(screen.getByText("Test Notification")).toBeInTheDocument();
});

test("does not render Notification component when visible is false", () => {
  render(
    <NotificationProvider>
      <Notification />
      <TestComponent
        message="Test Notification"
        visible={false}
        position="top"
      />
    </NotificationProvider>
  );
  setTimeout(() => {
    expect(screen.queryByText("Test Notification")).not.toBeInTheDocument();
  }, 500);
});

test("applies top position class when position is top", () => {
  render(
    <NotificationProvider>
      <Notification />
      <TestComponent
        message="Test Notification"
        visible={true}
        position="top"
      />
    </NotificationProvider>
  );

  const notification = screen.getByText("Test Notification");
  expect(notification).toHaveClass("top-1 left-1/2 transform -translate-x-1/2");
});

test("applies bottom position class when position is bottom", () => {
  render(
    <NotificationProvider>
      <Notification />
      <TestComponent
        message="Test Notification"
        visible={true}
        position="bottom"
      />
    </NotificationProvider>
  );

  const notification = screen.getByText("Test Notification");
  expect(notification).toHaveClass(
    "bottom-1 left-1/2 transform -translate-x-1/2"
  );
});
