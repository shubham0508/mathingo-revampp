import Footer from '@/components/layout/footer';

export default function AuthLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
