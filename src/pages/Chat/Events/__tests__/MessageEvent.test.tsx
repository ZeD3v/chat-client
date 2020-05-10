import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import MessageEvent from '../MessageEvent';

import { ChatEvents } from '../../index';

jest.mock('date-fns', () => ({
  format: jest.fn().mockReturnValue('19/01/1970 09:24:01'),
}));

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
