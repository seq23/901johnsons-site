import { PhotoSlot } from "@/components/PhotoSlot";
import { getSitePhoto } from "@/data/sitePhotos";

const connectionIdeas = [
  "Family directory request process",
  "Birthday and anniversary calendar",
  "Recipes and Sunday table memories",
  "Prayer list and care updates",
  "Committee contacts",
  "Youth, elders, and branch spotlights"
];

export default function ConnectionsPage() {
  return (
    <>
      <section className="page-section grid-2">
        <div>
          <p className="eyebrow">Family connections</p>
          <h1>Homey, useful, and easy to keep current.</h1>
          <p className="lead">
            A large family needs more than a gallery. This space is for the everyday connective tissue:
            birthdays, committees, recipes, care updates, branch news, and ways to find each other.
          </p>
        </div>
        <PhotoSlot slot={getSitePhoto("site-photo-009")} />
      </section>
      <section className="page-section grid-3">
        {connectionIdeas.map((idea) => (
          <article className="panel" key={idea}>
            <h3>{idea}</h3>
            <p>Ready for family-approved details, links, and manager ownership.</p>
          </article>
        ))}
      </section>
    </>
  );
}
