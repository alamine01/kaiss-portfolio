"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/admin");
        } catch (err: unknown) {
            console.error(err);
            setError("Email ou mot de passe incorrect");
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Administration</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@example.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p style={{ color: "#dc3545", marginBottom: "20px", textAlign: "center" }}>
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ width: "100%", justifyContent: "center" }}
                    >
                        {loading ? "Connexion..." : "Se connecter"}
                    </button>
                </form>
            </div>
        </div>
    );
}
