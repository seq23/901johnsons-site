export type CarouselItem = {
  id: string;
  type: "image" | "video";
  src: string;
  title: string;
  caption: string;
};

export const carouselItems: CarouselItem[] = [
  {
    id: "carousel-001",
    type: "image",
    src: "/site-photos/site-photo-001-evelena-joe-placeholder.svg",
    title: "Evelena and Joe Johnson Jr.",
    caption: "Replace this with the family portrait that should anchor the home page."
  },
  {
    id: "carousel-002",
    type: "image",
    src: "/site-photos/site-photo-002-homeplace-placeholder.svg",
    title: "The Family Homeplace",
    caption: "A place for the home, porch, church, yard, or roots photo everybody knows."
  },
  {
    id: "carousel-003",
    type: "image",
    src: "/site-photos/site-photo-003-upcoming-reunion-placeholder.svg",
    title: "Family Reunion Memories",
    caption: "Public photo and video uploads can be added to this carousel."
  }
];
