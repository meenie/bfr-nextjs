/* eslint-env jest */

import { mount } from 'enzyme';
import React from 'react';

import TopBar from '../components/TopBar';
import { StoreProvider } from '../hooks/useStore';

describe('With Enzyme', () => {
  it('App shows "Bang! for Reddit', () => {
    const topBar = mount(
      <StoreProvider>
        <TopBar />
      </StoreProvider>
    );

    expect(topBar.find('.MuiTypography-h6').text()).toEqual('Bang! for Reddit');
  });
});
