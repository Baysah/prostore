import Footer from "@/components/Footer";
import Header from "@/components/shared/header";


interface RootLayoutProps {
    children: React.ReactNode;
}

const RootLayout = ({children}: RootLayoutProps) => {
    return (
      <div className="flex h-screen flex-col">
        <Header />
        <main className="flex-1 wrapper">{children}</main>
        <Footer />
      </div>
    );
}
 
export default RootLayout;