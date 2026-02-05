import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    Timestamp,
    setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Project, CVSettings } from "./types";

const PROJECTS_COLLECTION = "projects";
const SETTINGS_COLLECTION = "settings";

// Projets
export async function getProjects(type?: "pro" | "universitaire"): Promise<Project[]> {
    let q = query(collection(db, PROJECTS_COLLECTION), orderBy("createdAt", "desc"));

    if (type) {
        q = query(
            collection(db, PROJECTS_COLLECTION),
            where("type", "==", type),
            orderBy("createdAt", "desc")
        );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Project[];
}

export async function getProjectById(id: string): Promise<Project | null> {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
    } as Project;
}

export async function addProject(project: Omit<Project, "id" | "createdAt">): Promise<string> {
    const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), {
        ...project,
        createdAt: Timestamp.now(),
    });
    return docRef.id;
}

export async function updateProject(id: string, project: Partial<Project>): Promise<void> {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await updateDoc(docRef, project);
}

export async function deleteProject(id: string): Promise<void> {
    const docRef = doc(db, PROJECTS_COLLECTION, id);
    await deleteDoc(docRef);
}

// CV
export async function getCVUrl(): Promise<string | null> {
    const docRef = doc(db, SETTINGS_COLLECTION, "cv");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    return docSnap.data().url;
}

export async function setCVUrl(url: string): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, "cv");
    await setDoc(docRef, {
        url,
        updatedAt: Timestamp.now(),
    });
}

// Logo
export async function getLogoUrl(): Promise<string | null> {
    const docRef = doc(db, SETTINGS_COLLECTION, "logo");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    return docSnap.data().url;
}

export async function setLogoUrl(url: string): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, "logo");
    await setDoc(docRef, {
        url,
        updatedAt: Timestamp.now(),
    });
}

// Contact
export interface ContactInfo {
    email: string;
    linkedin: string;
}

export async function getContactInfo(): Promise<ContactInfo | null> {
    const docRef = doc(db, SETTINGS_COLLECTION, "contact");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    return docSnap.data() as ContactInfo;
}

export async function setContactInfo(info: ContactInfo): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, "contact");
    await setDoc(docRef, {
        ...info,
        updatedAt: Timestamp.now(),
    });
}

// Hero Image
export async function getHeroImageUrl(): Promise<string | null> {
    const docRef = doc(db, SETTINGS_COLLECTION, "hero");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;
    return docSnap.data().url;
}

export async function setHeroImageUrl(url: string): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, "hero");
    await setDoc(docRef, {
        url,
        updatedAt: Timestamp.now(),
    });
}

// Filtres
export async function getProjectsByFilter(
    type: "pro" | "universitaire",
    domain?: string,
    year?: string
): Promise<Project[]> {
    let q = query(
        collection(db, PROJECTS_COLLECTION),
        where("type", "==", type),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    let projects = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Project[];

    if (domain) {
        projects = projects.filter((p) => p.domain === domain);
    }

    if (year) {
        projects = projects.filter((p) => p.year === year);
    }

    return projects;
}
