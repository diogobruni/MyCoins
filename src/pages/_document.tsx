import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;600&display=swap" rel="stylesheet" />

          <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        </Head>
        <body className="font-poppins bg-background scrollbar scrollbar-thumb-foreground scrollbar-track-transparent scrollbar-cursor-default">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}