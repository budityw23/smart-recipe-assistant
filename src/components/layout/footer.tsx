import { Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <p className="text-sm text-muted-foreground">
            Built with{' '}
            <Heart className="inline h-4 w-4 text-red-500" />{' '}
            using Next.js, TypeScript & Google Gemini AI
          </p>
          <p className="text-xs text-muted-foreground">
            © {currentYear} Smart Recipe Assistant. Budi Triwibowo portfolio's showcase.
          </p>
        </div>
      </div>
    </footer>
  )
}