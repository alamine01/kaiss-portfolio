"use client";

import { useState, useRef, useEffect } from "react";

interface FilterOption {
    label: string;
    value: string;
}

interface DropdownFilterProps {
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export default function DropdownFilter({
    label,
    options,
    value,
    onChange,
    placeholder = "Tous"
}: DropdownFilterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption ? selectedOption.label : placeholder;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className="dropdown-filter" ref={dropdownRef}>
            <label className="dropdown-label">{label}</label>
            <button
                className={`dropdown-trigger ${isOpen ? "open" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
                type="button"
            >
                <span>{displayText}</span>
                <svg
                    className={`dropdown-arrow ${isOpen ? "rotate" : ""}`}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                >
                    <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    <button
                        className={`dropdown-item ${value === "" ? "active" : ""}`}
                        onClick={() => handleSelect("")}
                    >
                        {placeholder}
                    </button>
                    {options.map((option) => (
                        <button
                            key={option.value}
                            className={`dropdown-item ${value === option.value ? "active" : ""}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
