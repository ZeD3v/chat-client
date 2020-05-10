import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import UserConnectedEvent from '../UserConnectedEvent';

import { ChatEvents } from '../../index';

describe('UserConnectedEvent', () => {
  test('renders correctly for the user', () => {
    const { asFragment } = render(
      <UserConnectedEvent
        user={{ username: 'Test user 1', token: 'test-token' }}
        event={{
          id: 'testid-1',
          timestamp: 1589041780,
          type: ChatEvents.USER_CONNECTED,
          payload: {
            username: 'Test user 1',
          },
        }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders correctly for other users', () => {
    const { asFragment } = render(
      <UserConnectedEvent
        user={{ username: 'Test user 1', token: 'test-token' }}
        event={{
          id: 'testid-1',
          timestamp: 1589041780,
          type: ChatEvents.USER_CONNECTED,
          payload: {
            username: 'Test user 2',
          },
        }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
