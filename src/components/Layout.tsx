import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../styles/layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    return (
        <div className="homepage-layout">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            <div className={sidebarOpen ? "layout-main" : "layout-main sidebar-collapsed"}>
                <Header />
                <div className="page-content">
                    {children}
                </div>
            </div>
        </div>
    );
}
