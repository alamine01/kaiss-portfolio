"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getProjects, deleteProject } from "@/lib/firestore";
import { Project } from "@/lib/types";
import AdminHeader from "@/components/AdminHeader";

export default function AdminDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/admin/login");
            } else {
                setUser(currentUser);
                loadProjects();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [router]);

    const loadProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error("Erreur chargement projets:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) return;

        setDeleting(id);
        try {
            await deleteProject(id);
            setProjects(projects.filter((p) => p.id !== id));
        } catch (error) {
            console.error("Erreur suppression:", error);
            alert("Erreur lors de la suppression");
        }
        setDeleting(null);
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2>Gestion des projets</h2>
                        <Link href="/admin/projets/nouveau" className="btn btn-primary">
                            + Nouveau projet
                        </Link>
                    </div>

                    {projects.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
                            <p>Aucun projet pour le moment.</p>
                            <Link href="/admin/projets/nouveau" className="btn btn-primary" style={{ marginTop: "20px" }}>
                                Créer votre premier projet
                            </Link>
                        </div>
                    ) : (
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Titre</th>
                                    <th>Type</th>
                                    <th>Domaine</th>
                                    <th>Année</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project) => (
                                    <tr key={project.id}>
                                        <td>{project.title}</td>
                                        <td>{project.type === "pro" ? "Professionnel" : "Universitaire"}</td>
                                        <td>{project.domain}</td>
                                        <td>{project.year}</td>
                                        <td className="admin-actions">
                                            <Link
                                                href={`/admin/projets/${project.id}`}
                                                className="btn btn-secondary"
                                                style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                                            >
                                                Modifier
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="btn btn-danger"
                                                disabled={deleting === project.id}
                                                style={{ padding: "6px 12px", fontSize: "0.85rem" }}
                                            >
                                                {deleting === project.id ? "..." : "Supprimer"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
