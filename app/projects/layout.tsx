import Navbar from "@/components/invest/Navbar";
import Footer from "@/components/invest/Footer";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-black text-white min-h-screen">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
