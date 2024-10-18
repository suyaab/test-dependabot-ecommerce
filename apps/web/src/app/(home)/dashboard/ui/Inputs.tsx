"use client";

export default function InputComponents() {
  return (
    <section className="container my-8 mb-20">
      <input
        className="form-input"
        type="text"
        value="Entered text"
        onChange={({ target }) => {
          return target.value;
        }}
      />

      <br />

      <input
        className="form-input"
        type="email"
        placeholder="Enter your email"
      />
    </section>
  );
}
