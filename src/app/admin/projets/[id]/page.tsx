"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getProjectById, addProject, updateProject } from "@/lib/firestore";
import { uploadProjectImage } from "@/lib/storage";
import { Project } from "@/lib/types";

export default function ProjectFormPage() {
    const router = useRouter();
    const params = useParams();
    const isEdit = params.id && params.id !== "nouveau";

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState<"pro" | "universitaire">("pro");
    const [domain, setDomain] = useState("Audiovisuel");
    const [year, setYear] = useState("2024");
    const [tags, setTags] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/admin/login");
            } else {
                setUser(currentUser);
                if (isEdit) {
                    loadProject(params.id as string);
                } else {
                    setLoading(false);
                }
            }
        });

        return () => unsubscribe();
    }, [router, isEdit, params.id]);

    const loadProject = async (id: string) => {
        try {
            const project = await getProjectById(id);
            if (project) {
                setTitle(project.title);
                setDescription(project.description);
                setType(project.type);
                setDomain(project.domain);
                setYear(project.year);
                setTags(project.tags.join(", "));
                setImages(project.images);
            }
        } catch (error) {
            console.error("Erreur chargement projet:", error);
        }
        setLoading(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setNewImages([...newImages, ...Array.from(e.target.files)]);
        }
    };

    const removeNewImage = (index: number) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            let allImages = [...images];

            // Upload new images
            if (newImages.length > 0) {
                const projectId = isEdit ? (params.id as string) : Date.now().toString();

                for (let i = 0; i < newImages.length; i++) {
                    const url = await uploadProjectImage(
                        newImages[i],
                        projectId,
                        allImages.length + i
                    );
                    allImages.push(url);
                }
            }

            const projectData = {
                title,
                description,
                type,
                domain,
                year,
                tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                images: allImages,
                thumbnail: allImages[0] || "",
            };

            if (isEdit) {
                await updateProject(params.id as string, projectData);
            } else {
                await addProject(projectData);
            }

            router.push("/admin");
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
            <header className="admin-header">
                <h1 className="admin-title">
                    {isEdit ? "Modifier le projet" : "Nouveau projet"}
                </h1>
                <nav className="admin-nav">
                    <Link href="/admin">← Retour</Link>
                </nav>
            </header>

            <div className="admin-content">
                <form onSubmit={handleSubmit} className="admin-section">
                    <div className="form-group">
                        <label htmlFor="title">Titre du projet *</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Ex: Shooting photo événement"
                        />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div className="form-group">
                            <label htmlFor="type">Type de projet *</label>
                            <select
                                id="type"
                                value={type}
                                onChange={(e) => setType(e.target.value as "pro" | "universitaire")}
                            >
                                <option value="pro">Professionnel</option>
                                <option value="universitaire">Universitaire</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="domain">Domaine *</label>
                            <select
                                id="domain"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                            >
                                <option value="Audiovisuel">Audiovisuel</option>
                                <option value="Photographie">Photographie</option>
                                <option value="Design">Design</option>
                                <option value="Illustration">Illustration</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div className="form-group">
                            <label htmlFor="year">Année *</label>
                            <select
                                id="year"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                            >
                                <option value="2024">2024</option>
                                <option value="2025">2025</option>
                                <option value="BUT 1">BUT 1</option>
                                <option value="BUT 1&2">BUT 1&2</option>
                                <option value="BUT 2">BUT 2</option>
                                <option value="BUT 3">BUT 3</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="tags">Tags (séparés par virgule)</label>
                            <input
                                type="text"
                                id="tags"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="Ex: photographie, événement, portrait"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description *</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Décrivez le projet, le contexte, les objectifs..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Images du projet</label>

                        {/* Existing images */}
                        {images.length > 0 && (
                            <div className="file-preview" style={{ marginBottom: "15px" }}>
                                {images.map((url, index) => (
                                    <div key={index} className="file-preview-item">
                                        <img src={url} alt={`Image ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="file-preview-remove"
                                            onClick={() => removeExistingImage(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New images preview */}
                        {newImages.length > 0 && (
                            <div className="file-preview" style={{ marginBottom: "15px" }}>
                                {newImages.map((file, index) => (
                                    <div key={index} className="file-preview-item">
                                        <img src={URL.createObjectURL(file)} alt={`Nouvelle image ${index + 1}`} />
                                        <button
                                            type="button"
                                            className="file-preview-remove"
                                            onClick={() => removeNewImage(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div
                            className="file-upload"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                            <p className="file-upload-label">
                                📷 Cliquez pour ajouter des images
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? "Enregistrement..." : isEdit ? "Mettre à jour" : "Créer le projet"}
                        </button>
                        <Link href="/admin" className="btn btn-secondary">
                            Annuler
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
