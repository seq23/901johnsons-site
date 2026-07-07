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

export const reunionYears = Array.from({ length: (2027 - 1985) / 2 + 1 }, (_, index) => 1985 + index * 2);

const featuredYearPhotoIds: Record<number, { heroPhotoId: string; shirtPhotoId?: string; galleryPhotoIds: string[] }> = {
  2027: {
    heroPhotoId: "site-photo-003",
    galleryPhotoIds: ["site-photo-003", "site-photo-002", "site-photo-010"]
  },
  2025: {
    heroPhotoId: "site-photo-004",
    shirtPhotoId: "site-photo-005",
    galleryPhotoIds: ["site-photo-004", "site-photo-005", "site-photo-002", "site-photo-009"]
  },
  2023: {
    heroPhotoId: "site-photo-006",
    shirtPhotoId: "site-photo-007",
    galleryPhotoIds: ["site-photo-006", "site-photo-007", "site-photo-008", "site-photo-009"]
  }
};

function buildReunion(year: number): Reunion {
  const isUpcoming = year === 2027;
  const featured = featuredYearPhotoIds[year] || {
    heroPhotoId: "site-photo-010",
    galleryPhotoIds: ["site-photo-010", "site-photo-002", "site-photo-008", "site-photo-009"]
  };

  return {
    slug: `${year}-family-reunion`,
    year,
    title: `${year} Johnson Family Reunion`,
    location: isUpcoming ? "Location to be announced" : "Location to be filled in",
    dates: isUpcoming ? "Dates to be announced" : "Dates to be filled in",
    summary: isUpcoming
      ? "The next Johnson family reunion is planned for 2027, continuing the every-two-years tradition that began in 1985."
      : `A preserved landing page for the ${year} Johnson family reunion with room for the official gallery, t-shirt photo, program notes, and family memories.`,
    status: isUpcoming ? "upcoming" : "past",
    heroPhotoId: featured.heroPhotoId,
    shirtPhotoId: featured.shirtPhotoId,
    highlights: isUpcoming
      ? ["Registration details", "Hotel block", "Family banquet", "Sunday worship", "Group photo"]
      : ["Official group photo", "T-shirt archive", "Family gallery", "Program memories"],
    galleryPhotoIds: featured.galleryPhotoIds
  };
}

export const reunions: Reunion[] = reunionYears.map(buildReunion).sort((a, b) => b.year - a.year);

export const uploadableReunions = reunions;

export function getReunion(slug: string) {
  return reunions.find((reunion) => reunion.slug === slug);
}
