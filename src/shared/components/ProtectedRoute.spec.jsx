/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectesRoute';

const TestComponent = () => <div>Protected Content</div>;

test('redirects to login if not authenticated', () => {
  localStorage.removeItem('token');

  render(
    <BrowserRouter>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<div>Login Page</div>} />
      </Routes>
    </BrowserRouter>
  );

  window.history.pushState({}, 'Protected Page', '/protected');

  expect(screen.getByText('Login Page')).toBeInTheDocument();
});

test('renders children if authenticated', () => {
  localStorage.setItem('token', 'valid-token');

  render(
    <BrowserRouter>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<div>Login Page</div>} />
      </Routes>
    </BrowserRouter>
  );

  window.history.pushState({}, 'Protected Page', '/protected');
  expect(screen.getByText('Protected Content')).toBeInTheDocument();
  localStorage.removeItem('token');
});
