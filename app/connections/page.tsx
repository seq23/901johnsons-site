import { ConnectionFeed } from "@/components/ConnectionFeed";
import { PhotoSlot } from "@/components/PhotoSlot";
import { facebookGroup } from "@/data/connections";
import { getSitePhoto } from "@/data/sitePhotos";

const connectionIdeas = [
  {
    title: "Family directory request process",
    copy: "A family-approved request process can keep contact information useful without making private details public."
  },
  {
    title: "Birthday and anniversary calendar",
    copy: "Self-serve birthday and anniversary submissions from the Upload & Announcements page can feed this section."
  },
  {
    title: "Recipes and Sunday table memories",
    copy: "Family recipes, Sunday dinner stories, and table photos can be uploaded for the family wall."
  },
  {
    title: "Prayer list and care updates",
    copy: "Prayer requests, care updates, and family support notes can be submitted by relatives."
  },
  {
    title: "Committee contacts",
    copy: "Ready for family-approved reunion committee names, roles, and contact links."
  },
  {
    title: "Youth, elders, and branch spotlights",
    copy: "Spotlights can come through family uploads and manager-approved announcements."
  }
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
          <a className="facebook-link" href={facebookGroup.url} target="_blank" rel="noreferrer">
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.23.2 2.23.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06Z" />
            </svg>
            {facebookGroup.label}
          </a>
        </div>
        <PhotoSlot slot={getSitePhoto("site-photo-009")} />
      </section>
      <section className="page-section grid-3">
        {connectionIdeas.map((idea) => (
          <article className="panel" key={idea.title}>
            <h3>{idea.title}</h3>
            <p>{idea.copy}</p>
          </article>
        ))}
      </section>
      <section className="page-section">
        <div className="family-tree-heading">
          <div>
            <p className="eyebrow">Self-serve family wall</p>
            <h2>Shared by the family</h2>
          </div>
          <p>Use the Upload & Announcements page to add photos, recipes, care updates, branch news, and family moments here.</p>
        </div>
        <ConnectionFeed />
      </section>
    </>
  );
}
