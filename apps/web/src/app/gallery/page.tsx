import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GALLERY_IMAGES } from "@/data/gallery";

const anchorImages = GALLERY_IMAGES.slice(0, 3);
const ministryImages = GALLERY_IMAGES.slice(3);

export const metadata: Metadata = {
  title: "Glory Gallery — Visual meditations",
  description:
    "AI-assisted visual meditations for Hope of Glory Ministry, each paired with Scripture and a short statement.",
};

export default function GalleryPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "Glory Gallery", href: "/gallery" },
          ]}
        />

        <header className="mb-12">
          <p className="eyebrow">Glory Gallery</p>
          <h1>Visual meditations.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            Images can carry a line of Scripture into memory. This gallery
            gathers ministry visuals with the statement and Scripture they are
            meant to serve.
          </p>
        </header>

        <section className="mb-14">
          <p className="eyebrow">Three anchors</p>
          <div className="grid grid-cols-1 gap-8">
            {anchorImages.map((image, index) => (
              <article key={image.slug} className="card overflow-hidden !p-0">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={2560}
                  height={1440}
                  sizes="(min-width: 1024px) 980px, 100vw"
                  priority={index === 0}
                  className="h-auto w-full object-cover"
                />
                <div className="p-6 md:p-8">
                  <p className="card__eyebrow">{image.scriptureRef}</p>
                  <h2 className="m-0 mb-3 text-warm">{image.title}</h2>
                  <p className="m-0 text-muted">{image.statement}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="eyebrow">Ministry images</p>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {ministryImages.map((image) => (
              <article key={image.slug} className="card overflow-hidden !p-0">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={2560}
                  height={1440}
                  sizes="(min-width: 1024px) 470px, 100vw"
                  className="h-auto w-full object-cover"
                />
                <div className="p-6 md:p-8">
                  <p className="card__eyebrow">{image.scriptureRef}</p>
                  <h2 className="m-0 mb-3 text-warm">{image.title}</h2>
                  <p className="m-0 text-muted">{image.statement}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Use the images with the Word</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/messages" className="btn btn--secondary">
              Browse Messages
            </Link>
            <Link href="/read" className="btn btn--ghost">
              Open Read
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
