export type SitePhotoSlot = {
  id: string;
  number: number;
  title: string;
  intendedUse: string;
  src: string;
  alt: string;
  required: boolean;
};

export const sitePhotoSlots: SitePhotoSlot[] = [
  {
    id: "site-photo-001",
    number: 1,
    title: "Evelena Johnson and Joe Johnson Jr. portrait",
    intendedUse: "Homepage hero portrait for the root matriarch and patriarch.",
    src: "/site-photos/site-photo-001-evelena-joe-placeholder.svg",
    alt: "Placeholder for Evelena Johnson and Joe Johnson Jr.",
    required: true
  },
  {
    id: "site-photo-002",
    number: 2,
    title: "Family porch or homeplace photo",
    intendedUse: "Homepage family care section.",
    src: "/site-photos/site-photo-002-homeplace-placeholder.svg",
    alt: "Placeholder for a Johnson family homeplace photo.",
    required: true
  },
  {
    id: "site-photo-003",
    number: 3,
    title: "Upcoming reunion feature image",
    intendedUse: "Reunions hub upcoming reunion banner.",
    src: "/site-photos/site-photo-003-upcoming-reunion-placeholder.svg",
    alt: "Placeholder for an upcoming Johnson family reunion photo.",
    required: true
  },
  {
    id: "site-photo-004",
    number: 4,
    title: "2025 reunion group photo",
    intendedUse: "Past reunion landing page gallery.",
    src: "/site-photos/site-photo-004-2025-reunion-placeholder.svg",
    alt: "Placeholder for the 2025 Johnson family reunion group photo.",
    required: true
  },
  {
    id: "site-photo-005",
    number: 5,
    title: "2025 reunion t-shirt photo",
    intendedUse: "Past reunion landing page t-shirt feature.",
    src: "/site-photos/site-photo-005-2025-shirt-placeholder.svg",
    alt: "Placeholder for the 2025 reunion t-shirt.",
    required: true
  },
  {
    id: "site-photo-006",
    number: 6,
    title: "2024 reunion group photo",
    intendedUse: "Past reunion landing page gallery.",
    src: "/site-photos/site-photo-006-2024-reunion-placeholder.svg",
    alt: "Placeholder for the 2024 Johnson family reunion group photo.",
    required: true
  },
  {
    id: "site-photo-007",
    number: 7,
    title: "2024 reunion t-shirt photo",
    intendedUse: "Past reunion landing page t-shirt feature.",
    src: "/site-photos/site-photo-007-2024-shirt-placeholder.svg",
    alt: "Placeholder for the 2024 reunion t-shirt.",
    required: true
  },
  {
    id: "site-photo-008",
    number: 8,
    title: "Family tree keepsake image",
    intendedUse: "Family history page.",
    src: "/site-photos/site-photo-008-family-tree-placeholder.svg",
    alt: "Placeholder for a Johnson family tree keepsake image.",
    required: true
  },
  {
    id: "site-photo-009",
    number: 9,
    title: "Family recipes or table photo",
    intendedUse: "Family connections page.",
    src: "/site-photos/site-photo-009-family-table-placeholder.svg",
    alt: "Placeholder for a family table or recipe photo.",
    required: true
  },
  {
    id: "site-photo-010",
    number: 10,
    title: "Admin reserve image",
    intendedUse: "Flexible replacement slot for future pages.",
    src: "/site-photos/site-photo-010-reserve-placeholder.svg",
    alt: "Placeholder for a future Johnson family site photo.",
    required: false
  }
];

export function getSitePhoto(id: string) {
  const slot = sitePhotoSlots.find((photo) => photo.id === id);
  if (!slot) {
    throw new Error(`Missing site photo slot: ${id}`);
  }
  return slot;
}
