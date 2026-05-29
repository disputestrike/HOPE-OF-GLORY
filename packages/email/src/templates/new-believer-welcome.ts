/**
 * New Believer Welcome — 7-touch sequence.
 *
 * Trigger: user clicks "I prayed" on /come-to-christ.
 * Cadence: day 0, 1, 3, 5, 7, 10, 14.
 * Primary CTA on every step: Start the 40-Day Journey.
 *
 * Tone: pastoral, short (180–250 words). No guilt. No urgency.
 * No prosperity language. One WEB scripture per email.
 */

import {
  shell,
  heading,
  paragraph,
  scripture,
  primaryButton,
  nameSuffix,
  stripHtml,
  BRAND_URL,
} from "./_shell";

export type NewBelieverOpts = {
  givenName?: string;
  /** Override the journey CTA URL. Defaults to /journey/40-day. */
  journeyUrl?: string;
};

type Built = { subject: string; html: string; text: string };

function journeyHref(opts: NewBelieverOpts): string {
  return opts.journeyUrl ?? `${BRAND_URL}/journey/40-day`;
}

function build(args: {
  subject: string;
  title: string;
  bodyHtml: string;
  scriptureRef: string;
  scriptureText: string;
  ctaHref: string;
  ctaLabel?: string;
}): Built {
  const cta = args.ctaLabel ?? "Start the 40-Day Journey";
  const inner = `
    ${heading(args.title)}
    ${args.bodyHtml}
    ${scripture(args.scriptureRef, args.scriptureText)}
    ${primaryButton(args.ctaHref, cta)}
  `;
  const text =
    `${args.title}\n\n` +
    `${stripHtml(args.bodyHtml)}\n\n` +
    `"${args.scriptureText}"\n— ${args.scriptureRef} (WEB)\n\n` +
    `${cta}: ${args.ctaHref}`;
  return { subject: args.subject, html: shell(inner), text };
}

/* ------------------------------ Day 0 ------------------------------ */

export function newBelieverDay0(opts: NewBelieverOpts = {}): Built {
  const name = nameSuffix(opts.givenName);
  return build({
    subject: "You prayed. Here is what comes next.",
    title: `You prayed${name}.`,
    bodyHtml: `
      ${paragraph(
        "Whatever brought you to that prayer — grief, hope, exhaustion, a long search — Jesus heard you. The Father is not far off. Right now, in this quiet moment, you belong to Him."
      )}
      ${paragraph(
        "You do not need to feel different to be different. The new life Jesus gives is not a feeling first; it is a fact you grow into."
      )}
      ${paragraph(
        "Over the next two weeks we will send a short note every few days. No pressure, no salesmanship — just the next small step. When you are ready, the 40-Day Journey walks you through the gospel of John, what prayer is, what baptism means, and how to find a faithful church."
      )}
    `,
    scriptureRef: "John 1:12",
    scriptureText:
      "But as many as received him, to them he gave the right to become God's children, to those who believe in his name.",
    ctaHref: journeyHref(opts),
  });
}

/* ------------------------------ Day 1 ------------------------------ */

export function newBelieverDay1(opts: NewBelieverOpts = {}): Built {
  const name = nameSuffix(opts.givenName);
  return build({
    subject: "Day 1: Tell someone.",
    title: `Day 1: Tell someone${name}.`,
    bodyHtml: `
      ${paragraph(
        "One of the first things Jesus' followers did was tell someone else. Not preach — just tell. Andrew told his brother. The woman at the well told her town. You do not need theology yet; you only need the truth that something has changed."
      )}
      ${paragraph(
        "Pick one person you trust. A friend, a parent, a sibling. Send a short message: <em>I started following Jesus. I am still figuring out what that means, but I wanted you to know.</em>"
      )}
      ${paragraph(
        "That is enough for today. You do not have to defend anything. You only have to be honest."
      )}
    `,
    scriptureRef: "John 1:41",
    scriptureText:
      "He first found his own brother, Simon, and said to him, \"We have found the Messiah!\"",
    ctaHref: journeyHref(opts),
  });
}

/* ------------------------------ Day 3 ------------------------------ */

export function newBelieverDay3(opts: NewBelieverOpts = {}): Built {
  return build({
    subject: "Day 3: Open the Bible.",
    title: "Day 3: Open the Bible.",
    bodyHtml: `
      ${paragraph(
        "If you have never read the Bible, start with the gospel of John. It is the fourth book in the New Testament. John was written so that you would know who Jesus is and that, by believing, you would have life in His name."
      )}
      ${paragraph(
        "Read one chapter. That is it. If a verse confuses you, mark it and keep going — you will find that the gospel explains itself the longer you read."
      )}
      ${paragraph(
        "When you are ready, the 40-Day Journey walks you through John one short reading at a time, with a reflection and a prayer for each day."
      )}
    `,
    scriptureRef: "John 20:31",
    scriptureText:
      "But these are written, that you may believe that Jesus is the Christ, the Son of God, and that believing you may have life in his name.",
    ctaHref: journeyHref(opts),
  });
}

/* ------------------------------ Day 5 ------------------------------ */

export function newBelieverDay5(opts: NewBelieverOpts = {}): Built {
  return build({
    subject: "Day 5: Pray honestly.",
    title: "Day 5: Pray honestly.",
    bodyHtml: `
      ${paragraph(
        "Prayer is not a performance. It is not a set of right words. It is talking to your Father, who already knows you and is glad you came."
      )}
      ${paragraph(
        "Try this today: in your own words, tell God one thing that is true about your life right now. Something hard, something hopeful, something you do not understand. Then sit quietly for a moment."
      )}
      ${paragraph(
        "You will not always feel an answer. You are not supposed to. You are learning a relationship, and relationships are built in the ordinary moments, not the dramatic ones."
      )}
    `,
    scriptureRef: "Matthew 6:6",
    scriptureText:
      "But you, when you pray, enter into your inner room, and having shut your door, pray to your Father who is in secret; and your Father who sees in secret will reward you openly.",
    ctaHref: journeyHref(opts),
  });
}

/* ------------------------------ Day 7 ------------------------------ */

export function newBelieverDay7(opts: NewBelieverOpts = {}): Built {
  return build({
    subject: "Day 7: Find a local church.",
    title: "Day 7: Find a local church.",
    bodyHtml: `
      ${paragraph(
        "You were not meant to walk this out alone. The Christian life happens in a body of believers — ordinary people who read the Bible together, sing together, take communion, baptize, and carry each other's burdens."
      )}
      ${paragraph(
        "Look for a church near you that preaches the Bible plainly, lifts up Jesus, and welcomes you as you are. Visit once. Then visit again. It often takes a few Sundays to begin to belong."
      )}
      ${paragraph(
        "If you do not know where to start, reply to this email and we will help you think it through. No pressure."
      )}
    `,
    scriptureRef: "Hebrews 10:24-25",
    scriptureText:
      "Let's consider how to provoke one another to love and good works, not forsaking our own assembling together, as the custom of some is, but exhorting one another.",
    ctaHref: journeyHref(opts),
  });
}

/* ------------------------------ Day 10 ------------------------------ */

export function newBelieverDay10(opts: NewBelieverOpts = {}): Built {
  return build({
    subject: "Day 10: What about baptism?",
    title: "Day 10: What about baptism?",
    bodyHtml: `
      ${paragraph(
        "Baptism is the public, physical sign of an inward reality. Going under the water pictures dying with Jesus; coming up pictures being raised to new life with Him. It is not what saves you — Jesus does that — but it is the first act of obedience He asked of His followers."
      )}
      ${paragraph(
        "If you have not been baptized, talk to a pastor at a local church. They will walk through it with you, answer your questions, and set a date. It is a celebration, not a test."
      )}
      ${paragraph(
        "If you have questions you do not feel ready to ask a pastor in person, you can reply to this email."
      )}
    `,
    scriptureRef: "Romans 6:4",
    scriptureText:
      "We were buried therefore with him through baptism into death, that just as Christ was raised from the dead through the glory of the Father, so we also might walk in newness of life.",
    ctaHref: journeyHref(opts),
  });
}

/* ------------------------------ Day 14 ------------------------------ */

export function newBelieverDay14(opts: NewBelieverOpts = {}): Built {
  const name = nameSuffix(opts.givenName);
  return build({
    subject: "Day 14: Two weeks in. Keep coming.",
    title: `Two weeks in${name}.`,
    bodyHtml: `
      ${paragraph(
        "The first few weeks of following Jesus often feel like everything and nothing at once. Some days you are sure. Some days you wonder if any of it took. Both are normal."
      )}
      ${paragraph(
        "Keep coming. Keep reading. Keep praying short, honest prayers. Keep showing up to a church even when you do not feel like it. The life of faith is built from small repeated steps, not heroic ones."
      )}
      ${paragraph(
        "We will keep walking with you. When you are ready, the 40-Day Journey is the next steady step — a short reading, a reflection, and a prayer each day for forty days."
      )}
    `,
    scriptureRef: "Philippians 1:6",
    scriptureText:
      "Being confident of this very thing, that he who began a good work in you will complete it until the day of Jesus Christ.",
    ctaHref: journeyHref(opts),
  });
}
