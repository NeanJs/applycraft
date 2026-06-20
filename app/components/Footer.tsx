import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col items-center gap-3">
        {/* Top row: logo | links | copyright — links truly centered via grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 items-center gap-3">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <img src="/logo.ico" width={32} height={32} alt="ApplyCraftLogo" />
            <span className="text-xs font-medium text-gray-500">
              ApplyCraft
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
