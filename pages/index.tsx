import React from 'react';
import { NoSsr } from '@material-ui/core';
import { observer } from 'mobx-react-lite';

import { StoreProvider } from '../hooks/useStore';
import TopBar from '../components/TopBar';
import Subreddits from '../components/Subreddits';
import AddDeckForm from '../components/AddDeckForm';

const App = () => {
  return (
    <NoSsr>
      <StoreProvider>
        <TopBar />
        <AddDeckForm />
        <Subreddits />
      </StoreProvider>
    </NoSsr>
  );
};

export default observer(App);
