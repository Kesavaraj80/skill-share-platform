import Link from "next/link";

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
            <Link
              href="/auth/signup"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg border border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              For Providers
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Showcase your skills and expertise</li>
              <li>• Find relevant projects</li>
              <li>• Set your own rates</li>
              <li>• Work on your terms</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              For Users
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>• Post your requirements</li>
              <li>• Find skilled professionals</li>
              <li>• Compare offers</li>
              <li>• Manage projects easily</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
