import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.ico";
export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col items-center gap-3">
        {/* Top row: logo | links | copyright, links truly centered via grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <Image
              src={Logo}
              className="w-10"
              alt="logo"
              width={100}
              height={100}
            />
            <span className="text-sm tracking-tight text-gray-700">
              <span>
                <strong>Apply</strong>Craft
              </span>
              <p className="text-gray-500">
                Craft applications that get noticed.
              </p>
            </span>
          </div>

          <div className="flex items-center justify-center gap-5">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/#faq"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              FAQ
            </Link>
            <a
              href="mailto:hello@applycraft.xyz"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Contact
            </a>
          </div>

          <p className="text-xs text-gray-400 text-center sm:text-right">
            &copy; {new Date().getFullYear()} ApplyCraft. All rights reserved.
          </p>
        </div>

        <p className="text-xs text-gray-400">
          Crafted with ❤️ By{" "}
          <a
            className="text-blue-700 hover:underline"
            href="https://nijanadhikari.com.np"
            target="_blank"
            rel="noopener noreferrer"
          >
            Nijan Adhikari
          </a>
        </p>
      </div>
    </footer>
  );
}
