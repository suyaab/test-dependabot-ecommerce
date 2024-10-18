"use client";

import Button from "~/components/Button";

export default function ButtonComponents() {
  return (
    <section className="container my-8 mb-20">
      <div className="flex w-1/3 items-center justify-between">
        <div className="bg-charcoal p-4">
          <Button text="Light" onClick={() => null} variant="light" />
        </div>
        <Button text="Dark" onClick={() => null} variant="dark" />
        <Button text="Outline" onClick={() => null} variant="outline" />
      </div>
    </section>
  );
}
