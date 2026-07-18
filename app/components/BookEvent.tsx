"use client";
import { useState } from "react";

function BookEvent() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  }
  return (
    <div id="book-event">
      {submitted ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            // onClick={() => setSubmitted(true)}
            className="button-submit"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}

export default BookEvent;
