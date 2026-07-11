import Image from "next/image";
import Link from "next/link";

function Navbar() {
  return (
    <header>
      <nav>
        <Link href="/" className="logo">
          <Image src="/icons/logo.png" alt="logo" width={24} height={24} />
          <p>DevEvent</p>
        </Link>

        <ul>
          <Link href="/events">Events</Link>

          <Link href="/about">About</Link>

          <Link href="/contact">Contact</Link>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
