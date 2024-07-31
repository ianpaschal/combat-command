import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from 'zod';

import { useAuth } from '~/components/AuthProvider';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { Separator } from '~/components/ui/separator';
import { supabase } from '~/supabaseClient';

const FormSchema = z.object({
  username: z.string().min(3, {
    message: 'Username must be at least 3 characters.',
  }).max(24, {
    message: 'Username must be less than 25 characters.',
  }),
  email: z.string().min(5, {
    message: 'Title must be at least 5 characters.',
  }),
  password: z.string().min(8, {
    message: 'Description must be at least 8 characters.',
  }),
  givenName: z.string().min(2, {
    message: 'Given name must be at least 2 characters.',
  }),
  surname: z.string().min(2, {
    message: 'Surname must be at least 2 characters.',
  }),
});

export const SignUpPage = (): JSX.Element => {
  const user = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      givenName: '',
      surname: '',
    },
  });
  const onSubmit = async ({ email, password, username, givenName, surname }: z.infer<typeof FormSchema>) => {

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, givenName, surname },
      },
    });
    setLoading(false);
    if (error) {
      toast('Uh oh...', {
        description: (
          <p>{error.message}</p>
        ),
      });
    } else {
      toast('Signed In');
      navigate('/dashboard');
    }
  };

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="grid h-screen place-items-center p-2">
      <Card className="w-full max-w-md flex-1">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Sign up to log your games, join tournaments and connect with the community.</CardDescription>
            </CardHeader>
            <Separator />
            <p>Already got an account? <Link to="/sign-in">Sign In</Link></p>
            <Separator />
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Username" disabled={loading} {...field} />
                    </FormControl>
                    <FormDescription>Your <span className="italic">nom de guerre</span>, visible to all&mdash;friends <span className="italic">and</span> enemies.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" disabled={loading} {...field} />
                    </FormControl>
                    <FormDescription>Hidden by default.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Password" disabled={loading} {...field} />
                    </FormControl>
                    <FormDescription>Minimum 8 characters.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="givenName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Given Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Given Name" disabled={loading} {...field} />
                    </FormControl>
                    <FormDescription>Hidden by default, but required by some tournaments.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="surname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Surname</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Surname" disabled={loading} {...field} />
                    </FormControl>
                    <FormDescription>Hidden by default, but required by some tournaments.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>Sign In</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};
