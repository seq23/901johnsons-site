import { MediaCarousel } from "@/components/MediaCarousel";
import { PhotoSlot } from "@/components/PhotoSlot";
import { carouselItems } from "@/data/carousel";
import { familyCareSections, rootAncestors } from "@/data/family";
import { getSitePhoto } from "@/data/sitePhotos";

export default function HomePage() {
  const ancestorPhoto = getSitePhoto("site-photo-001");
  const homeplacePhoto = getSitePhoto("site-photo-002");

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Family home online</p>
          <h1>901 Johnsons</h1>
          <p className="lead">
            A warm place for Johnson family reunions, photos, videos, announcements, history, and the
            ongoing care of the family record.
          </p>
          <div className="ancestor-grid">
            <div className="ancestor-pill">
              <strong>{rootAncestors.matriarch.name}</strong>
              <span>
                {rootAncestors.matriarch.role} · {rootAncestors.matriarch.birthYear}-
                {rootAncestors.matriarch.deathYear}
              </span>
            </div>
            <div className="ancestor-pill">
              <strong>{rootAncestors.patriarch.name}</strong>
              <span>
                {rootAncestors.patriarch.role} · {rootAncestors.patriarch.birthYear}-
                {rootAncestors.patriarch.deathYear}
              </span>
            </div>
          </div>
          <div className="button-row">
            <a className="button" href="/upload">
              Upload Photos or Announcements
            </a>
            <a className="button secondary" href="/reunions">
              See Reunions
            </a>
          </div>
        </div>
        <article className="hero-card">
          <img className="hero-photo" src={ancestorPhoto.src} alt={ancestorPhoto.alt} />
          <div className="hero-caption">
            <h2>Evelena & Joe Johnson Jr.</h2>
            <p>
              Root Matriarch and Root Patriarch. Replace this placeholder with the family portrait
              that should greet everyone first.
            </p>
          </div>
        </article>
      </section>

      <section className="page-section">
        <p className="eyebrow">Family gallery</p>
        <h2>Photos and videos in the middle of the house.</h2>
        <p>
          This carousel is built for both photos and videos. Public uploads go through the upload page
          first so the family managers can review what belongs on the homepage.
        </p>
        <MediaCarousel items={carouselItems} />
      </section>

      <section className="page-section grid-2">
        <PhotoSlot slot={homeplacePhoto} />
        <div>
          <p className="eyebrow">Family upkeep</p>
          <h2>Keep the family list alive and accurate.</h2>
          <p>
            Births, marriages, and homegoing notices can be submitted through the site and routed to
            the family data managers for the master workbook.
          </p>
          <div className="grid-3">
            {familyCareSections.map((section) => (
              <article className="panel" key={section.title}>
                <h3>{section.title}</h3>
                <p>{section.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
