import { notFound } from "next/navigation";
import { PhotoSlot } from "@/components/PhotoSlot";
import { ReunionGallery } from "@/components/ReunionGallery";
import { getReunion, reunions } from "@/data/reunions";
import { getSitePhoto } from "@/data/sitePhotos";

export function generateStaticParams() {
  return reunions.map((reunion) => ({ slug: reunion.slug }));
}

export default function ReunionDetailPage({ params }: { params: { slug: string } }) {
  const reunion = getReunion(params.slug);
  if (!reunion) {
    notFound();
  }

  return (
    <>
      <section className="page-section grid-2">
        <div>
          <p className="eyebrow">{reunion.status === "past" ? "Past reunion archive" : "Upcoming reunion"}</p>
          <h1>{reunion.title}</h1>
          <p className="lead">{reunion.summary}</p>
          <p>
            {reunion.location} · {reunion.dates}
          </p>
          <div className="button-row">
            <a className="button" href="/upload">
              Add Photos or Updates
            </a>
            <a className="button secondary" href="/reunions">
              Back to Reunions
            </a>
          </div>
        </div>
        <PhotoSlot slot={getSitePhoto(reunion.heroPhotoId)} />
      </section>

      {reunion.shirtPhotoId ? (
        <section className="page-section grid-2">
          <div>
            <p className="eyebrow">T-shirt archive</p>
            <h2>Official reunion shirt.</h2>
            <p>Replace this placeholder with the t-shirt photo for this year.</p>
          </div>
          <PhotoSlot slot={getSitePhoto(reunion.shirtPhotoId)} />
        </section>
      ) : null}

      <section className="page-section">
        <h2>Highlights</h2>
        <div className="grid-3">
          {reunion.highlights.map((highlight) => (
            <article className="panel" key={highlight}>
              <h3>{highlight}</h3>
              <p>Use this space for details, links, names, receipts, plans, or memories.</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-section">
        <h2>Gallery</h2>
        <p>
          Family-uploaded photos and videos for {reunion.year} appear here first, followed by the
          designated placeholder slots for official photos and t-shirt archives.
        </p>
        <ReunionGallery year={reunion.year} slots={reunion.galleryPhotoIds.map((photoId) => getSitePhoto(photoId))} />
      </section>
    </>
  );
}
