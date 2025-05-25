import { AppSidebar } from "@/components/features/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="w-full">
        <div className="p-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
