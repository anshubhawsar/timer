// kittuPhotos.ts

// 1. Combine all file paths into one array
const allRawPhotos: string[] = [
  // Original photos
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
  "/kittuimgs/photo_2026-06-24_19-16-03.jpg",
  // New photos from kitttttu folder
  "/kitttttu/photo_2026-06-24_19-15-17.jpg",
  "/kitttttu/photo_1_2026-06-27_16-55-54.jpg",
  "/kitttttu/photo_2_2026-06-27_16-55-54.jpg",
  "/kitttttu/photo_3_2026-06-27_16-55-54.jpg",
  "/kitttttu/photo_4_2026-06-27_16-55-54.jpg",
  "/kitttttu/photo_6_2026-06-27_16-55-54.jpg",
  "/kitttttu/photo_7_2026-06-27_16-55-54.jpg",
  "/kitttttu/photo_8_2026-06-27_16-55-54.jpg",
  "/kitttttu/photo_9_2026-06-27_16-55-54.jpg",
];

// 2. Export the encoded list so the browser can read the files with spaces correctly
export const kittuPhotos: string[] = allRawPhotos.map((p) => {
  const parts = p.split("/");
  const folder = parts[1]; // e.g., "kittuimgs" or "kitttttu"
  const filename = parts[2]; // e.g., "photo_2026-06-24_19-15-21 (2).jpg"
  
  if (!filename) return p;
  return `/${folder}/${encodeURIComponent(filename)}`;
});