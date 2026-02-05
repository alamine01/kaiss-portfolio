"use client";

import { useState } from "react";
import Image from "next/image";

interface ProjectGalleryProps {
    images: string[];
    title: string;
}

export default function ProjectGallery({ images, title }: ProjectGalleryProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const prevImage = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex(lightboxIndex === 0 ? images.length - 1 : lightboxIndex - 1);
        }
    };

    const nextImage = () => {
        if (lightboxIndex !== null) {
            setLightboxIndex(lightboxIndex === images.length - 1 ? 0 : lightboxIndex + 1);
        }
    };

    if (!images || images.length === 0) {
        return (
            <div className="empty-state">
                <h3>Aucune image disponible</h3>
            </div>
        );
    }

    return (
        <>
            <div className="project-gallery">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="gallery-image"
                        onClick={() => openLightbox(index)}
                    >
                        <Image
                            src={image}
                            alt={`${title} - Image ${index + 1}`}
                            width={600}
                            height={400}
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                ))}
            </div>

            {lightboxIndex !== null && (
                <div className="lightbox" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>×</button>

                    {images.length > 1 && (
                        <>
                            <button
                                className="lightbox-nav lightbox-prev"
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            >
                                ‹
                            </button>
                            <button
                                className="lightbox-nav lightbox-next"
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            >
                                ›
                            </button>
                        </>
                    )}

                    <Image
                        src={images[lightboxIndex]}
                        alt={`${title} - Image ${lightboxIndex + 1}`}
                        width={1200}
                        height={800}
                        style={{ objectFit: "contain", maxHeight: "90vh" }}
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
