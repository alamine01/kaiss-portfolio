export interface Project {
    id: string;
    title: string;
    description: string;
    type: "pro" | "universitaire";
    domain: string;
    year: string;
    images: string[];
    thumbnail: string;
    tags: string[];
    createdAt: Date;
}

export interface CVSettings {
    url: string;
    updatedAt: Date;
}

export interface FilterOption {
    label: string;
    value: string;
}
