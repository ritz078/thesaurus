import React from "react";
import App, { Container } from "next/app";
import Progress from "react-progress-2";

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
        <link rel="stylesheet" href="/static/progress.css" />
        <Container>
          <Progress.Component />
          <Component {...pageProps} />
        </Container>
      </>
    );
  }
}
