"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import Image from "next/image";
import { getHeroImageUrl } from "@/lib/firestore";

export default function Home() {
    const [heroUrl, setHeroUrl] = useState<string | null>(null);

    useEffect(() => {
        getHeroImageUrl().then(setHeroUrl);
    }, []);

    return (
        <>
            <Header />
            <main className="page">
                <section className="hero">
                    <div className="hero-content">
                        <h1 className="hero-greeting">Bonjour !</h1>
                        <h2 className="hero-name">Je suis <span>Touabi Kaïss</span></h2>
                        <p className="hero-description">
                            Étudiant en BUT MMI, je suis <strong>cadreur</strong>, <strong>UX/UI designer</strong> et <strong>graphiste junior</strong> spécialisé en <strong>création numérique</strong>. Passionné par l&apos;audiovisuel et le design, j&apos;allie <strong>technique</strong> et <strong>créativité</strong> pour donner vie à des projets percutants. <Link href="/projets-pro" className="hero-link">Découvrez mon univers !</Link>
                        </p>

                        <div className="tools">
                            <p className="tools-label">Outils exploités :</p>
                            <div className="tools-icons">
                                {/* Figma */}
                                <div className="tool-icon" style={{ background: "#1E1E1E" }} title="Figma">
                                    <svg width="16" height="24" viewBox="0 0 38 57" fill="none">
                                        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
                                        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
                                        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
                                        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
                                        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
                                    </svg>
                                </div>
                                {/* Premiere Pro */}
                                <div className="tool-icon" style={{ background: "#00005B" }} title="Adobe Premiere Pro">
                                    <span style={{ color: "#9999FF", fontWeight: "bold", fontSize: "0.85rem" }}>Pr</span>
                                </div>
                                {/* Photoshop */}
                                <div className="tool-icon" style={{ background: "#001E36" }} title="Adobe Photoshop">
                                    <span style={{ color: "#31A8FF", fontWeight: "bold", fontSize: "0.85rem" }}>Ps</span>
                                </div>
                                {/* Illustrator */}
                                <div className="tool-icon" style={{ background: "#330000" }} title="Adobe Illustrator">
                                    <span style={{ color: "#FF9A00", fontWeight: "bold", fontSize: "0.85rem" }}>Ai</span>
                                </div>
                                {/* Lightroom */}
                                <div className="tool-icon" style={{ background: "#001E36" }} title="Adobe Lightroom">
                                    <span style={{ color: "#31A8FF", fontWeight: "bold", fontSize: "0.85rem" }}>Lr</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hero-image">
                        {heroUrl ? (
                            <img
                                src={heroUrl}
                                alt="Touabi Kaïss"
                                className="hero-img-dynamic"
                            />
                        ) : (
                            <div className="hero-image-placeholder">
                                <span>Photo de profil</span>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
}
