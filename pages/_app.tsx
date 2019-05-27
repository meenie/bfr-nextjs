import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../config/theme';

// Convert old BangForReddit.com localStorage into new one
let oldBfrDecksJson: string;
if (process['browser'] && (oldBfrDecksJson = localStorage.getItem('BRF-decks.decks'))) {
  const parsed = JSON.parse(oldBfrDecksJson);

  const newJson = {
    currentDeckId: parsed.currentDeckId,
    deckIds: parsed.ids,
    decks: parsed.entities
  };

  localStorage.setItem('bfr-decks', JSON.stringify(newJson));

  let i = -1;
  while (++i < parsed.ids.length) {
    const deckId = parsed.ids[i];
    const subredditSettings = parsed.entities[deckId].subredditSettings;
    const subredditIds = parsed.entities[deckId].subredditIds;

    let i2 = -1;
    while (++i2 < subredditIds.length) {
      const subredditId = subredditIds[i2];
      localStorage.setItem(
        `subreddit-${deckId}-${subredditId}`,
        subredditSettings[subredditId].type ? `"${subredditSettings[subredditId].type}"` : `"hot"`
      );
    }
  }

  localStorage.removeItem('BRF-decks.decks');
}

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles !== null) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <title>Bang! for Reddit</title>
        </Head>
        <style jsx global>{`
          body,
          html,
          #__next {
            height: 100%;
          }
          html {
            padding-bottom: 136px;
            overflow-x: scroll;
          }
          body {
            overflow: unset !important;
          }
          .gif_player {
            width: 100%;
            height: 100%;
          }
          .gif_player img {
            height: 371px;
            display: block;
            margin: 0 auto;
          }
        `}</style>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </Container>
    );
  }
}

export default MyApp;
