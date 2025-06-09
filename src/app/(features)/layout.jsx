import { AppSidebar } from "@/components/features/Sidebar";
import SmartBreadcrumb from "@/components/layout/breadCrumb";
import Footer from "@/components/layout/footer";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex min-h-screen flex-col">
        <main className="flex-1 p-4 pb-0 mb-10">
          <SmartBreadcrumb />
          <div className="space-y-2">
            {children}
          </div>
        </main>        
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}