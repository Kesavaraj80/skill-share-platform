import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Skill Share Marketplace
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Connect with skilled professionals or offer your expertise
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="default" size="lg">
              <Link href="/auth/signup">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>For Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• Showcase your skills and expertise</li>
                <li>• Find relevant projects</li>
                <li>• Set your own rates</li>
                <li>• Work on your terms</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>For Users</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700">
                <li>• Post your requirements</li>
                <li>• Find skilled professionals</li>
                <li>• Compare offers</li>
                <li>• Manage projects easily</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
