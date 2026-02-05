"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getHeroImageUrl, setHeroImageUrl } from "@/lib/firestore";
import { uploadHeroImage } from "@/lib/storage";
import AdminHeader from "@/components/AdminHeader";

export default function AdminHeroPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [heroUrl, setHeroUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/admin/login");
            } else {
                setUser(currentUser);
                loadHeroImage();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const loadHeroImage = async () => {
        try {
            const url = await getHeroImageUrl();
            setHeroUrl(url);
        } catch (error) {
            console.error("Erreur chargement image hero:", error);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const url = await uploadHeroImage(selectedFile);
            await setHeroImageUrl(url);
            setHeroUrl(url);
            alert("Image mise à jour avec succès !");
            setSelectedFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error("Erreur upload:", error);
            alert("Erreur lors de l'upload");
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
            <AdminHeader />

            <div className="admin-content">
                <div className="admin-section">
                    <h2>Image d&apos;accueil (Hero)</h2>
                    <p style={{ marginBottom: "30px", color: "#666" }}>
                        Modifiez l&apos;image principale affichée sur la page d&apos;accueil.
                    </p>

                    <div style={{ maxWidth: "500px" }}>
                        <div style={{ marginBottom: "30px", background: "#f5f5f5", padding: "20px", borderRadius: "10px", textAlign: "center" }}>
                            <h3 style={{ marginBottom: "15px", fontSize: "1rem" }}>Aperçu actuel</h3>
                            {heroUrl ? (
                                <div style={{ position: "relative", width: "200px", height: "300px", margin: "0 auto", borderRadius: "10px", overflow: "hidden" }}>
                                    <Image
                                        src={heroUrl}
                                        alt="Hero actuel"
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            ) : (
                                <p style={{ color: "#999" }}>Aucune image définie (affichage par défaut)</p>
                            )}
                        </div>

                        <div className="file-upload">
                            <input
                                type="file"
                                id="hero-upload"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            <label htmlFor="hero-upload" className="file-upload-label">
                                {selectedFile ? "Changer l'image" : "Choisir une nouvelle image"}
                            </label>
                            {selectedFile && <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>{selectedFile.name}</p>}
                        </div>

                        {previewUrl && (
                            <div style={{ margin: "20px 0", textAlign: "center" }}>
                                <p style={{ marginBottom: "10px", fontWeight: "600" }}>Nouvelle image :</p>
                                <div style={{ position: "relative", width: "150px", height: "225px", margin: "0 auto", borderRadius: "10px", overflow: "hidden", border: "2px solid #FF7B54" }}>
                                    <Image
                                        src={previewUrl}
                                        alt="Aperçu"
                                        fill
                                        style={{ objectFit: "cover" }}
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            className="btn btn-primary"
                            style={{ width: "100%", marginTop: "20px" }}
                        >
                            {uploading ? "Envoi en cours..." : "Mettre à jour l'image"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
