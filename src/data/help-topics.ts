/**
 * Help topic catalog. Each entry powers /help/[topic] dynamic route.
 * Sourced from the soul-care + crisis brief. Tone is pastoral, not clinical.
 *
 * RULES:
 *   - Every page includes the NeedHelpBanner at the top
 *   - The "suicide" topic uses a CUSTOM page (not this dynamic route)
 *     because it requires the strictest crisis-mode response
 *   - Every page lists key WEB Scriptures and 1-2 next steps
 *   - Pages must NOT show donation prompts
 */

export type HelpTopic = {
  slug: string;
  hubLabel: string;
  title: string;
  subtitle: string;
  pageTitle: string;
  shortAnswer: string;
  body: string; // Markdown
  scriptures: Array<{ ref: string; text: string }>;
  nextSteps: Array<{ label: string; href: string }>;
};

export const HELP_TOPICS: Record<string, HelpTopic> = {
  grief: {
    slug: "grief",
    hubLabel: "Grief and loss",
    title: "Where Is God in My Grief?",
    subtitle: "When you lose someone you love.",
    pageTitle: "I am grieving",
    shortAnswer:
      "Christianity does not tell you to pretend grief is small. Jesus wept at Lazarus' tomb. Death is an enemy — but Christ entered death, defeated it, and promises resurrection life to all who belong to him. Christians grieve, but not as those without hope.",
    body: `## You are not alone

Grief is not a sign of weak faith. Jesus himself wept at the grave of his friend Lazarus — even knowing he was about to raise him from the dead (John 11:35). God does not require you to skip the tears.

## What death actually is

Death is an enemy. The Bible never softens that. Death is what should not be. It entered the world through sin, and it will be the last enemy destroyed when Christ returns (1 Corinthians 15:26).

But death is not the end of the story. Christ entered the grave. Christ rose from the grave. And he carries everyone who belongs to him through death into resurrection life.

## What this means for you

If your loved one belonged to Christ, they are with him now (2 Corinthians 5:8) — and you will see them again at the resurrection.

If your loved one's standing is unclear to you, leave that to the God who is more merciful than you can imagine. He has not asked you to weigh their soul. He has asked you to come to him with your grief.

## When the comfort feels far

The Lord is **near to the brokenhearted** (Psalm 34:18). Not far. Near. Even in the heaviest hours. Especially in those hours.`,
    scriptures: [
      { ref: "John 11:25-35", text: "Jesus weeps and declares himself the resurrection" },
      { ref: "1 Thessalonians 4:13-18", text: "Do not grieve as those without hope" },
      { ref: "Psalm 34:18", text: "The Lord is near to the brokenhearted" },
      { ref: "Revelation 21:1-5", text: "God wipes away every tear" },
      { ref: "1 Corinthians 15:20-26", text: "Death is the last enemy" },
    ],
    nextSteps: [
      { label: "Pray with Ask Hope", href: "/ask" },
      { label: "Share a prayer request", href: "/prayer" },
    ],
  },

  fear: {
    slug: "fear",
    hubLabel: "Fear and anxiety",
    title: "What Does the Bible Say About Fear and Anxiety?",
    subtitle: "The honest cry of an honest heart.",
    pageTitle: "I feel afraid",
    shortAnswer:
      "Fear reveals our weakness and our need for God. Scripture does not mock human fear — it repeatedly calls us to bring fear before the Lord. The answer is not denial. It is knowing the Father, trusting Christ, receiving the Spirit's help, praying honestly, and learning to rest.",
    body: `## You are allowed to be afraid

The Bible does not shame fear. It tells the story of David being afraid of Saul, Elijah running from Jezebel, the disciples panicking in a storm. God did not strike them down for trembling. He met them.

## What anxiety is not

Anxiety, as a feeling, is not automatically sin. It is the human nervous system warning you of danger. Sometimes the danger is real (a real bill, a real diagnosis). Sometimes it is exaggerated by exhaustion, grief, trauma, or illness.

What Scripture forbids is the anxiety that *rules* you — that crowds out trust, that takes the throne God should have, that says "God is not enough" and lives accordingly.

## How to respond

1. **Pray honestly.** Tell God exactly what you're afraid of. Not vague. Specific.
2. **Cast it on him.** 1 Peter 5:7 doesn't say "ignore it." It says "cast it on him, because he cares for you."
3. **Replace anxious thoughts with true ones.** Philippians 4:8 — whatever is true, whatever is honorable, think on these things.
4. **Get help if you need it.** Severe anxiety can be a medical issue. There is no shame in talking to a doctor or counselor. God works through them too.`,
    scriptures: [
      { ref: "Psalm 23", text: "I will fear no evil, for you are with me" },
      { ref: "Psalm 56:3", text: "When I am afraid, I trust in you" },
      { ref: "Isaiah 41:10", text: "Fear not, I am with you" },
      { ref: "Matthew 6:25-34", text: "Do not be anxious about your life" },
      { ref: "John 14:27", text: "My peace I give to you" },
      { ref: "Philippians 4:6-7", text: "Prayer and the peace of God" },
      { ref: "1 Peter 5:7", text: "Cast your anxieties on him" },
    ],
    nextSteps: [
      { label: "Pray with Ask Hope", href: "/ask" },
      { label: "Talk to a real person", href: "/contact" },
    ],
  },

  loneliness: {
    slug: "loneliness",
    hubLabel: "Loneliness",
    title: "Does God See Me When I Feel Alone?",
    subtitle: "When no one is near.",
    pageTitle: "I feel alone",
    shortAnswer:
      "You were made for communion with God and fellowship with others. Loneliness is not always sin — often it is a wound that reveals you were made for love, presence, and belonging. In Christ, God draws near, gives his Spirit, and brings believers into a family.",
    body: `## God sees you

Before anyone else saw your loneliness, God did. He sees the small hours. He sees the unread messages. He sees the rooms you sit in.

Psalm 139 says he searches you and knows you. There is nowhere you can go from his presence. Not your loneliest night. Not your darkest mood.

## You were not made to be alone

Even before sin entered the world, God said "it is not good that the man should be alone" (Genesis 2:18). Your hunger for belonging is not a flaw. It is the design.

## The family Christ brings

In Christ, you are not just a believer — you are adopted, brought into a family that spans every nation and every century. The local church, when it is healthy, is where that family becomes flesh and blood near you.

If you don't have a local church, use Ask Hope to think through finding one. If the church has hurt you, we will not pretend that didn't happen — but please don't let that be the final word.`,
    scriptures: [
      { ref: "Genesis 2:18", text: "Not good for man to be alone" },
      { ref: "Psalm 139", text: "God knows and sees" },
      { ref: "Psalm 68:5-6", text: "God sets the lonely in families" },
      { ref: "Matthew 28:20", text: "I am with you always" },
      { ref: "John 14:16-18", text: "I will not leave you as orphans" },
      { ref: "Hebrews 13:5", text: "I will never leave you" },
    ],
    nextSteps: [
      { label: "Find a local church", href: "/read/church-and-discipleship/local-church-matters" },
      { label: "Ask Hope", href: "/ask" },
    ],
  },

  doubt: {
    slug: "doubt",
    hubLabel: "Doubt and lost faith",
    title: "What If I Doubt God or Feel Like I Lost My Faith?",
    subtitle: "Honest questions are welcome here.",
    pageTitle: "I doubt",
    shortAnswer:
      "Doubt is not the opposite of faith — unbelief is. The man in Mark 9 cried, 'I believe; help my unbelief,' and Jesus received him. Bring doubt to Christ. Return to Scripture. Pray honestly. Look again at Jesus.",
    body: `## You can come here with your doubt

This is not a place that punishes questions. The Bible is full of people asking. Habakkuk asks. David asks. Job asks. Even Jesus, from the cross, cried "My God, why have you forsaken me?"

## What doubt is

Doubt is the unsteady place between belief and unbelief. Some doubt is honest struggle — questions you've never been able to answer. Some doubt is pain — the death you couldn't accept, the abuse you couldn't reconcile, the prayer that wasn't answered. Some doubt is doctrinal confusion. Some is sin's slow erosion. Some is exhaustion.

The Bible does not say "have it all figured out." It says "come."

## Three things to do

1. **Bring it to Jesus directly.** Not to a forum, not to your enemies' books first. Tell him out loud what you doubt. He hears.
2. **Look again at the resurrection.** If Christ rose, everything else holds. If he didn't, nothing else matters. The historical case for the resurrection is more serious than most people who reject it have ever examined.
3. **Stay in community.** Don't deconstruct alone. Don't reconstruct alone. Find faithful believers who will sit with your questions without panic and without pretense.`,
    scriptures: [
      { ref: "Mark 9:24", text: "I believe; help my unbelief" },
      { ref: "John 20:24-29", text: "Thomas and the risen Christ" },
      { ref: "Psalm 73", text: "Almost slipping, then returning to God" },
      { ref: "Habakkuk 1-2", text: "Honest questions before God" },
      { ref: "Jude 22", text: "Have mercy on those who doubt" },
      { ref: "Hebrews 12:1-2", text: "Looking to Jesus" },
    ],
    nextSteps: [
      { label: "Ask Hope your hardest question", href: "/ask" },
      { label: "Read the apologetics desk", href: "/apologetics" },
    ],
  },

  shame: {
    slug: "shame",
    hubLabel: "Shame, guilt, regret",
    title: "Can God Forgive Me After What I've Done?",
    subtitle: "Yes. Yes, he can.",
    pageTitle: "I carry shame",
    shortAnswer:
      "Guilt says 'I have sinned.' Shame says 'I am beyond love and restoration.' The gospel tells the truth about sin without leaving us in condemnation. In Christ, sinners are forgiven, cleansed, justified, adopted, and made new.",
    body: `## You are not too far

Whatever you've done. Whatever was done to you. Whatever you can't say out loud. Jesus knows. He's already paid. He is not waiting for you to clean up before you come.

The thief on the cross had nothing to offer. He couldn't be baptized. He couldn't make restitution. He had hours to live. Jesus said, *"Today you will be with me in Paradise."*

## Guilt vs. shame

Guilt is what you've done. Shame is who you fear you've become. Guilt drives you to repent. Shame drives you to hide.

The gospel speaks to both. Your guilt is real — and it is covered by the blood of Christ. Your shame is a lie — and it is killed by the love of Christ.

## What to do

1. **Tell God specifically.** Don't generalize. Name the thing.
2. **Receive his cleansing.** 1 John 1:9 is not a maybe. He is faithful and just to forgive.
3. **Believe that he sees you the way he says he sees you.** Romans 8:1 — there is no condemnation for those who are in Christ Jesus.
4. **Walk in the light with one trusted believer.** Shame loses power when it stops being secret.`,
    scriptures: [
      { ref: "Psalm 32", text: "Blessed is the one whose transgression is forgiven" },
      { ref: "Psalm 51", text: "Create in me a clean heart, O God" },
      { ref: "Romans 8:1", text: "No condemnation in Christ Jesus" },
      { ref: "1 John 1:9", text: "If we confess, he is faithful and just to forgive" },
      { ref: "2 Corinthians 5:17", text: "If anyone is in Christ, he is a new creation" },
      { ref: "Hebrews 10:19-22", text: "Hearts sprinkled clean" },
    ],
    nextSteps: [
      { label: "Pray with Ask Hope", href: "/ask" },
      { label: "Come to Christ", href: "/come-to-christ" },
    ],
  },

  confession: {
    slug: "confession",
    hubLabel: "Confession",
    title: "How Do I Confess My Sins to God?",
    subtitle: "Honest words. No more hiding.",
    pageTitle: "I need to confess",
    shortAnswer:
      "Confession is agreeing with God about sin and bringing it into the light. It is not informing God of what he doesn't know — it is coming out of hiding. Confession opens the way for forgiveness, cleansing, healing, accountability, and restored fellowship.",
    body: `## What confession is

Confession is the most freeing thing a sinner can do. It is saying out loud what you've been carrying in secret. It is agreeing with God about what is broken.

It is not a payment. It is not a performance. It is not earning. It is breathing out what is killing you so you can breathe in his mercy.

## How to do it

1. **Be specific.** "Forgive me for being a bad person" is not confession. "Forgive me for the lie I told my wife on Tuesday" is.
2. **Name the sin without excusing it.** Don't soften it. Don't blame anyone else. Just bring it.
3. **Receive his forgiveness as a fact.** When God forgives, it is done. Do not keep paying for what Christ already paid.
4. **Where the sin involves another person, repent to them too.** Confession to God is for forgiveness; confession to people is for reconciliation. Both matter.

## Should I confess to another person?

Yes — to a trusted believer. James 5:16 says to confess your sins to one another and pray for each other. Hidden sin grows. Shared sin loses power.

You don't need a priest to mediate between you and God — Christ is the one mediator (1 Timothy 2:5). But you need brothers and sisters in the body of Christ to walk this with you.`,
    scriptures: [
      { ref: "Genesis 3", text: "Hiding from God" },
      { ref: "Psalm 32", text: "When I kept silent, my bones wasted away" },
      { ref: "Psalm 51", text: "Confession after sin" },
      { ref: "Proverbs 28:13", text: "Whoever conceals his sin will not prosper" },
      { ref: "James 5:16", text: "Confess your sins to one another and pray" },
      { ref: "1 John 1:9", text: "If we confess our sins, he is faithful to forgive" },
    ],
    nextSteps: [
      { label: "Pray with Ask Hope", href: "/ask" },
      { label: "Come to Christ", href: "/come-to-christ" },
    ],
  },

  anger: {
    slug: "anger",
    hubLabel: "Anger and bitterness",
    title: "How Do I Deal With Anger and Bitterness?",
    subtitle: "God sees the wound behind the rage.",
    pageTitle: "I am angry",
    shortAnswer:
      "Anger can recognize real evil, but it becomes sinful when it rules us, seeks vengeance, or refuses love. Bitterness imprisons the soul. Christ teaches us to bring anger under God's judgment, seek justice rightly, forgive as forgiven people, and leave vengeance to the Lord.",
    body: `## What happened to you was not nothing

The Bible does not tell you to pretend you weren't hurt. Jesus was angry in the temple. God is described as slow to anger — which means anger is in him too, when injustice demands it.

What happened to you may have been real. The pain may be real. Acknowledging that is not bitterness. It is honesty.

## When anger becomes sin

Anger becomes sin when it:
- Rules you instead of being ruled by Christ
- Seeks revenge instead of leaving justice to God
- Refuses love
- Festers into bitterness that poisons everyone around it
- Justifies what God forbids

Ephesians 4:26-27 says be angry and do not sin. The two are not the same. Quick anger followed by quick repentance is human. Slow burning anger that becomes the way you see the world is bitterness — and bitterness destroys the bitter person first.

## Forgiveness

Forgiveness is not saying "what happened was okay." It is releasing the right to vengeance into God's hands. It is letting him be the judge instead of you.

Forgiveness does not require reconciliation. You can forgive someone you will never see again. You can forgive someone who is dangerous and still have nothing to do with them.

But unforgiveness is a cage you build for yourself. Christ has the key.`,
    scriptures: [
      { ref: "Ephesians 4:26-32", text: "Be angry and do not sin" },
      { ref: "James 1:19-20", text: "The anger of man does not produce God's righteousness" },
      { ref: "Romans 12:17-21", text: "Vengeance is mine, says the Lord" },
      { ref: "Hebrews 12:15", text: "See that no root of bitterness springs up" },
      { ref: "Matthew 18:21-35", text: "Forgive as you have been forgiven" },
      { ref: "Luke 23:34", text: "Father, forgive them — Jesus on the cross" },
    ],
    nextSteps: [
      { label: "Pray with Ask Hope", href: "/ask" },
      { label: "Talk to a real person", href: "/contact" },
    ],
  },

  rejection: {
    slug: "rejection",
    hubLabel: "Rejection",
    title: "What If I Feel Rejected, Unwanted, or Unseen?",
    subtitle: "God knows your name.",
    pageTitle: "I feel rejected",
    shortAnswer:
      "You may feel lost, unwanted, or unseen — but you are not invisible to God. You were made in his image. Christ came to seek and save the lost. Your worth is not measured by who rejected you, what you own, or how broken your life feels.",
    body: `## What rejection actually does

Rejection lies. It tells you the verdict of one person, or many people, is the verdict of God. It is not.

Jesus himself was *despised and rejected by men* (Isaiah 53:3). He knows. He doesn't speak about rejection from a distance.

## Where your worth comes from

Your worth is not in being chosen by people. Your worth is in being made by God in his image, and — if you are in Christ — being chosen by him before the foundation of the world (Ephesians 1:4).

That is a verdict no human rejection can overturn.

## A word about being unwanted

If you have ever been unwanted — by a parent, a partner, a family, a church, a culture — let the words of Psalm 27 sit on your soul:

> *Though my father and mother forsake me, the Lord will take me up.*

He does. He has. He will.`,
    scriptures: [
      { ref: "Luke 15", text: "The lost sheep, the lost coin, the lost son" },
      { ref: "Psalm 139", text: "God knows and sees" },
      { ref: "Psalm 27:10", text: "Though my father and mother forsake me, the Lord will take me up" },
      { ref: "Isaiah 43:1-7", text: "Called by name, created for glory" },
      { ref: "Matthew 11:28-30", text: "Come to me, all who labor and are heavy laden" },
      { ref: "John 6:37", text: "Whoever comes to me I will never cast out" },
      { ref: "Romans 8:31-39", text: "Nothing separates from God's love in Christ" },
    ],
    nextSteps: [
      { label: "Come to Christ", href: "/come-to-christ" },
      { label: "Ask Hope", href: "/ask" },
    ],
  },

  "feeling-lost": {
    slug: "feeling-lost",
    hubLabel: "Feeling lost",
    title: "What If I Feel Lost?",
    subtitle: "Christ came for the lost.",
    pageTitle: "I feel lost",
    shortAnswer:
      "Jesus said he came to seek and save the lost. Not the impressive. Not the figured-out. The lost. If you feel lost right now, you are exactly the person he came for.",
    body: `## Lost is not too far

Jesus told three stories in Luke 15: a lost sheep, a lost coin, a lost son. In all three, the lost one is *found*. The shepherd searches. The woman sweeps. The father runs.

He is searching for you. He is not annoyed that you are lost. He is moving toward you.

## What to do when you don't know what to do

1. **Stop pretending you know the way.** The first step is admitting you don't.
2. **Pray a simple prayer.** *Lord, I am lost. Find me. I am yours.*
3. **Open the Bible to John 1.** Read until you find Jesus.
4. **Ask Hope one question.** Just one.
5. **Find a faithful local church.** Lost people are not meant to stay lost — or alone.`,
    scriptures: [
      { ref: "Luke 15", text: "Lost sheep, coin, son" },
      { ref: "Luke 19:10", text: "The Son of Man came to seek and save the lost" },
      { ref: "Matthew 11:28-30", text: "Come to me, all who labor" },
      { ref: "John 14:6", text: "I am the way, the truth, and the life" },
    ],
    nextSteps: [
      { label: "Come to Christ", href: "/come-to-christ" },
      { label: "Ask Hope", href: "/ask" },
    ],
  },

  hopelessness: {
    slug: "hopelessness",
    hubLabel: "Hopelessness / despair",
    title: "Where Is God When I Feel Hopeless?",
    subtitle: "He is closest in the dark.",
    pageTitle: "I feel hopeless",
    shortAnswer:
      "Scripture gives language for despair. The Psalms cry from the depths. Elijah wanted to die. Job cursed the day of his birth. Yet God meets his people in weakness, not only when they feel strong. Hope in Christ does not mean pretending pain is not real.",
    body: `## Read this first

If you are thinking about ending your life or hurting yourself, please call or text **988** (U.S. Suicide & Crisis Lifeline) or **911** for immediate emergency. Outside the U.S., contact your local emergency number. You should not be alone with this right now.

[See our crisis resources](/help/crisis-resources)

## You are not the first

Elijah ran into the wilderness and asked God to take his life (1 Kings 19). Job wished he had never been born (Job 3). The author of Psalm 88 ends in darkness without resolution. These voices are in the Bible because despair is not foreign to the Christian life.

## What hopelessness is not

Hopelessness is not a sign that you have no faith. It is not proof God has abandoned you. It is often a sign of exhaustion — physical, emotional, spiritual, sometimes medical.

## What to do

1. **Get safe.** If you are at risk, call 988 or get to a hospital. This is not a lack of faith. It is wisdom.
2. **Sleep. Eat. Drink water.** Despair lies. The body matters.
3. **Tell one person.** Don't carry this alone. A friend. A pastor. Us at the contact page.
4. **Pray the Psalms when you can't find your own words.** Psalm 42, 43, 88.
5. **Talk to a doctor or counselor.** Severe despair can be a medical issue. There is no shame in real help.
6. **Remember the resurrection.** Christ did not stay in the tomb. Death does not get the final word.`,
    scriptures: [
      { ref: "Psalm 42-43", text: "Why are you cast down, O my soul?" },
      { ref: "Psalm 88", text: "Darkness and lament" },
      { ref: "1 Kings 19", text: "Elijah exhausted and despairing" },
      { ref: "Job 3", text: "Job's anguish" },
      { ref: "2 Corinthians 1:8-10", text: "Burdened beyond strength" },
      { ref: "Matthew 11:28-30", text: "Come to me, all who labor" },
      { ref: "Romans 15:13", text: "God of hope" },
    ],
    nextSteps: [
      { label: "Crisis resources", href: "/help/crisis-resources" },
      { label: "Pray with Ask Hope", href: "/ask" },
      { label: "Talk to a real person", href: "/contact" },
    ],
  },

  "family-pain": {
    slug: "family-pain",
    hubLabel: "Family pain",
    title: "What Does God Say About Family Pain?",
    subtitle: "He cares about families, and he never pretends they are painless.",
    pageTitle: "My family hurts",
    shortAnswer:
      "God cares about families, but the Bible does not pretend families are painless. Sin damages homes. Christ brings truth, forgiveness, wisdom, boundaries, repentance, and reconciliation where possible. Peace should be pursued — but abuse and evil should never be hidden.",
    body: `## The Bible is full of broken families

Cain killed his brother. Abraham favored Isaac. Jacob deceived his father. Joseph's brothers sold him. David's son Absalom rebelled. The family of God in Genesis is not a fairy tale.

You are not alone, and your family is not uniquely broken.

## What Christ brings

- **Truth.** The pretending stops.
- **Forgiveness.** Where you've sinned, ownership and confession. Where you've been sinned against, the path of forgiveness even when reconciliation is not safe.
- **Wisdom.** Sometimes silence; sometimes the hard conversation; sometimes the boundary; sometimes the leaving.
- **Boundaries.** "As far as it depends on you, live peaceably with all" (Romans 12:18) — sometimes peace requires distance.
- **Reconciliation, where possible.** Christ is the great reconciler. Where both parties humble themselves, miracles happen.

## A hard word about abuse

If you are being abused — physically, sexually, emotionally — by a family member, **the Bible does not require you to stay in danger**. Get safe first. Tell a trusted person outside the family. Contact authorities if there is immediate danger. Your safety is not negotiable.

See [crisis resources](/help/crisis-resources).`,
    scriptures: [
      { ref: "Exodus 20:12", text: "Honor your father and mother" },
      { ref: "Romans 12:18", text: "As far as it depends on you, live peaceably with all" },
      { ref: "Ephesians 4:31-32", text: "Forgive as God in Christ forgave you" },
      { ref: "Colossians 3:12-21", text: "Household life in Christ" },
      { ref: "Matthew 18:15-20", text: "When a brother sins against you" },
    ],
    nextSteps: [
      { label: "Crisis resources if you are unsafe", href: "/help/crisis-resources" },
      { label: "Pray with Ask Hope", href: "/ask" },
    ],
  },

  "no-money": {
    slug: "no-money",
    hubLabel: "Financial stress",
    title: "What If I Have No Money?",
    subtitle: "God cares about the poor, the hungry, and the unemployed.",
    pageTitle: "I have no money",
    shortAnswer:
      "Poverty is not proof that God hates you. Scripture calls us to pray for daily bread, work honestly where possible, practice wisdom, reject greed, receive help without shame, and trust the Father's care. The Church is also called to generosity and mercy.",
    body: `## God sees you

The Bible's God is the God of the poor. He hears the cry of the hungry. He defends the widow and orphan. He sent his Son to be born in a feeding trough.

You are not invisible to him.

## What to do this week

1. **Pray honestly.** "Give us this day our daily bread" is in the Lord's Prayer for a reason. Specific. Real. Asking.
2. **Make a basic needs list.** Food. Shelter. Safety. Transportation. Medicine. Get these clear before anything else.
3. **Find local help.** Call **211** in the U.S. for food, shelter, utilities, and emergency assistance. Search "food bank near me" or "community resources." Many faithful churches have benevolence funds — call the nearest one.
4. **Apply for what you qualify for.** SNAP, Medicaid, utility assistance, unemployment — these exist for you. Use them.
5. **Avoid predatory lenders.** Payday loans. Title loans. Crypto scams. They will make this worse.
6. **Talk to a faithful believer.** Don't carry this alone.

## A word about shame

Receiving help is not weakness. It is wisdom. The early church shared everything. Believers carried each other's burdens. There is no shame in being on the receiving end of mercy — only in being too proud to receive it.

## A word about money and God

God does not promise wealth. He promises his presence. Riches do not prove his favor; poverty does not prove his absence. He has been God to billionaires and to widows with two coins. He is with you.`,
    scriptures: [
      { ref: "Matthew 6:11", text: "Give us this day our daily bread" },
      { ref: "Matthew 6:25-34", text: "Seek first the kingdom of God" },
      { ref: "Philippians 4:19", text: "My God will supply every need" },
      { ref: "Proverbs 30:8-9", text: "Give me neither poverty nor riches" },
      { ref: "James 2:14-17", text: "Faith and works — care for real needs" },
      { ref: "1 John 3:17-18", text: "Love in deed and truth" },
      { ref: "Acts 2:44-45", text: "Believers shared all things" },
    ],
    nextSteps: [
      { label: "Find local resources", href: "/help/crisis-resources" },
      { label: "Pray with Ask Hope", href: "/ask" },
    ],
  },

  homeless: {
    slug: "homeless",
    hubLabel: "Homelessness",
    title: "If You Need Shelter Tonight",
    subtitle: "Your safety matters. God sees you.",
    pageTitle: "I need shelter",
    shortAnswer:
      "If you do not have a safe place to sleep, your immediate safety matters. God sees you, and needing help does not make you less valuable. Seek local shelter resources, emergency services if you are unsafe, and nearby churches that may help with food, clothing, and referrals.",
    body: `## Tonight

If you are unsafe right now — being threatened, exposed to dangerous weather, or in medical emergency — **call 911**.

For shelter, food, and emergency assistance in the U.S., **dial 211**. You'll be connected to local resources by ZIP code.

In the U.S., HUD's [Find Shelter tool](https://www.hud.gov/findshelter) helps locate shelters, health, clothing, and related resources.

For domestic violence shelter, call the **National Domestic Violence Hotline at 1-800-799-7233** (or text START to 88788).

Outside the U.S., search for your country's emergency social services or local Red Cross.

## What to know

- **Local churches** often help with food, clothing, gas, bus passes, and short-term shelter referrals. Knock on doors. Most pastors will sit with you.
- **You are not invisible.** You are made in the image of God. Your situation is not your worth.
- **There is no shame in receiving.** Mercy is how God's people are supposed to live.

## What we can do

Hope of Glory Ministry cannot provide shelter or housing directly. We can pray with you and point you to resources. We can be a voice on the line. You can use Ask Hope to think through next steps. Please use the resources above first.`,
    scriptures: [
      { ref: "Psalm 68:5-6", text: "God sets the lonely in families" },
      { ref: "Isaiah 58:6-10", text: "Bring the homeless poor into your house" },
      { ref: "Matthew 25:35-40", text: "I was a stranger and you welcomed me" },
      { ref: "Luke 10:25-37", text: "The Good Samaritan" },
      { ref: "James 2:15-17", text: "Practical mercy" },
    ],
    nextSteps: [
      { label: "Crisis resources", href: "/help/crisis-resources" },
      { label: "Pray with Ask Hope", href: "/ask" },
    ],
  },

  pain: {
    slug: "pain",
    hubLabel: "Pain and suffering",
    title: "Where Is God in My Pain?",
    subtitle: "Closer than your breath.",
    pageTitle: "I am in pain",
    shortAnswer:
      "God does not dismiss pain. Jesus entered pain. He was rejected, wounded, betrayed, crucified, and acquainted with grief. In Christ, pain is not meaningless, and it is not final.",
    body: `## He entered the pain

Christianity does not say *pain is not real*. It says *Christ entered pain to redeem it*.

Isaiah 53 calls him a *man of sorrows, and acquainted with grief*. He was rejected, beaten, mocked, betrayed by his closest friends, abandoned, killed.

When you bring your pain to him, he is not surprised. He is not far. He knows.

## Pain is not always discipline

Sometimes pain is the consequence of your own choices. Sometimes it is the consequence of someone else's. Sometimes it is the broken world. Sometimes it is God's discipline. Sometimes it is mystery.

Do not let anyone glibly tell you which one yours is. Job's friends did that. God rebuked them.

## What is promised

- **He is near to the brokenhearted** (Psalm 34:18)
- **His grace is sufficient** (2 Corinthians 12:9)
- **Present sufferings are not worth comparing to the glory to be revealed** (Romans 8:18)
- **He will wipe every tear from every eye** (Revelation 21:4)
- **Nothing can separate you from his love** (Romans 8:38-39)

## What to do

Bring the pain. Don't dress it up. Don't make it presentable. Bring it as it is. He has handled worse — and he handled it for you.`,
    scriptures: [
      { ref: "Isaiah 53", text: "A man of sorrows, acquainted with grief" },
      { ref: "Psalm 34:18", text: "The Lord is near to the brokenhearted" },
      { ref: "Hebrews 4:14-16", text: "A sympathetic high priest" },
      { ref: "2 Corinthians 12:7-10", text: "My grace is sufficient for you" },
      { ref: "Romans 8:18", text: "Present sufferings and future glory" },
      { ref: "Revelation 21:4", text: "He will wipe away every tear" },
    ],
    nextSteps: [
      { label: "Pray with Ask Hope", href: "/ask" },
      { label: "Submit a prayer request", href: "/prayer" },
    ],
  },
};

export const HELP_TOPIC_SLUGS = Object.keys(HELP_TOPICS);
