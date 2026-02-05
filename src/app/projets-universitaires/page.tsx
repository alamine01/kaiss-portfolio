"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import DropdownFilter from "@/components/DropdownFilter";
import { getProjectsByFilter } from "@/lib/firestore";
import { Project } from "@/lib/types";

const domainFilters = [
    { label: "Audiovisuel", value: "Audiovisuel" },
    { label: "Photographie", value: "Photographie" },
    { label: "Design", value: "Design" },
    { label: "Illustration", value: "Illustration" },
];

const yearFilters = [
    { label: "BUT 1", value: "BUT 1" },
    { label: "BUT 1&2", value: "BUT 1&2" },
    { label: "BUT 2", value: "BUT 2" },
    { label: "BUT 3", value: "BUT 3" },
];

export default function ProjetsUniversitairesPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [domainFilter, setDomainFilter] = useState("");
    const [yearFilter, setYearFilter] = useState("");

    useEffect(() => {
        loadProjects();
    }, [domainFilter, yearFilter]);

    const loadProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getProjectsByFilter(
                "universitaire",
                domainFilter || undefined,
                yearFilter || undefined
            );
            setProjects(data);
        } catch (err) {
            console.error("Erreur chargement projets:", err);
            setError("Impossible de charger les projets. Vérifiez votre connexion.");
        }
        setLoading(false);
    };

    return (
        <>
            <Header />
            <main className="page">
                <div className="page-title">
                    <h1>Projets Universitaires</h1>
                    <p>
                        Découvrez mes projets réalisés dans le cadre de ma formation en BUT MMI.
                        Ces travaux académiques reflètent mon évolution et mes apprentissages.
                    </p>
                </div>

                <div className="filters-container">
                    <DropdownFilter
                        label="Domaine"
                        options={domainFilters}
                        value={domainFilter}
                        onChange={setDomainFilter}
                        placeholder="Tous les domaines"
                    />
                    <DropdownFilter
                        label="Année"
                        options={yearFilters}
                        value={yearFilter}
                        onChange={setYearFilter}
                        placeholder="Toutes les années"
                    />
                </div>

                {loading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <h3>Erreur de connexion</h3>
                        <p>{error}</p>
                        <button onClick={loadProjects} className="btn btn-primary" style={{ marginTop: "20px" }}>
                            Réessayer
                        </button>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="empty-state">
                        <h3>Aucun projet trouvé</h3>
                        <p>Modifiez les filtres ou ajoutez des projets depuis l&apos;admin.</p>
                    </div>
                ) : (
                    <div className="projects-grid">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                basePath="/projets-universitaires"
                            />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}
