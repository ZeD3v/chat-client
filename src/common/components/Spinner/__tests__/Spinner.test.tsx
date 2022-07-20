import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Spinner from '../index';

describe('Modal', () => {
  test('renders correctly', () => {
    const { container } = render(<Spinner />);
    expect(container).toMatchSnapshot();
  });
});
