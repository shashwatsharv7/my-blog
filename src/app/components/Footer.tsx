import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Us Section */}
        <h2 className="text-2xl font-bold mb-6 text-center">Contact Us</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Mithila By Rajnath</h3>
            <p className="text-gray-400">
              A personal blog dedicated to the ancient land of Mithila.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/reference-texts" className="text-gray-400 hover:text-white transition-colors">
                  Reference Texts
                </Link>
              </li>
              <li>
                <Link href="/by-author" className="text-gray-400 hover:text-white transition-colors">
                  By Author
                </Link>
              </li>
              <li>
                <Link href="/miscellaneous" className="text-gray-400 hover:text-white transition-colors">
                  Miscellaneous
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-6">
              {/* Gmail */}
              <a href="mailto:rajnathmisha9@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-8 w-8">
                  <path d="M20.5 3h-17A2.5 2.5 0 001 5.5v13A2.5 2.5 0 003.5 21h17a2.5 2.5 0 002.5-2.5v-13A2.5 2.5 0 0020.5 3zM20.5 5l-8.5 6L3.5 5h17zM3.5 19v-.01L12 12l8.5 6.99V19h-17z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/rajnath.mishra.50"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 320 512" className="h-8 w-8">
                  <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.5 0 225.36 0C141.09 0 89.53 54.42 89.53 153.12V195.3H0v92.7h89.53V512h107.91V288z" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/MishraRajNath?t=9MFSGYwHU4Sh-s-lzyu-SA&s=09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 1200 1227" className="h-8 w-8">
                  <path d="M711.3 529.3L1164.6 0H1060.2L660.1 479.2L338.6 0H0L478.5 707.3L0 1227H104.5L529.6 719.1L871.1 1227H1200L711.3 529.3ZM582.1 653.4L539.1 593.2L144.2 81.7H289.2L616.3 556.1L659.3 616.3L1066.2 1146H920.2L582.1 653.4Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Mithila By Rajnath. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}