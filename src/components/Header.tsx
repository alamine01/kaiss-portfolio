"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getLogoUrl } from "@/lib/firestore";

export default function Header() {
    const pathname = usePathname();
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        loadLogo();
    }, []);

    const loadLogo = async () => {
        try {
            const url = await getLogoUrl();
            setLogoUrl(url);
        } catch (error) {
            console.error("Erreur chargement logo:", error);
        }
    };

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

    return (
        <header className="header">
            <div className="header-inner">
                <Link href="/" className="logo">
                    {logoUrl ? (
                        <Image
                            src={logoUrl}
                            alt="Logo"
                            width={50}
                            height={50}
                            style={{ objectFit: "contain" }}
                        />
                    ) : (
                        <span>K</span>
                    )}
                </Link>

                <button
                    className="mobile-menu-btn"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Menu"
                >
                    {isMenuOpen ? "✕" : "☰"}
                </button>

                <nav className={`nav ${isMenuOpen ? "mobile-active" : ""}`}>
                    <Link
                        href="/projets-pro"
                        className={`nav-link ${isActive("/projets-pro") ? "active" : ""}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Projets Professionnels
                    </Link>
                    <Link
                        href="/projets-universitaires"
                        className={`nav-link ${isActive("/projets-universitaires") ? "active" : ""}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Projets Universitaires
                    </Link>
                    <Link
                        href="/cv"
                        className={`nav-link ${isActive("/cv") ? "active" : ""}`}
                        onClick={() => setIsMenuOpen(false)}
                    >
                        mon CV
                    </Link>
                    <Link
                        href="/contact"
                        className="nav-icon"
                        title="Contact"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        ✉
                    </Link>
                </nav>
            </div>
        </header>
    );
}
