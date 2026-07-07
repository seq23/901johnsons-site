import { rootAncestors } from "@/data/family";
import {
  familyTreeBranches,
  familyTreeExpectedPersonEntryCount,
  familyTreeGenerations,
  familyTreePersonEntryCount,
  familyTreeSourceTab
} from "@/data/familyTree";

function PhotoPlaceholder({ label }: { label: string }) {
  return (
    <div className="tree-photo-placeholder" aria-label={label}>
      <span>Photo</span>
    </div>
  );
}

export function FamilyTree() {
  return (
    <div className="family-tree-frame" aria-label="Johnson family tree with roots, branches, and generations">
      <div className="family-tree-board">
        <div className="tree-title-band">
          <p className="eyebrow">Johnson Family Tree</p>
          <h2>Evelena Johnson and Joe Johnson Jr.</h2>
          <p>
            {familyTreeBranches.length} branches from {familyTreeSourceTab}. Current displayed cells:{" "}
            {familyTreePersonEntryCount}. Workbook target: {familyTreeExpectedPersonEntryCount} people.
          </p>
        </div>

        <div className="tree-root-row">
          <article className="tree-root-card">
            <PhotoPlaceholder label="Photo placeholder for Evelena Johnson" />
            <div>
              <strong>{rootAncestors.matriarch.name}</strong>
              <span>
                {rootAncestors.matriarch.birthYear}-{rootAncestors.matriarch.deathYear} -{" "}
                {rootAncestors.matriarch.role}
              </span>
            </div>
          </article>
          <article className="tree-root-card">
            <PhotoPlaceholder label="Photo placeholder for Joe Johnson Jr." />
            <div>
              <strong>{rootAncestors.patriarch.name}</strong>
              <span>
                {rootAncestors.patriarch.birthYear}-{rootAncestors.patriarch.deathYear} -{" "}
                {rootAncestors.patriarch.role}
              </span>
            </div>
          </article>
        </div>

        <nav className="tree-branch-nav" aria-label="Family tree branch index">
          {familyTreeBranches.map((branch) => (
            <a href={`#branch-${branch.roman.toLowerCase()}`} key={branch.roman}>
              <span>{branch.roman}</span>
              {branch.branchName}
            </a>
          ))}
        </nav>

        <div className="tree-branch-list">
          {familyTreeBranches.map((branch) => {
            const entryCount = branch.generations.reduce((total, generation) => total + generation.length, 0);
            return (
              <article className="tree-branch-card" id={`branch-${branch.roman.toLowerCase()}`} key={branch.roman}>
                <div className="tree-branch-cell">
                  <div>
                    <span>{branch.roman}</span>
                    <strong>{branch.branchName}</strong>
                  </div>
                  <small>{branch.photoLabel}</small>
                  <em>{entryCount} entries</em>
                </div>
                <div className="tree-generation-grid">
                  {branch.generations.map((generation, index) => (
                    <div className="tree-generation-cell" key={`${branch.roman}-${familyTreeGenerations[index]}`}>
                      <h3>{familyTreeGenerations[index]}</h3>
                      {index === 0 ? <PhotoPlaceholder label={`Photo placeholder for ${branch.branchName}`} /> : null}
                      {generation.length ? (
                        generation.map((name) => <span key={name}>{name}</span>)
                      ) : (
                        <em>Awaiting verified names</em>
                      )}
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
