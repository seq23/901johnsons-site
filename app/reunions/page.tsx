import { PhotoSlot } from "@/components/PhotoSlot";
import { reunions } from "@/data/reunions";
import { getSitePhoto } from "@/data/sitePhotos";

export default function ReunionsPage() {
  const upcoming = reunions.filter((reunion) => reunion.status === "upcoming");
  const past = reunions.filter((reunion) => reunion.status === "past");

  return (
    <>
      <section className="page-section grid-2">
        <div>
          <p className="eyebrow">Reunions</p>
          <h1>Upcoming and past family gatherings.</h1>
          <p className="lead">
            Keep the next reunion organized and give every past reunion its own page with photos,
            memories, committee notes, and the official t-shirt.
          </p>
        </div>
        <PhotoSlot slot={getSitePhoto("site-photo-003")} />
      </section>
      <section className="page-section">
        <h2>Upcoming</h2>
        <div className="grid-3">
          {upcoming.map((reunion) => (
            <article className="reunion-card" key={reunion.slug}>
              <h3>{reunion.title}</h3>
              <p>{reunion.location}</p>
              <p>{reunion.dates}</p>
              <a className="button" href={`/reunions/${reunion.slug}`}>
                Open Reunion Page
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="page-section">
        <h2>Past Reunions</h2>
        <div className="grid-3">
          {past.map((reunion) => (
            <article className="reunion-card" key={reunion.slug}>
              <h3>{reunion.title}</h3>
              <p>{reunion.summary}</p>
              <a className="button secondary" href={`/reunions/${reunion.slug}`}>
                View Archive
              </a>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
