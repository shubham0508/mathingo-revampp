import Footer from '@/components/layout/footer';
import Header from '@/components/layout/header';

export default function MarketingLayout({ children }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header className="bg-mathz-radial"/>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
