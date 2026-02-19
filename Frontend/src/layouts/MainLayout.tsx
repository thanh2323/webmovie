import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Layout/Navbar";
import { Footer } from "../components/Layout/Footer";

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-background relative selection:bg-primary/30 selection:text-white">
            <Navbar />
            <main className="relative z-0 min-h-screen">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
