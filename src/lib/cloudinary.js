const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

export const UPLOAD_PRESETS = {
  cover: import.meta.env.VITE_CLOUDINARY_PRESET_COVERS,
  profile: import.meta.env.VITE_CLOUDINARY_PRESET_PROFILES,
  librarian: import.meta.env.VITE_CLOUDINARY_PRESET_LIBRARIANS,
};

export const uploadImage = async (file, preset) => {
  if (!CLOUD_NAME || !preset) {
    throw new Error(
      "Cloudinary is not configured. Check .env.local and restart npm run dev.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData },
  );
  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(result?.error?.message ?? "Image upload failed.");
  }
  return result.secure_url;
};