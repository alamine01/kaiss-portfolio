import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Touabi Kaïss - Portfolio",
    description: "Cadreur, UX/UI Designer et Graphiste junior spécialisé en création numérique",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
