import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session as Session}>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
        <Component {...pageProps} />
      {/* </Suspense> */}
    </SessionProvider>
  );
}
