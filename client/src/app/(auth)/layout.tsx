import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mystic-dark text-white font-inter antialiased">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-mystic-dark bg-opacity-90 backdrop-blur-sm shadow-xl p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-cinzel text-ancient-gold font-black"
          >
            AETHERIA
          </Link>
          <Link
            href="/"
            className="text-sm text-mystic-gray hover:text-ancient-gold transition duration-300"
          >
            Back to Home
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}

