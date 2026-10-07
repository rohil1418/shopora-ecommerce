const localImages = import.meta.glob("../assets/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export const getImage = (name: string, width: number, height: number): string => {
  for (const ext of EXTENSIONS) {
    const found = localImages[`../assets/${name}.${ext}`];
    if (found) return found;
  }
  return `https://picsum.photos/seed/${name}/${width}/${height}`;
};