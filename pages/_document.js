/* eslint-disable react/no-danger, import/no-unresolved */
import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { extractStyles } from "evergreen-ui";
import flush from "styled-jsx/server";

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const page = renderPage();
    // `css` is a string with css from both glamor and ui-box.
    // No need to get the glamor css manually if you are using it elsewhere in your app.
    //
    // `hydrationScript` is a script you should render on the server.
    // It contains a stringified version of the glamor and ui-box caches.
    // Evergreen will look for that script on the client and automatically hydrate
    // both glamor and ui-box.
    const { css, hydrationScript } = extractStyles();

    const styles = flush();

    return {
      ...page,
      css,
      styles,
      hydrationScript
    };
  }

  render() {
    const { css, hydrationScript, styles } = this.props;

    return (
      <html>
        <Head>
          <link rel="shortcut icon" type="image/png" href="/static/favicon.png"/>
          <style dangerouslySetInnerHTML={{ __html: styles }} />
          <style dangerouslySetInnerHTML={{ __html: css }} />
        </Head>

        <body>
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </html>
    );
  }
}
