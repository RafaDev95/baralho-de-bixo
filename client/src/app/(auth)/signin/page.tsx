import { SignInForm } from '../../../components/auth/sign-in-form';

export default function SignInPage() {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-8 top-1/4 font-cinzel text-6xl text-ancient-gold transform -rotate-12">
          Magic
        </div>
        <div className="absolute right-8 top-3/4 font-cinzel text-6xl text-ancient-gold transform rotate-12">
          Power
        </div>
      </div>
      <div className="relative z-10 w-full max-w-md">
        <SignInForm />
      </div>
    </div>
  );
}
