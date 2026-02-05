"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getCVUrl, setCVUrl } from "@/lib/firestore";
import { uploadCV } from "@/lib/storage";
import AdminHeader from "@/components/AdminHeader";

export default function AdminCVPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cvUrl, setCvUrlState] = useState<string | null>(null);
    const [newCV, setNewCV] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/admin/login");
            } else {
                setUser(currentUser);
                loadCV();
            }
        });

        return () => unsubscribe();
    }, [router]);

    const loadCV = async () => {
        try {
            const url = await getCVUrl();
            setCvUrlState(url);
        } catch (error) {
            console.error("Erreur chargement CV:", error);
        }
        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewCV(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCV) return;

        setSaving(true);
        try {
            const url = await uploadCV(newCV);
            await setCVUrl(url);
            setCvUrlState(url);
            setNewCV(null);
            alert("CV mis à jour avec succès !");
        } catch (error) {
            console.error("Erreur upload CV:", error);
            alert("Erreur lors de l'upload du CV");
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
                    <h2>CV actuel</h2>

                    {cvUrl ? (
                        <div style={{ marginBottom: "30px" }}>
                            <iframe
                                src={cvUrl}
                                style={{
                                    width: "100%",
                                    height: "500px",
                                    border: "1px solid #ddd",
                                    borderRadius: "8px",
                                    marginBottom: "15px"
                                }}
                                title="CV actuel"
                            />
                            <a
                                href={cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                            >
                                📥 Télécharger le CV actuel
                            </a>
                        </div>
                    ) : (
                        <p style={{ color: "#666", marginBottom: "30px" }}>
                            Aucun CV n&apos;a encore été uploadé.
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="admin-section">
                    <h2>Mettre à jour le CV</h2>

                    <div className="form-group">
                        <div
                            className="file-upload"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                            <p className="file-upload-label">
                                📄 Cliquez pour sélectionner un PDF
                            </p>
                        </div>

                        {newCV && (
                            <p style={{ marginTop: "15px", color: "#666" }}>
                                Fichier sélectionné : <strong>{newCV.name}</strong>
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!newCV || saving}
                    >
                        {saving ? "Upload en cours..." : "Mettre à jour le CV"}
                    </button>
                </form>
            </div>
        </div>
    );
}
