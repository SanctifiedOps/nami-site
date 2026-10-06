"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container-shell flex min-h-[80svh] items-center pt-24 pb-16">
      <div className="grid w-full gap-10 border-t-2 border-accent pt-8 md:grid-cols-[minmax(0,1fr)_20rem] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
            Something went wrong
          </p>
          <h1 className="type-page-title mt-5 max-w-3xl">
            This page couldn’t load properly
          </h1>
        </div>
        <div className="md:border-l md:border-line md:pl-8">
          <p className="type-body">
            Your information is safe. Try the page again, or return to the homepage if the problem continues.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-soft"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-md border border-line-strong px-5 py-3 text-sm font-semibold text-fg transition-colors hover:border-accent"
            >
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
