"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

function Navbar() {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvent</p>
        </Link>

        <ul>
          <Link href="/">Home</Link>

          <Link href="/">Events</Link>

          <Link href="/" onClick={() => posthog.capture("create_event_clicked")}>Create Event</Link>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
