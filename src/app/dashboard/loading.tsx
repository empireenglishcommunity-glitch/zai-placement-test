import { Navbar, Footer } from '@/components/empire';
import { Loader2 } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col empire-bg">
      <Navbar />
      <main className="flex-1 relative z-10 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#c9a84c] animate-spin mx-auto" />
          <p className="font-[family-name:var(--font-heading)] text-[#8b7355] text-sm tracking-wider">
            Loading your command center...
          </p>
        </div>
      </main>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
