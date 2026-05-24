/**
 * 30-day new believer curriculum.
 *
 * Days 1-7: Gospel of John
 * Days 8-14: Basic prayer + faith essentials
 * Days 15-21: Who Christ is (Christology)
 * Days 22-30: Belonging to the church
 */
export type CurriculumDay = {
  day: number;
  theme: string;
  scriptureRef: string;
  readingPlan: string;
  prayerPrompt: string;
  reflectionQuestion: string;
};

export const NEW_BELIEVER_CURRICULUM: readonly CurriculumDay[] = [
  // Days 1-7 — Gospel of John
  { day: 1, theme: "In the beginning was the Word", scriptureRef: "John 1:1-18", readingPlan: "Read John 1", prayerPrompt: "Thank God for sending His Son.", reflectionQuestion: "What does it mean that 'the Word became flesh'?" },
  { day: 2, theme: "Behold, the Lamb of God", scriptureRef: "John 1:29-51", readingPlan: "Read John 1:29-51 again and John 2", prayerPrompt: "Ask Jesus to teach you how to follow him.", reflectionQuestion: "What did the first disciples notice about Jesus?" },
  { day: 3, theme: "You must be born again", scriptureRef: "John 3:1-21", readingPlan: "Read John 3", prayerPrompt: "Ask God to give you new life.", reflectionQuestion: "Why did Jesus say Nicodemus needed to be born again?" },
  { day: 4, theme: "Living water", scriptureRef: "John 4:1-26", readingPlan: "Read John 4", prayerPrompt: "Ask Jesus to satisfy your deepest thirst.", reflectionQuestion: "What did Jesus offer the woman at the well?" },
  { day: 5, theme: "I am the bread of life", scriptureRef: "John 6:25-40", readingPlan: "Read John 6", prayerPrompt: "Tell Jesus you want him as your daily bread.", reflectionQuestion: "What does it mean to come to Jesus and never hunger?" },
  { day: 6, theme: "I am the good shepherd", scriptureRef: "John 10:1-18", readingPlan: "Read John 10", prayerPrompt: "Thank the Shepherd for laying down his life for you.", reflectionQuestion: "Why is Jesus called the good shepherd?" },
  { day: 7, theme: "I am the resurrection and the life", scriptureRef: "John 11:17-44", readingPlan: "Read John 11", prayerPrompt: "Bring your grief to Jesus, who wept with Mary and Martha.", reflectionQuestion: "How does Jesus' raising of Lazarus point to his own resurrection?" },
  // Days 8-14 — Prayer + faith essentials
  { day: 8, theme: "How to pray", scriptureRef: "Matthew 6:5-15", readingPlan: "Read Matthew 6 and pray the Lord's Prayer slowly", prayerPrompt: "Pray the Lord's Prayer phrase by phrase.", reflectionQuestion: "Which phrase of the Lord's Prayer feels most personal today?" },
  { day: 9, theme: "Faith is", scriptureRef: "Hebrews 11:1-6", readingPlan: "Read Hebrews 11", prayerPrompt: "Ask God to grow your faith.", reflectionQuestion: "What does it mean to please God by faith?" },
  { day: 10, theme: "Repentance", scriptureRef: "Acts 3:17-26", readingPlan: "Read Psalm 51", prayerPrompt: "Confess specifically and receive forgiveness.", reflectionQuestion: "What does turning away from sin look like in your life?" },
  { day: 11, theme: "Forgiveness", scriptureRef: "1 John 1:5-2:2", readingPlan: "Read 1 John 1-2", prayerPrompt: "Bring your hidden things into the light.", reflectionQuestion: "Why does God's forgiveness depend on Christ's blood, not your performance?" },
  { day: 12, theme: "The Bible", scriptureRef: "2 Timothy 3:14-17", readingPlan: "Read 2 Timothy 3", prayerPrompt: "Ask God to make Scripture come alive to you.", reflectionQuestion: "How is Scripture useful for teaching, correction, and training?" },
  { day: 13, theme: "Trusting in hard times", scriptureRef: "Romans 8:28-39", readingPlan: "Read Romans 8", prayerPrompt: "Tell God where you are afraid; ask for his peace.", reflectionQuestion: "What can separate you from God's love in Christ?" },
  { day: 14, theme: "The Holy Spirit", scriptureRef: "John 14:15-27", readingPlan: "Read John 14-16", prayerPrompt: "Ask the Spirit to fill you and guide you.", reflectionQuestion: "What does Jesus promise about the Helper?" },
  // Days 15-21 — Who Christ is
  { day: 15, theme: "The image of the invisible God", scriptureRef: "Colossians 1:15-20", readingPlan: "Read Colossians 1", prayerPrompt: "Worship Jesus as the one in whom all the fullness of God dwells.", reflectionQuestion: "What does Paul say all things were created through?" },
  { day: 16, theme: "Christ in you, the hope of glory", scriptureRef: "Colossians 1:24-29", readingPlan: "Read Colossians 1-2", prayerPrompt: "Thank Christ that he lives in you by the Spirit.", reflectionQuestion: "What is the mystery Paul says has now been revealed?" },
  { day: 17, theme: "The exact representation", scriptureRef: "Hebrews 1:1-3", readingPlan: "Read Hebrews 1-2", prayerPrompt: "Ask God to help you see Jesus as he truly is.", reflectionQuestion: "Why does Hebrews say Jesus is greater than the angels?" },
  { day: 18, theme: "He humbled himself", scriptureRef: "Philippians 2:5-11", readingPlan: "Read Philippians 2", prayerPrompt: "Ask for the same humble mind as Christ.", reflectionQuestion: "What does it mean that every knee will bow?" },
  { day: 19, theme: "Lamb that was slain", scriptureRef: "Revelation 5:1-14", readingPlan: "Read Revelation 5", prayerPrompt: "Join the song: Worthy is the Lamb.", reflectionQuestion: "Why is the Lamb worthy?" },
  { day: 20, theme: "He is risen", scriptureRef: "1 Corinthians 15:1-28", readingPlan: "Read 1 Corinthians 15", prayerPrompt: "Thank Christ that death is defeated.", reflectionQuestion: "Why is the resurrection central to the gospel?" },
  { day: 21, theme: "The same yesterday, today, forever", scriptureRef: "Hebrews 13:5-8", readingPlan: "Read Hebrews 13", prayerPrompt: "Cast every fear on the one who does not change.", reflectionQuestion: "How does Jesus' unchanging nature give you stability?" },
  // Days 22-30 — Belonging to the church
  { day: 22, theme: "You are not alone", scriptureRef: "Hebrews 10:19-25", readingPlan: "Read Hebrews 10", prayerPrompt: "Ask God to lead you to a faithful local church.", reflectionQuestion: "Why does Hebrews tell believers not to give up meeting together?" },
  { day: 23, theme: "Baptism", scriptureRef: "Romans 6:1-14", readingPlan: "Read Romans 6 and Matthew 28:18-20", prayerPrompt: "Ask God if it is time for you to be baptized — talk to a pastor.", reflectionQuestion: "What does baptism picture about Christ and about you?" },
  { day: 24, theme: "The Lord's Supper", scriptureRef: "1 Corinthians 11:23-34", readingPlan: "Read 1 Corinthians 11", prayerPrompt: "Examine your heart; come to the table with gratitude.", reflectionQuestion: "What does the bread and the cup mean?" },
  { day: 25, theme: "Many members, one body", scriptureRef: "1 Corinthians 12:12-27", readingPlan: "Read 1 Corinthians 12", prayerPrompt: "Ask God how you are meant to serve.", reflectionQuestion: "Why does the body need every member?" },
  { day: 26, theme: "Spiritual gifts", scriptureRef: "Romans 12:1-8", readingPlan: "Read Romans 12", prayerPrompt: "Offer yourself as a living sacrifice.", reflectionQuestion: "What gifts has God given you to serve the body?" },
  { day: 27, theme: "Loving one another", scriptureRef: "John 13:34-35", readingPlan: "Read John 13", prayerPrompt: "Ask God to grow your love for fellow believers.", reflectionQuestion: "What does Christ's love look like in practice?" },
  { day: 28, theme: "Sharing the gospel", scriptureRef: "Acts 1:6-11", readingPlan: "Read Acts 1-2", prayerPrompt: "Ask the Spirit for boldness and one person to share with.", reflectionQuestion: "Who has the Spirit put on your heart to tell?" },
  { day: 29, theme: "Standing firm", scriptureRef: "Ephesians 6:10-20", readingPlan: "Read Ephesians 6", prayerPrompt: "Put on the armor of God in prayer.", reflectionQuestion: "Which piece of armor do you most need today?" },
  { day: 30, theme: "Filling the earth", scriptureRef: "Habakkuk 2:14", readingPlan: "Read Revelation 7:9-12 and Habakkuk 2", prayerPrompt: "Pray for the earth to be filled with the knowledge of the glory of the Lord.", reflectionQuestion: "What is one thing you will keep practicing after day 30?" },
];
