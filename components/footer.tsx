import Github from "@/public/github-mark.png"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-lavender-100 border-t border-lavender-200 py-6 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-700">
              © {new Date().getFullYear()} Laterz. Created by{" "}
              <Link
                href="https://devgg.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline"
              >
                Gourav
              </Link>
            </p>
          </div>
          <div className="flex space-x-6">
            <Link
              href="https://github.com/gourav/Laterz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-purple-600 transition-colors flex items-center"
            ><img src={Github.src} alt="GitHub" width={20} height={20} className="mr-2" />

              <span>GitHub</span>
            </Link>
            <Link href="#" className="text-gray-700 hover:text-purple-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Laterz is not responsible for missed deadlines, angry bosses, or existential crises.</p>
        </div>
      </div>
    </footer>
  )
}

