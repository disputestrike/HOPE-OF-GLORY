import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "What we believe",
  description:
    "The Statement of Faith of Hope of Glory Ministry — the doctrinal floor on which everything we publish stands, bounded by the historic Nicene faith and the plain reading of Scripture.",
};

const articles: { n: string; heading: string; body: string }[] = [
  {
    n: "1",
    heading: "The Holy Scriptures",
    body: "We believe the sixty-six books of the Old and New Testaments are the inspired Word of God, given by the Holy Spirit through human authors, true and trustworthy in all that they teach. The Scriptures are the sole final authority for Christian faith and practice. Tradition, reason, experience, and the witness of the church are valuable servants of the Word, never its judges.",
  },
  {
    n: "2",
    heading: "God",
    body: "We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit. The three persons are co-equal, co-eternal, and of one essence. God is holy, sovereign, just, merciful, and love. He created the heavens and the earth, sustains all things by His power, and rules over all according to His good purpose. We confess the faith expressed by the Nicene Creed.",
  },
  {
    n: "3",
    heading: "Jesus Christ",
    body: "We believe Jesus Christ is the eternal Son of God, fully God and fully man, conceived by the Holy Spirit and born of the virgin Mary. He lived a sinless life, was crucified under Pontius Pilate for our sins, was buried, and rose bodily on the third day. He ascended into heaven, reigns at the right hand of the Father, intercedes for His people, and will return in glory to judge the living and the dead. There is no other name under heaven given among men by which we must be saved.",
  },
  {
    n: "4",
    heading: "The Holy Spirit",
    body: "We believe the Holy Spirit is fully God, sent by the Father and the Son. He convicts the world of sin, regenerates the dead heart, indwells every believer, seals them for the day of redemption, illumines the Scriptures, gives gifts for the building up of the church, and forms the character of Christ in those He inhabits.",
  },
  {
    n: "5",
    heading: "Humanity and Sin",
    body: "We believe human beings, male and female, are made in the image of God and bear inherent dignity and worth. Through the disobedience of our first parents, sin entered the human race; all have sinned and fall short of the glory of God. Sin is real, personal, and corporate; it brings death, alienation from God, and disorder in creation. No human effort can remedy this condition.",
  },
  {
    n: "6",
    heading: "Salvation",
    body: "We believe salvation is by grace alone, through faith alone, in Christ alone. By His atoning death and victorious resurrection, Jesus reconciles sinners to God. Those who repent of sin and trust in Christ are forgiven, justified, adopted as children of God, indwelt by the Spirit, and are being conformed to the image of the Son. Salvation is the free gift of God and the lifelong work of God in those who receive it. The hope of glory is Christ in us.",
  },
  {
    n: "7",
    heading: "The Church",
    body: "We believe the church is the body of Christ, composed of all who have been united to Him by faith, across every generation, language, and nation. The local church is the visible expression of this body — gathered for the Word, baptism and the Lord's Supper, prayer, fellowship, mutual care, and the equipping of the saints. No digital ministry replaces or competes with the local church; it serves the church.",
  },
  {
    n: "8",
    heading: "Last Things",
    body: "We believe Jesus Christ will return personally, visibly, and in glory. The dead will be raised. The righteous will inherit eternal life in the presence of God; those who finally reject Christ will face just judgment. God will make all things new. The earth will be filled with the knowledge of the glory of the Lord as the waters cover the sea. On the timing and order of end-time events, faithful Christians have differed; we hold the central hope firmly and the detailed timeline humbly.",
  },
  {
    n: "9",
    heading: "Mission",
    body: "We believe the church is sent into the world to proclaim the gospel, make disciples of all nations, baptize them in the name of the Father and of the Son and of the Holy Spirit, and teach them to obey everything Christ commanded. Hope of Glory Ministry exists in service to this mission, that the whole earth may be filled with His glory.",
  },
];

export default function BeliefsPage() {
  return (
    <section className="section">
      <div className="container-prose">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: "What We Believe", href: "/beliefs" },
          ]}
        />

        <header className="mb-10">
          <p className="eyebrow">Statement of Faith</p>
          <h1>What we believe.</h1>
          <p
            className="text-muted max-w-readable"
            style={{ fontSize: "var(--fs-body-lg)" }}
          >
            This statement summarizes what Hope of Glory Ministry holds and
            teaches. It is bounded by the historic Nicene faith and the plain
            reading of the Christian Scriptures. It is not an exhaustive
            systematic theology; it is the doctrinal floor on which everything
            we publish stands.
          </p>
        </header>

        <section className="mb-10">
          <blockquote className="scripture-display border-none m-0 p-0">
            All Scripture is God-breathed and is profitable for teaching, for
            reproof, for correction, and for instruction in righteousness.
          </blockquote>
          <p className="scripture-ref">2 Timothy 3:16 · WEB</p>
        </section>

        <div className="flex flex-col gap-6 mb-12">
          {articles.map((a) => (
            <article key={a.n} className="card">
              <p className="card__eyebrow">Article {a.n}</p>
              <h2 className="m-0 mb-3" style={{ fontSize: "var(--fs-h3)" }}>
                {a.heading}
              </h2>
              <p className="m-0 text-warm">{a.body}</p>
            </article>
          ))}
        </div>

        <section className="card mb-10">
          <p className="card__eyebrow">Doctrinal boundary</p>
          <p className="m-0 text-warm">
            What is stated above is held without negotiation. Where Scripture
            speaks clearly, we speak clearly. Where Scripture has been read
            differently by faithful Christians across the centuries, we name
            the positions charitably and decline to bind consciences beyond
            what is written. See our{" "}
            <Link href="/doctrinal-basis" className="text-gold">
              doctrinal basis
            </Link>
            .
          </p>
        </section>

        <div className="gold-divider" />

        <section>
          <p className="eyebrow">Next steps</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/come-to-christ" className="btn btn--primary">
              Come to Christ
            </Link>
            <Link href="/doctrinal-basis" className="btn btn--secondary">
              Our doctrinal basis
            </Link>
            <Link href="/scroll" className="btn btn--ghost">
              Study deeper in The Scroll
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
}
