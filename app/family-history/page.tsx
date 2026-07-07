import { rootAncestors } from "@/data/family";

export default function FamilyHistoryPage() {
  return (
    <>
      <section className="page-section">
        <p className="eyebrow">Family history</p>
        <h1>From Evelena and Joe Johnson Jr. forward.</h1>
        <p className="lead">
          The family record starts here with {rootAncestors.matriarch.name} ({rootAncestors.matriarch.birthYear}-
          {rootAncestors.matriarch.deathYear}) and {rootAncestors.patriarch.name} (
          {rootAncestors.patriarch.birthYear}-{rootAncestors.patriarch.deathYear}).
        </p>
        <p>
          The tree below is the website mockup view for the family record. It is designed to hold the
          family branches, generation columns, and future photo placements in one large visual.
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
      </section>

      <section className="page-section family-tree-section" aria-labelledby="family-tree-heading">
        <div className="family-tree-heading">
          <div>
            <p className="eyebrow">Family tree mockup</p>
            <h2 id="family-tree-heading">Johnson Family Tree</h2>
          </div>
          <p>
            This image is intentionally large. Scroll inside the frame to inspect the branches and
            generation columns.
          </p>
        </div>
        <div className="family-tree-frame" role="img" aria-label="Johnson family tree website mockup">
          <img
            className="family-tree-image"
            src="/site-photos/johnson-family-tree-mockup.png"
            alt="Johnson Family Tree website mockup with branch rows and generation columns"
          />
        </div>
      </section>
    </>
  );
}
