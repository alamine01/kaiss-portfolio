"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getCVUrl } from "@/lib/firestore";

export default function CVPage() {
    const [cvUrl, setCvUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCV();
    }, []);

    const loadCV = async () => {
        try {
            const url = await getCVUrl();
            setCvUrl(url);
        } catch (error) {
            console.error("Erreur chargement CV:", error);
        }
        setLoading(false);
    };

    return (
        <>
            <Header />
            <main className="page">
                <div className="page-title">
                    <h1>Mon CV</h1>
                    <p>
                        Découvrez mon parcours, mes compétences et mes expériences professionnelles.
                    </p>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "40px 20px",
                    gap: "30px"
                }}>
                    {loading ? (
                        <div className="loading">
                            <div className="spinner"></div>
                        </div>
                    ) : cvUrl ? (
                        <>
                            <iframe
                                src={cvUrl}
                                style={{
                                    width: "100%",
                                    maxWidth: "800px",
                                    height: "80vh",
                                    border: "none",
                                    borderRadius: "12px",
                                    background: "white"
                                }}
                                title="CV Touabi Kaïss"
                            />
                            <a
                                href={cvUrl}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                                style={{ textDecoration: "none" }}
                            >
                                📥 Télécharger le CV
                            </a>
                        </>
                    ) : (
                        <div className="empty-state">
                            <h3>CV non disponible</h3>
                            <p>Le CV sera bientôt disponible au téléchargement.</p>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
