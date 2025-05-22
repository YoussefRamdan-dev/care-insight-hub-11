
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import { useToast } from '@/hooks/use-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const { toast } = useToast();
  const [authError, setAuthError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    setAuthError(null);
    
    // Demo credentials hint
    if (values.email === 'demo' && values.password === 'demo123') {
      values.email = 'patient@example.com';
      values.password = 'password';
    }

    const user = await login(values.email, values.password);
    
    if (user) {
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      });
      navigate('/dashboard');
    } else {
      setAuthError("Invalid email or password. Try patient@example.com or doctor@example.com.");
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md animate-fade-in">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Login to CareInsight</h1>
            <p className="text-gray-600 mt-2">Access your healthcare dashboard</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {authError && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
                  {authError}
                </div>
              )}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your-email@example.com" {...field} />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>
            <p className="text-gray-500 mt-2">
              <Link to="/forgot-password" className="hover:underline">
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
