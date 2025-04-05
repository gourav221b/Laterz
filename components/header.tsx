import Github from '@/public/github-mark.png'
import Link from "next/link"

export default function Header() {
  return (
    <header className="w-full bg-lavender-100 border-b border-lavender-200 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
          <h1 className="text-2xl font-bold">
            <span className="text-gray-800">Laterz</span>
          </h1>
          </Link>
        </div>
        <nav className="flex items-center space-x-6">
         
          <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
            About
          </Link>
          <Link
            href="https://github.com/gourav221b/Laterz"
            className="flex items-center text-gray-700 hover:text-purple-600 transition-colors"
          >
            <img src={Github.src} alt="GitHub" width={20} height={20} />

          </Link>
          
        </nav>
      </div>
    </header>
  )
}

