import Navbar from '@/components/layout/navbar'
import Sidebar from '@/components/layout/sidebar'
import MobileNav from '@/components/layout/mobile-nav'
import FloatingActionButton from '@/components/layout/floating-action-button'
import ScrollToTop from '@/components/layout/scroll-to-top'
import InstallPrompt from '@/components/pwa/install-prompt'
import NotificationsInit from '@/components/notifications/notifications-init'
import MessagesInit from '@/components/messages/messages-init'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background pb-16 lg:pb-0">
      <NotificationsInit />
      <MessagesInit />
      <Navbar />
      <div className="flex overflow-x-hidden">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-4 py-6 max-w-full lg:max-w-3xl xl:max-w-4xl overflow-x-hidden">
            {children}
          </div>
        </main>

        {/* Right Sidebar - Desktop Only */}
        <aside className="hidden xl:block w-80 p-6 border-l flex-shrink-0">
          <div className="sticky top-20">
            <h3 className="font-bold text-lg mb-4">Suggested Creators</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                No suggestions yet
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
      <FloatingActionButton />
      <ScrollToTop />
      <InstallPrompt />
    </div>
  )
}
