import { FamilyTree } from "@/components/FamilyTree";
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
          The tree below is a designed website version of the family workbook mockup. It carries the
          readable names from the uploaded PDF into branch and generation sections, with room for root
          photos, branch photos, and verified corrections.
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
            <p className="eyebrow">Family tree</p>
            <h2 id="family-tree-heading">Johnson Family Tree</h2>
          </div>
          <p>
            This image is intentionally large. Scroll inside the frame to inspect the branches and
            generation columns.
          </p>
        </div>
        <FamilyTree />
      </section>
    </>
  );
}
