export type Reunion = {
  slug: string;
  year: number;
  title: string;
  location: string;
  dates: string;
  summary: string;
  status: "upcoming" | "past";
  heroPhotoId: string;
  shirtPhotoId?: string;
  highlights: string[];
  galleryPhotoIds: string[];
};

export const reunions: Reunion[] = [
  {
    slug: "2026-family-reunion",
    year: 2026,
    title: "2026 Johnson Family Reunion",
    location: "Memphis, Tennessee",
    dates: "Dates to be announced",
    summary:
      "The next family gathering will bring branches together for food, worship, photos, storytelling, and family business.",
    status: "upcoming",
    heroPhotoId: "site-photo-003",
    highlights: ["Registration details", "Hotel block", "Family banquet", "Sunday worship", "Group photo"],
    galleryPhotoIds: ["site-photo-003", "site-photo-002", "site-photo-010"]
  },
  {
    slug: "2025-family-reunion",
    year: 2025,
    title: "2025 Johnson Family Reunion",
    location: "Location to be filled in",
    dates: "Dates to be filled in",
    summary:
      "A saved landing page for the 2025 reunion with room for the official gallery, shirt photo, program notes, and family memories.",
    status: "past",
    heroPhotoId: "site-photo-004",
    shirtPhotoId: "site-photo-005",
    highlights: ["Official group photo", "T-shirt design", "Banquet memories", "Branch updates"],
    galleryPhotoIds: ["site-photo-004", "site-photo-005", "site-photo-002", "site-photo-009"]
  },
  {
    slug: "2024-family-reunion",
    year: 2024,
    title: "2024 Johnson Family Reunion",
    location: "Location to be filled in",
    dates: "Dates to be filled in",
    summary:
      "A preserved page for the 2024 gathering with a gallery, shirt photo, and room for committee notes.",
    status: "past",
    heroPhotoId: "site-photo-006",
    shirtPhotoId: "site-photo-007",
    highlights: ["Family gallery", "T-shirt archive", "Program memories", "Committee notes"],
    galleryPhotoIds: ["site-photo-006", "site-photo-007", "site-photo-008", "site-photo-009"]
  }
];

export function getReunion(slug: string) {
  return reunions.find((reunion) => reunion.slug === slug);
}
