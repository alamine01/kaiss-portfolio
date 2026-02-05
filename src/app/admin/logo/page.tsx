"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getLogoUrl, setLogoUrl } from "@/lib/firestore";
import { uploadLogo } from "@/lib/storage";

export default function AdminLogoPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [logoUrl, setLogoUrlState] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/admin/login");
            } else {
                setUser(currentUser);
                loadLogo();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const loadLogo = async () => {
        try {
            const url = await getLogoUrl();
            setLogoUrlState(url);
        } catch (error) {
            console.error("Erreur chargement logo:", error);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const url = await uploadLogo(selectedFile);
            await setLogoUrl(url);
            setLogoUrlState(url);
            setSelectedFile(null);
            setPreview(null);
            alert("Logo mis à jour avec succès !");
        } catch (error) {
            console.error("Erreur upload:", error);
            alert("Erreur lors de l'upload du logo");
        }
        setUploading(false);
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
            <header className="admin-header">
                <h1 className="admin-title">Dashboard Admin</h1>
                <nav className="admin-nav">
                    <Link href="/admin">Projets</Link>
                    <Link href="/admin/cv">CV</Link>
                    <Link href="/admin/logo">Logo</Link>
                    <Link href="/" target="_blank">Voir le site</Link>
                </nav>
            </header>

            <div className="admin-content">
                <div className="admin-section">
                    <h2>Logo du site</h2>
                    <p style={{ marginBottom: "20px", color: "#666" }}>
                        Uploadez un logo qui remplacera le &quot;K&quot; dans le header du site.
                    </p>

                    {/* Logo actuel */}
                    {logoUrl && (
                        <div style={{ marginBottom: "30px" }}>
                            <h3 style={{ marginBottom: "15px", color: "#333" }}>Logo actuel</h3>
                            <div style={{
                                width: "150px",
                                height: "150px",
                                background: "linear-gradient(135deg, #FF7B54, #FFB26B)",
                                borderRadius: "15px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "15px"
                            }}>
                                <Image
                                    src={logoUrl}
                                    alt="Logo actuel"
                                    width={120}
                                    height={120}
                                    style={{ objectFit: "contain" }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Upload nouveau logo */}
                    <div style={{ marginBottom: "20px" }}>
                        <h3 style={{ marginBottom: "15px", color: "#333" }}>
                            {logoUrl ? "Changer le logo" : "Ajouter un logo"}
                        </h3>

                        <div className="file-upload" style={{ marginBottom: "20px" }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                id="logo-upload"
                                style={{ display: "none" }}
                            />
                            <label
                                htmlFor="logo-upload"
                                style={{
                                    display: "inline-block",
                                    padding: "15px 30px",
                                    background: "#f0f0f0",
                                    border: "2px dashed #ccc",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    textAlign: "center"
                                }}
                            >
                                {preview ? "Changer l'image" : "Sélectionner une image"}
                            </label>
                        </div>

                        {/* Preview */}
                        {preview && (
                            <div style={{ marginBottom: "20px" }}>
                                <h4 style={{ marginBottom: "10px", color: "#666" }}>Aperçu</h4>
                                <div style={{
                                    width: "150px",
                                    height: "150px",
                                    background: "linear-gradient(135deg, #FF7B54, #FFB26B)",
                                    borderRadius: "15px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    padding: "15px"
                                }}>
                                    <Image
                                        src={preview}
                                        alt="Aperçu logo"
                                        width={120}
                                        height={120}
                                        style={{ objectFit: "contain" }}
                                    />
                                </div>
                            </div>
                        )}

                        {selectedFile && (
                            <button
                                onClick={handleUpload}
                                disabled={uploading}
                                className="btn btn-primary"
                            >
                                {uploading ? "Upload en cours..." : "Enregistrer le logo"}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
