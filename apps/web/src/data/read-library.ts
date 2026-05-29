/**
 * Read library — 12 hubs, each with a topic grid. Article stubs include
 * substantial short answers + scripture references; full bodies are
 * progressively added.
 *
 * Every article must:
 *   - cite WEB or KJV (no copyrighted translations)
 *   - point to Christ
 *   - link back to a parent hub
 *   - offer at least one next step (Ask Hope, Come to Christ, or a related article)
 */

export type ArticleScripture = { ref: string; note?: string };

export type Article = {
  slug: string;
  title: string;
  subtitle: string;
  shortAnswer: string;
  keyScriptures: ArticleScripture[];
  body?: string; // optional markdown for fully-written articles
  relatedSlugs?: string[];
};

export type Hub = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  articles: Article[];
};

export const HUBS: Record<string, Hub> = {
  "come-to-christ": {
    slug: "come-to-christ",
    eyebrow: "Begin",
    title: "Come to Christ / Gospel",
    description:
      "Why you need Jesus. What the gospel is. Why he had to die. Did he rise? How can you be saved? And what happens after.",
    articles: [
      {
        slug: "why-you-need-jesus",
        title: "Why You Need Jesus",
        subtitle: "The diagnosis before the cure.",
        shortAnswer:
          "Every human being has turned away from God — in actions, words, and the deepest part of the heart. This is what the Bible calls sin. Sin is not just bad behavior; it is a broken relationship with the God who made us. You cannot fix it by being better, more religious, or more sincere. You need rescue. Jesus Christ is that rescue. He took the punishment your sins deserved, rose from the grave, and offers you forgiveness, adoption, and eternal life. You need Jesus because you were made by him, you have rebelled against him, and only he can bring you home.",
        keyScriptures: [
          { ref: "Romans 3:23", note: "All have sinned and fall short" },
          { ref: "Romans 6:23", note: "Wages of sin is death; gift of God is eternal life" },
          { ref: "John 14:6", note: "I am the way, the truth, and the life" },
          { ref: "John 3:16", note: "God so loved the world" },
          { ref: "1 Timothy 2:5", note: "One mediator between God and man, Christ Jesus" },
        ],
        relatedSlugs: ["what-is-the-gospel", "how-can-i-be-saved", "why-jesus-had-to-die"],
      },
      {
        slug: "what-is-the-gospel",
        title: "What Is the Gospel?",
        subtitle: "The best news ever told.",
        shortAnswer:
          "The gospel is not 'try harder.' It is not 'be a good person.' It is the announcement of what God has done. Jesus Christ — the eternal Son of God — became a man, lived the perfect life we could not live, died on a cross taking the punishment our sins deserved, rose from the dead on the third day, and is alive right now. He invites you, by name, to turn from your sin (repentance) and trust him alone (faith). This is the gospel: not a list of religious requirements, but a person to receive.",
        keyScriptures: [
          { ref: "1 Corinthians 15:1-8", note: "Paul's summary of the gospel" },
          { ref: "Romans 1:16", note: "Gospel is the power of God for salvation" },
          { ref: "Mark 1:15", note: "Repent and believe the gospel" },
          { ref: "Ephesians 2:8-9", note: "By grace, through faith, not of works" },
          { ref: "Acts 4:12", note: "No other name under heaven" },
        ],
        relatedSlugs: ["why-jesus-had-to-die", "did-jesus-rise", "how-can-i-be-saved"],
      },
      {
        slug: "why-jesus-had-to-die",
        title: "Why Jesus Had to Die",
        subtitle: "Substitution in place of sinners.",
        shortAnswer:
          "God is holy, and he cannot pretend sin is not serious. Sin damages people, breaks the world, and demands justice. But God is also love, and he did not want to leave us in our rebellion. So he sent his Son to take the punishment we deserved. Jesus' death on the cross was not a tragic accident or a moral example. It was a substitution: he stood in our place, bore our sin, satisfied God's justice, and opened the door for forgiveness. The cross is where God's holiness and God's love meet.",
        keyScriptures: [
          { ref: "Isaiah 53:5-6", note: "Pierced for our transgressions" },
          { ref: "2 Corinthians 5:21", note: "He became sin for us" },
          { ref: "Romans 5:8", note: "While we were still sinners, Christ died for us" },
          { ref: "1 Peter 2:24", note: "He bore our sins in his body on the tree" },
          { ref: "Hebrews 9:22", note: "Without shedding of blood, no forgiveness" },
        ],
        relatedSlugs: ["did-jesus-rise", "what-is-the-gospel", "peace-with-god"],
      },
      {
        slug: "did-jesus-rise",
        title: "Did Jesus Rise from the Dead?",
        subtitle: "Christianity stands or falls here.",
        shortAnswer:
          "If Christ has not been raised, the apostle Paul said, our faith is futile and we are still in our sins (1 Corinthians 15:17). The resurrection is not a metaphor — it is a claim about a real event in history. The tomb was empty. Hundreds of eyewitnesses saw the risen Christ. Skeptics were converted. Cowards became martyrs. The early church spread like fire, with no political or military power, because the men and women who started it had seen something. The resurrection is the best-supported event in ancient history — and it changes everything.",
        keyScriptures: [
          { ref: "1 Corinthians 15:3-8", note: "Eyewitness summary" },
          { ref: "Matthew 28:1-10", note: "The empty tomb" },
          { ref: "Luke 24:36-43", note: "The risen Christ eats fish" },
          { ref: "Acts 1:3", note: "Many proofs over forty days" },
          { ref: "Romans 1:4", note: "Declared Son of God by the resurrection" },
        ],
        relatedSlugs: ["why-jesus-had-to-die", "what-is-the-gospel", "eternal-life"],
      },
      {
        slug: "how-can-i-be-saved",
        title: "How Can I Be Saved?",
        subtitle: "Believe in the Lord Jesus, and you will be saved.",
        shortAnswer:
          "Salvation is by grace, through faith in Jesus Christ, expressed in repentance. You cannot earn it. You receive it. Saving faith is not just knowing about Jesus — it is trusting him with your life and your eternity. It includes turning from your sin (repentance) and trusting him alone (faith). Good works do not save you; they follow salvation, like fruit follows a living tree. Whatever you have done, Jesus has paid for. Whoever you have been, he can make new.",
        keyScriptures: [
          { ref: "Acts 16:31", note: "Believe in the Lord Jesus, and you will be saved" },
          { ref: "Ephesians 2:8-9", note: "By grace, through faith — gift of God" },
          { ref: "Romans 10:9-10", note: "Confess with your mouth, believe in your heart" },
          { ref: "John 3:16-17", note: "Whoever believes in him should not perish" },
          { ref: "Titus 3:5", note: "Not by works but by his mercy" },
        ],
        relatedSlugs: ["sinners-prayer", "born-again", "assurance-of-salvation"],
      },
      {
        slug: "born-again",
        title: "Born Again",
        subtitle: "A new beginning the world cannot give.",
        shortAnswer:
          "Jesus told a religious leader named Nicodemus that no one can see the kingdom of God unless he is born again (John 3:3). This is not metaphor for self-improvement. It is the work of the Holy Spirit, who gives new spiritual life to a person who was spiritually dead. When you trust Christ, God himself gives you new birth — a new heart, a new nature, a new desire for him. You don't earn it. You receive it. It is a gift.",
        keyScriptures: [
          { ref: "John 3:1-8", note: "You must be born again" },
          { ref: "1 Peter 1:3", note: "Born again to a living hope" },
          { ref: "Ezekiel 36:26", note: "A new heart I will give you" },
          { ref: "Titus 3:5-7", note: "The washing of regeneration" },
          { ref: "2 Corinthians 5:17", note: "If anyone is in Christ, he is a new creation" },
        ],
        relatedSlugs: ["holy-spirit", "assurance-of-salvation", "baptism"],
      },
      {
        slug: "baptism",
        title: "Baptism",
        subtitle: "The first public obedience.",
        shortAnswer:
          "Baptism is the first public step of obedience for a new believer. It pictures dying to the old life and rising to new life with Christ. It does not save you — Christ saves you — but it is what Christ commands his disciples to do. Christians have disagreed on the mode (immersion, pouring) and subjects (professing believers only, or also infants of believers). We teach what Scripture clearly says, name the historic positions charitably, and ask you to be baptized soon, in a faithful local church.",
        keyScriptures: [
          { ref: "Matthew 28:19", note: "Baptize them in the name of the Father, Son, Spirit" },
          { ref: "Romans 6:3-4", note: "Buried with him by baptism into death" },
          { ref: "Acts 2:38", note: "Repent and be baptized" },
          { ref: "Acts 8:36-38", note: "What hinders me from being baptized?" },
          { ref: "Colossians 2:12", note: "Buried with him in baptism" },
        ],
        relatedSlugs: ["born-again", "communion", "church-and-discipleship"],
      },
      {
        slug: "assurance-of-salvation",
        title: "Assurance of Salvation",
        subtitle: "How can I know I am saved?",
        shortAnswer:
          "Assurance is not built on how you feel today. It is built on what Christ has done and what God has promised. Three things confirm a believer's standing: the testimony of God's Word that whoever trusts Christ has eternal life, the inner witness of the Holy Spirit who cries 'Father' with our spirits, and the visible fruit of a changed life — love for God, love for his people, hatred of sin, perseverance in faith. If you doubt today, look again at the cross. Christ holds you; you do not hold yourself.",
        keyScriptures: [
          { ref: "1 John 5:13", note: "That you may know you have eternal life" },
          { ref: "Romans 8:15-16", note: "Spirit testifies we are children of God" },
          { ref: "John 10:28-29", note: "No one will snatch them from my hand" },
          { ref: "Philippians 1:6", note: "He who began a good work will bring it to completion" },
          { ref: "John 6:37", note: "Whoever comes to me I will never cast out" },
        ],
        relatedSlugs: ["born-again", "doubt", "peace-with-god"],
      },
      {
        slug: "peace-with-god",
        title: "Peace With God",
        subtitle: "The end of the war.",
        shortAnswer:
          "Apart from Christ, every human being is at war with God — not because God is unwilling to receive us, but because our sin separates us from him. The cross ended that war for everyone who trusts Christ. Justified by faith, we have peace with God through our Lord Jesus Christ. This is not the absence of trouble; it is the presence of reconciliation. The God you ran from is now your Father. The judge who would have condemned you is now your advocate.",
        keyScriptures: [
          { ref: "Romans 5:1", note: "Justified by faith, we have peace with God" },
          { ref: "Colossians 1:20", note: "Making peace by the blood of his cross" },
          { ref: "Ephesians 2:14", note: "He himself is our peace" },
          { ref: "John 14:27", note: "My peace I give to you" },
          { ref: "Philippians 4:6-7", note: "The peace of God which surpasses understanding" },
        ],
        relatedSlugs: ["why-jesus-had-to-die", "adoption", "assurance-of-salvation"],
      },
      {
        slug: "eternal-life",
        title: "Eternal Life",
        subtitle: "The life that already begins.",
        shortAnswer:
          "Eternal life is not just unending duration — it is a quality of life that begins the moment you trust Christ. Jesus said eternal life is to know the Father and the Son whom he sent (John 17:3). Knowing him. Being known by him. Walking with him here, then face to face forever. Death does not end the life Christ gives. It cannot. He has the keys.",
        keyScriptures: [
          { ref: "John 17:3", note: "Eternal life is to know God and Christ" },
          { ref: "John 3:36", note: "Whoever believes in the Son has eternal life" },
          { ref: "John 11:25-26", note: "I am the resurrection and the life" },
          { ref: "1 John 5:11-12", note: "Whoever has the Son has life" },
          { ref: "Revelation 1:18", note: "I have the keys of death and Hades" },
        ],
        relatedSlugs: ["did-jesus-rise", "resurrection-of-the-body", "born-again"],
      },
      {
        slug: "resurrection-of-the-body",
        title: "Resurrection of the Body",
        subtitle: "Not just souls in heaven. Bodies risen.",
        shortAnswer:
          "Christianity does not believe in disembodied souls floating forever. It teaches the resurrection of the body. When Christ returns, the dead in Christ will rise, given glorified bodies like his — physical, real, yet imperishable. The new creation is not less material than this one; it is more. This is the hope that turned cowardly disciples into martyrs and grieving families into people of patient joy.",
        keyScriptures: [
          { ref: "1 Corinthians 15:42-44", note: "Sown perishable, raised imperishable" },
          { ref: "Philippians 3:21", note: "Transform our lowly body to be like his glorious body" },
          { ref: "1 Thessalonians 4:13-18", note: "The dead in Christ will rise first" },
          { ref: "Romans 8:23", note: "The redemption of our bodies" },
          { ref: "Job 19:26-27", note: "In my flesh I shall see God" },
        ],
        relatedSlugs: ["did-jesus-rise", "eternal-life", "judgment"],
      },
      {
        slug: "judgment",
        title: "The Final Judgment",
        subtitle: "What every human being will face.",
        shortAnswer:
          "Scripture teaches that every person will stand before God to give account. This is sobering — and it is also news, because God has appointed a judge: the risen Christ. For everyone who has trusted him, the verdict is already in: 'no condemnation' (Romans 8:1). For those who rejected him, the warnings of Scripture are real and grave. We do not flinch from this teaching, and we do not weaponize it. We speak it with the same gravity Jesus did, and the same love.",
        keyScriptures: [
          { ref: "Hebrews 9:27", note: "Appointed to die once, then judgment" },
          { ref: "2 Corinthians 5:10", note: "We must all appear before the judgment seat" },
          { ref: "Acts 17:31", note: "He will judge the world in righteousness" },
          { ref: "Revelation 20:11-15", note: "The great white throne" },
          { ref: "Romans 8:1", note: "No condemnation for those in Christ Jesus" },
        ],
        relatedSlugs: ["come-to-christ", "resurrection-of-the-body", "eternal-life"],
      },
    ],
  },

  "god-trinity-word-spirit": {
    slug: "god-trinity-word-spirit",
    eyebrow: "God",
    title: "God, Trinity, the Word, and the Holy Spirit",
    description:
      "Who God is. The triune God. The Word and the Spirit. Walking by the Spirit. Fruit and gifts.",
    articles: [
      {
        slug: "who-is-god",
        title: "Who Is God?",
        subtitle: "Not what we imagine. What he has revealed.",
        shortAnswer:
          "The God of the Bible is not a vague spiritual force. He is the one true God — eternal, holy, loving, just, all-powerful, all-knowing, present everywhere, unchanging in his perfection. He is personal. He speaks. He acts in history. He made all things. He sustains all things. He is not 'the universe' — he is the maker of the universe. And he has made himself known most fully in his Son, Jesus Christ.",
        keyScriptures: [
          { ref: "Deuteronomy 6:4", note: "The Lord our God, the Lord is one" },
          { ref: "Isaiah 40:28", note: "Everlasting God, creator" },
          { ref: "Exodus 34:6-7", note: "Merciful, gracious, slow to anger" },
          { ref: "Psalm 90:2", note: "From everlasting to everlasting" },
          { ref: "John 1:18", note: "The only Son has made him known" },
        ],
        relatedSlugs: ["triune-god", "father-son-spirit", "word-became-flesh"],
      },
      {
        slug: "triune-god",
        title: "The Triune God",
        subtitle: "One God, three persons.",
        shortAnswer:
          "Scripture teaches that there is one God, eternally existing as three persons: the Father, the Son, and the Holy Spirit. They are not three gods; they are one God. They are not one person playing three roles; they are three distinct persons. This is mystery — not contradiction. We did not invent this; we received it from what God revealed about himself. The Trinity is not optional Christian theology. It is the heart of the Christian confession.",
        keyScriptures: [
          { ref: "Matthew 28:19", note: "In the name of the Father, Son, and Holy Spirit" },
          { ref: "John 1:1", note: "The Word was with God and the Word was God" },
          { ref: "2 Corinthians 13:14", note: "Grace, love, and fellowship — Trinitarian benediction" },
          { ref: "John 14:26", note: "The Father sends the Spirit in the Son's name" },
          { ref: "Genesis 1:26", note: "Let us make man in our image" },
        ],
        relatedSlugs: ["who-is-god", "father-son-spirit", "deity-of-christ"],
      },
      {
        slug: "father-son-spirit",
        title: "The Father, the Son, and the Holy Spirit",
        subtitle: "How the persons of the Trinity relate.",
        shortAnswer:
          "The Father sends. The Son is sent — eternally begotten, incarnate, crucified, risen, reigning. The Holy Spirit proceeds — sent from the Father and the Son, indwelling believers, applying the work of Christ. Each person is fully God. They are distinguished by their relations and roles, not by any inequality. They love one another, glorify one another, and act together in everything God does.",
        keyScriptures: [
          { ref: "John 17:5", note: "Glory I had with you before the world existed" },
          { ref: "John 15:26", note: "Spirit of truth who proceeds from the Father" },
          { ref: "John 14:16-17", note: "The Father will give you another Helper" },
          { ref: "Romans 8:11", note: "Spirit of him who raised Jesus from the dead" },
          { ref: "1 Peter 1:2", note: "Foreknowledge of Father, sanctification of Spirit, blood of Christ" },
        ],
        relatedSlugs: ["triune-god", "holy-spirit", "deity-of-christ"],
      },
      {
        slug: "word-of-god",
        title: "The Word of God",
        subtitle: "Inspired, true, sufficient.",
        shortAnswer:
          "Scripture is the inspired Word of God — given by the Holy Spirit through human authors, in their language and style, yet without error in what it affirms. It is true. It is sufficient for everything we need to know God and live for him. It is the final authority above tradition, experience, reason, and feeling. It is not less than literature, but it is more than literature: it is the breath of God still speaking through ink and ages.",
        keyScriptures: [
          { ref: "2 Timothy 3:16-17", note: "All Scripture is breathed out by God" },
          { ref: "2 Peter 1:21", note: "Men carried along by the Holy Spirit" },
          { ref: "Psalm 119:105", note: "Your word is a lamp to my feet" },
          { ref: "Isaiah 55:11", note: "My word will not return empty" },
          { ref: "Hebrews 4:12", note: "The word of God is living and active" },
        ],
        relatedSlugs: ["word-became-flesh", "why-trust-the-bible", "meditate-on-the-word"],
      },
      {
        slug: "word-became-flesh",
        title: "The Word Became Flesh",
        subtitle: "God among us.",
        shortAnswer:
          "In the beginning was the Word, and the Word was with God, and the Word was God. And the Word became flesh and dwelt among us — full of grace and truth. This is the Christmas mystery: the eternal Son took on human nature without ceasing to be divine, lived among us, died for us, rose for us, and now reigns as the God-man forever. We have seen his glory.",
        keyScriptures: [
          { ref: "John 1:1-18", note: "In the beginning was the Word" },
          { ref: "Philippians 2:5-11", note: "Did not count equality with God a thing to be grasped" },
          { ref: "Hebrews 1:1-3", note: "He is the radiance of the glory of God" },
          { ref: "Colossians 2:9", note: "In him the fullness of deity dwells bodily" },
          { ref: "1 Timothy 3:16", note: "Great is the mystery of godliness" },
        ],
        relatedSlugs: ["deity-of-christ", "triune-god", "word-of-god"],
      },
      {
        slug: "holy-spirit",
        title: "Who Is the Holy Spirit?",
        subtitle: "The third person of the Trinity, not a vague force.",
        shortAnswer:
          "The Holy Spirit is the third person of the Trinity — fully God, with the Father and the Son. He is not a vague force or impersonal energy. He convicts of sin, regenerates dead hearts, indwells believers, gifts the church, leads into truth, intercedes in our prayers, and produces the character of Christ in us. He is the great gift Jesus promised. Every Christian has him.",
        keyScriptures: [
          { ref: "John 14:16-17", note: "Another Helper, the Spirit of truth" },
          { ref: "John 16:7-15", note: "He will convict and guide into all truth" },
          { ref: "Romans 8:9-11", note: "If anyone does not have the Spirit of Christ, he is not his" },
          { ref: "Acts 1:8", note: "You will receive power when the Holy Spirit has come upon you" },
          { ref: "1 Corinthians 6:19", note: "Your body is a temple of the Holy Spirit" },
        ],
        relatedSlugs: ["gift-of-the-spirit", "walking-by-the-spirit", "fruit-of-the-spirit"],
      },
      {
        slug: "gift-of-the-spirit",
        title: "The Gift of the Holy Spirit",
        subtitle: "What every Christian receives.",
        shortAnswer:
          "When you trust Christ, the Holy Spirit comes to dwell in you. This is not a second-class gift, not a reward for advanced Christians. Every believer receives the Spirit at conversion — sealed, indwelled, baptized into the body of Christ, marked as God's own. The Spirit is the deposit guaranteeing our inheritance: the down payment on what is coming.",
        keyScriptures: [
          { ref: "Acts 2:38", note: "Repent, be baptized, receive the Holy Spirit" },
          { ref: "Ephesians 1:13-14", note: "Sealed with the promised Holy Spirit" },
          { ref: "Romans 8:15-16", note: "Spirit of adoption who cries 'Abba, Father'" },
          { ref: "1 Corinthians 12:13", note: "By one Spirit we were all baptized into one body" },
          { ref: "Galatians 4:6", note: "God sent the Spirit of his Son into our hearts" },
        ],
        relatedSlugs: ["holy-spirit", "born-again", "walking-by-the-spirit"],
      },
      {
        slug: "walking-by-the-spirit",
        title: "Walking by the Spirit",
        subtitle: "The daily Christian life.",
        shortAnswer:
          "Walking by the Spirit is the daily Christian life: depending on him rather than self, keeping in step with his leading, putting to death the deeds of the flesh, bearing his fruit. It is not perfection. It is direction. The Christian who stumbles and gets back up by grace is walking by the Spirit; the religious person who never stumbles but never depends on Christ is not.",
        keyScriptures: [
          { ref: "Galatians 5:16-25", note: "Walk by the Spirit, and you will not gratify the desires of the flesh" },
          { ref: "Romans 8:13-14", note: "By the Spirit you put to death the deeds of the body" },
          { ref: "Ephesians 5:18", note: "Be filled with the Spirit" },
          { ref: "2 Corinthians 3:18", note: "Transformed from one degree of glory to another" },
          { ref: "Romans 12:1-2", note: "Be transformed by the renewing of your mind" },
        ],
        relatedSlugs: ["fruit-of-the-spirit", "overcoming-sin", "holiness"],
      },
      {
        slug: "fruit-of-the-spirit",
        title: "Fruit of the Spirit",
        subtitle: "Not nine virtues. One fruit, nine flavors.",
        shortAnswer:
          "The fruit of the Spirit is love, joy, peace, patience, kindness, goodness, faithfulness, gentleness, self-control. It is fruit — singular — because it is the natural outflow of one Spirit's work. It grows in a believer's life over years, not days. You don't produce it by trying harder; you abide in Christ and the Spirit produces it in you. Wherever this fruit is present, the Spirit is at work.",
        keyScriptures: [
          { ref: "Galatians 5:22-23", note: "The fruit of the Spirit is love, joy, peace…" },
          { ref: "John 15:4-5", note: "Abide in me, and I in you" },
          { ref: "Ephesians 5:9", note: "The fruit of light is found in all that is good and right and true" },
          { ref: "Colossians 3:12-15", note: "Put on compassionate hearts" },
          { ref: "2 Peter 1:5-8", note: "Add to your faith virtue, knowledge, self-control, steadfastness…" },
        ],
        relatedSlugs: ["walking-by-the-spirit", "holiness", "love-your-neighbor"],
      },
      {
        slug: "spiritual-gifts",
        title: "Spiritual Gifts",
        subtitle: "Every believer is gifted. None is gifted alone.",
        shortAnswer:
          "The Spirit gives gifts to every believer — teaching, serving, encouraging, leading, mercy, faith, healing, prophecy, tongues, hospitality, and more — for the common good of the body of Christ. Not everyone has the same gifts. Faithful Christians have disagreed on whether certain gifts (tongues, prophecy, healing) continue today in the same form. We teach what Scripture says, urge their use in love, never weaponize them, and never make any gift the proof of salvation.",
        keyScriptures: [
          { ref: "1 Corinthians 12:4-11", note: "Varieties of gifts, same Spirit" },
          { ref: "Romans 12:6-8", note: "Gifts that differ according to the grace given" },
          { ref: "Ephesians 4:11-13", note: "Apostles, prophets, evangelists, pastors, teachers" },
          { ref: "1 Peter 4:10-11", note: "Use them as good stewards of God's varied grace" },
          { ref: "1 Corinthians 13:1-3", note: "Without love I am nothing" },
        ],
        relatedSlugs: ["body-of-christ", "love-your-neighbor", "holy-spirit"],
      },
      {
        slug: "fear-of-the-lord",
        title: "The Fear of the Lord",
        subtitle: "Not terror. Reverence.",
        shortAnswer:
          "To fear the Lord is not to live in dread of him. It is to know who he is — holy, glorious, just, merciful — and to live in fitting reverence. Where there is no fear of God, life becomes shallow. Where there is fear of God, wisdom begins. The fear of the Lord is clean, drives out the fear of man, and goes hand in hand with love.",
        keyScriptures: [
          { ref: "Proverbs 1:7", note: "The fear of the Lord is the beginning of knowledge" },
          { ref: "Psalm 19:9", note: "The fear of the Lord is clean" },
          { ref: "Isaiah 6:1-5", note: "Holy, holy, holy is the Lord of hosts" },
          { ref: "Luke 12:4-5", note: "Fear him who has authority over body and soul" },
          { ref: "1 Peter 1:17", note: "Conduct yourselves with fear" },
        ],
        relatedSlugs: ["who-is-god", "true-worship", "humility"],
      },
      {
        slug: "true-worship",
        title: "Worship in Spirit and Truth",
        subtitle: "Not what we feel. Who we honor.",
        shortAnswer:
          "Jesus told the Samaritan woman that true worshipers will worship the Father in spirit and truth. Worship is not a music style or a building or a Sunday. It is the whole of life given to God. It is sincere from the heart (spirit) and shaped by what God has revealed about himself (truth). The Father seeks such worshipers — not because he needs us, but because we were made for this.",
        keyScriptures: [
          { ref: "John 4:23-24", note: "Worship the Father in spirit and truth" },
          { ref: "Romans 12:1", note: "Present your bodies as a living sacrifice" },
          { ref: "Psalm 95", note: "Come, let us worship and bow down" },
          { ref: "Revelation 4:8-11", note: "Worship around the throne" },
          { ref: "Hebrews 12:28-29", note: "Offer to God acceptable worship" },
        ],
        relatedSlugs: ["love-god", "fear-of-the-lord", "obeying-jesus"],
      },
    ],
  },

  "christ-in-all-scripture": {
    slug: "christ-in-all-scripture",
    eyebrow: "Bible",
    title: "Christ in All Scripture",
    description:
      "From Genesis to Revelation, the Bible's spine is Jesus. The seed, the lamb, the suffering servant, the king.",
    articles: [
      {
        slug: "christ-in-you",
        title: "Christ in You, the Hope of Glory",
        subtitle: "The mystery now revealed.",
        shortAnswer:
          "The apostle Paul calls it 'the mystery hidden for ages and generations but now revealed.' What is the mystery? Christ in you, the hope of glory. Not Christ for you only — though that is glorious — but Christ in you. The same Jesus who walked with his disciples now lives in everyone who belongs to him, by his Spirit. This is the heart of the Christian life. He is not far. He is in.",
        keyScriptures: [
          { ref: "Colossians 1:24-29", note: "The mystery hidden and now revealed" },
          { ref: "Galatians 2:20", note: "Christ lives in me" },
          { ref: "John 14:23", note: "We will come and make our home with him" },
          { ref: "Ephesians 3:17", note: "That Christ may dwell in your hearts through faith" },
          { ref: "2 Corinthians 4:6-7", note: "Treasure in jars of clay" },
        ],
        relatedSlugs: ["mystery-of-christ", "born-again", "holy-spirit"],
      },
      {
        slug: "mystery-of-christ",
        title: "The Mystery of Christ",
        subtitle: "Hidden in the Old Testament. Revealed in the New.",
        shortAnswer:
          "Paul speaks of 'the mystery of Christ' — God's plan, hidden in ages past, now made known. The mystery is that in Christ, Jew and Gentile become one new people, and that the eternal Son of God himself takes flesh to redeem us. The Old Testament whispers it. The New Testament shouts it. Christ is not an afterthought to God's plan. He is the plan.",
        keyScriptures: [
          { ref: "Ephesians 3:4-6", note: "The mystery of Christ — Gentiles fellow heirs" },
          { ref: "Colossians 1:26-27", note: "The mystery hidden for ages, now revealed" },
          { ref: "Romans 16:25-26", note: "Mystery kept secret for long ages, now disclosed" },
          { ref: "1 Corinthians 2:7-8", note: "God's wisdom in a mystery" },
          { ref: "Matthew 13:35", note: "Things hidden since the foundation of the world" },
        ],
        relatedSlugs: ["christ-in-you", "messianic-prophecies", "christ-in-the-ot"],
      },
      {
        slug: "messianic-prophecies",
        title: "Messianic Prophecies",
        subtitle: "Hundreds of pointers, one Person fulfilling them all.",
        shortAnswer:
          "The Old Testament makes specific predictions about the coming Messiah — born of a virgin, in Bethlehem, of the line of David, pierced for transgressions, executed with criminals, buried with the rich, raised on the third day. Jesus fulfills these prophecies with a precision that cannot be coincidence. He is who he claimed to be: the long-promised one, the Christ, the Son of God.",
        keyScriptures: [
          { ref: "Isaiah 7:14", note: "Behold, a virgin shall conceive" },
          { ref: "Micah 5:2", note: "Out of Bethlehem shall come a ruler" },
          { ref: "Isaiah 53", note: "The suffering servant — pierced for our transgressions" },
          { ref: "Psalm 22", note: "They pierced my hands and my feet" },
          { ref: "Daniel 7:13-14", note: "One like a son of man" },
        ],
        relatedSlugs: ["christ-in-the-ot", "suffering-servant", "did-jesus-rise"],
      },
      {
        slug: "christ-in-the-ot",
        title: "Christ in the Old Testament",
        subtitle: "Every page whispers his name.",
        shortAnswer:
          "Jesus said, 'These are the Scriptures that bear witness about me' — referring to the Old Testament. The Old Testament is not Plan A and Jesus Plan B. The whole story has always been about him. The seed of the woman who crushes the serpent. The Lamb of the Passover. The Rock that gave water in the wilderness. The Suffering Servant of Isaiah. The Son of David promised an eternal throne. He is the point.",
        keyScriptures: [
          { ref: "Luke 24:27", note: "Beginning with Moses, he interpreted all the Scriptures concerning himself" },
          { ref: "John 5:39", note: "The Scriptures bear witness about me" },
          { ref: "Acts 10:43", note: "All the prophets bear witness about him" },
          { ref: "Hebrews 10:7", note: "In the scroll of the book it is written of me" },
          { ref: "1 Peter 1:10-12", note: "The prophets searched and inquired" },
        ],
        relatedSlugs: ["seed-of-the-woman", "passover-lamb", "son-of-david"],
      },
      {
        slug: "seed-of-the-woman",
        title: "The Seed of the Woman",
        subtitle: "The first gospel promise.",
        shortAnswer:
          "In Genesis 3, after Adam and Eve fall into sin, God speaks judgment on the serpent — and embedded in that judgment is the first promise of the gospel. One day, a descendant of the woman (her 'seed') will crush the serpent's head, though the serpent will strike his heel. That seed is Christ. The cross is the heel-bruise that becomes the serpent-crushing.",
        keyScriptures: [
          { ref: "Genesis 3:15", note: "He will bruise your head, and you will bruise his heel" },
          { ref: "Galatians 3:16", note: "The seed, who is Christ" },
          { ref: "1 John 3:8", note: "The Son of God appeared to destroy the works of the devil" },
          { ref: "Hebrews 2:14-15", note: "He took on flesh to destroy the one who has the power of death" },
          { ref: "Romans 16:20", note: "The God of peace will soon crush Satan under your feet" },
        ],
        relatedSlugs: ["christ-in-the-ot", "messianic-prophecies", "why-jesus-had-to-die"],
      },
      {
        slug: "passover-lamb",
        title: "The Passover Lamb",
        subtitle: "Blood on the doorpost. Death passing over.",
        shortAnswer:
          "On the night Israel was delivered from Egypt, every family killed a lamb and put its blood on the doorpost. The angel of death 'passed over' every house marked by the blood. This was not just a one-time rescue. It was a picture. The Lamb who would one day be slain — Jesus Christ — would shed his blood, and death would pass over everyone covered by it.",
        keyScriptures: [
          { ref: "Exodus 12:1-13", note: "The Passover instituted" },
          { ref: "John 1:29", note: "Behold, the Lamb of God who takes away the sin of the world" },
          { ref: "1 Corinthians 5:7", note: "Christ our Passover lamb has been sacrificed" },
          { ref: "1 Peter 1:18-19", note: "Redeemed with the precious blood of Christ, a lamb without blemish" },
          { ref: "Revelation 5:6-12", note: "Worthy is the Lamb who was slain" },
        ],
        relatedSlugs: ["why-jesus-had-to-die", "suffering-servant", "tabernacle-and-temple"],
      },
      {
        slug: "son-of-david",
        title: "The Son of David",
        subtitle: "An eternal throne promised, fulfilled.",
        shortAnswer:
          "God promised David that one of his descendants would sit on a throne forever. Solomon was a partial fulfillment. The full fulfillment is Jesus — the Son of David, the rightful King of Israel, the one whose kingdom has no end. The angel Gabriel said as much to Mary: 'The Lord God will give him the throne of his father David, and he will reign over the house of Jacob forever.'",
        keyScriptures: [
          { ref: "2 Samuel 7:12-16", note: "I will establish his kingdom forever" },
          { ref: "Isaiah 9:6-7", note: "On the throne of David, of the increase of his government there will be no end" },
          { ref: "Luke 1:32-33", note: "The Lord God will give him the throne of his father David" },
          { ref: "Matthew 1:1", note: "Jesus Christ, the son of David" },
          { ref: "Revelation 22:16", note: "I am the root and the descendant of David" },
        ],
        relatedSlugs: ["messianic-prophecies", "kingdom-of-god", "behold-i-am-coming-soon"],
      },
      {
        slug: "suffering-servant",
        title: "The Suffering Servant",
        subtitle: "Pierced for our transgressions.",
        shortAnswer:
          "Isaiah 53, written 700 years before Christ, describes a coming servant of the Lord who would be despised, rejected, wounded for our transgressions, crushed for our iniquities, silent like a sheep before its shearers, executed with criminals, buried with the rich, and ultimately raised to justify many. This is Jesus. Every line. Even his enemies recognize the precision.",
        keyScriptures: [
          { ref: "Isaiah 53:1-12", note: "By his stripes we are healed" },
          { ref: "Acts 8:32-35", note: "Philip explains Isaiah 53 — beginning with this Scripture he told him the good news about Jesus" },
          { ref: "1 Peter 2:24-25", note: "He himself bore our sins in his body on the tree" },
          { ref: "Romans 4:25", note: "Delivered up for our trespasses and raised for our justification" },
          { ref: "Matthew 8:17", note: "He took our illnesses and bore our diseases" },
        ],
        relatedSlugs: ["why-jesus-had-to-die", "did-jesus-rise", "messianic-prophecies"],
      },
      {
        slug: "tabernacle-and-temple",
        title: "The Tabernacle and Temple",
        subtitle: "God dwelling among his people — and then becoming one of us.",
        shortAnswer:
          "The tabernacle in the wilderness — and later the temple in Jerusalem — was the place where God dwelt visibly with his people. But it was always a picture. The true tabernacle is Christ himself. 'The Word became flesh and tabernacled among us.' And now, in him, we ourselves become the temple of the living God, indwelt by his Spirit.",
        keyScriptures: [
          { ref: "Exodus 25:8", note: "Let them make me a sanctuary, that I may dwell in their midst" },
          { ref: "John 1:14", note: "The Word became flesh and tabernacled among us" },
          { ref: "John 2:19-21", note: "He was speaking about the temple of his body" },
          { ref: "1 Corinthians 3:16-17", note: "You are God's temple" },
          { ref: "Revelation 21:22", note: "Its temple is the Lord God Almighty and the Lamb" },
        ],
        relatedSlugs: ["word-became-flesh", "holy-spirit", "passover-lamb"],
      },
      {
        slug: "nations-blessed-in-abraham",
        title: "The Nations Blessed in Abraham",
        subtitle: "A promise made to one family for the whole world.",
        shortAnswer:
          "When God called Abraham, he made a promise: 'In you all the families of the earth shall be blessed.' Israel was not chosen against the nations; Israel was chosen for the nations. That promise is fulfilled in Christ — the descendant of Abraham through whom the gospel goes to every people, tribe, and tongue. The Great Commission is not a new idea. It is the ancient promise coming to harvest.",
        keyScriptures: [
          { ref: "Genesis 12:1-3", note: "In you all the families of the earth shall be blessed" },
          { ref: "Galatians 3:8-9", note: "Scripture foresaw that God would justify the Gentiles by faith" },
          { ref: "Matthew 28:18-20", note: "Make disciples of all nations" },
          { ref: "Revelation 7:9", note: "A great multitude from every nation" },
          { ref: "Romans 4:13-25", note: "The promise to Abraham comes through righteousness of faith" },
        ],
        relatedSlugs: ["nations-unity-and-glory", "great-commission", "earth-filled-with-his-glory"],
      },
      {
        slug: "mystery-revealed",
        title: "The Mystery Hidden and Now Revealed",
        subtitle: "What the prophets longed to see.",
        shortAnswer:
          "The Old Testament prophets searched and inquired about the salvation they were prophesying about. They saw glimpses. They did not see the whole. What they longed for is what we have seen: God himself, in Christ, dying for the sins of the world, rising for the justification of his people, sending his Spirit, gathering one new people from every nation. The mystery has come into the open.",
        keyScriptures: [
          { ref: "1 Peter 1:10-12", note: "Prophets searched and inquired" },
          { ref: "Matthew 13:16-17", note: "Many prophets and righteous people longed to see" },
          { ref: "Ephesians 1:9-10", note: "The mystery of his will, set forth in Christ" },
          { ref: "Colossians 1:26-27", note: "The mystery hidden for ages now revealed" },
          { ref: "Romans 16:25-27", note: "The mystery kept secret for long ages now disclosed" },
        ],
        relatedSlugs: ["mystery-of-christ", "christ-in-you", "christ-in-the-ot"],
      },
    ],
  },

  "lifes-biggest-questions": {
    slug: "lifes-biggest-questions",
    eyebrow: "Questions",
    title: "Life's Biggest Questions",
    description:
      "Plain biblical answers to the questions you actually ask. Purpose, evil, suffering, salvation, eternity.",
    articles: [
      {
        slug: "purpose-of-life",
        title: "What Is the Purpose of Life?",
        subtitle: "Made by God, made for God.",
        shortAnswer:
          "You were not made by accident. You were not made just to be useful, productive, or pleasant. You were made by God, for God — to know him, love him, enjoy him, worship him, and reflect him to the world. Sin damaged that purpose. Christ restores it. The purpose of your life is not found by looking inward. It is found by looking up.",
        keyScriptures: [
          { ref: "Genesis 1:27", note: "Made in the image of God" },
          { ref: "Isaiah 43:7", note: "Created for my glory" },
          { ref: "1 Corinthians 10:31", note: "Whatever you do, do all to the glory of God" },
          { ref: "John 17:3", note: "Eternal life is to know God" },
          { ref: "Revelation 4:11", note: "You created all things, and by your will they existed" },
        ],
        relatedSlugs: ["why-are-we-here", "does-my-life-matter", "who-is-god"],
      },
      {
        slug: "why-evil",
        title: "Why Is There Evil?",
        subtitle: "The hardest question, asked honestly.",
        shortAnswer:
          "The Bible does not pretend evil is small or unreal. It is real. It hurts. It is also, in a sense, surprising — because God's original creation was very good. Evil entered through human rebellion against God, and the world has been broken ever since. God is not evil's author. He is its enemy. And in Christ, he entered the brokenness himself — to take the worst of evil into his own body on the cross, defeat it by resurrection, and one day end it forever in the new creation.",
        keyScriptures: [
          { ref: "Genesis 3", note: "The fall — evil enters the world" },
          { ref: "Romans 5:12", note: "Sin came into the world through one man" },
          { ref: "Romans 8:20-22", note: "Creation groans, subjected to futility" },
          { ref: "Revelation 21:4", note: "He will wipe away every tear" },
          { ref: "1 John 3:8", note: "The Son of God appeared to destroy the works of the devil" },
        ],
        relatedSlugs: ["why-do-i-suffer", "why-do-i-sin", "why-does-god-allow-pain"],
      },
      {
        slug: "why-do-i-suffer",
        title: "Why Do I Suffer?",
        subtitle: "Not always discipline. Not always meaningless.",
        shortAnswer:
          "Scripture gives many reasons for suffering: sometimes consequences of our own choices, sometimes consequences of others' choices, sometimes the broken world, sometimes God's discipline, sometimes mystery, sometimes a means God uses to deepen, refine, or call. Job's friends were rebuked for being too quick to assign reasons. We should be slow to do the same. But we are not without hope: Christ has entered suffering himself, and his grace is sufficient.",
        keyScriptures: [
          { ref: "John 9:1-3", note: "Neither this man nor his parents sinned" },
          { ref: "Romans 8:18", note: "Present sufferings are not worth comparing to the glory" },
          { ref: "Hebrews 12:5-11", note: "The Lord disciplines the one he loves" },
          { ref: "2 Corinthians 12:7-10", note: "My grace is sufficient for you" },
          { ref: "1 Peter 4:12-13", note: "Do not be surprised at the fiery trial" },
        ],
        relatedSlugs: ["why-evil", "why-does-god-allow-pain", "pain"],
      },
      {
        slug: "what-happens-when-i-die",
        title: "What Happens When I Die?",
        subtitle: "Christianity has a real answer.",
        shortAnswer:
          "Death is not the end. Every human being will face God and give account. For those who have trusted Christ, death is the entrance to his presence — to be 'absent from the body, present with the Lord' — and one day, at the resurrection, the reuniting of body and soul in glory. For those who have rejected him, the Bible warns of conscious separation from God. We do not say this lightly. We say it because Jesus said it. And we plead with everyone to come to him while there is time.",
        keyScriptures: [
          { ref: "Hebrews 9:27", note: "Appointed to die once, then judgment" },
          { ref: "2 Corinthians 5:6-8", note: "Away from the body, at home with the Lord" },
          { ref: "Philippians 1:21-23", note: "To depart and be with Christ" },
          { ref: "Luke 23:43", note: "Today you will be with me in Paradise" },
          { ref: "John 11:25-26", note: "I am the resurrection and the life" },
        ],
        relatedSlugs: ["death-and-dying", "resurrection-of-the-body", "judgment"],
      },
      {
        slug: "is-christianity-true",
        title: "Is Christianity True?",
        subtitle: "The question Paul said the answer stands or falls on.",
        shortAnswer:
          "Christianity stakes its truth on one historical claim: Jesus of Nazareth rose bodily from the grave. If he did, everything else holds. If he didn't, Paul himself said the whole faith collapses. The resurrection is the best-supported event in ancient history — eyewitnesses, transformed lives, no body produced, the rapid spread of the church. We do not ask you to believe blindly. We ask you to weigh the evidence honestly, then come.",
        keyScriptures: [
          { ref: "1 Corinthians 15:14-19", note: "If Christ has not been raised, our faith is futile" },
          { ref: "Luke 1:1-4", note: "Carefully investigated everything from the beginning" },
          { ref: "Acts 26:25-26", note: "This was not done in a corner" },
          { ref: "John 20:30-31", note: "These are written that you may believe" },
          { ref: "1 Peter 3:15", note: "Always being prepared to give a defense" },
        ],
        relatedSlugs: ["did-jesus-rise", "why-trust-the-bible", "why-jesus-and-not-another"],
      },
      {
        slug: "why-jesus-and-not-another",
        title: "Why Jesus and Not Another Way?",
        subtitle: "Because no one else makes the claim — or pays the price.",
        shortAnswer:
          "Other religious teachers point to the way. Jesus says, 'I am the way.' Other founders die. Jesus rises. Other systems offer requirements you must meet. Jesus meets them for you. The exclusivity of Christ is not arrogance; it is news. If anyone else could have saved the world, the Father would not have sent his Son to die. He did because no one else could.",
        keyScriptures: [
          { ref: "John 14:6", note: "I am the way, the truth, and the life" },
          { ref: "Acts 4:12", note: "No other name under heaven by which we must be saved" },
          { ref: "1 Timothy 2:5-6", note: "One mediator between God and man, Christ Jesus" },
          { ref: "Hebrews 2:14-15", note: "Through death he might destroy the one who has the power of death" },
          { ref: "Romans 10:9-13", note: "Whoever calls on the name of the Lord will be saved" },
        ],
        relatedSlugs: ["what-is-the-gospel", "is-christianity-true", "exclusivity-of-christ"],
      },
      {
        slug: "can-i-be-a-good-person",
        title: "Can I Just Be a Good Person?",
        subtitle: "If 'good enough' worked, the cross was unnecessary.",
        shortAnswer:
          "If we could earn our way to God by being good, the cross was the most pointless event in history. We cannot. The standard is not 'good enough' compared to other people — it is the holiness of God. Every honest heart knows it falls short. Being good is not the answer to your sin; being given Christ's righteousness through faith is. Then, having been received by him, you live a life of good works — not to earn what is already yours, but as the fruit of being made new.",
        keyScriptures: [
          { ref: "Romans 3:10-12", note: "None is righteous, no, not one" },
          { ref: "Isaiah 64:6", note: "All our righteous deeds are like a polluted garment" },
          { ref: "Ephesians 2:8-10", note: "Not of works, that no one may boast — created for good works" },
          { ref: "Galatians 2:21", note: "If righteousness were through the law, then Christ died for no purpose" },
          { ref: "Romans 6:23", note: "The wages of sin is death; the gift of God is eternal life" },
        ],
        relatedSlugs: ["how-can-i-be-saved", "why-you-need-jesus", "overcoming-sin"],
      },
      {
        slug: "why-god-seems-silent",
        title: "Why Does God Seem Silent?",
        subtitle: "He is not far. He is closer than your breath.",
        shortAnswer:
          "There are times God seems silent. Faithful believers across centuries — from Job to David to Habakkuk — have cried out in those seasons. The Bible does not deny them. But the silence is not absence. God has spoken in his Word. He has spoken finally in his Son. He is near to the brokenhearted. The silence is sometimes his refining; sometimes the noise of our own life; sometimes the mystery of his timing. Keep coming. He hears.",
        keyScriptures: [
          { ref: "Psalm 22:1-2", note: "My God, my God, why have you forsaken me?" },
          { ref: "Habakkuk 1:2-4", note: "How long, O Lord?" },
          { ref: "Hebrews 1:1-2", note: "He has spoken to us by his Son" },
          { ref: "Psalm 34:18", note: "The Lord is near to the brokenhearted" },
          { ref: "Isaiah 55:8-9", note: "My thoughts are not your thoughts" },
        ],
        relatedSlugs: ["doubt", "waiting-on-god", "prayer"],
      },
      {
        slug: "world-needs-most",
        title: "What Does the World Need Most?",
        subtitle: "Not what the world thinks it needs.",
        shortAnswer:
          "The world has plenty of theories about what it needs — more money, more education, more therapy, more politics, more technology. None of these are evil. None of these are enough. What the world needs most is what only Christ can give: forgiveness of sin, peace with God, healing of the heart, truth in confusion, hope in death, freedom from shame, power over sin, unity across peoples, and the promise of resurrection and new creation. The world needs Jesus.",
        keyScriptures: [
          { ref: "John 3:16-17", note: "God so loved the world that he gave his Son" },
          { ref: "Matthew 9:36-38", note: "He had compassion on them — they were like sheep without a shepherd" },
          { ref: "Habakkuk 2:14", note: "The earth shall be filled with the knowledge of the glory of the Lord" },
          { ref: "1 Timothy 1:15", note: "Christ Jesus came into the world to save sinners" },
          { ref: "Revelation 21:5", note: "Behold, I am making all things new" },
        ],
        relatedSlugs: ["what-the-world-needs", "purpose-of-life", "come-to-christ"],
      },
    ],
  },

  "word-prayer-and-power": {
    slug: "word-prayer-and-power",
    eyebrow: "Prayer",
    title: "Word, Prayer, and Power",
    description:
      "How to pray honestly. What biblical meditation means. Does God still heal? When the answer is no.",
    articles: [
      {
        slug: "does-god-answer-prayer",
        title: "Does God Really Answer Prayer?",
        subtitle: "Yes. Sometimes the way you asked. Sometimes a deeper way.",
        shortAnswer:
          "Scripture says God hears, and Scripture says God answers. But the answer is not always 'yes' the way we wanted. Sometimes it is 'yes.' Sometimes it is 'wait.' Sometimes it is 'no, because I am giving you something better.' God is not a vending machine. He is a Father — and a Father loves his children too much to grant every request that would harm them. Keep praying. He hears.",
        keyScriptures: [
          { ref: "1 John 5:14-15", note: "If we ask anything according to his will, he hears" },
          { ref: "Matthew 7:7-11", note: "Ask, and it will be given to you" },
          { ref: "2 Corinthians 12:7-9", note: "Three times I pleaded — my grace is sufficient" },
          { ref: "James 4:3", note: "You ask and do not receive, because you ask wrongly" },
          { ref: "Romans 8:26-27", note: "The Spirit himself intercedes for us" },
        ],
        relatedSlugs: ["how-do-we-pray", "when-god-says-no", "prayer-and-gods-will"],
      },
      {
        slug: "how-do-we-pray",
        title: "How Do We Pray?",
        subtitle: "The Lord's Prayer is the pattern.",
        shortAnswer:
          "Jesus' disciples asked him to teach them to pray. He gave them what we call the Lord's Prayer — not a magic formula, but a pattern. Address God as Father. Honor his name. Pray for his kingdom and will. Ask for daily bread, forgiveness, deliverance. Pray in Jesus' name. Pray with thanksgiving. Pray Scripture back to God. Be specific. Be honest. Keep going.",
        keyScriptures: [
          { ref: "Matthew 6:5-15", note: "The Lord's Prayer" },
          { ref: "Philippians 4:6-7", note: "By prayer and supplication with thanksgiving" },
          { ref: "1 Thessalonians 5:17", note: "Pray without ceasing" },
          { ref: "Hebrews 4:16", note: "Draw near with confidence to the throne of grace" },
          { ref: "John 14:13-14", note: "Whatever you ask in my name" },
        ],
        relatedSlugs: ["does-god-answer-prayer", "prayer-and-gods-will", "meditate-on-the-word"],
      },
      {
        slug: "prayer-and-gods-will",
        title: "How to Pray According to God's Will",
        subtitle: "Not naming and claiming. Aligning and asking.",
        shortAnswer:
          "Praying 'according to God's will' is not magic phrasing tacked onto the end of a request. It is the heart-orientation that says, 'Father, your will be done — not mine.' It is shaped by Scripture, conformed by the Spirit, and willing to bend to what is right rather than what is preferred. Even Jesus prayed that way in Gethsemane: 'Not my will, but yours.' That is the model.",
        keyScriptures: [
          { ref: "1 John 5:14-15", note: "If we ask anything according to his will" },
          { ref: "Matthew 26:39", note: "Not as I will, but as you will" },
          { ref: "Romans 12:1-2", note: "What is the will of God" },
          { ref: "Colossians 1:9-10", note: "Filled with the knowledge of his will" },
          { ref: "James 4:13-15", note: "If the Lord wills, we will live and do this or that" },
        ],
        relatedSlugs: ["how-do-we-pray", "when-god-says-no", "obeying-jesus"],
      },
      {
        slug: "when-god-says-no",
        title: "When God Says No",
        subtitle: "He may be saying yes to something deeper.",
        shortAnswer:
          "Paul pleaded three times for a 'thorn in the flesh' to be removed. God's answer was no — but the no came with something better: 'My grace is sufficient for you, for my power is made perfect in weakness.' Sometimes God's no is the door to the deeper yes: the yes of intimacy, of dependence, of glory we did not know we needed. The no is not the absence of God. It is sometimes the way he holds us.",
        keyScriptures: [
          { ref: "2 Corinthians 12:7-10", note: "My grace is sufficient for you" },
          { ref: "Matthew 26:39", note: "Let this cup pass from me — yet not as I will" },
          { ref: "Romans 8:28", note: "For those who love God all things work together for good" },
          { ref: "Isaiah 55:8-9", note: "My thoughts are not your thoughts" },
          { ref: "Hebrews 5:7-8", note: "He learned obedience through what he suffered" },
        ],
        relatedSlugs: ["does-god-answer-prayer", "waiting-on-god", "why-god-seems-silent"],
      },
      {
        slug: "meditate-on-the-word",
        title: "Meditate on the Word Day and Night",
        subtitle: "Not emptying. Filling.",
        shortAnswer:
          "Biblical meditation is not emptying your mind. It is filling it — with Scripture, slowly, repeatedly, prayerfully. To meditate on the Word day and night is to chew on a passage like an ox chewing its cud: returning to it, tasting it, working it down into your soul until it shapes how you think and how you live. The Word in your mouth. The Word in your heart.",
        keyScriptures: [
          { ref: "Joshua 1:8", note: "Meditate on it day and night" },
          { ref: "Psalm 1:1-3", note: "His delight is in the law of the Lord; on his law he meditates" },
          { ref: "Psalm 119:11", note: "Your word I have stored up in my heart" },
          { ref: "Colossians 3:16", note: "Let the word of Christ dwell in you richly" },
          { ref: "Deuteronomy 6:6-9", note: "These words shall be on your heart" },
        ],
        relatedSlugs: ["word-in-mouth-and-heart", "word-of-god", "how-do-we-pray"],
      },
      {
        slug: "word-in-mouth-and-heart",
        title: "The Word in Your Mouth and in Your Heart",
        subtitle: "Speak it. Hide it. Live by it.",
        shortAnswer:
          "The Bible repeatedly connects the Word in our mouth and the Word in our heart. We speak Scripture back to God. We speak it to ourselves. We hide it in our hearts so we will not sin against him. We don't 'name and claim' as if Scripture were a magic spell — we receive it, believe it, and let it shape both our speech and our trust.",
        keyScriptures: [
          { ref: "Deuteronomy 30:14", note: "The word is very near you, in your mouth and in your heart" },
          { ref: "Romans 10:8-10", note: "The word is near you, in your mouth and in your heart" },
          { ref: "Psalm 19:14", note: "Let the words of my mouth be acceptable in your sight" },
          { ref: "Psalm 119:11", note: "Your word I have stored up in my heart" },
          { ref: "Colossians 4:6", note: "Let your speech always be gracious, seasoned with salt" },
        ],
        relatedSlugs: ["meditate-on-the-word", "how-do-we-pray", "word-of-god"],
      },
      {
        slug: "does-god-still-heal",
        title: "Does God Still Heal Today?",
        subtitle: "Yes. Sometimes physically. Always ultimately.",
        shortAnswer:
          "God still heals. He heals through medicine and skilled doctors. He heals through direct, gracious intervention. He heals in answer to prayer. He also, in his wisdom, sometimes allows illness to continue — for purposes we do not always see in this life. But the final answer is not in this life. In Christ, every believer is promised a resurrected body, free of every sickness. Healing now is a foretaste. Healing then is the full meal.",
        keyScriptures: [
          { ref: "James 5:14-16", note: "Pray for one another, that you may be healed" },
          { ref: "Mark 1:40-42", note: "Jesus, moved with compassion, stretched out his hand and touched him" },
          { ref: "2 Corinthians 12:7-9", note: "Three times I pleaded — my grace is sufficient" },
          { ref: "Isaiah 53:5", note: "By his stripes we are healed" },
          { ref: "Revelation 21:4", note: "He will wipe away every tear, no more death or pain" },
        ],
        relatedSlugs: ["faith-healing-sovereignty", "pray-for-healing", "miracles"],
      },
      {
        slug: "faith-healing-sovereignty",
        title: "Faith, Healing, and the Sovereignty of God",
        subtitle: "God does not heal because we believe hard enough.",
        shortAnswer:
          "There is a counterfeit teaching that says if you just had enough faith, you would be healed. This is cruel and unscriptural. Faithful believers — Paul, Timothy, Trophimus, countless saints across centuries — have prayed for healing and not received it in this life. Their faith was not the problem. God is sovereign. He heals according to his wisdom and timing, not according to a formula. Faith does not coerce God. Faith trusts God.",
        keyScriptures: [
          { ref: "2 Corinthians 12:7-10", note: "Paul's thorn — God's answer was sufficient grace" },
          { ref: "1 Timothy 5:23", note: "Paul tells Timothy to take wine for his stomach" },
          { ref: "2 Timothy 4:20", note: "Trophimus I left ill at Miletus" },
          { ref: "Philippians 2:25-30", note: "Epaphroditus was indeed ill, near to death" },
          { ref: "Job 1-2", note: "Job's suffering was not because of his lack of faith" },
        ],
        relatedSlugs: ["does-god-still-heal", "why-do-i-suffer", "pain"],
      },
      {
        slug: "miracles",
        title: "Do Miracles Still Happen?",
        subtitle: "Yes — but not on demand.",
        shortAnswer:
          "Miracles still happen. God is still God; he has not retired. Across centuries and continents, there are well-documented cases of physical healing, deliverance, and providence that defy natural explanation. But miracles are not on demand, not a sign of superior faith, and not the heart of the Christian life. The heart of the Christian life is Christ — and the greatest miracle is the new birth of a sinner who was spiritually dead and is now alive in him.",
        keyScriptures: [
          { ref: "Acts 4:30", note: "Stretch out your hand to heal, and signs and wonders" },
          { ref: "John 11:43-44", note: "Lazarus, come out" },
          { ref: "Mark 16:17-18", note: "These signs will accompany those who believe" },
          { ref: "Hebrews 2:3-4", note: "God also bore witness by signs and wonders" },
          { ref: "John 14:11-12", note: "Believe me for the sake of the works themselves" },
        ],
        relatedSlugs: ["does-god-still-heal", "faith-healing-sovereignty", "born-again"],
      },
      {
        slug: "pray-for-healing",
        title: "Pray for Healing",
        subtitle: "Specific. Persistent. Submitted.",
        shortAnswer:
          "If you or someone you love is sick, pray. Pray specifically. Pray with elders if you can — James commands it. Pray repeatedly. Pray in faith. Pray with thanksgiving even before the answer comes. And pray with the same words Christ prayed: 'Your will be done.' Some prayers will be answered in this life. Others will be answered in the resurrection. Either way, your prayer was heard.",
        keyScriptures: [
          { ref: "James 5:14-16", note: "Is anyone among you sick? Let him call for the elders" },
          { ref: "Mark 11:24", note: "Whatever you ask in prayer, believe that you have received it" },
          { ref: "Philippians 4:6-7", note: "Make your requests known to God" },
          { ref: "Matthew 26:39", note: "If it is possible — yet not as I will" },
          { ref: "Romans 8:26-27", note: "The Spirit himself intercedes" },
        ],
        relatedSlugs: ["does-god-still-heal", "faith-healing-sovereignty", "how-do-we-pray"],
      },
    ],
  },

  // The remaining 8 hubs follow with progressive depth. Stubs are intentionally
  // substantial enough to be useful at launch; full body content is added over time.

  "following-jesus": {
    slug: "following-jesus",
    eyebrow: "Discipleship",
    title: "Following Jesus in Real Life",
    description: "Holiness, repentance, sexuality, money, work, family, anger, forgiveness, integrity.",
    articles: [
      {
        slug: "overcoming-sin",
        title: "Overcoming Sin",
        subtitle: "Not by trying harder. By dying and rising with Christ.",
        shortAnswer:
          "The Christian life is not 'try to be a better person.' It is daily putting to death the old self by the power of the Spirit, and putting on the new self created in Christ. Sin is fought — really fought — but not in your own strength. The flesh and the Spirit war in you. The Spirit wins as you abide in Christ, confess sin, walk in the light, and run from temptation.",
        keyScriptures: [
          { ref: "Romans 6:11-14", note: "Reckon yourselves dead to sin" },
          { ref: "Romans 8:13", note: "By the Spirit put to death the deeds of the body" },
          { ref: "Galatians 5:16-25", note: "Walk by the Spirit" },
          { ref: "1 John 1:7-9", note: "Walk in the light, confess our sins" },
          { ref: "Hebrews 12:1-2", note: "Lay aside every weight, run with endurance" },
        ],
        relatedSlugs: ["repentance", "holiness", "walking-by-the-spirit"],
      },
      {
        slug: "repentance",
        title: "Repentance",
        subtitle: "Turning from. Turning to.",
        shortAnswer:
          "Repentance is more than feeling bad. It is a change of mind that leads to a change of direction. You stop running from God and start running toward him. You stop excusing the sin and start naming it. You stop trying to manage it and start putting it to death. Repentance is the daily breath of a believer — not a one-time gate, but a lifelong posture.",
        keyScriptures: [
          { ref: "Acts 3:19", note: "Repent therefore, and turn back" },
          { ref: "2 Corinthians 7:10", note: "Godly grief produces a repentance that leads to salvation" },
          { ref: "Luke 15:17-21", note: "The prodigal comes to himself" },
          { ref: "Psalm 51", note: "A psalm of repentance" },
          { ref: "Revelation 2:5", note: "Repent and do the works you did at first" },
        ],
        relatedSlugs: ["overcoming-sin", "confession", "born-again"],
      },
      {
        slug: "holiness",
        title: "Holiness",
        subtitle: "Be holy, for I am holy.",
        shortAnswer:
          "Holiness is not an achievement; it is a calling. God has set us apart for himself, and now he calls us to live like the people we already are in Christ. Holiness is not perfection in this life. It is direction. It touches everything: thoughts, speech, sex, money, work, relationships, anger, ambition. The Spirit is the one who produces it. Our job is to abide, repent, and obey.",
        keyScriptures: [
          { ref: "1 Peter 1:14-16", note: "Be holy, for I am holy" },
          { ref: "Hebrews 12:14", note: "Pursue holiness, without which no one will see the Lord" },
          { ref: "1 Thessalonians 4:3-7", note: "This is the will of God, your sanctification" },
          { ref: "2 Corinthians 7:1", note: "Bringing holiness to completion in the fear of God" },
          { ref: "Romans 6:19-22", note: "The fruit you get leads to sanctification, and its end, eternal life" },
        ],
        relatedSlugs: ["walking-by-the-spirit", "overcoming-sin", "obeying-jesus"],
      },
      {
        slug: "marriage-and-sexuality",
        title: "Marriage and Sexuality",
        subtitle: "Designed by God, for his glory and human flourishing.",
        shortAnswer:
          "Marriage was designed by God in the beginning — a covenant between one man and one woman, a picture of Christ and the church, the only context for sexual union. Christianity does not invent these standards; it receives them from the Creator. The world's sexual confusion is real, and many people carry deep wounds from broken sexual stories. We speak truth, we extend mercy, we point to Christ. Whatever your past, Christ welcomes those who come — and he calls all who come into holiness.",
        keyScriptures: [
          { ref: "Genesis 2:18-25", note: "The two shall become one flesh" },
          { ref: "Matthew 19:4-6", note: "From the beginning he made them male and female" },
          { ref: "Ephesians 5:22-33", note: "Marriage as a picture of Christ and the church" },
          { ref: "1 Corinthians 6:9-11", note: "And such were some of you — washed, sanctified, justified" },
          { ref: "1 Thessalonians 4:3-7", note: "Abstain from sexual immorality" },
        ],
        relatedSlugs: ["holiness", "sexuality", "gender"],
      },
      {
        slug: "money-and-contentment",
        title: "Money and Contentment",
        subtitle: "Neither poverty nor riches. The Father's care.",
        shortAnswer:
          "Money is a tool, not a god. The Bible warns against the love of money (a root of all kinds of evil) and against trusting riches that fly away. It also warns against demanding wealth as a measure of God's favor. The way of contentment is gratitude, generosity, honest work, prayer for daily bread, and trusting the Father who feeds the birds.",
        keyScriptures: [
          { ref: "1 Timothy 6:6-10", note: "Godliness with contentment is great gain" },
          { ref: "Hebrews 13:5", note: "Keep your life free from love of money" },
          { ref: "Matthew 6:19-24", note: "You cannot serve God and money" },
          { ref: "Philippians 4:11-13", note: "I have learned, in whatever situation I am, to be content" },
          { ref: "Proverbs 30:8-9", note: "Give me neither poverty nor riches" },
        ],
        relatedSlugs: ["work", "no-money", "false-gospels"],
      },
      {
        slug: "forgiveness",
        title: "Forgiveness",
        subtitle: "What it is. What it isn't. How it's done.",
        shortAnswer:
          "Forgiveness is releasing the right to vengeance into God's hands. It is not pretending the wrong didn't happen. It is not always reconciliation. It is not 'getting over it.' It is the costly choice to extend the mercy you yourself have received from Christ. Sometimes it takes years. Sometimes it requires distance and wisdom for safety. But unforgiveness is a cage you build for yourself. Christ has the key.",
        keyScriptures: [
          { ref: "Matthew 18:21-35", note: "The unmerciful servant" },
          { ref: "Ephesians 4:31-32", note: "Forgive one another, as God in Christ forgave you" },
          { ref: "Colossians 3:13", note: "Bearing with one another, and forgiving each other" },
          { ref: "Luke 17:3-4", note: "Forgive him… even seven times in a day" },
          { ref: "Romans 12:17-21", note: "Vengeance is mine, says the Lord" },
        ],
        relatedSlugs: ["anger", "bitterness", "reconciliation"],
      },
    ],
  },

  "what-the-world-needs": {
    slug: "what-the-world-needs",
    eyebrow: "Mission",
    title: "What the World Needs",
    description: "One Savior. One kingdom. One mission. The hope of the nations.",
    articles: [
      {
        slug: "the-only-savior",
        title: "The Only Savior",
        subtitle: "There is salvation in no one else.",
        shortAnswer:
          "Christianity's exclusivity is news, not insult. If anyone else could save the world, the Father would not have sent the Son to die. Jesus is not one prophet among many, one teacher among many, one path among many. He is the eternal Son of God who bore the world's sin and rose to give the world life. There is no other name under heaven given among people by which we must be saved.",
        keyScriptures: [
          { ref: "Acts 4:12", note: "No other name under heaven" },
          { ref: "John 14:6", note: "I am the way, the truth, and the life" },
          { ref: "1 Timothy 2:5-6", note: "One mediator between God and man" },
          { ref: "Romans 10:9-13", note: "Whoever calls on the name of the Lord will be saved" },
          { ref: "John 3:36", note: "Whoever believes in the Son has eternal life" },
        ],
        relatedSlugs: ["why-jesus-and-not-another", "what-is-the-gospel", "come-to-christ"],
      },
      {
        slug: "kingdom-of-god",
        title: "The Kingdom of God",
        subtitle: "His reign breaking into our world.",
        shortAnswer:
          "The kingdom of God is the reign of God — the rule of his Christ, breaking into the world. Jesus announced it: 'The kingdom of God is at hand.' He demonstrated it in healing, deliverance, forgiveness, resurrection. He left his church to extend it through gospel proclamation and lives of love and obedience. The kingdom is already here in Christ, and not yet here in fullness — until he returns and the earth is filled with his glory.",
        keyScriptures: [
          { ref: "Mark 1:14-15", note: "The kingdom of God is at hand" },
          { ref: "Matthew 6:9-10", note: "Your kingdom come, your will be done" },
          { ref: "Luke 17:20-21", note: "The kingdom of God is in your midst" },
          { ref: "Romans 14:17", note: "The kingdom is righteousness, peace, and joy in the Holy Spirit" },
          { ref: "Revelation 11:15", note: "The kingdom of this world has become the kingdom of our Lord" },
        ],
        relatedSlugs: ["the-only-savior", "new-creation", "mission-of-the-church"],
      },
      {
        slug: "new-creation",
        title: "The New Creation",
        subtitle: "Behold, I am making all things new.",
        shortAnswer:
          "Christianity does not promise escape from this world. It promises the renewal of this world. The new creation is not somewhere else; it is here, made new. New heavens, new earth, no more death, no more grief, no more pain, no more separation, God dwelling with his people, the earth filled with his glory. This is the hope of the Christian — not disembodied souls forever, but resurrected bodies in a resurrected world.",
        keyScriptures: [
          { ref: "Revelation 21:1-5", note: "I saw a new heaven and a new earth" },
          { ref: "Romans 8:18-25", note: "Creation itself will be set free" },
          { ref: "2 Peter 3:13", note: "We are waiting for new heavens and a new earth" },
          { ref: "Isaiah 65:17-25", note: "I create new heavens and a new earth" },
          { ref: "2 Corinthians 5:17", note: "If anyone is in Christ, he is a new creation" },
        ],
        relatedSlugs: ["resurrection-of-the-body", "kingdom-of-god", "what-happens-when-i-die"],
      },
      {
        slug: "false-gospels",
        title: "False Gospels",
        subtitle: "Anything that adds to Christ subtracts from him.",
        shortAnswer:
          "Many things sound like the gospel but aren't. The prosperity gospel: God will make you rich and healthy if you have enough faith. The moralistic gospel: be a good person and God will accept you. The therapeutic gospel: God's main goal is your happiness. The political gospel: salvation comes through the right party. Each of these adds something to Christ — and anything added to Christ subtracts from him. The true gospel is Christ crucified and risen, received by faith alone.",
        keyScriptures: [
          { ref: "Galatians 1:6-9", note: "If anyone is preaching a different gospel — let him be accursed" },
          { ref: "2 Corinthians 11:3-4", note: "A different Jesus, a different spirit, a different gospel" },
          { ref: "1 Timothy 6:3-5", note: "Imagining that godliness is a means of gain" },
          { ref: "Matthew 7:21-23", note: "Not everyone who says 'Lord, Lord' will enter the kingdom" },
          { ref: "Jude 3-4", note: "Contend for the faith once for all delivered to the saints" },
        ],
        relatedSlugs: ["what-is-the-gospel", "the-only-savior", "discernment"],
      },
      {
        slug: "hope-of-the-nations",
        title: "The Hope of the Nations",
        subtitle: "Every tribe, tongue, and people.",
        shortAnswer:
          "From the beginning, God's plan has reached to every nation. Abraham was blessed so that in him all the families of the earth would be blessed. Israel was chosen for the nations, not against them. Christ died for sinners from every people. The church gathers, by the Spirit, a multitude no one can number from every nation, tribe, people, and tongue. The earth shall be filled with the knowledge of the glory of the Lord. This is not optional. This is the plan.",
        keyScriptures: [
          { ref: "Genesis 12:1-3", note: "In you all the families of the earth shall be blessed" },
          { ref: "Habakkuk 2:14", note: "The earth shall be filled with the knowledge of the glory of the Lord" },
          { ref: "Matthew 28:18-20", note: "Make disciples of all nations" },
          { ref: "Revelation 5:9-10", note: "A people for God from every tribe, language, people, and nation" },
          { ref: "Romans 10:13-15", note: "How will they hear without someone preaching?" },
        ],
        relatedSlugs: ["nations-blessed-in-abraham", "mission-of-the-church", "earth-filled-with-his-glory"],
      },
    ],
  },

  "nations-unity-and-glory": {
    slug: "nations-unity-and-glory",
    eyebrow: "Glory",
    title: "Nations, Unity, and Glory",
    description: "One new people in Christ. Different peoples, one Lord. The earth filled with his glory.",
    articles: [
      {
        slug: "one-new-people-in-christ",
        title: "One New People in Christ",
        subtitle: "Jew and Gentile. Every people. One Lord.",
        shortAnswer:
          "The cross did not just save individuals. It tore down the wall of hostility between Jew and Gentile and created one new humanity in Christ. Every divided people group — by ethnicity, language, culture, class — is reconciled at the foot of the cross. We are still distinct; we are no longer divided. This is not a slogan. It is the heartbeat of Christian community.",
        keyScriptures: [
          { ref: "Ephesians 2:14-19", note: "He himself is our peace, who has made us both one" },
          { ref: "Galatians 3:26-29", note: "No longer Jew nor Greek, slave nor free, male nor female — all one in Christ" },
          { ref: "Colossians 3:11", note: "Christ is all, and in all" },
          { ref: "Revelation 7:9-10", note: "A great multitude from every nation, tribe, people, and language" },
          { ref: "John 17:20-23", note: "That they may all be one" },
        ],
        relatedSlugs: ["racism-and-the-gospel", "unity-of-the-spirit", "body-of-christ"],
      },
      {
        slug: "racism-and-the-gospel",
        title: "Racism and the Gospel",
        subtitle: "Every human being made in the image of God.",
        shortAnswer:
          "Racism is sin. Every human being is made in the image of God and worthy of dignity, honor, and love. The cross of Christ — which reconciles God's enemies to himself — also reconciles human enemies to one another. The early church scandalously welcomed slave and free, rich and poor, Jew and Gentile to the same table. We are called to the same scandal today. Where the world divides, Christ unites.",
        keyScriptures: [
          { ref: "Genesis 1:27", note: "Made in the image of God" },
          { ref: "Acts 10:34-35", note: "God shows no partiality" },
          { ref: "Acts 17:26-27", note: "From one man he made every nation" },
          { ref: "James 2:1-9", note: "Show no partiality" },
          { ref: "Galatians 3:28", note: "No longer Jew nor Greek" },
        ],
        relatedSlugs: ["one-new-people-in-christ", "love-your-neighbor", "love-your-enemies"],
      },
      {
        slug: "unity-of-the-spirit",
        title: "Unity of the Spirit",
        subtitle: "Already given. To be guarded.",
        shortAnswer:
          "The unity of believers is not something we manufacture. It is something the Spirit has already given — to be guarded with humility, gentleness, patience, and love. The early church battled disunity at every turn (between Jew and Gentile, rich and poor, weak and strong). The answer was always the same: remember the gospel, bear with one another, forgive as Christ forgave you.",
        keyScriptures: [
          { ref: "Ephesians 4:1-6", note: "Eager to maintain the unity of the Spirit in the bond of peace" },
          { ref: "Philippians 2:1-4", note: "Same mind, same love, full accord and one mind" },
          { ref: "Romans 15:5-7", note: "Welcome one another as Christ has welcomed you" },
          { ref: "John 17:20-23", note: "That they may all be one" },
          { ref: "Colossians 3:12-14", note: "Above all these put on love" },
        ],
        relatedSlugs: ["one-new-people-in-christ", "racism-and-the-gospel", "love-your-neighbor"],
      },
      {
        slug: "earth-filled-with-his-glory",
        title: "The Earth Filled With His Glory",
        subtitle: "The promise we live by.",
        shortAnswer:
          "Twice the Old Testament declares it. Habakkuk: 'The earth shall be filled with the knowledge of the glory of the Lord, as the waters cover the sea.' Psalm 72: 'May the whole earth be filled with his glory.' This is the promise that frames every Christian's life. The earth is going to be filled. Not might be. Will be. Our work, prayer, witness, suffering, mission — they are all part of the work God is doing to bring this about. The end is glory, everywhere.",
        keyScriptures: [
          { ref: "Habakkuk 2:14", note: "The earth shall be filled with the knowledge of the glory of the Lord" },
          { ref: "Psalm 72:19", note: "May the whole earth be filled with his glory" },
          { ref: "Numbers 14:21", note: "Truly, as I live, the whole earth shall be filled with the glory of the Lord" },
          { ref: "Isaiah 11:9", note: "The earth shall be full of the knowledge of the Lord" },
          { ref: "Revelation 21:23", note: "The glory of God gives it light" },
        ],
        relatedSlugs: ["hope-of-the-nations", "kingdom-of-god", "new-creation"],
      },
    ],
  },

  apologetics: {
    slug: "apologetics",
    eyebrow: "Defense",
    title: "Apologetics and Hard Questions",
    description:
      "Defending the faith firmly and charitably. We compare doctrines — we never insult persons.",
    articles: [
      {
        slug: "why-trust-the-bible",
        title: "Why Trust the Bible?",
        subtitle: "Documents, manuscripts, eyewitnesses, transformed lives.",
        shortAnswer:
          "The Bible is the best-attested ancient document in human history. Thousands of manuscript copies in original languages, dating to within a generation of the originals. Internal consistency across 66 books, 40 authors, 1,500 years. Eyewitness testimony for the New Testament events. Confirmation by archaeology, history, and the transformed lives of those who first claimed to see the risen Christ. We don't trust the Bible blindly. We trust it because it has earned trust.",
        keyScriptures: [
          { ref: "2 Timothy 3:16-17", note: "All Scripture is breathed out by God" },
          { ref: "2 Peter 1:16-21", note: "We did not follow cleverly devised myths" },
          { ref: "Luke 1:1-4", note: "Carefully investigated everything from the beginning" },
          { ref: "1 John 1:1-3", note: "That which we have seen with our eyes, looked upon, touched" },
          { ref: "Isaiah 40:8", note: "The grass withers, the flower fades, but the word of our God will stand forever" },
        ],
        relatedSlugs: ["bible-corrupted", "did-jesus-rise", "word-of-god"],
      },
      {
        slug: "bible-corrupted",
        title: "Is the Bible Corrupted?",
        subtitle: "No. The textual evidence is overwhelming.",
        shortAnswer:
          "A common claim is that the Bible has been changed so many times we cannot know what it originally said. The textual evidence says otherwise. We have over 5,800 Greek manuscripts of the New Testament alone, plus thousands more in Latin, Syriac, Coptic, and other languages, dating from as early as the 2nd century. The vast majority of variants are spelling, word order, or copying mistakes that don't affect meaning. No major Christian doctrine rests on a disputed text. We have what they wrote.",
        keyScriptures: [
          { ref: "Isaiah 40:8", note: "The word of our God will stand forever" },
          { ref: "Matthew 24:35", note: "My words will not pass away" },
          { ref: "Psalm 119:89", note: "Forever, O Lord, your word is firmly fixed in the heavens" },
          { ref: "1 Peter 1:24-25", note: "The word of the Lord remains forever" },
          { ref: "2 Timothy 3:16", note: "All Scripture is breathed out by God" },
        ],
        relatedSlugs: ["why-trust-the-bible", "did-jesus-rise", "is-christianity-true"],
      },
      {
        slug: "christianity-and-islam",
        title: "Christianity and Islam",
        subtitle: "Comparing doctrines truthfully and respectfully.",
        shortAnswer:
          "Christians and Muslims share some common ground: belief in one God, in his sovereignty, in his moral law, in the importance of prayer and submission. We share many of the prophets. We share many ethical concerns. But we differ — fundamentally — on the deepest question of all: Who is Jesus? Christianity confesses that Jesus is the eternal Son of God, who died for our sins and rose again. Islam denies both the cross and the resurrection. This is not a small difference. This is the heart of Christian hope. We discuss with our Muslim neighbors with respect, with honesty, with love — and without softening the gospel.",
        keyScriptures: [
          { ref: "John 1:1-14", note: "The Word was God — and the Word became flesh" },
          { ref: "John 14:6", note: "I am the way, the truth, and the life" },
          { ref: "1 Corinthians 15:3-4", note: "Christ died for our sins and was raised on the third day" },
          { ref: "1 John 4:2-3", note: "Every spirit that confesses that Jesus has come in the flesh is from God" },
          { ref: "Acts 4:12", note: "There is no other name under heaven by which we must be saved" },
        ],
        relatedSlugs: ["why-jesus-and-not-another", "deity-of-christ", "did-jesus-rise"],
      },
      {
        slug: "trinity-objections",
        title: "Trinity Objections",
        subtitle: "Mystery, not contradiction.",
        shortAnswer:
          "Critics sometimes say the Trinity is illogical: 'You can't be one and three at the same time.' But the church never said God is one and three in the same sense. He is one in essence, three in persons. That is not contradiction; that is distinction. Critics also say the word 'Trinity' isn't in the Bible. True — but the teaching is everywhere: in the deity of the Father, the deity of the Son, the deity of the Spirit, and the affirmation that God is one. The Trinity is the church's name for what Scripture has always said.",
        keyScriptures: [
          { ref: "Matthew 28:19", note: "In the name of the Father, Son, and Holy Spirit" },
          { ref: "John 1:1-14", note: "The Word was with God, and the Word was God" },
          { ref: "2 Corinthians 13:14", note: "Grace, love, and fellowship — Trinitarian benediction" },
          { ref: "Deuteronomy 6:4", note: "The Lord our God, the Lord is one" },
          { ref: "John 10:30", note: "I and the Father are one" },
        ],
        relatedSlugs: ["triune-god", "father-son-spirit", "deity-of-christ"],
      },
      {
        slug: "atheism",
        title: "Atheism and Unbelief",
        subtitle: "Honest conversation with honest doubters.",
        shortAnswer:
          "Atheism is not one position; it is many. Some atheists deny God because the evidence does not yet persuade them. Some because of moral or emotional injury — God seems unjust, the church has wounded them, they cannot reconcile a good God with suffering. We don't insult atheists. We don't bluff. We listen, we ask honest questions back, we look at the resurrection, we point to the moral law written on every conscience, and we trust the Spirit to bring sight where there is blindness. Many of the church's greatest saints were once committed atheists.",
        keyScriptures: [
          { ref: "Psalm 14:1", note: "The fool says in his heart, 'There is no God'" },
          { ref: "Romans 1:18-21", note: "What can be known about God is plain to them" },
          { ref: "Romans 2:14-15", note: "The law written on their hearts" },
          { ref: "1 Peter 3:15", note: "Always be prepared to give a defense, with gentleness and respect" },
          { ref: "Acts 17:22-31", note: "Paul at Mars Hill" },
        ],
        relatedSlugs: ["is-christianity-true", "science-and-faith", "suffering-and-god"],
      },
      {
        slug: "science-and-faith",
        title: "Science and Faith",
        subtitle: "No war. Different questions.",
        shortAnswer:
          "Science is excellent at how. Christianity is concerned with why. Science describes the mechanism; Christianity describes the meaning. The supposed war between science and faith is largely manufactured. Most of the founders of modern science were Christians — Newton, Boyle, Kepler, Pascal, Faraday. The Christian view of a rational, ordered universe made by a rational God is what made modern science thinkable. Christians can hold a range of views on age of the earth and process of creation, but we do not pit Scripture against the evidence of the world God himself made.",
        keyScriptures: [
          { ref: "Psalm 19:1-4", note: "The heavens declare the glory of God" },
          { ref: "Romans 1:20", note: "His invisible attributes have been clearly perceived in the things made" },
          { ref: "Colossians 1:16-17", note: "In him all things hold together" },
          { ref: "Proverbs 25:2", note: "It is the glory of God to conceal things, the glory of kings to search them out" },
          { ref: "Job 38-41", note: "Where were you when I laid the foundation of the earth?" },
        ],
        relatedSlugs: ["atheism", "is-christianity-true", "who-is-god"],
      },
      {
        slug: "suffering-and-god",
        title: "Suffering and the Goodness of God",
        subtitle: "Christ entered it. He did not run from it.",
        shortAnswer:
          "The problem of suffering is real, and Christianity does not dodge it. But unlike most worldviews, Christianity does not just explain suffering — it enters it. God himself came in Christ. He was rejected, wounded, betrayed, executed. He knows suffering from the inside. He did not stay above it. And in his resurrection, he announced that suffering is not the final word. Death is not the final word. He is making all things new. Until then, his grace is sufficient. His presence is real. His promises hold.",
        keyScriptures: [
          { ref: "Isaiah 53", note: "A man of sorrows, acquainted with grief" },
          { ref: "Hebrews 4:15-16", note: "Sympathetic high priest" },
          { ref: "Romans 8:18-39", note: "Present sufferings, future glory, nothing can separate us" },
          { ref: "John 11:33-35", note: "Jesus wept" },
          { ref: "Revelation 21:4", note: "He will wipe away every tear" },
        ],
        relatedSlugs: ["why-evil", "why-do-i-suffer", "pain"],
      },
    ],
  },

  "worship-love-and-obedience": {
    slug: "worship-love-and-obedience",
    eyebrow: "Heart",
    title: "Worship, Love, and Obedience",
    description: "True worship. Love God. Love your neighbor. Love your enemies. Abide in Christ.",
    articles: [
      {
        slug: "love-god",
        title: "Love the Lord Your God",
        subtitle: "The first and greatest commandment.",
        shortAnswer:
          "Jesus said the first and greatest commandment is to love the Lord your God with all your heart, soul, mind, and strength. This is not a vague feeling. It is the whole-life response of a person who has been loved first. We love because he first loved us. Love for God is shown in obedience, worship, trust, prayer, and a longing to know him better.",
        keyScriptures: [
          { ref: "Mark 12:28-30", note: "Love the Lord your God with all your heart, soul, mind, and strength" },
          { ref: "Deuteronomy 6:4-5", note: "The Shema" },
          { ref: "1 John 4:19", note: "We love because he first loved us" },
          { ref: "John 14:15", note: "If you love me, you will keep my commandments" },
          { ref: "Psalm 27:4", note: "One thing have I asked — to dwell in the house of the Lord" },
        ],
        relatedSlugs: ["love-your-neighbor", "obeying-jesus", "true-worship"],
      },
      {
        slug: "love-your-neighbor",
        title: "Love Your Neighbor",
        subtitle: "The second commandment, like the first.",
        shortAnswer:
          "After loving God, Jesus said, comes loving your neighbor as yourself. Not just the neighbor who is convenient. Not just the neighbor who shares your background. The Samaritan is your neighbor. The hostile co-worker is your neighbor. The poor, the immigrant, the broken person down the street is your neighbor. Love is not a feeling here; it is action — costly, practical, persistent action shaped by Christ.",
        keyScriptures: [
          { ref: "Mark 12:31", note: "The second is this: Love your neighbor as yourself" },
          { ref: "Luke 10:25-37", note: "The good Samaritan" },
          { ref: "1 John 3:17-18", note: "Love in deed and truth, not just words" },
          { ref: "James 2:8-9", note: "If you really fulfill the royal law, you do well" },
          { ref: "Galatians 5:13-14", note: "Through love serve one another" },
        ],
        relatedSlugs: ["love-god", "love-your-enemies", "love-in-deed"],
      },
      {
        slug: "love-your-enemies",
        title: "Love Your Enemies",
        subtitle: "Jesus' third hard command.",
        shortAnswer:
          "Loving your friends is easy. Even pagans do that. What sets Christ's disciples apart is loving enemies — praying for those who persecute, doing good to those who hate, forgiving those who wound. This is the love of the cross. Jesus prayed for his executioners while he was being executed. Stephen did the same. We do the same — not because the wrong didn't matter, but because we have been loved by an enemy-loving God.",
        keyScriptures: [
          { ref: "Matthew 5:43-48", note: "Love your enemies and pray for those who persecute you" },
          { ref: "Luke 23:34", note: "Father, forgive them, for they know not what they do" },
          { ref: "Acts 7:60", note: "Lord, do not hold this sin against them — Stephen at his stoning" },
          { ref: "Romans 5:10", note: "While we were enemies we were reconciled to God" },
          { ref: "Romans 12:19-21", note: "Overcome evil with good" },
        ],
        relatedSlugs: ["love-your-neighbor", "forgiveness", "anger"],
      },
      {
        slug: "abide-in-christ",
        title: "Abide in Christ",
        subtitle: "The Christian life is connection, not effort.",
        shortAnswer:
          "Jesus said, 'Abide in me, and I in you. As the branch cannot bear fruit by itself unless it abides in the vine, neither can you, unless you abide in me.' The Christian life is not 'try harder.' It is 'stay connected.' Abiding looks like: praying, reading the Word, listening to the Spirit, walking with believers, confessing sin, returning. Fruit grows by connection. Without him, we can do nothing.",
        keyScriptures: [
          { ref: "John 15:1-11", note: "Abide in me and I in you" },
          { ref: "1 John 2:6", note: "Whoever says he abides in him ought to walk in the same way he walked" },
          { ref: "1 John 4:13", note: "By this we know that we abide in him — he has given us of his Spirit" },
          { ref: "Colossians 2:6-7", note: "As you received Christ Jesus, so walk in him, rooted and built up" },
          { ref: "Psalm 27:4", note: "To dwell in the house of the Lord all the days of my life" },
        ],
        relatedSlugs: ["walking-by-the-spirit", "fruit-of-the-spirit", "obeying-jesus"],
      },
    ],
  },

  "church-and-discipleship": {
    slug: "church-and-discipleship",
    eyebrow: "Church",
    title: "The Church and Discipleship",
    description: "What the church is. Why local church matters. Baptism. Communion. Gifts. Membership.",
    articles: [
      {
        slug: "what-is-the-church",
        title: "What Is the Church?",
        subtitle: "The body of Christ. Not a building.",
        shortAnswer:
          "The church is not a building, an organization, a brand, or a Sunday service. The church is the people of God — all those, in every place and every century, who have been called out of the world and into Christ. We are his body. He is our head. The church is universal — across time and place — and local — visible in the gathered community of believers under faithful leadership.",
        keyScriptures: [
          { ref: "Ephesians 1:22-23", note: "The church, which is his body" },
          { ref: "1 Corinthians 12:12-27", note: "We are the body of Christ" },
          { ref: "Matthew 16:18", note: "I will build my church" },
          { ref: "Acts 2:41-47", note: "The early church together" },
          { ref: "Hebrews 10:24-25", note: "Do not give up meeting together" },
        ],
        relatedSlugs: ["body-of-christ", "local-church-matters", "membership"],
      },
      {
        slug: "local-church-matters",
        title: "Why Local Church Matters",
        subtitle: "The New Testament knows nothing of disembodied Christians.",
        shortAnswer:
          "The New Testament knows nothing of disembodied Christians — believers who follow Christ alone without a community of other believers. Every command of Christ assumes a body. Baptism. Communion. Mutual love. Confession. Discipline. Accountability. Worship. Prayer. Christ has not asked you to go it alone. He has put you in a family. A faithful local church is not optional for a healthy Christian life. It is the normal context for one.",
        keyScriptures: [
          { ref: "Hebrews 10:24-25", note: "Stir up one another to love and good works" },
          { ref: "Acts 2:42-47", note: "Devoted to the apostles' teaching, fellowship, breaking of bread, prayers" },
          { ref: "1 Corinthians 12:12-27", note: "Many members, one body" },
          { ref: "Ephesians 4:11-16", note: "Each member working properly, body grows" },
          { ref: "Matthew 18:15-20", note: "Where two or three are gathered in my name" },
        ],
        relatedSlugs: ["what-is-the-church", "body-of-christ", "membership"],
      },
      {
        slug: "communion",
        title: "Communion / The Lord's Supper",
        subtitle: "Bread, cup, remembering, anticipating.",
        shortAnswer:
          "On the night he was betrayed, Jesus took bread and cup and gave them to his disciples — saying 'This is my body, broken for you' and 'This is my blood, poured out for you.' He commanded believers to share this meal in remembrance of him until he comes. Christians have differed on what exactly happens at the table (memorial, spiritual presence, real presence). We teach what Scripture says, name the historic positions charitably, and call every believer to come to the table with reverence and joy.",
        keyScriptures: [
          { ref: "1 Corinthians 11:23-29", note: "Do this in remembrance of me" },
          { ref: "Luke 22:19-20", note: "This is my body — this is the new covenant in my blood" },
          { ref: "John 6:53-58", note: "Whoever feeds on my flesh has eternal life" },
          { ref: "Acts 2:42", note: "Devoted to the breaking of bread" },
          { ref: "1 Corinthians 10:16-17", note: "The cup of blessing… the bread we break" },
        ],
        relatedSlugs: ["baptism", "what-is-the-church", "local-church-matters"],
      },
    ],
  },

  "hope-for-the-human-heart": {
    slug: "hope-for-the-human-heart",
    eyebrow: "Soul care",
    title: "Hope for the Human Heart",
    description:
      "Biblical help for grief, fear, loneliness, doubt, death, shame, confession, anxiety, family pain, hopelessness.",
    articles: [
      {
        slug: "where-god-meets-pain",
        title: "Where God Meets You in Pain",
        subtitle: "Closer than your breath.",
        shortAnswer:
          "God is not far from you in your pain. He has not abandoned you. He has not moved on. He is near to the brokenhearted. Christ himself entered the worst of human pain — rejection, betrayal, torture, death — and rose to show that pain does not have the final word. Whatever you are carrying, bring it to him as it is. He has carried worse, for you.",
        keyScriptures: [
          { ref: "Psalm 34:18", note: "The Lord is near to the brokenhearted" },
          { ref: "Isaiah 53:3-5", note: "A man of sorrows, acquainted with grief" },
          { ref: "Hebrews 4:14-16", note: "A sympathetic high priest" },
          { ref: "Matthew 11:28-30", note: "Come to me, all who labor and are heavy laden" },
          { ref: "Revelation 21:4", note: "He will wipe away every tear" },
        ],
        relatedSlugs: ["help-grief", "help-fear", "help-pain"],
      },
      {
        slug: "what-people-need-map",
        title: "What People Need — Gospel Answers Map",
        subtitle: "Every human need has a biblical answer.",
        shortAnswer:
          "Grief — Christ is the resurrection and the life. Fear — God is with us; Christ gives peace. Death — Jesus conquered death. Loneliness — God draws near and brings us into his family. Doubt — bring doubt to Christ; look again at him. Shame — no condemnation in Christ. Guilt — confess and receive forgiveness. Anxiety — cast your cares on the Father. Despair — hope in the God who raises the dead. Regret — Christ restores and makes new. Bitterness — forgive as God forgave you. Waiting — trust God's timing. Injustice — God will judge and make all things right. Weakness — his grace is sufficient. Lost faith — return to Christ, the author and finisher of faith.",
        keyScriptures: [
          { ref: "Matthew 11:28-30", note: "Come to me, all who labor" },
          { ref: "John 14:1-3", note: "Let not your hearts be troubled" },
          { ref: "Romans 8:31-39", note: "Nothing separates us from God's love in Christ" },
          { ref: "2 Corinthians 4:16-18", note: "Inner self is being renewed day by day" },
          { ref: "Psalm 23", note: "I will fear no evil" },
        ],
        relatedSlugs: ["where-god-meets-pain", "help-grief", "help-fear"],
      },
    ],
  },
};

export const HUB_SLUGS = Object.keys(HUBS);

export function getHub(slug: string): Hub | null {
  return HUBS[slug] ?? null;
}

export function getArticle(hubSlug: string, articleSlug: string): { hub: Hub; article: Article } | null {
  const hub = getHub(hubSlug);
  if (!hub) return null;
  const article = hub.articles.find((a) => a.slug === articleSlug);
  if (!article) return null;
  return { hub, article };
}
