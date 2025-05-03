import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function DefaultLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-7xl px-6 flex-grow pt-2">
                {children}
            </main>
            <Footer></Footer>
        </div>
    );
}
