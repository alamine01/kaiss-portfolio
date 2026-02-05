"use client";

interface FilterOption {
    label: string;
    value: string;
}

interface ProjectFilterProps {
    filters: FilterOption[];
    activeFilter: string;
    onFilterChange: (value: string) => void;
}

export default function ProjectFilter({
    filters,
    activeFilter,
    onFilterChange
}: ProjectFilterProps) {
    return (
        <div className="filters">
            <button
                className={`filter-btn ${activeFilter === "" ? "active" : ""}`}
                onClick={() => onFilterChange("")}
            >
                Tous
            </button>
            {filters.map((filter) => (
                <button
                    key={filter.value}
                    className={`filter-btn ${activeFilter === filter.value ? "active" : ""}`}
                    onClick={() => onFilterChange(filter.value)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
}
