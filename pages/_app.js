import React from "react";
import App, { Container } from "next/app";
import Progress from "react-progress-2";
import Head from "next/head";

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Thesaurus | Find Synonyms and translate to other languages.</title>
          <meta name="description" content="Thesaurus helps in finding synonyms of any word including suggestion from other languages."/>
          <link rel="stylesheet" href="/static/progress.css" />
        </Head>
        <Container>
          <Progress.Component />
          <Component {...pageProps} />
        </Container>
      </>
    );
  }
}
