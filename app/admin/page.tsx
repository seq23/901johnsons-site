import { AdminGate } from "@/components/AdminGate";
import { AdminPendingUploads } from "@/components/AdminPendingUploads";
import { AdminSitePhotoForm } from "@/components/AdminSitePhotoForm";
import { PhotoSlot } from "@/components/PhotoSlot";
import { sitePhotoSlots } from "@/data/sitePhotos";

export default function AdminPage() {
  return (
    <AdminGate>
      <section className="page-section grid-2">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Designated site photo manager.</h1>
          <p className="lead">
            This admin page is for fixed site imagery: hero photos, reunion landing page photos, shirt
            photos, and page-specific images. It is separate from public carousel uploads.
          </p>
        </div>
        <PhotoSlot slot={sitePhotoSlots[0]} />
      </section>
      <section className="page-section">
        <article className="form-panel">
          <h2>Family uploads waiting for review</h2>
          <p>Photos and videos sent from the upload page stay private until you approve them here.</p>
          <AdminPendingUploads />
        </article>
      </section>
      <section className="page-section grid-2">
        <article className="form-panel">
          <h2>Upload designated site photo</h2>
          <AdminSitePhotoForm />
        </article>
        <article className="panel">
          <h2>Photo Slot Registry</h2>
          <p>These slots are also maintained in `data/sitePhotos.ts`.</p>
          {sitePhotoSlots.map((slot) => (
            <p key={slot.id}>
              <strong>#{slot.number.toString().padStart(3, "0")}</strong> {slot.title}
            </p>
          ))}
        </article>
      </section>
    </AdminGate>
  );
}
