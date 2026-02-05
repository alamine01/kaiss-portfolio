"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminHeader() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            router.push("/admin/login");
        } catch (error) {
            console.error("Erreur déconnexion:", error);
        }
    };

    const isActive = (path: string) => {
        if (path === "/admin") {
            return pathname === "/admin" || pathname.startsWith("/admin/projets");
        }
        return pathname.startsWith(path);
    };

    return (
        <header className="admin-header">
            <h1 className="admin-title">Dashboard Admin</h1>

            <button
                className="mobile-menu-btn admin-mobile-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Menu Admin"
                style={{ color: "var(--color-dark)" }} // Force dark color for visibility on white bg
            >
                {isMenuOpen ? "✕" : "☰"}
            </button>

            <nav className={`admin-nav ${isMenuOpen ? "mobile-active" : ""}`}>
                <Link
                    href="/admin"
                    className={isActive("/admin") ? "active" : ""}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Projets
                </Link>
                <Link
                    href="/admin/cv"
                    className={isActive("/admin/cv") ? "active" : ""}
                    onClick={() => setIsMenuOpen(false)}
                >
                    CV
                </Link>
                <Link
                    href="/admin/logo"
                    className={isActive("/admin/logo") ? "active" : ""}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Logo
                </Link>
                <Link
                    href="/admin/contact"
                    className={isActive("/admin/contact") ? "active" : ""}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Contact
                </Link>
                <Link
                    href="/admin/hero"
                    className={isActive("/admin/hero") ? "active" : ""}
                    onClick={() => setIsMenuOpen(false)}
                >
                    Accueil
                </Link>
                <Link href="/" target="_blank" className="view-site-link">
                    Voir le site ↗
                </Link>
                <button
                    onClick={handleLogout}
                    className="logout-btn"
                >
                    Déconnexion
                </button>
            </nav>
        </header>
    );
}
