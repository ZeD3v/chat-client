import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import UserDisconnectedEvent from '../UserDisconnectedEvent';

import { ChatEvents } from '../../index';

describe('UserDisconnectedEvent', () => {
  test('renders correctly if user disconnected due to inactivity', () => {
    const { asFragment } = render(
      <UserDisconnectedEvent
        user={{ username: 'Test user 1', token: 'test-token' }}
        event={{
          id: 'testid-1',
          timestamp: 1589041780,
          type: ChatEvents.USER_DISCONNECTED,
          payload: {
            username: 'Test user 2',
            reason: 'USER_INACTIVE',
          },
        }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test('renders correctly if user left', () => {
    const { asFragment } = render(
      <UserDisconnectedEvent
        user={{ username: 'Test user 1', token: 'test-token' }}
        event={{
          id: 'testid-1',
          timestamp: 1589041780,
          type: ChatEvents.USER_DISCONNECTED,
          payload: {
            username: 'Test user 2',
            reason: 'USER_LEFT',
          },
        }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
