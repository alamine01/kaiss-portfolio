"use client";

import Image from "next/image";
import Link from "next/link";
import { Project } from "@/lib/types";

interface ProjectCardProps {
    project: Project;
    basePath: string;
}

export default function ProjectCard({ project, basePath }: ProjectCardProps) {
    return (
        <Link href={`${basePath}/${project.id}`} className="project-card">
            <div className="project-image">
                {project.thumbnail ? (
                    <Image
                        src={project.thumbnail}
                        alt={project.title}
                        width={400}
                        height={300}
                        style={{ objectFit: "cover" }}
                    />
                ) : (
                    <div style={{
                        width: "100%",
                        height: "100%",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <span>Image</span>
                    </div>
                )}
            </div>
            <div className="project-info">
                <div className="project-domain">
                    {project.domain} <span style={{ fontWeight: 400 }}>– {project.tags.join(", ") || "photographie"}</span>
                </div>
                <div className="project-year">
                    {project.year}
                </div>
            </div>
        </Link>
    );
}
