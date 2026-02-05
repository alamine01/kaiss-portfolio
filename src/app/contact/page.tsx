"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { getContactInfo, ContactInfo } from "@/lib/firestore";

export default function ContactPage() {
    const [contact, setContact] = useState<ContactInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadContact();
    }, []);

    const loadContact = async () => {
        try {
            const info = await getContactInfo();
            setContact(info);
        } catch (error) {
            console.error("Erreur chargement contact:", error);
        }
        setLoading(false);
    };

    const emailLink = contact?.email ? `mailto:${contact.email}` : "mailto:contact@touabikaiss.fr";
    const linkedinLink = contact?.linkedin || "https://www.linkedin.com/in/touabikaiss";

    return (
        <>
            <Header />
            <main className="page">
                <div className="page-title">
                    <h1>Contact</h1>
                    <p>
                        Vous avez un projet ? Une question ? N&apos;hésitez pas à me contacter !
                    </p>
                </div>

                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "40px 20px",
                    gap: "30px",
                    maxWidth: "600px",
                    margin: "0 auto"
                }}>
                    <div style={{
                        background: "rgba(255,255,255,0.1)",
                        padding: "40px",
                        borderRadius: "20px",
                        width: "100%",
                        backdropFilter: "blur(10px)"
                    }}>
                        <div style={{ marginBottom: "30px", textAlign: "center" }}>
                            <h2 style={{ fontSize: "1.5rem", marginBottom: "20px" }}>Touabi Kaïss</h2>
                            <p style={{ opacity: 0.9, lineHeight: 1.8 }}>
                                Cadreur • UX/UI Designer • Graphiste
                            </p>
                        </div>

                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "20px",
                            alignItems: "center"
                        }}>
                            <a
                                href={emailLink}
                                className="btn btn-primary"
                                style={{ textDecoration: "none", width: "100%", justifyContent: "center" }}
                            >
                                ✉ Envoyer un email
                            </a>

                            <a
                                href={linkedinLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                                style={{
                                    textDecoration: "none",
                                    width: "100%",
                                    justifyContent: "center",
                                    color: "white",
                                    borderColor: "white"
                                }}
                            >
                                💼 LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
