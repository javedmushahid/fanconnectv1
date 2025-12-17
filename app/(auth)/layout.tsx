import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Link href="/">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FanConnect
              </h1>
            </Link>
          </div>
          {children}
        </div>
      </div>

      {/* Right Side - Image/Illustration */}
      <div className="hidden lg:block relative bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white space-y-6">
            <h2 className="text-4xl font-bold">
              Connect with your favorite creators
            </h2>
            <p className="text-xl text-blue-100">
              Exclusive content, direct messaging, and more.
            </p>
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm text-blue-100">Creators</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">500K+</div>
                <div className="text-sm text-blue-100">Subscribers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">1M+</div>
                <div className="text-sm text-blue-100">Posts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
