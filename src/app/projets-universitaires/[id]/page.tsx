"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { getProjectById } from "@/lib/firestore";
import { Project } from "@/lib/types";

export default function ProjectDetailPage() {
    const params = useParams();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    useEffect(() => {
        if (params.id) {
            loadProject(params.id as string);
        }
    }, [params.id]);

    const loadProject = async (id: string) => {
        setLoading(true);
        try {
            const data = await getProjectById(id);
            setProject(data);
        } catch (error) {
            console.error("Erreur chargement projet:", error);
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <>
                <Header />
                <main className="page">
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                </main>
            </>
        );
    }

    if (!project) {
        return (
            <>
                <Header />
                <main className="page">
                    <div className="project-detail">
                        <Link href="/projets-universitaires" className="back-btn">
                            ← Retour aux projets
                        </Link>
                        <div className="empty-state">
                            <h3>Projet non trouvé</h3>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    const mainImage = project.images[0];
    const otherImages = project.images.slice(1);

    return (
        <>
            <Header />
            <main className="page">
                <div className="project-detail">
                    <Link href="/projets-universitaires" className="back-btn">
                        ← Retour aux projets
                    </Link>

                    <div className="project-detail-header">
                        <h1 className="project-detail-title">{project.title}</h1>
                        <div className="project-detail-meta">
                            <span>{project.domain}</span>
                            <span>•</span>
                            <span>{project.year}</span>
                            {project.tags.length > 0 && (
                                <>
                                    <span>•</span>
                                    <span>{project.tags.join(", ")}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Main content: Image left, Description right */}
                    <div className="project-main-content">
                        <div className="project-main-image">
                            {mainImage && (
                                <Image
                                    src={mainImage}
                                    alt={project.title}
                                    width={600}
                                    height={400}
                                    onClick={() => setLightboxImage(mainImage)}
                                    style={{ cursor: "pointer" }}
                                />
                            )}
                        </div>
                        <div className="project-main-description">
                            <h2>Description</h2>
                            <p>{project.description}</p>

                            {project.tags.length > 0 && (
                                <div className="project-tags">
                                    {project.tags.map((tag, index) => (
                                        <span key={index} className="project-tag">{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Other images gallery */}
                    {otherImages.length > 0 && (
                        <div className="project-other-images">
                            <h3>Galerie</h3>
                            <div className="project-gallery-grid">
                                {otherImages.map((img, index) => (
                                    <div
                                        key={index}
                                        className="gallery-thumb"
                                        onClick={() => setLightboxImage(img)}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${project.title} - Image ${index + 2}`}
                                            width={300}
                                            height={200}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Lightbox */}
            {lightboxImage && (
                <div className="lightbox" onClick={() => setLightboxImage(null)}>
                    <button className="lightbox-close" onClick={() => setLightboxImage(null)}>×</button>
                    <Image
                        src={lightboxImage}
                        alt="Vue agrandie"
                        width={1200}
                        height={800}
                        style={{ objectFit: "contain" }}
                    />
                </div>
            )}
        </>
    );
}
