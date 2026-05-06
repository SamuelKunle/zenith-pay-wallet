import type { AppProps } from "next/app";
import "../src/index.css";

export default function ZenithPayApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
