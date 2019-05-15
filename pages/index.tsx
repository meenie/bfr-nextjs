import React, { useReducer } from 'react';
import Grid from '@material-ui/core/Grid';

import Subreddit from '../components/Subreddit';

const reducer = (state: any, action: any) => {
  const {subreddits} = state;

  switch (action.type) {
    case 'ADD':
      subreddits.push('funny');
      return { ...state, subreddits }
    case 'REMOVE':
      subreddits.pop();
      return { ...state, subreddits }
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatcher] = useReducer(reducer, {subreddits: ['nba', 'warriors', 'politics']});

  const add = () => {
    dispatcher({type: 'ADD'})
  }

  const remove = () => {
    dispatcher({type: 'REMOVE'})
  }

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={() => add()}>Add</button>
        <button onClick={() => remove()}>Remove</button>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="stretch"
        >
          {state.subreddits.map((subreddit: string, index: number) => (
            <Grid
              item
              xs={12}
              md={4}
              key={index}>
                <Subreddit subreddit={subreddit} filter='top' />
            </Grid>
          ))}
        </Grid>
      </header>
    </div>
  );
}