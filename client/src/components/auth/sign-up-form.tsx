'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthSignUp } from '../../hooks/auth/use-auth-sign-up';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Alert, AlertDescription } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores'
    ),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const signUpMutation = useAuthSignUp();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    signUpMutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          router.push('/dashboard');
        } else {
          form.setError('root', {
            message: response.error || 'Failed to sign up',
          });
        }
      },
      onError: (error: Error) => {
        form.setError('root', {
          message: error.message || 'Failed to sign up',
        });
      },
    });
  };

  return (
    <Card className="w-full max-w-md bg-stone-carving border-2 border-ancient-gold shadow-gold-glow">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-cinzel font-bold text-ancient-gold">
          Create an account
        </CardTitle>
        <CardDescription className="text-mystic-gray">
          Enter your information to get started with Aetheria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {form.formState.errors.root && (
              <Alert
                variant="destructive"
                className="bg-red-900/20 border-red-500"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-200">
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-mystic-gray">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Choose a username"
                      className="bg-mystic-dark/50 border-mystic-gray text-white placeholder:text-mystic-gray focus:border-ancient-gold"
                      {...field}
                      disabled={signUpMutation.isPending}
                    />
                  </FormControl>
                  <FormDescription className="text-mystic-gray">
                    This will be your display name in the game
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      disabled={signUpMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-mystic-gray">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      className="bg-mystic-dark/50 border-mystic-gray text-white placeholder:text-mystic-gray focus:border-ancient-gold"
                      {...field}
                      disabled={signUpMutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-ancient-gold text-mystic-dark hover:bg-ancient-gold/90 font-cinzel font-bold uppercase shadow-gold-glow"
              disabled={signUpMutation.isPending}
            >
              {signUpMutation.isPending ? 'Creating account...' : 'Sign Up'}
            </Button>

            <div className="text-center text-sm text-mystic-gray">
              Already have an account?{' '}
              <Link
                href="/signin"
                className="text-ancient-gold hover:text-ancient-gold/80 hover:underline font-medium transition-colors"
              >
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
