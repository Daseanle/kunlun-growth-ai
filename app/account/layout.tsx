import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { AccountNav } from "@/components/account-nav";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="page shell auth">
        <AccountNav />
        {children}
      </main>
      <Footer />
    </>
  );
}
