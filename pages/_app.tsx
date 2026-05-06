import type { AppProps } from "next/app";
import Head from "next/head";
import "../src/index.css";

export default function ZenithPayApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#0f766e" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0c1017" media="(prefers-color-scheme: dark)" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
