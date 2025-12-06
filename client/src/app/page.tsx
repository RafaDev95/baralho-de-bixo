'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/auth-context';
import { Button } from '../components/ui/button';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Layers,
  Gamepad2,
  Users,
  Zap,
  Shield,
  Sword,
  Trophy,
} from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { isAuthenticated, player } = useAuth();
  const router = useRouter();

  return (
    <main className="bg-mystic-dark text-white font-inter antialiased">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-mystic-dark bg-opacity-90 backdrop-blur-sm shadow-xl p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-cinzel text-ancient-gold font-black"
          >
            AETHERIA
          </Link>
          <nav className="hidden md:flex space-x-8 text-lg">
            <a
              href="#sobre"
              className="hover:text-ancient-gold transition duration-300"
            >
              About
            </a>
            <a
              href="#features"
              className="hover:text-ancient-gold transition duration-300"
            >
              Features
            </a>
            <a
              href="#como-jogar"
              className="hover:text-ancient-gold transition duration-300"
            >
              How to Play
            </a>
          </nav>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="hidden md:block text-sm text-mystic-gray">
                  {player?.username}
                </span>
                <Button
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="border-ancient-gold text-ancient-gold hover:bg-ancient-gold hover:text-mystic-dark"
                >
                  Dashboard
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => router.push('/signin')}
                  variant="ghost"
                  className="text-ancient-gold"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => router.push('/signup')}
                  className="bg-ancient-gold text-mystic-dark hover:bg-ancient-gold/90"
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        id="hero-section"
        className="h-screen flex items-center justify-center text-center p-4 relative bg-mystic-dark overflow-hidden"
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0 bg-mystic-dark bg-opacity-80"
          style={{
            background:
              'linear-gradient(to top, rgba(13, 17, 23, 0.95) 0%, rgba(13, 17, 23, 0.7) 50%, rgba(13, 17, 23, 0.95) 100%)',
          }}
        />

        {/* Runic circle pattern */}
        <div className="runic-circle" />

        <div className="relative z-10 p-6 md:p-12 rounded-xl max-w-6xl mx-auto">
          <h2 className="font-cinzel text-5xl md:text-8xl font-extrabold mb-4 md:mb-6 leading-tight text-ancient-gold text-shadow-purple-glow">
            THE LEGENDARY BATTLE IS YOURS
          </h2>
          <p className="font-inter text-xl md:text-3xl text-white mb-10 max-w-4xl mx-auto">
            Enter a world of legends, magic, and eternal battles. Build your
            legacy in the realm of Aetheria.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            {isAuthenticated ? (
              <Button
                onClick={() => router.push('/rooms')}
                size="lg"
                className="button-metallic px-10 py-4 text-xl font-cinzel text-ancient-gold font-bold uppercase shadow-orange-glow hover:scale-105 transition transform duration-300"
              >
                Play Now
              </Button>
            ) : (
              <Button
                onClick={() => router.push('/signup')}
                size="lg"
                className="button-metallic px-10 py-4 text-xl font-cinzel text-ancient-gold font-bold uppercase shadow-orange-glow hover:scale-105 transition transform duration-300"
              >
                Start Your Journey
              </Button>
            )}
            <Button
              onClick={() => {
                document
                  .getElementById('sobre')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              variant="outline"
              className="button-metallic px-10 py-4 text-xl font-cinzel text-ancient-gold font-bold uppercase border-ancient-gold shadow-purple-glow hover:scale-105 transition transform duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="sobre"
        className="py-20 md:py-32 bg-mystic-dark relative overflow-hidden"
      >
        <div
          className="magical-particle w-2 h-2 bg-emerald-glow top-1/4 left-1/4"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="magical-particle w-1 h-1 bg-ancient-gold bottom-1/3 right-1/2"
          style={{ animationDelay: '1.5s' }}
        />
        <div
          className="magical-particle w-3 h-3 bg-mystic-gray top-2/3 left-3/4"
          style={{ animationDelay: '3s' }}
        />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h3 className="font-cinzel text-4xl md:text-5xl text-center text-ancient-gold mb-12">
            The Legacy of Aetheria
          </h3>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-ancient-scroll text-mystic-gray">
              <h4 className="font-cinzel text-3xl mb-4 text-ancient-gold">
                The Universe
              </h4>
              <p className="mb-4 text-lg">
                Aetheria is a realm forged by gods and destroyed by titans. It
                is the stage of a millennial conflict between Ancient Races and
                Colossal Creatures. Each card is a story, each duel, a legend to
                be engraved in the Stone Annals.
              </p>
              <p className="text-lg">
                Master the arcane arts, summon Hydras and Dragons, and lead your
                clan to victory using Emerald Magic, Stone Force, and Shadow
                Cunning. Your Avatar awaits you.
              </p>
            </div>

            <div className="hidden md:block relative w-full h-[400px]">
              <Image
                src="https://placehold.co/600x400/152030/d4af37?text=Art+of+Hydra+and+Magic"
                alt="Colossal Creature emerging from the mist"
                fill
                className="rounded-lg shadow-2xl border-2 border-emerald-glow object-cover"
                unoptimized
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 md:py-32 bg-mystic-dark border-t border-b border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="font-cinzel text-4xl md:text-5xl text-center text-emerald-glow mb-16">
            Game Features
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: Cards */}
            <Link
              href={isAuthenticated ? '/cards' : '/signup'}
              className="p-6 bg-stone-carving rounded-lg text-center card-rune-border hover:scale-105 transition-transform cursor-pointer"
            >
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-ancient-gold" />
              <h4 className="font-cinzel text-xl font-bold mb-2">
                Card Collection
              </h4>
              <p className="text-sm text-mystic-gray">
                Browse, search, and collect hundreds of unique cards with
                different types, rarities, and abilities.
              </p>
            </Link>

            {/* Feature 2: Decks */}
            <Link
              href={isAuthenticated ? '/decks' : '/signup'}
              className="p-6 bg-stone-carving rounded-lg text-center card-rune-border hover:scale-105 transition-transform cursor-pointer"
            >
              <Layers className="h-12 w-12 mx-auto mb-4 text-emerald-glow" />
              <h4 className="font-cinzel text-xl font-bold mb-2">
                Deck Building
              </h4>
              <p className="text-sm text-mystic-gray">
                Create and customize your decks. Build the perfect strategy with
                your favorite cards.
              </p>
            </Link>

            {/* Feature 3: Game Rooms */}
            <Link
              href={isAuthenticated ? '/rooms' : '/signup'}
              className="p-6 bg-stone-carving rounded-lg text-center card-rune-border hover:scale-105 transition-transform cursor-pointer"
            >
              <Gamepad2 className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="font-cinzel text-xl font-bold mb-2">
                Multiplayer Battles
              </h4>
              <p className="text-sm text-mystic-gray">
                Join or create game rooms. Challenge other players in epic
                turn-based battles.
              </p>
            </Link>

            {/* Feature 4: Players */}
            <Link
              href={isAuthenticated ? '/players' : '/signup'}
              className="p-6 bg-stone-carving rounded-lg text-center card-rune-border hover:scale-105 transition-transform cursor-pointer"
            >
              <Users className="h-12 w-12 mx-auto mb-4 text-mystic-gray" />
              <h4 className="font-cinzel text-xl font-bold mb-2">
                Player Profiles
              </h4>
              <p className="text-sm text-mystic-gray">
                View player statistics, rankings, and achievements. Compete for
                glory and recognition.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section id="como-jogar" className="py-20 md:py-32 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="font-cinzel text-4xl md:text-5xl text-center text-ancient-gold mb-12">
            The Grimoire of First Steps
          </h3>

          <div className="bg-ancient-scroll text-gray-200">
            <ol className="space-y-8">
              {/* Step 1 */}
              <li className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center font-cinzel text-2xl bg-ancient-gold text-mystic-dark rounded-full border-2 border-mystic-dark">
                  1
                </div>
                <div>
                  <p className="font-cinzel text-2xl text-ancient-gold mb-1">
                    Create Your Account
                  </p>
                  <p className="text-lg">
                    Sign up to start your journey. Choose your username and
                    begin collecting cards.
                  </p>
                </div>
              </li>
              {/* Step 2 */}
              <li className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center font-cinzel text-2xl bg-ancient-gold text-mystic-dark rounded-full border-2 border-mystic-dark">
                  2
                </div>
                <div>
                  <p className="font-cinzel text-2xl text-ancient-gold mb-1">
                    Build Your Deck
                  </p>
                  <p className="text-lg">
                    Browse the card collection and create powerful decks. Each
                    card has unique abilities and energy costs.
                  </p>
                </div>
              </li>
              {/* Step 3 */}
              <li className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center font-cinzel text-2xl bg-ancient-gold text-mystic-dark rounded-full border-2 border-mystic-dark">
                  3
                </div>
                <div>
                  <p className="font-cinzel text-2xl text-ancient-gold mb-1">
                    Join a Battle
                  </p>
                  <p className="text-lg">
                    Enter a game room, wait for players, and start your first
                    battle. Manage your energy, play cards strategically, and
                    defeat your opponent.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* Game Mechanics Section */}
      <section className="py-20 md:py-32 bg-mystic-dark border-t border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="font-cinzel text-4xl md:text-5xl text-center text-ancient-gold mb-16">
            Game Mechanics
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-stone-carving rounded-lg text-center card-rune-border">
              <Zap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="font-cinzel text-xl font-bold mb-2">
                Energy System
              </h4>
              <p className="text-sm text-mystic-gray">
                Start with 1 energy per turn. Gain +1 energy each turn (max 10).
                Cards cost energy to play.
              </p>
            </div>

            <div className="p-6 bg-stone-carving rounded-lg text-center card-rune-border">
              <Sword className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h4 className="font-cinzel text-xl font-bold mb-2">Combat</h4>
              <p className="text-sm text-mystic-gray">
                Creatures can attack opponents or other creatures. Use strategy
                to control the battlefield.
              </p>
            </div>

            <div className="p-6 bg-stone-carving rounded-lg text-center card-rune-border">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h4 className="font-cinzel text-xl font-bold mb-2">Defense</h4>
              <p className="text-sm text-mystic-gray">
                Protect your avatar with creatures and spells. The last player
                standing wins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        id="cta-final"
        className="h-[60vh] flex items-center justify-center text-center p-4 relative"
        style={{
          backgroundImage:
            "url('https://placehold.co/1920x800/101825/d4af37?text=Epic+Landscape+with+Storm')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70" />
        <div className="relative z-10 p-6 md:p-12 rounded-xl">
          <h3
            className="font-cinzel text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-xl"
            style={{ textShadow: '0 0 10px rgba(0, 0, 0, 1)' }}
          >
            THE NEXT LEGENDARY BATTLE IS YOURS
          </h3>
          <p className="font-inter text-xl md:text-2xl text-mystic-gray mb-10 max-w-3xl mx-auto">
            Thousands of players await. Start collecting your cards and prove
            your worth in the Aetheria Tournament.
          </p>
          {isAuthenticated ? (
            <Button
              onClick={() => router.push('/rooms')}
              size="lg"
              className="inline-block px-12 py-5 text-2xl font-cinzel rounded-xl bg-emerald-glow text-mystic-dark font-bold uppercase shadow-lg shadow-emerald-600/50 hover:scale-105 transition transform duration-300"
            >
              Find a Game
            </Button>
          ) : (
            <Button
              onClick={() => router.push('/signup')}
              size="lg"
              className="inline-block px-12 py-5 text-2xl font-cinzel rounded-xl bg-emerald-glow text-mystic-dark font-bold uppercase shadow-lg shadow-emerald-600/50 hover:scale-105 transition transform duration-300"
            >
              Begin Your Journey
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-mystic-dark p-8 border-t border-gray-800 text-center">
        <p className="font-cinzel text-ancient-gold mb-2">
          &copy; 2025 Aetheria Card Game. All Rights Reserved.
        </p>
        <div className="text-sm text-mystic-gray space-x-4">
          <Link href="#" className="hover:text-white">
            Terms of Service
          </Link>
          <span>|</span>
          <Link href="#" className="hover:text-white">
            Privacy Policy
          </Link>
          <span>|</span>
          {isAuthenticated && (
            <>
              <Link href="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
              <span>|</span>
            </>
          )}
          <Link href="/signin" className="hover:text-white">
            Sign In
          </Link>
        </div>
      </footer>
    </main>
  );
}
