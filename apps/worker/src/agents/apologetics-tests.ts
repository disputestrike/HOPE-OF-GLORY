/**
 * Hard-objection test suite. The Apologetics Agent must pass ≥ 90% before
 * the live debate room (Phase 11) opens to the public.
 */
export type HardObjection = {
  category: string;
  question: string;
};

export const HARD_OBJECTIONS: readonly HardObjection[] = [
  // Bible reliability
  { category: "bible", question: "How can you trust a book full of contradictions?" },
  { category: "bible", question: "The Bible was rewritten by men over centuries — why believe any of it?" },
  { category: "bible", question: "What about the lost books like the Gospel of Thomas?" },
  // Trinity
  { category: "trinity", question: "The word 'Trinity' isn't in the Bible. Why teach it?" },
  { category: "trinity", question: "How can three persons be one God? That's just illogical." },
  // Christology
  { category: "christ", question: "Jesus never claimed to be God in the synoptic gospels." },
  { category: "christ", question: "If Jesus is God, who was he praying to in the garden?" },
  { category: "christ", question: "How can a good God allow His son to be tortured?" },
  // Problem of evil
  { category: "evil", question: "If God is all-powerful and all-good, why is there so much evil and suffering?" },
  { category: "evil", question: "How can a loving God send people to hell forever?" },
  // Other religions / Islam
  { category: "islam", question: "Why is Christianity true and not Islam? Muslims read their book too." },
  { category: "islam", question: "Muslims say the Bible was corrupted. How would you respond?" },
  // Atheism / science
  { category: "atheism", question: "There's no scientific evidence for God." },
  { category: "atheism", question: "Evolution disproves Genesis." },
  // Sexuality
  { category: "sexuality", question: "Why does Christianity condemn LGBTQ+ people?" },
  { category: "sexuality", question: "Doesn't Jesus' 'love your neighbor' mean accepting everyone as they are?" },
  // Exclusivity
  { category: "exclusivity", question: "How can you say Jesus is the only way? What about people who never hear?" },
  { category: "exclusivity", question: "Aren't all religions basically the same?" },
  // JW / LDS
  { category: "jw", question: "Jehovah's Witnesses say Jesus is Michael the Archangel. Why is that wrong?" },
  { category: "lds", question: "Mormons believe in Jesus too. Are they Christians?" },
  // Catholic / Orthodox
  { category: "catholic", question: "Why are you not Catholic? The Catholic Church is the original church." },
  // Pastoral / hard
  { category: "suffering", question: "I prayed and God didn't answer. Why?" },
  { category: "doubt", question: "I used to believe but I just can't anymore. What do you say to me?" },
  { category: "resurrection", question: "The resurrection is just a myth that grew over time." },
  { category: "miracles", question: "Miracles violate the laws of nature, so they can't happen." },
  // Modern / progressive
  { category: "progressive", question: "Why do conservative Christians focus so much on rules?" },
  { category: "deconstruction", question: "I deconstructed and I'm happier. Why would I go back?" },
];
