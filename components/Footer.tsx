import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#E5E0D8] py-14 text-[#1F2937]">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1400px] px-6 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_repeat(4,0.95fr)]">
          <div className="space-y-4">
            <p className="text-lg font-semibold text-[#111111]">BatchNGo</p>
            <p className="max-w-sm text-sm leading-7 text-[#7C7A74]">
              A premium marketplace for brands and makers seeking refined
              small-batch production.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7C7A74]">
              Marketplace
            </p>
            <ul className="space-y-2 text-sm text-[#7C7A74]">
              <li>
                <Link
                  href="/find-makers"
                  className="transition hover:text-[#111111]"
                >
                  Browse Makers
                </Link>
              </li>
              <li>
                <Link
                  href="/post-project"
                  className="transition hover:text-[#111111]"
                >
                  Post a Project
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7C7A74]">
              Makers
            </p>
            <ul className="space-y-2 text-sm text-[#7C7A74]">
              <li>
                <Link
                  href="/for-manufacturers/apply"
                  className="transition hover:text-[#111111]"
                >
                  Join as a Maker
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="transition hover:text-[#111111]"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7C7A74]">
              Resources
            </p>
            <ul className="space-y-2 text-sm text-[#7C7A74]">
              <li>
                <Link
                  href="/guides"
                  className="transition hover:text-[#111111]"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="transition hover:text-[#111111]"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7C7A74]">
              Company
            </p>
            <ul className="space-y-2 text-sm text-[#7C7A74]">
              <li>
                <Link href="/about" className="transition hover:text-[#111111]">
                  About
                </Link>
              </li>
              <li>
                <Link href="/terms" className="transition hover:text-[#111111]">
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="transition hover:text-[#111111]"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#E5E0D8] pt-6 text-sm text-[#7C7A74] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2024 BatchNGo Marketplace. All rights reserved.</p>
          <div className="flex flex-wrap gap-6">
            <Link href="/privacy" className="transition hover:text-[#111111]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[#111111]">
              Terms
            </Link>
            <Link href="/contact" className="transition hover:text-[#111111]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
