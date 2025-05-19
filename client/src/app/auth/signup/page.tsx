"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function SignupSelection() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Join our skill share marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild variant="default" className="w-full">
            <Link href="/auth/signup/user">Sign up as a User</Link>
          </Button>
          <Button asChild variant="secondary" className="w-full">
            <Link href="/auth/signup/provider">Sign up as a Provider</Link>
          </Button>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
