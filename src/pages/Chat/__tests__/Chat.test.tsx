import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import socketIOClient from 'socket.io-client';

import { UserContext } from '../../../App';
import Chat from '../index';

jest.mock('socket.io-client');

describe('Chat', () => {
  let socket = {
    on: jest.fn(),
    emit: jest.fn(),
    disconnect: jest.fn(),
    removeAllListeners: jest.fn(),
  };

  beforeEach(() => {
    socket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      removeAllListeners: jest.fn(),
    };

    (socketIOClient as any).mockReturnValue(socket);
  });

  test('renders correctly', () => {
    const { asFragment } = render(<Chat />);
    expect(asFragment()).toMatchSnapshot();
  });

  test('sends message when send button is pressed', () => {
    const { container } = render(
      <UserContext.Provider
        value={{
          user: { username: 'Test user', token: 'test-token' },
          setUser: jest.fn(),
        }}
      >
        <Chat />
      </UserContext.Provider>
    );
    const testMessage = 'This is a test message.';

    fireEvent.change(getByTestId(container, 'chat-message-input'), {
      target: { value: testMessage },
    });
    fireEvent.click(getByTestId(container, 'chat-message-submit-btn'));

    expect(socket.emit).toHaveBeenCalledTimes(1);
    expect(socket.emit).toHaveBeenCalledWith('message', {
      message: testMessage,
    });
  });
});
