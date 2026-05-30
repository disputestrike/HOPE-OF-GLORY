export type LaunchStatus = "published" | "ready" | "scheduled";

export type LaunchSermon = {
  id: string;
  slug: string;
  title: string;
  primaryPassage: string;
  supportingPassages: string[];
  seriesSlug: string;
  seriesTitle: string;
  seriesTheme: string;
  scheduledFor: string;
  status: LaunchStatus;
  summary: string;
  fullText: string;
  prayer: string;
  callToAction: string;
  imageUrl: string;
  socialPosts: Array<{
    platform: "facebook" | "instagram" | "x" | "youtube" | "linkedin";
    caption: string;
    scheduledFor: string;
  }>;
};

export type PlannedSermon = {
  id: string;
  slug: string;
  title: string;
  primaryPassage: string;
  seriesSlug: string;
  seriesTitle: string;
  seriesTheme: string;
  scheduledFor: string;
  status: LaunchStatus;
  summary: string;
};

export type EmailLifecycleItem = {
  key: string;
  flow: string;
  audience: string;
  cadence: string;
  nextRun: string;
  template: string;
  status: "ready" | "credential-gated" | "active";
};

export type AutomationStep = {
  time: string;
  owner: string;
  action: string;
  output: string;
  requires: string;
};

const launchStart = "2026-05-25";

function atMorning(dayOffset: number): string {
  const date = new Date(`${launchStart}T11:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + dayOffset);
  return date.toISOString();
}

function atHour(dayOffset: number, hourUtc: number): string {
  const date = new Date(`${launchStart}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + dayOffset);
  date.setUTCHours(hourUtc, 0, 0, 0);
  return date.toISOString();
}

const series = {
  slug: "foundations-launch-week",
  title: "Foundations: The Earth Filled With His Glory",
  theme: "Mission, identity, and the gospel that fills the earth",
};

function social(dayOffset: number, title: string, passage: string): LaunchSermon["socialPosts"] {
  return [
    {
      platform: "facebook",
      scheduledFor: atHour(dayOffset, 15),
      caption: `${title}. ${passage}. The glory of the Lord is not a private idea for private people. It is good news for the whole earth. Read today's message at Hope of Glory Ministry.`,
    },
    {
      platform: "instagram",
      scheduledFor: atHour(dayOffset, 18),
      caption: `${passage} | ${title}. A short word for today: Christ is the center, the nations are in view, and the Word of God still speaks.`,
    },
    {
      platform: "x",
      scheduledFor: atHour(dayOffset, 20),
      caption: `${title} - ${passage}. The mission is simple: proclaim Christ until the earth is filled with the knowledge of the glory of the Lord.`,
    },
    {
      platform: "youtube",
      scheduledFor: atHour(dayOffset, 23),
      caption: `${title}: today's short teaching from Hope of Glory Ministry.`,
    },
  ];
}

export const LAUNCH_SERMONS: LaunchSermon[] = [
  {
    id: "launch-001",
    slug: "the-earth-filled-with-his-glory",
    title: "The Earth Filled With His Glory",
    primaryPassage: "Habakkuk 2:14",
    supportingPassages: ["Numbers 14:21", "Isaiah 11:9", "Psalm 96:1-3"],
    seriesSlug: series.slug,
    seriesTitle: series.title,
    seriesTheme: series.theme,
    scheduledFor: atMorning(0),
    status: "published",
    summary:
      "Habakkuk teaches us to see beyond a violent age into God's promised future: the earth filled with the knowledge of the glory of the Lord.",
    imageUrl: "/images/earth-filled-with-his-glory.png",
    callToAction: "Join the mission. Read the Word, pray for the nations, and share one message of Christ today.",
    prayer:
      "Father, fill the earth with the knowledge of your glory. Begin with my heart, my home, and my mouth. Make Christ known through me. Amen.",
    fullText: `## The promise in a shaking world

Habakkuk did not receive his vision in a quiet world. He looked around and saw violence, injustice, pride, corruption, and spiritual confusion. His question was not abstract. It was the cry of a believer who loved God and could not understand why evil seemed to keep winning. "How long, LORD?" is not unbelief when it is prayed toward God. It is faith refusing to pretend that the world is fine.

Into that heaviness God speaks one of the great promises of Scripture: "For the earth will be filled with the knowledge of the glory of the LORD, as the waters cover the sea." The answer is not that evil is imaginary. The answer is that evil is temporary. The proud build kingdoms that crack. The violent make noise that fades. But the glory of the Lord will fill the earth.

## Knowledge, not vague spirituality

Notice the wording. The earth will be filled with the knowledge of the glory of the Lord. This is not merely religious feeling. It is not a fog of inspiration. It is knowledge. God intends to be known. He reveals himself through creation, covenant, prophets, Scripture, and finally through Jesus Christ, the exact image of the invisible God.

This is why Hope of Glory Ministry exists. We do not want to fill the internet with spiritual noise. We want the Word of God to be understood. We want Jesus Christ proclaimed clearly. We want the hurting to know where hope is found, the doubting to know where truth stands, and the nations to see the glory of God in the face of Christ.

## As the waters cover the sea

The comparison is overwhelming. Waters do not cover the sea in patches. They do not touch one corner and leave the rest dry. The sea is covered by water by nature. God is saying that his glory will not remain hidden in one nation, one language, one room, or one generation. His knowledge will spread until the earth is saturated with it.

That does not make our labor unnecessary. It makes our labor hopeful. We preach because God has promised. We pray because God has promised. We teach children, send messages, write articles, answer questions, make phone calls, give, serve, and share because the end is not uncertain. The Lamb will receive the reward of his suffering.

## Christ is the glory

The glory promised in Habakkuk is not detached from Christ. John says the Word became flesh, and "we saw his glory." Paul says God gives "the light of the knowledge of the glory of God in the face of Jesus Christ." If you want to know what God is like, look at Jesus. Look at his holiness, his mercy, his authority, his cross, his resurrection, his coming kingdom.

The world does not need a thinner gospel. The world needs the real Christ: crucified for sinners, risen from the dead, reigning now, returning soon. The knowledge that fills the earth is not merely that God exists. It is that God has made himself known in his Son.

## Begin with one faithful step

The promise is global, but obedience begins close. Read one passage today. Pray for one person. Share one true word. Repent of one sin. Encourage one wounded soul. Support one work that makes Christ known. The earth is filled through ordinary faithfulness carried by extraordinary grace.

The question is not whether God's glory will fill the earth. The question is whether we will gladly take our place in that mission.`,
    socialPosts: social(0, "The Earth Filled With His Glory", "Habakkuk 2:14"),
  },
  {
    id: "launch-002",
    slug: "let-the-whole-earth-be-filled-with-his-glory",
    title: "Let the Whole Earth Be Filled With His Glory",
    primaryPassage: "Psalm 72:19",
    supportingPassages: ["Psalm 72:8-11", "Psalm 96:1-3", "Revelation 11:15"],
    seriesSlug: series.slug,
    seriesTitle: series.title,
    seriesTheme: series.theme,
    scheduledFor: atMorning(1),
    status: "published",
    summary:
      "Psalm 72 turns prayer into a kingdom horizon: bless the King, bless his name, and let the whole earth be filled with his glory.",
    imageUrl: "/images/ministry-humanity-to-light.png",
    callToAction: "Pray Psalm 72 for the nations and ask God to make Christ known where you live.",
    prayer:
      "Blessed be your glorious name, Lord. Let the whole earth be filled with your glory. Teach my heart to worship beyond my own small world. Amen.",
    fullText: `## A prayer too large for one nation

Psalm 72 is a royal psalm. It prays for the king, for justice, for the poor, for the needy, and for dominion from sea to sea. At first glance it sounds like a prayer for Israel's throne. But as the psalm unfolds, the horizon becomes too large for Solomon, too large for any ordinary son of David. The nations come into view. The ends of the earth come into view. The poor and helpless are lifted into the center of the king's concern.

Then the psalm rises into worship: "Blessed be his glorious name forever! Let the whole earth be filled with his glory. Amen and amen." This is not small religion. This is kingdom prayer.

## Glory and justice belong together

One of the beautiful things about Psalm 72 is that glory is not separated from mercy. The king's greatness is seen in righteousness, justice, rescue, and compassion. He "will deliver the needy when he cries; the poor, who has no helper." In the Bible, the glory of God is not a decoration over injustice. The glory of God puts the world right.

That matters for ministry. If we say we want the earth filled with God's glory, we cannot ignore the grieving, the hungry, the homeless, the ashamed, the lonely, the sinner, the doubter, or the person who feels forgotten. Glory is not cold brightness. God's glory is the beauty of all that he is: holy, true, merciful, just, faithful, patient, and mighty to save.

## Jesus is the King Psalm 72 needed

No earthly king has fulfilled this psalm. David did not. Solomon did not. Every king after them failed in one way or another. But Jesus, the Son of David, carries this prayer to its completion. He is righteous without corruption. He is merciful without weakness. He is King without insecurity. He receives worship from the nations because he is worthy.

When the wise men came from the east bringing gifts, Matthew was not giving us a sentimental Christmas scene. He was showing the nations beginning to come to the King. When Jesus sent his disciples to make disciples of all nations, he was moving Psalm 72 forward. When Revelation shows every tribe and tongue before the Lamb, it is the final "Amen" of this prayer.

## A worship that expands the heart

The psalm does something to us if we let it. It stretches our prayers. Many of our prayers are necessarily personal: help me, heal me, forgive me, guide me. God welcomes those prayers. But Psalm 72 teaches us to pray wider: Lord, bless your name in my city. Let Christ be known among people I will never meet. Raise up worship in languages I do not speak. Defend the poor. Rescue the needy. Fill the earth with your glory.

That kind of prayer saves us from shrinking the kingdom down to our preferences. It teaches us to love what God loves.

## Amen and amen

The psalm ends with doubled agreement: Amen and amen. In other words, yes, Lord. Let it be so. Do it. Bring the King. Fill the earth. Make your name known. Rescue the poor. Judge evil. Gather the nations. Receive worship from every people.

Hope of Glory Ministry stands inside that prayer. We are not inventing a mission. We are joining one that Scripture already gave us. Blessed be his glorious name forever. Let the whole earth be filled with his glory. Amen and amen.`,
    socialPosts: social(1, "Let the Whole Earth Be Filled With His Glory", "Psalm 72:19"),
  },
  {
    id: "launch-003",
    slug: "christ-in-you-the-hope-of-glory",
    title: "Christ in You, the Hope of Glory",
    primaryPassage: "Colossians 1:27",
    supportingPassages: ["Colossians 1:24-29", "Galatians 2:20", "Romans 8:10-11"],
    seriesSlug: series.slug,
    seriesTitle: series.title,
    seriesTheme: series.theme,
    scheduledFor: atMorning(2),
    status: "published",
    summary:
      "The hope of glory is not self-improvement or religious branding. It is Christ himself dwelling in his people by the Spirit.",
    imageUrl: "/images/christ-in-you-hope-of-glory.png",
    callToAction: "If Christ is not yet your hope, come to him today. If he is, live today from union with him.",
    prayer:
      "Lord Jesus, be my hope, my life, and my confidence. Teach me to stop trusting myself and to live by your indwelling life. Amen.",
    fullText: `## The mystery now revealed

Paul says God chose to make known "the riches of the glory of this mystery among the Gentiles, which is Christ in you, the hope of glory." That sentence is deep enough to carry a lifetime of worship. A mystery in the New Testament is not a puzzle God is trying to hide forever. It is something once concealed and now revealed by grace. The prophets saw pieces. The apostles proclaimed the fullness.

The mystery is not merely that Gentiles can receive blessings from Israel's God. The Old Testament already promised blessing for the nations. The astonishing revelation is that Christ himself dwells in his people, Jews and Gentiles together, by the Holy Spirit. The hope of glory is not an idea we hold at a distance. It is a Person who has made his home in us.

## Not Christ near you only

Many people think Christianity means trying to behave well while Jesus watches from far away. But Paul says something stronger: Christ in you. The risen Lord is not merely an example outside us. He is life within us. This does not make us divine. It does not erase the distinction between Creator and creature. It means believers are united to Christ by faith and indwelt by his Spirit.

That changes identity. You are not merely your past, your failure, your family story, your shame, your gifts, your pain, your bank account, your ethnicity, your rejection, or your achievement. If you belong to Christ, the deepest truth about you is union with him. Your life is hidden with Christ in God.

## The hope of glory

Hope in Scripture is not wishful thinking. It is confident expectation grounded in God's promise. The hope of glory means the future God has promised is already anchored in the Christ who lives in us now. Glory is coming: resurrection, holiness, restored creation, the unveiled presence of God. But the firstfruits are already here because Christ is here.

This is why suffering does not get the final word. Paul writes Colossians from hardship, but he is not empty. Christ in you means God has not merely promised to visit later. He has begun his new creation in the hearts of his people now.

## Christ among the nations

Paul says this mystery is made known among the Gentiles. That matters. Hope of Glory Ministry is not built on a private inspiration. It is built on the biblical announcement that the Messiah of Israel is also the Savior of the nations. The God of Abraham keeps covenant, sends his Son, pours out his Spirit, and gathers people from every people and language into one body.

The name "Hope of Glory" is therefore not a slogan. It is a confession. Our hope is Christ. Our message is Christ. Our confidence is Christ. Our future is Christ.

## Proclaim him

The next verse says, "whom we proclaim." If Christ is the hope of glory, then he must be announced. Paul warns, teaches, labors, and struggles so that people may be presented mature in Christ. This is the shape of ministry: not entertainment, not personality, not arguments for their own sake, but proclaiming Christ until people are rooted in him.

So ask the honest question: Is Christ in you? Not merely around your life, not merely admired, not merely quoted, but received by faith. If not, come to him. If yes, then live today from the hope you already carry. Christ in you is stronger than despair, deeper than shame, and more certain than death.`,
    socialPosts: social(2, "Christ in You, the Hope of Glory", "Colossians 1:27"),
  },
  {
    id: "launch-004",
    slug: "the-word-became-flesh-and-revealed-glory",
    title: "The Word Became Flesh and Revealed Glory",
    primaryPassage: "John 1:14",
    supportingPassages: ["John 1:1-18", "Hebrews 1:1-3", "2 Corinthians 4:6"],
    seriesSlug: series.slug,
    seriesTitle: series.title,
    seriesTheme: series.theme,
    scheduledFor: atMorning(3),
    status: "ready",
    summary:
      "John tells us that the eternal Word became flesh. The glory of God is revealed most clearly in Jesus Christ.",
    imageUrl: "/images/christ-in-you-hope-of-glory.png",
    callToAction: "Read John 1 slowly today and ask: what does Jesus reveal about God?",
    prayer:
      "Father, show me your glory in the face of Jesus Christ. Let the Word made flesh correct my false ideas and draw me into worship. Amen.",
    fullText: `## The Word before the world

John does not begin his Gospel in Bethlehem. He begins before creation: "In the beginning was the Word, and the Word was with God, and the Word was God." Before Mary held him, before shepherds heard angels, before Rome counted citizens, the Son already was. He is not a creature who became important. He is the eternal Word through whom all things were made.

That matters because Christian faith does not begin with vague inspiration. It begins with revelation. God speaks. God makes himself known. And the fullest speech of God is not a sentence on a page but the Son in flesh.

## The scandal of flesh

"The Word became flesh" is one of the most staggering lines ever written. Flesh means real humanity. Not a costume. Not an appearance. Not God pretending to be close. The eternal Son took on our nature. He entered hunger, fatigue, tears, temptation, rejection, grief, pain, and death. He came near enough to be touched, heard, watched, misunderstood, loved, hated, crucified, and raised.

This is why the gospel is not God shouting advice from a distance. It is God coming down. The holy God did not despise human weakness. He entered it without sin in order to redeem it.

## We saw his glory

John says, "We saw his glory." Where did they see it? In miracles, yes. At the transfiguration, yes. In his authority over demons, disease, wind, and grave, yes. But the glory of Jesus is also seen in his humility, patience, truth, compassion, obedience, suffering, and cross. The glory is "full of grace and truth." Not grace without truth. Not truth without grace. Full of both.

Many people imagine glory as brightness only. In Christ, glory has a face. It has nail-pierced hands. It has tears at Lazarus's tomb. It has a voice that says, "Father, forgive them." It has resurrection power on the third day.

## The only Son from the Father

Jesus reveals God because he is from the Father and with the Father. John later says, "No one has seen God at any time. The one and only Son, who is in the bosom of the Father, he has declared him." We do not climb into God's hidden being by speculation. We receive the Son's revelation.

If you want to know whether God cares for sinners, look at Jesus eating with them. If you want to know whether God has authority over death, look at Jesus calling Lazarus out. If you want to know whether God is holy, look at Jesus confronting hypocrisy. If you want to know whether God loves, look at the cross.

## Receive him

John 1 also says that to all who received him, who believed in his name, he gave the right to become God's children. The Word became flesh not merely to impress us but to save us. He came to his own, and many rejected him. But whoever receives him becomes family.

So do not leave John 1 as a beautiful doctrine only. Let it become invitation. The eternal Word came near. He revealed glory. He offered grace. He tells the truth. Receive him.`,
    socialPosts: social(3, "The Word Became Flesh and Revealed Glory", "John 1:14"),
  },
  {
    id: "launch-005",
    slug: "go-and-make-disciples",
    title: "Go and Make Disciples",
    primaryPassage: "Matthew 28:18-20",
    supportingPassages: ["Acts 1:8", "Romans 10:13-15", "Psalm 96:3"],
    seriesSlug: series.slug,
    seriesTitle: series.title,
    seriesTheme: series.theme,
    scheduledFor: atMorning(4),
    status: "ready",
    summary:
      "The mission of Jesus rests on the authority of Jesus. We go because all authority in heaven and on earth belongs to him.",
    imageUrl: "/images/earth-filled-with-his-glory.png",
    callToAction: "Share today's message with one person and pray that Christ would make disciples through ordinary obedience.",
    prayer:
      "Lord Jesus, you have all authority. Send me with humility, courage, and love. Make disciples through your Word and Spirit. Amen.",
    fullText: `## Mission begins with authority

Jesus does not begin the Great Commission with our enthusiasm. He begins with his authority: "All authority has been given to me in heaven and on earth." That is the foundation. If mission depended on our energy, it would collapse quickly. If it depended on our cleverness, it would become manipulation. But mission rests on the risen Christ.

He has authority over heaven and earth. Not partial authority. Not future authority only. The crucified and risen Lord reigns. That means no place is outside his concern and no people are outside the reach of his command.

## Make disciples, not fans

The command is to make disciples. A disciple is a learner, follower, and worshiper of Jesus. The goal is not religious traffic, emotional moments, or shallow agreement. The goal is people who trust Christ, obey Christ, learn Christ, and belong to his people.

That is why Jesus includes baptizing and teaching. Evangelism and discipleship belong together. We call people to repent and believe, and then we help them learn everything Jesus commanded. The gospel is not an entry ticket to a life we then build ourselves. It is the beginning of a whole life under the lordship of Christ.

## All nations

Jesus sends his disciples to all nations. The promise to Abraham is moving toward its appointed fullness. Israel's Messiah is the light of the nations. The worship of God will not be confined to one language or one people. Every culture is judged, redeemed, purified, and brought under Christ.

Digital ministry does not replace embodied church, but it can carry the Word across borders with surprising speed. A sermon can reach a room we will never enter. A prayer can comfort a person we will never meet. A clear gospel page can be found at midnight by someone afraid to walk into a church. These tools are not the kingdom, but they can serve the kingdom.

## Teaching them to observe

Jesus does not say teach them to know only. He says teach them to observe all he commanded. Obedience matters. Grace does not make obedience optional. Grace makes obedience possible and joyful. We teach forgiveness, holiness, prayer, mercy, truth, sexual purity, generosity, courage, humility, reconciliation, and endurance because Jesus is Lord over all of life.

This is why the ministry must be more than content. It must offer pathways: Come to Christ, the 40-Day Journey, Daily Faith, Help for Real Life, Read, Ask Hope, The Scroll, Messages. The goal is not one click. The goal is formation.

## I am with you always

The commission ends with comfort: "Behold, I am with you always, even to the end of the age." Jesus sends us, but he does not abandon us. His presence is the courage of mission. His Spirit empowers witness. His Word carries authority. His church is never finally alone.

So go. Pray. Teach. Share. Invite. Serve. Answer questions. Carry the gospel where God has placed you. The mission is too large for us, but it is not too large for Christ.`,
    socialPosts: social(4, "Go and Make Disciples", "Matthew 28:18-20"),
  },
  {
    id: "launch-006",
    slug: "the-revelation-of-jesus-christ",
    title: "The Revelation of Jesus Christ",
    primaryPassage: "Revelation 1:1-8",
    supportingPassages: ["Daniel 7:13-14", "Revelation 1:9-20", "Hebrews 12:28-29"],
    seriesSlug: series.slug,
    seriesTitle: series.title,
    seriesTheme: series.theme,
    scheduledFor: atMorning(5),
    status: "scheduled",
    summary:
      "Revelation is not first a panic chart. It is the unveiling of Jesus Christ in glory, authority, judgment, and hope.",
    imageUrl: "/images/christ-in-you-hope-of-glory.png",
    callToAction: "Read Revelation 1 before reading arguments about Revelation. Begin with the glory of Jesus.",
    prayer:
      "Lord Jesus, open my eyes to see you as you are: holy, risen, reigning, and near to your church. Amen.",
    fullText: `## The book begins with Jesus

Revelation begins, "The Revelation of Jesus Christ." Before beasts, bowls, seals, trumpets, timelines, and debates, the book gives us Jesus. Revelation means unveiling. The curtain is pulled back so the church can see the risen Christ and endure with faithfulness.

Many people approach Revelation with fear or fascination. Scripture invites something better: worshipful endurance. The first blessing in the book is for the one who reads, hears, and keeps what is written. Revelation is not entertainment for speculation. It is pastoral prophecy for faithful obedience.

## Grace and peace from the reigning Lord

John writes to real churches under pressure. He blesses them with grace and peace from God, from the seven Spirits before the throne, and from Jesus Christ. Then he names Jesus: faithful witness, firstborn of the dead, ruler of the kings of the earth. That is enough to steady a trembling church.

Jesus is the faithful witness because he told the truth unto death. He is the firstborn of the dead because resurrection has begun in him. He is ruler of kings because Rome, Babylon, and every proud empire are not ultimate. The church may look small, but her Lord reigns.

## Loved, freed, made a kingdom

Revelation 1 does not only show power. It shows love: "To him who loves us, and washed us from our sins by his blood." The glorious Christ is not distant from sinners. He loves. He frees. He makes his people a kingdom and priests to God.

That means Revelation is not merely about what happens to the world. It is about who the church is in Christ. Washed people. Loved people. Priestly people. Witnessing people. Enduring people.

## Behold, he is coming

The book turns our eyes forward: "Behold, he is coming with the clouds." Daniel 7 stands behind this. The Son of Man receives dominion, glory, and a kingdom. Jesus takes that imagery on his own lips, and Revelation shows him in divine splendor.

His coming is hope for the oppressed and warning for the rebellious. Every eye will see him. The world that ignored him will face him. The church that suffered with him will rejoice in him.

## Alpha and Omega

God says, "I am the Alpha and the Omega." History is not random. The first and last letters belong to him. He stands at the beginning and the end. The church can endure because the story is not held together by human rulers, markets, armies, or algorithms. It is held by the Almighty.

So read Revelation with your eyes on Jesus. Let the book make you holy, brave, patient, and hopeful. The Lamb wins. The King comes. The glory of Christ will be revealed.`,
    socialPosts: social(5, "The Revelation of Jesus Christ", "Revelation 1:1-8"),
  },
  {
    id: "launch-007",
    slug: "a-great-multitude-from-every-nation",
    title: "A Great Multitude From Every Nation",
    primaryPassage: "Revelation 7:9-10",
    supportingPassages: ["Revelation 5:9-10", "Genesis 12:3", "Matthew 24:14"],
    seriesSlug: series.slug,
    seriesTitle: series.title,
    seriesTheme: series.theme,
    scheduledFor: atMorning(6),
    status: "scheduled",
    summary:
      "The end of mission is worship: a multitude no one can number, from every nation, standing before the throne and the Lamb.",
    imageUrl: "/images/ministry-humanity-to-light.png",
    callToAction: "Pray for one people or nation today and ask God to make Christ known there.",
    prayer:
      "Lamb of God, gather worshipers from every nation. Make my life useful in your mission and keep my hope fixed on your throne. Amen.",
    fullText: `## The end of the mission is worship

Revelation 7 gives one of the most beautiful scenes in Scripture: a great multitude that no one could number, from every nation, tribe, people, and language, standing before the throne and before the Lamb. They are clothed in white robes. They cry out, "Salvation be to our God, who sits on the throne, and to the Lamb!"

This is where the Bible's missionary heartbeat has always been going. God called Abraham so that all families of the earth would be blessed. Israel was chosen to bear witness to the true God. The prophets promised nations streaming to the Lord. Jesus sent his disciples to all nations. Revelation shows the promise fulfilled.

## Every nation, one Savior

The multitude is diverse, but the song is united. They do not stand before separate thrones. They do not proclaim separate salvations. They cry out to God and to the Lamb. The nations are not erased, but they are redeemed. Language, people, and history are gathered into worship under Christ.

This corrects both pride and despair. It corrects pride because no nation owns the gospel. Christ is not the possession of one ethnic group, political movement, or culture. It corrects despair because no nation is beyond the reach of grace. The blood of the Lamb purchases people from everywhere.

## Salvation belongs to God

The song matters: "Salvation belongs to our God." We do not save ourselves. We do not rescue the world through clever branding, technology, arguments, or moral effort. God saves. The Lamb saves. We preach, pray, serve, give, translate, teach, and send because salvation belongs to him.

That keeps ministry humble. We work hard, but we cannot raise the dead. We use tools, but tools cannot regenerate hearts. We build pathways, but Christ must walk with people in them. The power belongs to God.

## The Lamb at the center

The Lamb is not on the edge of heaven's worship. He is at the center. This is remarkable because the Lamb is the one who was slain. Heaven's throne room does not hide the cross. It sings because of it. The wounds of Christ are not an embarrassment to glory. They are the reason sinners from every nation can stand.

If you feel too sinful, look at the Lamb. If you feel too far, look at the multitude. If you wonder whether God can save people unlike you, look at the throne. The gospel is larger than our fears.

## Live now for that day

Revelation 7 is future, but it should shape today. Pray beyond your own household. Give beyond your own comfort. Share Christ across awkward boundaries. Refuse racism, contempt, and tribal pride. Welcome believers from every background as family in Christ. Support the spread of Scripture and sound teaching.

One day the earth will be filled with the knowledge of the glory of the Lord. One day the whole earth will be filled with his glory. One day Christ in his people will be seen as the hope of glory. Until then, we labor with tears, courage, and joy.`,
    socialPosts: social(6, "A Great Multitude From Every Nation", "Revelation 7:9-10"),
  },
];

const futureSeries = [
  {
    slug: "christ-in-you-week-2",
    title: "Christ in You",
    theme: "Union with Christ, the mystery revealed, Christ among the nations",
    startOffset: 7,
    sermons: [
      ["the-mystery-hidden-for-ages", "The Mystery Hidden for Ages", "Colossians 1:24-27"],
      ["christ-is-all-and-in-all", "Christ Is All and in All", "Colossians 3:11"],
      ["buried-with-him-raised-with-him", "Buried With Him, Raised With Him", "Colossians 2:12-15"],
      ["set-your-mind-on-things-above", "Set Your Mind on Things Above", "Colossians 3:1-4"],
      ["christ-among-the-nations", "Christ Among the Nations", "Colossians 1:6"],
      ["the-fullness-of-deity", "The Fullness of Deity", "Colossians 2:9-10"],
      ["above-every-name", "Above Every Name", "Philippians 2:9-11"],
    ],
  },
  {
    slug: "knowledge-of-glory-week-3",
    title: "The Knowledge of the Glory of the Lord",
    theme: "Habakkuk: faithfulness, judgment, glory, mission",
    startOffset: 14,
    sermons: [
      ["how-long-o-lord", "How Long, O Lord?", "Habakkuk 1:1-4"],
      ["the-righteous-shall-live-by-faith", "The Righteous Shall Live by Faith", "Habakkuk 2:4"],
      ["woe-to-the-proud", "Woe to the Proud", "Habakkuk 2:6-20"],
      ["the-knowledge-of-his-glory", "The Knowledge of His Glory", "Habakkuk 2:14"],
      ["yet-i-will-rejoice", "Yet I Will Rejoice", "Habakkuk 3:17-19"],
      ["the-god-who-sees", "The God Who Sees", "Habakkuk 3:3-15"],
      ["the-earth-shall-be-filled", "The Earth Shall Be Filled", "Habakkuk 2:14"],
    ],
  },
  {
    slug: "word-to-the-nations-week-4",
    title: "The Word Goes to the Nations",
    theme: "Matthew 28, Acts 1, Romans 10, Psalm 96",
    startOffset: 21,
    sermons: [
      ["all-authority", "All Authority", "Matthew 28:18"],
      ["make-disciples", "Make Disciples", "Matthew 28:19-20"],
      ["you-will-be-my-witnesses", "You Will Be My Witnesses", "Acts 1:8"],
      ["how-will-they-hear", "How Will They Hear?", "Romans 10:14-17"],
      ["declare-his-glory", "Declare His Glory", "Psalm 96:1-3"],
      ["whoever-calls-on-the-name", "Whoever Calls on the Name", "Romans 10:13"],
      ["from-every-tribe", "From Every Tribe", "Matthew 24:14"],
    ],
  },
  {
    slug: "revelation-of-jesus-week-5",
    title: "The Revelation of Jesus Christ",
    theme: "Revelation 1, 5, 7, 19, 22",
    startOffset: 28,
    sermons: [
      ["behold-he-is-coming", "Behold, He Is Coming", "Revelation 1:7-8"],
      ["worthy-is-the-lamb", "Worthy Is the Lamb", "Revelation 5:9-14"],
      ["salvation-belongs-to-our-god", "Salvation Belongs to Our God", "Revelation 7:9-12"],
      ["the-marriage-supper-of-the-lamb", "The Marriage Supper of the Lamb", "Revelation 19:6-9"],
      ["king-of-kings-and-lord-of-lords", "King of Kings and Lord of Lords", "Revelation 19:11-16"],
      ["i-am-making-all-things-new", "I Am Making All Things New", "Revelation 21:5"],
      ["behold-i-am-coming-quickly", "Behold, I Am Coming Quickly", "Revelation 22:7-21"],
    ],
  },
] as const;

export const PLANNED_SERMONS: PlannedSermon[] = futureSeries.flatMap((week) =>
  week.sermons.map(([slug, title, primaryPassage], index) => ({
    id: `${week.slug}-${index + 1}`,
    slug,
    title,
    primaryPassage,
    seriesSlug: week.slug,
    seriesTitle: week.title,
    seriesTheme: week.theme,
    scheduledFor: atMorning(week.startOffset + index),
    status: "scheduled",
    summary: `Scheduled teaching in ${week.title}: ${title} from ${primaryPassage}. The sermon pipeline drafts, verifies, pairs media, and queues distribution for this date.`,
  })),
);

export const EMAIL_LIFECYCLE: EmailLifecycleItem[] = [
  {
    key: "new_believer_welcome",
    flow: "New Believer Welcome",
    audience: "People who prayed or clicked I gave my life to Jesus",
    cadence: "Day 0, 1, 3, 5, 7, 10, 14",
    nextRun: atHour(0, 13),
    template: "new-believer-welcome",
    status: "ready",
  },
  {
    key: "forty_day_journey",
    flow: "40-Day Journey",
    audience: "Journey subscribers",
    cadence: "Daily at 6:00 AM Central",
    nextRun: atHour(2, 11),
    template: "journey-day",
    status: "ready",
  },
  {
    key: "daily_faith",
    flow: "Daily Faith",
    audience: "Daily Faith subscribers",
    cadence: "Daily or Monday / Wednesday / Friday",
    nextRun: atHour(2, 12),
    template: "daily-faith",
    status: "ready",
  },
  {
    key: "prayer_followup",
    flow: "Prayer Request Follow-up",
    audience: "People who submitted prayer requests",
    cadence: "Immediate, day 3, day 7",
    nextRun: atHour(2, 16),
    template: "prayer-followup",
    status: "credential-gated",
  },
  {
    key: "weekly_digest",
    flow: "Weekly Digest",
    audience: "Opted-in readers",
    cadence: "Weekly",
    nextRun: atHour(6, 14),
    template: "weekly-digest",
    status: "ready",
  },
  {
    key: "re_engagement",
    flow: "Re-engagement",
    audience: "Dormant subscribers",
    cadence: "14 to 30 days inactive",
    nextRun: atHour(14, 15),
    template: "re-engagement",
    status: "ready",
  },
  {
    key: "donor_stewardship",
    flow: "Donor Stewardship",
    audience: "Supporters",
    cadence: "Immediate receipt plus monthly impact note",
    nextRun: atHour(7, 17),
    template: "donor-stewardship",
    status: "credential-gated",
  },
];

export const AUTOMATION_RUNBOOK: AutomationStep[] = [
  {
    time: "05:30 CT",
    owner: "Calendar Agent",
    action: "Select the scheduled sermon for the day.",
    output: "Daily sermon record, Daily Word seed, email subject, and social content brief.",
    requires: "Database; static launch schedule is used in preview.",
  },
  {
    time: "06:00 CT",
    owner: "Sermon Pipeline",
    action: "Draft or load sermon, run Scripture/citation checks, attach image, mark ready.",
    output: "Published sermon page and message card.",
    requires: "LLM keys for generation; static sermon content is used in preview.",
  },
  {
    time: "06:15 CT",
    owner: "Daily Faith Agent",
    action: "Build the six daily modules from the sermon and journey calendar.",
    output: "Daily Faith page, Daily Word page, and subscriber payload.",
    requires: "Resend key to send; page updates work without keys.",
  },
  {
    time: "07:00 CT",
    owner: "Image and Video Agents",
    action: "Create sermon cards, short captions, and video prompts that match the passage.",
    output: "Media queue for review and posting.",
    requires: "Image/video providers for generation; provided launch images are used now.",
  },
  {
    time: "09:00 CT",
    owner: "Posting Agent",
    action: "Queue platform-specific posts through Postiz.",
    output: "Facebook, Instagram, X, YouTube Shorts, and LinkedIn scheduled items.",
    requires: "POSTIZ_URL, POSTIZ_API_KEY, connected social accounts.",
  },
  {
    time: "All day",
    owner: "Care Agents",
    action: "Receive Ask Hope questions, prayer requests, contacts, calls, and crisis flags.",
    output: "Admin queues for prayer, questions, calls, corrections, and human handoff.",
    requires: "Database plus SignalWire/Deepgram for phone.",
  },
];

export function getStaticSermons(): LaunchSermon[] {
  return [...LAUNCH_SERMONS].sort((a, b) => +new Date(b.scheduledFor) - +new Date(a.scheduledFor));
}

export function getStaticSermon(slug: string): LaunchSermon | null {
  return LAUNCH_SERMONS.find((sermon) => sermon.slug === slug) ?? null;
}

export function getEditorialCalendar(): Array<LaunchSermon | PlannedSermon> {
  return [...LAUNCH_SERMONS, ...PLANNED_SERMONS].sort(
    (a, b) => +new Date(a.scheduledFor) - +new Date(b.scheduledFor),
  );
}

export function getTodaysLaunchSermon(now = new Date()): LaunchSermon {
  const dayKey = now.toISOString().slice(0, 10);
  const sameDay = LAUNCH_SERMONS.find((sermon) => sermon.scheduledFor.slice(0, 10) === dayKey);
  if (sameDay) return sameDay;

  const past = [...LAUNCH_SERMONS]
    .filter((sermon) => new Date(sermon.scheduledFor) <= now)
    .sort((a, b) => +new Date(b.scheduledFor) - +new Date(a.scheduledFor));

  return past[0] ?? LAUNCH_SERMONS[0]!;
}

export function getSocialQueue(): Array<{
  id: string;
  platform: string;
  caption: string;
  scheduledFor: string;
  status: "queued" | "credential-gated";
  sermonTitle: string;
}> {
  return LAUNCH_SERMONS.flatMap((sermon) =>
    sermon.socialPosts.map((post, index) => ({
      id: `${sermon.id}-${post.platform}-${index}`,
      platform: post.platform,
      caption: post.caption,
      scheduledFor: post.scheduledFor,
      status: "credential-gated" as const,
      sermonTitle: sermon.title,
    })),
  ).sort((a, b) => +new Date(a.scheduledFor) - +new Date(b.scheduledFor));
}

export function formatLaunchDate(value: string | Date | null): string {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatLaunchDateTime(value: string | Date | null): string {
  if (!value) return "";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
