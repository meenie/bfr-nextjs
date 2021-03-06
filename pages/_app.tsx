import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../config/theme';
import { convertOldBFR } from '../utils/convert_old_bfr';

convertOldBFR();

class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
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
            overflow-y: hidden;
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
      </>
    );
  }
}

export default MyApp;
