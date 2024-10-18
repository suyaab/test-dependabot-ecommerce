"use client";

export default function Error() {
  // TODO: log errors to newrelic

  return (
    <div className="container">
      <div className="flex h-96 w-full flex-col items-center justify-center">
        <h2>Oh No!</h2>
        <p>We had an exception</p>
      </div>
    </div>
  );
}
