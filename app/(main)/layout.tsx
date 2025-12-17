import Navbar from '@/components/layout/navbar'
import Sidebar from '@/components/layout/sidebar'
import MobileNav from '@/components/layout/mobile-nav'
import FloatingActionButton from '@/components/ui/floating-action-button'
import ScrollToTop from '@/components/ui/scroll-to-top'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 max-w-2xl lg:max-w-3xl mx-auto px-4 py-6 lg:py-8">
          {children}
        </main>
        <aside className="hidden xl:block w-80 p-6 border-l">
          <div className="sticky top-20">
            <h3 className="font-bold text-lg mb-4">Suggested Creators</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">No suggestions yet</p>
            </div>
          </div>
        </aside>
      </div>
      <MobileNav />
      <FloatingActionButton />
      <ScrollToTop />
    </div>
  )
}
