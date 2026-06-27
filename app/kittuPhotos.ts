// Premium gallery image list (served from /birthday-app/public/kittuimgs/*)
// NOTE: Filenames are sourced from the folder itself; some photos may include " (2)" in the name.
const rawKittuPhotos: string[] = [
  "/kittuimgs/photo_2026-06-24_19-15-17.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-20.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-21 (2).jpg",
  "/kittuimgs/photo_2026-06-24_19-15-21.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-22.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-23.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-24 (2).jpg",
  "/kittuimgs/photo_2026-06-24_19-15-24.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-25.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-26 (2).jpg",
  "/kittuimgs/photo_2026-06-24_19-15-26.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-27 (2).jpg",
  "/kittuimgs/photo_2026-06-24_19-15-27.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-28.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-29 (2).jpg",
  "/kittuimgs/photo_2026-06-24_19-15-29.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-30.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-31.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-32.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-33.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-37.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-38.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-39.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-40.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-41.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-52.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-53.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-54 (2).jpg",
  "/kittuimgs/photo_2026-06-24_19-15-54.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-55.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-56 (2).jpg",
  "/kittuimgs/photo_2026-06-24_19-15-56.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-57.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-58 (2).jpg",
  "/kittuimgs/photo_2026-06-24_19-15-58.jpg",
  "/kittuimgs/photo_2026-06-24_19-15-59.jpg",
  "/kittuimgs/photo_2026-06-24_19-16-00 (2).jpg",
  "/kittuimgs/photo_2026-06-24_19-16-00.jpg",
  "/kittuimgs/photo_2026-06-24_19-16-01.jpg",
  "/kittuimgs/photo_2026-06-24_19-16-02 (2).jpg",
  "/kittuimgs/photo_2026-06-24_19-16-02.jpg",
  "/kittuimgs/photo_2026-06-24_19-16-03.jpg"
];

// URL-encode just the filename segment (handles spaces like " (2)" reliably).
export const kittuPhotos: string[] = rawKittuPhotos.map((p) => {
  const [prefix, filename] = p.split("/kittuimgs/");
  // If path doesn't match expected structure, return as-is.
  if (!p.includes("/kittuimgs/") || filename === undefined) return p;
  return `${prefix}/kittuimgs/${encodeURIComponent(filename)}`;
});





