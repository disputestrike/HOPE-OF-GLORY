/**
 * Single source of truth for the public Donor Bill of Rights and the
 * Hope of Glory Ministry donation ethics statement.
 *
 * Used on both /give and /donation-ethics so the text never drifts.
 * The Donor Bill of Rights wording follows the AFP standard.
 */

export const MISSION_STATEMENT =
  "Hope of Glory Ministry exists to fill the earth with the knowledge of the glory of the Lord by proclaiming Jesus Christ through Scripture, prayer, teaching, apologetics, and AI-powered digital ministry. Your support helps keep the ministry online, free to access, and available to people seeking Christ, prayer, and biblical answers.";

export const GIFT_FUNDING_ITEMS: ReadonlyArray<string> = [
  "Daily sermon production and free distribution",
  "Ask Hope, the Scripture-and-prayer chat product (server time and model use)",
  "The Hope Line phone number and crisis-ready operations",
  "Translation of teaching into other languages",
  "Free apologetics content for seekers",
];

export const DONATION_ETHICS_POINTS: ReadonlyArray<string> = [
  "The gospel, prayer, and biblical help remain free; giving is always optional.",
  "We will never use guilt, shame, fear, urgency, or crisis language to ask for money.",
  "We will never frame giving as a transaction with God or Hope of Glory Ministry.",
  "We will never promise blessing, healing, favor, breakthrough, or financial return in exchange for a gift.",
  "We will never ask for or mention giving during prayer, crisis, financial hardship, shelter, hunger, or safety interactions.",
  "We will publish how we use what we receive and answer donor questions plainly.",
  "You can ask for a refund within 30 days, no questions asked.",
];

export const DONOR_BILL_OF_RIGHTS: ReadonlyArray<string> = [
  "To be informed of the organization's mission, of the way the organization intends to use donated resources, and of its capacity to use donations effectively.",
  "To be informed of the identity of those serving on the governing board, and to expect the board to exercise prudent judgment in its stewardship responsibilities.",
  "To have access to the organization's most recent financial statements.",
  "To be assured their gifts will be used for the purposes for which they were given.",
  "To receive appropriate acknowledgement and recognition.",
  "To be assured that information about their donation is handled with respect and confidentiality.",
  "To expect that all relationships with individuals representing organizations of interest will be professional in nature.",
  "To be informed whether those seeking donations are volunteers, employees of the organization, or hired solicitors.",
  "To have the opportunity for their names to be deleted from mailing lists.",
  "To feel free to ask questions when making a donation, and to receive prompt, truthful, and forthright answers.",
];
