import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var hour = parseInt(new Intl.DateTimeFormat("en-US", {
                    timeZone: "Asia/Kolkata", hour: "numeric", hour12: false
                  }).format(new Date()), 10);
                  var isLight = hour >= 5 && hour < 12;
                  if (!isLight) document.documentElement.classList.add("dark");
                } catch (e) {}
              })();
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}