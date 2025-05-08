import { AppSidebar } from "@/components/features/Sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="p-4">
            <SidebarTrigger />
            {children}
          </div>
        </SidebarInset>
    </SidebarProvider>
  );
}
