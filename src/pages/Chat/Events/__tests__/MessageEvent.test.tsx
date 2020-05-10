import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import MessageEvent from '../MessageEvent';

import { ChatEvents } from '../../index';

describe('MessageEvent', () => {
  test('renders correctly', () => {
    const { asFragment } = render(
      <MessageEvent
        user={{ username: 'Test user', token: 'test-token' }}
        event={{
          id: 'testid-1',
          timestamp: 1589041780,
          type: ChatEvents.MESSAGE,
          payload: {
            message: 'This is a test message',
            username: 'Test user',
          },
        }}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
