"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getContactInfo, setContactInfo } from "@/lib/firestore";
import AdminHeader from "@/components/AdminHeader";

export default function AdminContactPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState("");
    const [linkedin, setLinkedin] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/admin/login");
            } else {
                setUser(currentUser);
                loadContact();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const loadContact = async () => {
        try {
            const info = await getContactInfo();
            if (info) {
                setEmail(info.email || "");
                setLinkedin(info.linkedin || "");
            }
        } catch (error) {
            console.error("Erreur chargement contact:", error);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setContactInfo({ email, linkedin });
            alert("Informations de contact sauvegardées !");
        } catch (error) {
            console.error("Erreur sauvegarde:", error);
            alert("Erreur lors de la sauvegarde");
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <div className="admin-container">
                <div className="loading" style={{ minHeight: "100vh" }}>
                    <div className="spinner" style={{ borderColor: "#ddd", borderTopColor: "#FF7B54" }}></div>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="admin-container">
            <AdminHeader />

            <div className="admin-content">
                <div className="admin-section">
                    <h2>Informations de contact</h2>
                    <p style={{ marginBottom: "30px", color: "#666" }}>
                        Configurez votre email et lien LinkedIn pour la page contact.
                    </p>

                    <div style={{ maxWidth: "500px" }}>
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="votre@email.com"
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "2px solid #ddd",
                                    borderRadius: "10px",
                                    fontSize: "1rem"
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <label style={{ display: "block", marginBottom: "8px", fontWeight: "600" }}>
                                Lien LinkedIn
                            </label>
                            <input
                                type="url"
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                placeholder="https://linkedin.com/in/votre-profil"
                                style={{
                                    width: "100%",
                                    padding: "12px 15px",
                                    border: "2px solid #ddd",
                                    borderRadius: "10px",
                                    fontSize: "1rem"
                                }}
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn btn-primary"
                            style={{ width: "100%" }}
                        >
                            {saving ? "Sauvegarde..." : "Enregistrer"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
