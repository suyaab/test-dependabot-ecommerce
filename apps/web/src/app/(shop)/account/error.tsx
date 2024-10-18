"use client";

export default function Error() {
  // TODO: log errors to newrelic

  return (
    <div className="container">
      <div className="flex h-96 w-full flex-col items-center justify-center">
        <h2>Oh No!</h2>
        <p>We had an exception</p>

        <a href="/api/auth/logout" className="mt-11 underline">
          Logout
        </a>
      </div>
    </div>
  );
}
