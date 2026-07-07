import { PhotoSlot } from "@/components/PhotoSlot";
import { CarouselUploadForm, FamilyAnnouncementForm } from "@/components/UploadForms";
import { getSitePhoto } from "@/data/sitePhotos";

export default function UploadPage() {
  return (
    <>
      <section className="page-section grid-2">
        <div>
          <p className="eyebrow">Upload and announce</p>
          <h1>Share what the family needs to keep.</h1>
          <p className="lead">
            Add photos and videos for the homepage carousel queue, or send birth, marriage, and
            homegoing updates to the family data managers.
          </p>
          <p className="notice">
            Family data submissions are structured for Google Sheets. If the webhook is not connected
            yet, submissions are saved locally for setup/testing.
          </p>
        </div>
        <PhotoSlot slot={getSitePhoto("site-photo-009")} />
      </section>
      <section className="page-section grid-2">
        <article className="form-panel">
          <h2>Upload a photo or video</h2>
          <p>Use this for reunion memories, old family photos, short clips, and family moments.</p>
          <CarouselUploadForm />
        </article>
        <article className="form-panel">
          <h2>Submit a family update</h2>
          <p>Use this for new babies, marriages, and deaths that should reach the master family list.</p>
          <FamilyAnnouncementForm />
        </article>
      </section>
    </>
  );
}
