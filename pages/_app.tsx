import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../config/theme';

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
					html {
						padding-bottom: 127px;
					}
					body,
					html,
					#__next {
						height: 100%;
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
