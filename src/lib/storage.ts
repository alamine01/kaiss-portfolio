import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";

export async function uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

export async function uploadProjectImage(
    file: File,
    projectId: string,
    index: number
): Promise<string> {
    const extension = file.name.split(".").pop();
    const path = `projects/${projectId}/${index}.${extension}`;
    return uploadImage(file, path);
}

export async function uploadCV(file: File): Promise<string> {
    const path = `cv/cv.pdf`;
    return uploadImage(file, path);
}

export async function uploadLogo(file: File): Promise<string> {
    const extension = file.name.split(".").pop();
    const path = `logo/logo.${extension}`;
    return uploadImage(file, path);
}

export async function deleteImage(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
}
