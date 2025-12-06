'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthSignIn } from '../../hooks/auth/use-auth-sign-in';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const router = useRouter();
  const signInMutation = useAuthSignIn();

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = (data: SignInFormValues) => {
    signInMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          router.push('/dashboard');
        } else {
          form.setError('root', {
            message: response.error || 'Failed to sign in',
          });
        }
      },
      onError: (error: Error) => {
        form.setError('root', {
          message: error.message || 'Failed to sign in',
        });
      },
    });
  };

  return (
    <Card className="w-full max-w-md bg-stone-carving border-2 border-ancient-gold shadow-gold-glow">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-cinzel font-bold text-ancient-gold">
          Welcome back
        </CardTitle>
        <CardDescription className="text-mystic-gray">
          Enter your email to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-500">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-mystic-gray">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      className="bg-mystic-dark/50 border-mystic-gray text-white placeholder:text-mystic-gray focus:border-ancient-gold"
                      {...field}
                      disabled={signInMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-ancient-gold text-mystic-dark hover:bg-ancient-gold/90 font-cinzel font-bold uppercase shadow-gold-glow"
              disabled={signInMutation.isPending}
            >
              {signInMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>

            <div className="text-center text-sm text-mystic-gray">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-ancient-gold hover:text-ancient-gold/80 hover:underline font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
