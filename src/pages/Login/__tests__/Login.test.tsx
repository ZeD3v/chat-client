import React from 'react';
import fetchMock from 'jest-fetch-mock';
import { render, fireEvent, getByTestId, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { UserContext, ErrorContext } from '../../../App';
import Login from '../index';

describe('Login', () => {
  test('renders correctly', () => {
    const { asFragment } = render(<Login />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('sends login request when login button is clicked', async () => {
    const { container } = render(
      <UserContext.Provider
        value={{
          user: { username: 'Test user', token: 'test-token' },
          setUser: jest.fn(),
        }}
      >
        <ErrorContext.Provider
          value={{
            error: null,
            setError: jest.fn(),
          }}
        >
          <Login />
        </ErrorContext.Provider>
      </UserContext.Provider>
    );
    const testUsername = 'tester';

    fireEvent.change(getByTestId(container, 'login-username-input'), {
      target: { value: testUsername },
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(getByTestId(container, 'login-submit-btn'));
    });

    expect(fetchMock).toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/login', {
      body: `{"username":"${testUsername}"}`,
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    });
  });

  test('show error message if error is set', () => {
    const { asFragment } = render(
      <UserContext.Provider
        value={{
          user: { username: 'Test user', token: 'test-token' },
          setUser: jest.fn(),
        }}
      >
        <ErrorContext.Provider
          value={{
            error: 'Something went wrong',
            setError: jest.fn(),
          }}
        >
          <Login />
        </ErrorContext.Provider>
      </UserContext.Provider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
