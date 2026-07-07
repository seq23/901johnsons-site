import { PhotoSlot } from "@/components/PhotoSlot";
import { rootAncestors } from "@/data/family";
import { getSitePhoto } from "@/data/sitePhotos";

export default function FamilyHistoryPage() {
  return (
    <section className="page-section grid-2">
      <PhotoSlot slot={getSitePhoto("site-photo-008")} />
      <div>
        <p className="eyebrow">Family history</p>
        <h1>From Evelena and Joe Johnson Jr. forward.</h1>
        <p className="lead">
          The family record starts here with {rootAncestors.matriarch.name} ({rootAncestors.matriarch.birthYear}-
          {rootAncestors.matriarch.deathYear}) and {rootAncestors.patriarch.name} (
          {rootAncestors.patriarch.birthYear}-{rootAncestors.patriarch.deathYear}).
        </p>
        <p>
          This page is ready for the family tree story, branch summaries, family places, oral histories,
          and links to approved family documents.
        </p>
        <div className="ancestor-grid">
          <div className="ancestor-pill">
            <strong>{rootAncestors.matriarch.name}</strong>
            <span>{rootAncestors.matriarch.role}</span>
          </div>
          <div className="ancestor-pill">
            <strong>{rootAncestors.patriarch.name}</strong>
            <span>{rootAncestors.patriarch.role}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
