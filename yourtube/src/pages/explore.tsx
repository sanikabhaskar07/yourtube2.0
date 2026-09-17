import Head from "next/head";
import Link from "next/link";

export default function Explore() {
  return (
    <>
      <Head>
        <title>Explore - YourTube</title>
      </Head>

      <main className="min-h-screen bg-white px-6 py-8 text-black dark:bg-black dark:text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Explore</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Discover videos and content on YourTube.
              </p>
            </div>

            <Link
              href="/"
              className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/"
              className="rounded-xl border border-gray-200 p-6 transition hover:shadow-md dark:border-gray-800"
            >
              <h2 className="text-xl font-semibold">Trending</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Watch popular videos.
              </p>
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-gray-200 p-6 transition hover:shadow-md dark:border-gray-800"
            >
              <h2 className="text-xl font-semibold">Music</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Explore music videos.
              </p>
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-gray-200 p-6 transition hover:shadow-md dark:border-gray-800"
            >
              <h2 className="text-xl font-semibold">Technology</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Discover technology content.
              </p>
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-gray-200 p-6 transition hover:shadow-md dark:border-gray-800"
            >
              <h2 className="text-xl font-semibold">Gaming</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Find gaming videos.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}