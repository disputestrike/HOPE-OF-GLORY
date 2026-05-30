/**
 * The 30-Day Hope for the Hurting Heart — a rescue and comfort journey.
 *
 * This is a separate path from the 40-Day Hope of Glory Journey.
 * The 40-day journey is discipleship; this 30-day journey is comfort.
 * It exists for people in pain: grief, fear, shame, doubt, loneliness, illness,
 * loss of work, loss of housing, anger, weariness, and the long valley.
 *
 * Five chapters, six days each:
 *   Sees     — God Sees You, even now (Days 1-6)
 *   Wounded  — When the heart bleeds (Days 7-12)
 *   Grieving — Loss, confession, doubt (Days 13-18)
 *   Doubting — Waiting, silence, failure (Days 19-24)
 *   Hoping   — Anxiety, weakness, Christ in you (Days 25-30)
 *
 * Tone is pastoral and unhurried. Pain is acknowledged before hope.
 * No prosperity gospel. No moralizing. No "everything happens for a reason."
 *
 * Crisis rule: Day 2 (When You Want to Give Up) and Day 20 (When You Feel
 * Hopeless) open with a direct 988/911 safety line.
 *
 * Scripture quotations are from the World English Bible (WEB), public domain.
 */

export type HurtingHeartDay = {
  day: number;
  chapter: 1 | 2 | 3 | 4 | 5;
  chapterName: string;
  theme: string;
  subtitle: string;
  scriptureRef: string;
  scriptureText: string;
  reflection: string;
  prayer: string;
  nextStep: string;
};

export const HURTING_HEART_TOTAL_DAYS = 30;

const C1 = "Sees";
const C2 = "Wounded";
const C3 = "Grieving";
const C4 = "Doubting";
const C5 = "Hoping";

const CRISIS_OPENING =
  "If you are thinking about ending your life right now, please don't read on alone. Call or text 988 now, or call 911 if there is immediate danger. Tell one person nearby. Then come back when you are safe. We are here. ";

export const HURTING_HEART_JOURNEY: HurtingHeartDay[] = [
  {
    day: 1,
    chapter: 1,
    chapterName: C1,
    theme: "God Sees You",
    subtitle: "You are not invisible to him.",
    scriptureRef: "Genesis 16:13",
    scriptureText:
      "She called the name of Yahweh who spoke to her, 'You are a God who sees,' for she said, 'Have I even stayed alive after seeing him?'",
    reflection:
      "Hagar was a slave woman, used and discarded, running from a household that had wounded her. She was alone in the wilderness with a child in her womb and no future she could name. And the first person in the Bible to give God a name is her. Not a patriarch. A pregnant, exhausted, mistreated woman. She called him El Roi — the God who sees. Whatever brought you to this page today, that name still holds. He is not far off. He is not waiting for you to clean yourself up before he can look at you. He has already looked. He has already seen what you are carrying — the part you can say out loud and the part you cannot. You are not invisible. You are not a number. You are not too much. The same God who knelt beside Hagar in her wilderness is bending toward you in yours. We will not rush you through the next thirty days. We will not pretend the pain is not pain. But before anything else, hear this: he sees you. He sees you. He sees you.",
    prayer:
      "God who sees — I don't have words today. I just need to know I am not alone in this. Be near. Don't let me run from you. Even if I cannot feel you, sit with me. In Jesus' name. Amen.",
    nextStep:
      "Take three slow breaths. Say out loud, even in a whisper: 'God sees me.' That is enough for today.",
  },
  {
    day: 2,
    chapter: 1,
    chapterName: C1,
    theme: "When You Want to Give Up",
    subtitle: "You are not the first. You are not alone. Please stay.",
    scriptureRef: "1 Kings 19:4",
    scriptureText:
      "He himself went a day's journey into the wilderness, and came and sat down under a juniper tree. He requested for himself that he might die, and said, 'It is enough. Now, O Yahweh, take away my life; for I am not better than my fathers.'",
    reflection:
      CRISIS_OPENING +
      "Elijah was a prophet who had just won the largest spiritual victory of his life — and within days he was under a tree, asking God to let him die. He was not a coward. He was not faithless. He was exhausted, threatened, alone, and his body and mind had run out. God did not rebuke him. God did not lecture him. God let him sleep. Then he sent an angel with bread and water and said, eat. Then he let him sleep again. Then more bread, more water. Only after the body had been fed and the heart had been heard did God speak — and even then, not in fire or wind or earthquake, but in a still small voice. If you are at the place Elijah was — done, finished, ready to be done with the whole thing — hear this carefully. You are not the first. You are not the worst. You are not a failure of faith. You are a tired human being whose body and soul need tending before they need a sermon. God's response to Elijah was not 'try harder.' It was food, rest, presence, and a gentle voice. Receive the same today. Eat something. Drink water. Lie down if you can. And please, tell one person — pastor, friend, family, or 988 — that you are at the juniper tree. Stay.",
    prayer:
      "Father, I am tired. More tired than I know how to say. I do not want to die — and I also do not want to keep going like this. Send me what Elijah received: food, rest, a voice that is gentle. Keep me here. Don't let go of me. In Jesus' name. Amen.",
    nextStep:
      "If you might hurt yourself, call or text 988 right now. If there is immediate danger, call 911. Otherwise: tell one safe person you trust that today is hard. Eat something. Drink water. Sleep if you can.",
  },
  {
    day: 3,
    chapter: 1,
    chapterName: C1,
    theme: "When You Feel Unwanted",
    subtitle: "The God who chose you did not choose you by mistake.",
    scriptureRef: "Isaiah 43:1",
    scriptureText:
      "But now Yahweh who created you, Jacob, and he who formed you, Israel, says: 'Don't be afraid, for I have redeemed you. I have called you by your name. You are mine.'",
    reflection:
      "Maybe you were the child who never quite fit in your own family. Maybe a marriage ended and the words still echo. Maybe a friend group closed the door. Maybe you've spent your whole life feeling like an extra person in every room. Being unwanted is one of the deepest wounds a human heart can carry, because we were made to belong. We were made for a Father. We were made for a family. So when belonging fails — and in this broken world it always fails somewhere — the wound goes to the place we were designed to be held. Hear what God says to Israel, a small, often-betrayed people: I have called you by your name. You are mine. He does not say, you have earned a place. He says, I have made one. He does not say, prove yourself. He says, you are already mine. The cross is the loudest declaration in history that God wanted you — wanted you enough to come, to bleed, to die, to rise. The people who failed to want you were wrong about you. The God who made you is not wrong about you. You are not extra. You are not leftover. You are called by name.",
    prayer:
      "Father, the wound of not being wanted is old and it is real. I bring it to you. Speak my name. Tell me I am yours. Not because of what I have done, but because of who you are. Amen.",
    nextStep:
      "Write your name on a piece of paper. Under it, write: 'Called by name. Mine. — God.' Put it somewhere you will see it tomorrow.",
  },
  {
    day: 4,
    chapter: 1,
    chapterName: C1,
    theme: "When You Are Angry",
    subtitle: "Anger is not the enemy. It is a messenger.",
    scriptureRef: "Ephesians 4:26",
    scriptureText:
      "Be angry, and don't sin. Don't let the sun go down on your wrath.",
    reflection:
      "The Bible does not tell you not to be angry. It tells you not to let anger become sin. There is a difference, and the church has not always taught it well. Anger is a signal. It usually means something you love has been threatened, or something righteous has been violated, or a wound you have been hiding has been pressed on. Jesus was angry. He overturned tables. He wept at injustice. He grieved over hardness of heart. The Father is angry at sin precisely because he loves what sin destroys. So if you are angry today — at a person who hurt you, at a system that failed you, at a body that betrayed you, at God himself — do not start by being ashamed of the anger. Start by asking what it is pointing to. What love is under it? What wound? What lie that needs to be confronted? The danger is not that you feel it. The danger is that you carry it past sundown, that you let it become bitterness, that you turn it on people who do not deserve it, that you turn it on yourself. Bring it honestly to God. He can handle it. He is not threatened by your fire. He is the one who lit the lamp inside you that says, 'this is wrong.'",
    prayer:
      "Father, I am angry. I will not pretend with you. Help me see what is under the anger. Show me the wound, the loss, the love being defended. Teach me to be angry without sinning, and not to carry this past sundown. Amen.",
    nextStep:
      "Name the anger to God in one honest sentence. Then ask: what is it pointing to? Don't try to fix it yet. Just see it.",
  },
  {
    day: 5,
    chapter: 1,
    chapterName: C1,
    theme: "When Bitterness Is Growing",
    subtitle: "A root that has to come up before it goes deeper.",
    scriptureRef: "Hebrews 12:15",
    scriptureText:
      "Looking carefully lest there be any man who falls short of the grace of God, lest any root of bitterness springing up trouble you, and many be defiled by it.",
    reflection:
      "Bitterness is what anger turns into when it is not given to God. Anger is fast and hot; bitterness is slow and cold. Anger flares; bitterness settles. Bitterness rehearses. Bitterness scripts what you would say if you ever got the chance. Bitterness keeps a ledger and a list. And the worst part of bitterness is that it does not stay yours. The writer of Hebrews says it springs up and many are defiled by it — your spouse, your children, your friendships, your church, your view of God. The root spreads in the dark. If you find a root of bitterness growing in your heart today, hear this gently: the answer is not to shame yourself for it. Bitterness almost always grows from a real wound. Someone really did hurt you. Something really was unfair. The question is whether you are going to spend the rest of your life as the keeper of that wound, or whether you are going to hand it to the only judge who is just. Forgiveness is not saying it didn't matter. Forgiveness is releasing the right to be the one who makes them pay. That right was never yours to begin with. God will be a far better judge than you would. Let the root come up while it still can.",
    prayer:
      "Father, search me. Show me where bitterness has put down a root. Pull it up. I cannot do this on my own. I release [name them, even silently] into your hands. You are the judge. Set me free. Amen.",
    nextStep:
      "Name one person you have rehearsed against in your mind. Pray for them by name, even if the words are short and cold. Do it once. Then again tomorrow.",
  },
  {
    day: 6,
    chapter: 1,
    chapterName: C1,
    theme: "When You Feel Disrespected",
    subtitle: "Your worth is not in their hands.",
    scriptureRef: "Psalm 139:14",
    scriptureText:
      "I will give thanks to you, for I am fearfully and wonderfully made. Your works are wonderful. My soul knows that very well.",
    reflection:
      "There are few things that wound like being treated as less than you are. A boss who dismisses you. A parent who never quite saw you. A spouse who speaks to you with contempt. A stranger who looked through you. The world is full of small disrespects, and they add up like cold drops on stone. The temptation in disrespect is to start carrying the verdict — to begin to believe, somewhere underneath, that the way they treated you is the true measure of who you are. It is not. Your worth was set before you ever spoke a word. You are fearfully and wonderfully made. You are an image-bearer of the living God. Christ shed his blood for you. The verdict of heaven on your life is more weighty than every cold word ever spoken to you, every dismissive glance, every passed-over moment. This does not make the disrespect okay. It does mean their disrespect cannot define you. Take the wound to God. Let him be the one who speaks over you. Then go back into the day, not having to earn what is already yours.",
    prayer:
      "Father, I have been treated as less than I am. The wound is real. Speak the truth over me again — that I am made by you, loved by you, paid for by Christ. Let your voice be louder than theirs. Amen.",
    nextStep:
      "Write down one cruel or dismissive word that has lodged in you. Beside it, write what God says: 'Fearfully and wonderfully made. Called by name. Mine.'",
  },
  {
    day: 7,
    chapter: 2,
    chapterName: C2,
    theme: "When You Are Grieving",
    subtitle: "God is near to the brokenhearted.",
    scriptureRef: "Psalm 34:18",
    scriptureText:
      "Yahweh is near to those who have a broken heart, and saves those who have a crushed spirit.",
    reflection:
      "Grief is not a problem to be solved. Grief is the price of love, and love is never wasted. If you are grieving today — the loss of a person, a marriage, a body that used to work, a child who walked away, a future that will never come — do not let anyone tell you to hurry. Do not let anyone hand you a verse like a band-aid. Jesus wept at the tomb of his friend even though he knew the resurrection was minutes away. He did not skip the weeping because he knew the ending. He wept because Lazarus was loved and Lazarus was dead and that is worth weeping over. The promise of Psalm 34 is not that the broken heart will be quickly fixed. The promise is that God is near to it. He does not stand at a distance from your grief. He kneels into it. He is not embarrassed by your tears. He counts them. He keeps them in a bottle, the psalmist says — every one. If today is a day where the only honest prayer is a sob, that prayer is heard. The God who is near to the brokenhearted is near to you.",
    prayer:
      "Father, I am not okay. I am not going to pretend with you. I miss [name them — the person, the life, the thing]. Be near. Don't make me carry this alone. In Jesus' name. Amen.",
    nextStep:
      "Light a candle, or sit by a window, and for five minutes simply let yourself feel what you feel. You do not have to perform for God.",
  },
  {
    day: 8,
    chapter: 2,
    chapterName: C2,
    theme: "When You Are Afraid",
    subtitle: "He does not shame your fear. He sits down beside it.",
    scriptureRef: "Isaiah 41:10",
    scriptureText:
      "Don't you be afraid, for I am with you. Don't be dismayed, for I am your God. I will strengthen you. I will help you. Yes, I will uphold you with the right hand of my righteousness.",
    reflection:
      "Fear is not a sin. Fear is a signal — a body and a soul saying, something here is too big for me. The Bible says 'fear not' more than three hundred times, but never in a tone of contempt. It is always 'fear not, for I am with you.' The cure for fear in Scripture is never to be told you are silly for being afraid. The cure is the presence of the One who is bigger than what scares you. If you are afraid today — of a diagnosis, of a phone call, of a court date, of a future that has gone dark, of a mind that will not stop — do not begin by hating yourself for the fear. The fear is human. Bring it to the only One who can stand under it. Tell him exactly what frightens you. Be specific. Then listen for what he says — not in a thunderclap, usually, but in the slow, quiet repetition of his promise: I am with you. I am your God. I will strengthen you. I will help you. I will uphold you. The fear may not vanish today. But you do not have to carry it alone. And he is not going anywhere.",
    prayer:
      "Father, I am afraid. Specifically afraid of [name it]. I am not going to dress it up. Be with me. Strengthen me. Help me. Uphold me. I cannot stand under this alone. In Jesus' name. Amen.",
    nextStep:
      "Name the fear out loud, in one sentence. Then say, out loud: 'I am not alone in this. God is with me.' Repeat as many times as you need.",
  },
  {
    day: 9,
    chapter: 2,
    chapterName: C2,
    theme: "When You Have No Money",
    subtitle: "The Father of birds and lilies has not forgotten you.",
    scriptureRef: "Matthew 6:31-32",
    scriptureText:
      "Therefore don't be anxious, saying, 'What will we eat?', 'What will we drink?' or, 'With what will we be clothed?' For the Gentiles seek after all these things; for your heavenly Father knows that you need all these things.",
    reflection:
      "If you are sitting with bills you cannot pay, a fridge that is too empty, a job that did not come through, a car that broke at the worst time — this is not a small grief. Jesus did not treat material need as something spiritual people should rise above. He fed crowds. He paid temple tax. He told his followers to pray for daily bread because daily bread matters. So begin by refusing the shame. Poverty is not a verdict on your worth. Financial trouble is not God's punishment. Many of the most faithful people in Scripture were poor. The Lord himself had no place to lay his head. But hear what Jesus actually says: your heavenly Father knows that you need these things. He knows. He is not waiting for you to convince him you have a need. He sees the bank account, the empty cabinet, the unanswered application. Then comes the call — not to faithless worry, but to honest dependence. Pray for daily bread. Tell trusted people in your life what is actually going on. Use 211 for food, housing, and basic-need resources where you live. Pride starves; humility eats. And the Father who feeds the sparrows is not the Father who will forget you.",
    prayer:
      "Father, you know exactly where I stand financially. I am not going to hide it from you. Give us this day our daily bread. Teach me to ask honestly. Give me wisdom for what I can do and peace for what I cannot. Amen.",
    nextStep:
      "Tell one trusted person what you are actually facing. If you need food, shelter, or utility help, dial 211 — it is free, 24/7, and confidential.",
  },
  {
    day: 10,
    chapter: 2,
    chapterName: C2,
    theme: "When You Need Shelter",
    subtitle: "The Son of Man had nowhere to lay his head — and he knows you.",
    scriptureRef: "Psalm 91:1-2",
    scriptureText:
      "He who dwells in the secret place of the Most High will rest in the shadow of the Almighty. I will say of Yahweh, 'He is my refuge and my fortress; my God, in whom I trust.'",
    reflection:
      "If you do not have a safe place to sleep tonight, or you are afraid you will not next week, you are not alone and you are not invisible. Jesus said it himself: foxes have holes and birds have nests, but the Son of Man had nowhere to lay his head. The Lord knows what it is to be without a roof. He is not at a distance from your fear about shelter. He is close. There is the deep refuge — God himself, who is your fortress and your hiding place no matter what street you sleep on tonight — and there is the practical refuge, and you need both. Both are gifts from him. Please, do not try to navigate housing crisis alone. Dial 211 in the United States; it connects you to local shelter, food, and emergency resources. If you are fleeing violence or immediate danger, call 911; if despair has become a danger to yourself, call or text 988. If you are in a church community, tell a pastor. Hidden need does not get help. Made-known need often does. And whatever happens with the roof tonight, the deeper roof — the shadow of the Almighty — cannot be taken from you.",
    prayer:
      "Father, you are my refuge. Even when the walls around me fail, you do not. Provide a safe place to sleep tonight. Send the right help. Give me courage to ask. Keep me, and the ones I love, in your shadow. Amen.",
    nextStep:
      "If you need shelter help, dial 211. If you are in immediate danger, dial 911. Tell one safe person you trust where you are.",
  },
  {
    day: 11,
    chapter: 2,
    chapterName: C2,
    theme: "When You Feel Lost",
    subtitle: "The Shepherd does not wait for the sheep to find their way home.",
    scriptureRef: "Luke 15:4",
    scriptureText:
      "Which of you men, if you had one hundred sheep, and lost one of them, wouldn't leave the ninety-nine in the wilderness, and go after the one that was lost, until he found it?",
    reflection:
      "Lost is not just a geographical word. You can be lost in your own city. You can be lost inside your marriage. You can be lost in a faith you used to know. You can be lost in a body and a mind that no longer feel like yours. The shame of feeling lost is that it can seem like everyone else has the map and you are the only one who misplaced it. Hear what Jesus said. Not, you idiot, you got yourself lost. Not, find your own way back. He told a story about a shepherd who left ninety-nine sheep behind in the wilderness to go after one. One. He did not stand at the door and wait. He went out. He hunted. He searched. He picked the sheep up. He carried it home on his shoulders. And then he threw a party. That shepherd is Jesus. If you feel lost today, you are not the project he is too busy for. You are the one he is going after. Sit still long enough to be found. He is closer than you think.",
    prayer:
      "Good Shepherd, I am lost. I don't know how I got this far from the path, and I don't know how to get back. Come and find me. Pick me up. Carry me home. Amen.",
    nextStep:
      "Sit in silence for three minutes. Don't try to find your way out today. Let yourself be found.",
  },
  {
    day: 12,
    chapter: 2,
    chapterName: C2,
    theme: "When You Feel Ashamed",
    subtitle: "There is no condemnation in Christ.",
    scriptureRef: "Romans 8:1",
    scriptureText:
      "There is therefore now no condemnation to those who are in Christ Jesus, who don't walk according to the flesh, but according to the Spirit.",
    reflection:
      "Shame is not the same as guilt. Guilt says, I did a bad thing. Shame says, I am a bad thing. Guilt can be forgiven; shame whispers that there is something underneath the doing that no forgiveness can reach. Many people who have been Christians for decades are still bent under shame. The voices in your head — from a parent, from an abuser, from a culture, from the enemy — keep saying you are unclean, unfit, unworthy, beyond reach. Hear the Word over the voices. There is therefore now no condemnation to those who are in Christ Jesus. None. Not 'less.' Not 'almost none.' None. If Christ has taken you, you are taken. The cross was not a half-measure. It did not cover the doing while leaving the being uncovered. He has clothed you in his righteousness. The Father looks at you and sees his Son. The shame is a liar. The voices that have told you what you are have been wrong. The verdict of the cross is what is true. Sit with it today. Let the truer sentence be louder than the older ones.",
    prayer:
      "Father, the shame is old and it goes deep. I do not always know how to hand it to you. But I am handing it now. Cover me. Speak the truer word over me — that in Christ there is no condemnation. Amen.",
    nextStep:
      "Read Romans 8:1 ten times slowly. Out loud if you can. Let the words land where the shame lives.",
  },
  {
    day: 13,
    chapter: 3,
    chapterName: C3,
    theme: "When You Need to Confess",
    subtitle: "Confession is not punishment. It is the door home.",
    scriptureRef: "1 John 1:9",
    scriptureText:
      "If we confess our sins, he is faithful and righteous to forgive us the sins, and to cleanse us from all unrighteousness.",
    reflection:
      "There is something you have been carrying. Maybe one thing, maybe many. Maybe it has been hidden for so long it feels like part of your bones. Confession is not God's way of humiliating you. Confession is his way of getting the weight off your back. He already knows. He is not waiting for the information. He is waiting for the relationship — for you to come out from behind the bush like Adam, for you to come down from the tree like Zacchaeus, for you to step into the light. The promise of 1 John 1:9 is staggering. If we confess, he is faithful — he will not change his mind. He is righteous — the forgiveness has been bought, fair and finished, at the cross. He will forgive the sins. He will cleanse from all unrighteousness. Not most. All. You cannot bring a sin to him that the blood of Christ has not already covered. So name it. To him first. And, where it is wise and safe, to a trustworthy pastor or believer who can pray with you. Hidden sin grows in the dark. Confessed sin loses its grip.",
    prayer:
      "Father, I have been carrying this — [name it, even silently]. I am tired of hiding. I confess it to you. Cleanse me by the blood of Jesus. Set me free. Restore the joy of being yours. Amen.",
    nextStep:
      "Write the confession down, even one sentence. Pray it. Then, if it is wise and safe, tell one trusted believer who can pray with you.",
  },
  {
    day: 14,
    chapter: 3,
    chapterName: C3,
    theme: "When You Doubt God",
    subtitle: "Doubt is not the opposite of faith. It is often where faith grows.",
    scriptureRef: "Mark 9:24",
    scriptureText:
      "Immediately the father of the child cried out with tears, 'I believe. Help my unbelief!'",
    reflection:
      "A father brought his sick son to Jesus and said, 'If you can do anything, have compassion on us, and help us.' Jesus answered, 'If you can! All things are possible to him who believes.' The father did not pretend. He cried out, 'I believe. Help my unbelief!' That is one of the most honest prayers in the whole Bible — and Jesus healed the boy. He did not require a clean, doubt-free faith first. He met the father where he was. If you are full of questions today — about God's goodness, about why he allowed what he allowed, about whether any of this is real — you are not the first follower of Jesus to feel it. The Psalms are full of doubt. Job is full of doubt. Even John the Baptist, in prison, sent disciples to ask Jesus, 'Are you the one we expected, or should we look for another?' Jesus did not rebuke him. Faith is not the absence of questions. Faith is bringing the questions to the only One who can answer them. Don't go quiet. Bring it. He can take it.",
    prayer:
      "Lord Jesus, I believe. Help my unbelief. I have questions I cannot answer. I have wounds that have made me doubt. Don't let me drift. Hold on to me even when I am not sure I am holding on to you. Amen.",
    nextStep:
      "Write down the honest question you have been afraid to ask God. Bring it to him. Then bring it to a trusted Christian friend or pastor who will not flinch.",
  },
  {
    day: 15,
    chapter: 3,
    chapterName: C3,
    theme: "When You Feel Alone",
    subtitle: "He will never leave you nor forsake you.",
    scriptureRef: "Hebrews 13:5",
    scriptureText:
      "For he has said, 'I will in no way leave you, neither will I in any way forsake you.'",
    reflection:
      "There is loneliness that comes from being by yourself, and there is loneliness that comes from being in a room full of people who do not see you. Both are real. Both ache. Loneliness is not a character flaw. It is part of what it means to be human in a fallen world where every connection is somehow short of what we were made for. We were made for the Father, and for one another, and the absence of either is felt in the bones. Hear the promise. The Greek of Hebrews 13:5 piles up negatives — 'I will in no way, no never, no not at all leave you or forsake you.' The verse is built like a wall. The God who said it does not lie. Even when no human voice is close, he is close. The Spirit dwells in you. The Son intercedes for you. The Father is for you. This does not replace the gift of other people; you still need them, and finding even one safe Christian to walk with you is one of the most important steps you can take. But on the long nights when no one is there, he is there. He has promised. The promise will not break.",
    prayer:
      "Father, the loneliness is real. Some nights it feels like more than I can bear. Help me remember your promise: you will not leave me. You will not forsake me. Send the friend I need. Until then, sit with me. Amen.",
    nextStep:
      "Reach out to one person today — not for advice, just to connect. A text counts. Even five words counts.",
  },
  {
    day: 16,
    chapter: 3,
    chapterName: C3,
    theme: "When You Carry Family Wounds",
    subtitle: "What was done to you does not have to define you.",
    scriptureRef: "Psalm 27:10",
    scriptureText:
      "When my father and my mother forsake me, then Yahweh will take me up.",
    reflection:
      "The people who were supposed to be your safest harbor were, for some of you, the first storm. A parent who was cruel. A parent who was absent. A parent who was there in the body but never in the heart. A sibling who was an enemy. A family system that taught you to be small, or to be loud, or to be never enough. Family wounds go deeper than most because they are formed early, before you had the words to name them. Hear Psalm 27. Even when my father and my mother forsake me — and they did, for some of you, in ways that should never have happened — the Lord will take me up. He is not just a substitute for what failed. He is the original, the one your parents were always supposed to be a small picture of. He is the Father who does not abandon. He is the Father who does not lie. He is the Father whose love is not earned by performance and is not lost by failure. This does not make the family wound disappear. Healing from that kind of injury often takes years, often takes a good counselor, often takes safe boundaries. But you are not stuck being the version of yourself your family made you. The Father who is taking you up is making you new.",
    prayer:
      "Father, you know exactly what was done and what was withheld. I bring the wound. Be to me what they could not be. Heal what was broken in me from the beginning. Free me to be the person you created, not the one I was shaped into surviving. Amen.",
    nextStep:
      "If your family wound is deep, consider finding a faithful Christian counselor. It is not weakness; it is wisdom. Many churches can connect you to one.",
  },
  {
    day: 17,
    chapter: 3,
    chapterName: C3,
    theme: "When You Cannot Forgive",
    subtitle: "You do not have to start with feelings. Start with a choice.",
    scriptureRef: "Colossians 3:13",
    scriptureText:
      "Bearing with one another, and forgiving each other, if any man has a complaint against any; even as Christ forgave you, so you also do.",
    reflection:
      "If someone has told you to 'just forgive and move on,' they have not understood forgiveness, and they have probably never been wounded as deeply as you have been. Forgiveness is not pretending the wrong did not happen. Forgiveness is not saying it was okay. Forgiveness is not always reconciliation; sometimes safety requires distance, and the Bible knows that. Forgiveness is releasing the right to be the one who makes them pay. That right is not yours. The judge of all the earth will do right. And until that day, holding on to vengeance does not punish them — it poisons you. Forgiveness is usually not one moment. It is often a long obedience in the same direction. You will release it on a Tuesday, and on Wednesday you will find yourself rehearsing it again. Release it again. And again. And again. The feelings often follow the choice, sometimes years later. If you cannot forgive today, you can still pray to be willing to be willing. That is enough for now. Christ, who forgave you from a cross, will do this in you when you cannot do it on your own.",
    prayer:
      "Lord Jesus, you forgave them while they were still nailing you to the cross. I cannot do this in my own strength. I am not even sure I want to yet. But I am willing to be willing. Begin the work in me. Set me free from being the keeper of this wound. Amen.",
    nextStep:
      "Name the person, even silently. Say: 'I release them into your hands, God. You are the judge.' You may need to do this again tomorrow, and the next day. That is okay.",
  },
  {
    day: 18,
    chapter: 3,
    chapterName: C3,
    theme: "When You Feel Forgotten",
    subtitle: "You are written on the palms of his hands.",
    scriptureRef: "Isaiah 49:15-16",
    scriptureText:
      "Can a woman forget her nursing child, that she should not have compassion on the son of her womb? Yes, these may forget, yet I will not forget you! Behold, I have engraved you on the palms of my hands. Your walls are continually before me.",
    reflection:
      "Maybe the world has moved on without you. The friends who said they would call did not. The promotion went to someone else. The chronic illness made you slowly invisible. The years pass and you cannot tell whether anyone notices you are still here. Being forgotten is one of the quietest kinds of pain, because nothing dramatic happens. The hurt is in what is absent. Hear what God says — and hear the staggering tenderness of it. Even a nursing mother might forget her child. He will not forget you. He has engraved you on his palms. Engraved. Not written. Not penciled. Carved. And then a Christian reader of these words reaches Calvary and realizes, with a sob, that the hands of Jesus have nail prints in them forever. He bears your name on his hands. When the Father looks at the wounds of his Son, he sees you. Forever. You are not forgotten. You could not be more remembered than this.",
    prayer:
      "Father, the loneliness of feeling forgotten is heavy. I bring it to you. Thank you that you have not forgotten me. Thank you that the wounds of Jesus carry my name. Help me believe it on the days I cannot feel it. Amen.",
    nextStep:
      "Look at your own hands. Pray: 'I am engraved on his. He has not forgotten me.' Carry that with you today.",
  },
  {
    day: 19,
    chapter: 4,
    chapterName: C4,
    theme: "When You Are Tired of Waiting",
    subtitle: "Wait does not mean no. It does not mean forever. And it is not wasted.",
    scriptureRef: "Psalm 27:14",
    scriptureText:
      "Wait for Yahweh. Be strong, and let your heart take courage. Yes, wait for Yahweh.",
    reflection:
      "Few things test the heart like waiting. Waiting for a job. Waiting for a child. Waiting for a healing. Waiting for a marriage to mend. Waiting for a prayer that has been on your lips for so long you no longer know how to pray it differently. Scripture is full of waiters. Abraham waited twenty-five years for the child God promised. Joseph waited in a pit and a prison. David waited fifteen years between being anointed and being crowned. Hannah waited so long for a son that other women mocked her in the temple. And then Jesus came, and his very first followers had been waiting four hundred years for God to speak again. Waiting is not God forgetting you. Waiting is often the long, slow work God does in you that nothing else could have done. It is not wasted time. Even so, exhaustion in waiting is real, and the Psalms know this. Psalm 27 does not say 'wait for God' once. It says it twice — like a coach in the corner of a tired fighter saying, hold on, hold on, hold on. Take courage. Be strong. Wait. He has not forgotten the answer. He is working in the quiet.",
    prayer:
      "Father, I am tired of waiting. You know what I have been asking for. I do not want a lecture; I want an answer. But while I wait, give me a courage I cannot manufacture. Hold me. Do the work in me that I cannot see. Amen.",
    nextStep:
      "Name the one thing you have been waiting on God for. Tell him, plainly: 'I am tired. I am still here. I am still waiting.' Then go about your day. That counts.",
  },
  {
    day: 20,
    chapter: 4,
    chapterName: C4,
    theme: "When You Feel Hopeless",
    subtitle: "Stay. Please stay. There is still hope, even if you cannot see it.",
    scriptureRef: "Lamentations 3:21-23",
    scriptureText:
      "This I recall to my mind; therefore I have hope. It is because of Yahweh's loving kindnesses that we are not consumed, because his compassion doesn't fail. They are new every morning. Great is your faithfulness.",
    reflection:
      CRISIS_OPENING +
      "Lamentations is a book of grief. Whole chapters are weeping. The writer says he has forgotten what happiness is. He says his strength is gone, his hope from the Lord is gone. He says he is like a man whose teeth have been broken on gravel. This is in your Bible. God did not edit it out. He did not pretend it away. He let it stand. And then, in the middle of that book of weeping, comes verse 21 — 'This I recall to my mind; therefore I have hope.' Not a feeling of hope. A choice to remember. To recall. To say out loud, even in tears, that the mercies of the Lord are new every morning, even when you cannot feel them. Hopelessness lies. It tells you tomorrow will look exactly like today, that nothing will ever change, that you are stuck forever in this hour. It is not true. The Lord's compassions are new every morning. You have not used up his patience. You have not exhausted his love. Tomorrow has mercies in it that today does not have. Stay until you find them. If today is more than you can carry — please, do not carry it alone. Call 988. Tell someone. Stay. The morning is coming. It is.",
    prayer:
      "Father, I do not feel hope today. I am telling you the truth. But Lamentations gives me permission to say what is true, and still hold on. Be new mercy for me tomorrow. Get me through tonight. Send me the one person I need. Keep me here. In Jesus' name. Amen.",
    nextStep:
      "If you might hurt yourself, call or text 988 right now. If there is immediate danger, call 911. Tell one safe person you are not okay. Eat something. Drink water. Make it to morning. That is enough.",
  },
  {
    day: 21,
    chapter: 4,
    chapterName: C4,
    theme: "When God Seems Silent",
    subtitle: "Silence is not absence.",
    scriptureRef: "Psalm 13:1",
    scriptureText:
      "How long, Yahweh? Will you forget me forever? How long will you hide your face from me?",
    reflection:
      "If you have prayed and prayed and felt like the words went into a wall, you are not the first believer to feel it. Psalm 13 is in your Bible because the Holy Spirit knew you would need it. 'How long, O Lord? Will you forget me forever? How long will you hide your face from me?' David did not pretend he felt close. He told God it felt like the opposite. And yet — and this is the gift of Psalm 13 — he kept talking to the God who seemed silent. He did not walk away. He prayed his confusion. He prayed his anger. He prayed his grief. And by the end of the psalm, even though nothing in his circumstances had changed, he was singing, 'I will sing to Yahweh, because he has dealt bountifully with me.' Silence is not always absence. Sometimes silence is the work happening underneath that you cannot yet see. Sometimes silence is the school of trust. Sometimes silence is the place where you learn to love God for who he is, not just for the answers he gives. Keep talking. Keep showing up. The silence will not last forever, and even within it, he is closer than you feel.",
    prayer:
      "Father, you have felt far. I will not pretend otherwise. How long? I do not know. But like David, I am still talking to you. I will not walk away. Speak when you will. I will keep listening. Amen.",
    nextStep:
      "Pray Psalm 13 as your own. Out loud. The whole psalm, including the ending. Words you do not feel yet can still be true.",
  },
  {
    day: 22,
    chapter: 4,
    chapterName: C4,
    theme: "When You Have Failed",
    subtitle: "Peter denied him three times. Jesus made him breakfast.",
    scriptureRef: "John 21:12",
    scriptureText:
      "Jesus said to them, 'Come and eat breakfast.'",
    reflection:
      "Peter swore he would die for Jesus. Hours later he denied even knowing him — three times, with cursing, in front of a fire while his Lord was being tortured nearby. When the rooster crowed, Peter went out and wept bitterly. That is failure. That is the kind of moment that becomes your name, the kind of moment you replay at three in the morning for the rest of your life. And what did the risen Jesus do with Peter? He cooked him breakfast. He did not greet him with a lecture. He did not greet him with humiliation in front of the others. He made him breakfast on the beach, and then — kindly, one for each denial — he asked him three times, 'Do you love me?' And he gave him work to do. He restored him. He did not just forgive him; he sent him out. If you have failed today — if you have failed in a marriage, in a parenting moment, in a job, in a vow you made to God last year — hear this: Jesus does not stop loving his failed disciples. He restores them. He cooks them breakfast. He calls them again. Your failure is not the final word over your life. His mercy is.",
    prayer:
      "Lord Jesus, I have failed. You know what I did and what I left undone. Do not throw me out. Restore me like you restored Peter. Cook me breakfast. Call me again. I love you, even if I do not love you well. Amen.",
    nextStep:
      "Name the failure to God. Then receive his welcome. Then do the next ordinary thing: a meal, a walk, a phone call to someone you love. Forgiveness is meant to be lived.",
  },
  {
    day: 23,
    chapter: 4,
    chapterName: C4,
    theme: "When You Mourn a Loved One",
    subtitle: "Jesus wept. And resurrection is real.",
    scriptureRef: "John 11:35",
    scriptureText: "Jesus wept.",
    reflection:
      "The shortest verse in the English Bible is also one of the deepest. Jesus wept. He knew Lazarus was about to be raised. He knew the ending. He knew the empty tomb was minutes away. And still he wept. He stood at the grave of his friend and let the tears come because love does not pretend the grave is not the grave. Death is an enemy. Loss is loss. The Bible never tells you to be cheerful about it. When the apostle Paul writes about grief, he does not say, 'do not grieve.' He says, 'do not grieve as those who have no hope.' There is a kind of Christian grief that is not less because it is grief — it is just held inside a bigger promise. Death is not the final word. Jesus rose. And he is the firstfruits of a harvest. The one you have lost, if they were in Christ, is not gone. They are home before you, and you will see them again. Even so, the missing is real. The empty chair is real. The voice you will not hear today is real. Weep. Jesus did. And let the hope be there too, underneath the weeping — not erasing it, but holding it.",
    prayer:
      "Lord Jesus, you wept. Thank you that you did. I am weeping too. I miss them. I would do anything for one more day. Be near. Hold the hope of resurrection up over me when I cannot hold it for myself. Amen.",
    nextStep:
      "Speak their name today. Tell God one specific thing you miss about them. Tell one friend, too. Memory is not betrayal of healing; it is part of it.",
  },
  {
    day: 24,
    chapter: 4,
    chapterName: C4,
    theme: "When You Are Sick",
    subtitle: "He sees your body. He has not forgotten it.",
    scriptureRef: "Psalm 41:3",
    scriptureText:
      "Yahweh will sustain him on his sickbed, and restore him from his bed of illness.",
    reflection:
      "If you are sick today — a chronic condition that has reshaped your whole life, an illness you are waiting for results on, a body that has slowly stopped doing what it used to do — you are not less of a Christian for it. You are not being punished. Your sickness is not the verdict of God on your faith. Some of the most faithful people in Scripture were ill: Paul had his thorn, Timothy had his stomach, Epaphroditus nearly died, Trophimus was left behind sick. The body matters to God. He made yours. Christ healed many in his earthly ministry, and we are right to pray for healing — boldly, often, in faith. He still heals. But God does not promise every prayer for healing in this life will be answered yes. Sometimes the deeper healing is the soul learning to trust the Father in a body that is failing. Sometimes the healing is delayed until the resurrection, where every sick body of every faithful saint will rise new, never to die again. Whatever this day looks like — pain, fatigue, fear, treatment, waiting — he is sustaining you on the bed. He has not stepped away. He has not forgotten your body. He will heal it. The only question is which side of the resurrection that healing will be on.",
    prayer:
      "Father, you see this body. You see this pain. You see this fear. I ask you, boldly, for healing. If you choose to wait, give me grace to trust you in the waiting. Sustain me. Hold me. I am yours, sick or well. Amen.",
    nextStep:
      "Tell a few trusted people what you are facing and ask them to pray. Take your medicine. Rest as you are able. Receiving help is not failure of faith.",
  },
  {
    day: 25,
    chapter: 5,
    chapterName: C5,
    theme: "When You Are Anxious",
    subtitle: "Cast it. He cares.",
    scriptureRef: "1 Peter 5:7",
    scriptureText: "Casting all your worries on him, because he cares for you.",
    reflection:
      "Anxiety is not always a spiritual failure. Sometimes it is the body and mind telling you the truth — that something is wrong, or threatening, or unresolved. Sometimes it is a condition that calls for medical and counseling help and prayer all at once, and there is no shame in any of those. Some of the godliest people you will ever meet take medication for anxiety and pray every day. Both can be true. Hear what Peter says to a church that was being persecuted, scattered, exhausted: cast all your worries on him. Cast is a strong word — like throwing a heavy net off a boat. You do not gently set anxiety down. You hurl it. And the reason you can hurl it is the second half of the verse: because he cares for you. The God of the universe is not annoyed by your worry. He is not waiting for you to figure it out before he will listen. He cares. He cares about the small worry and the large one. He cares about the body that will not relax and the thoughts that will not stop. Bring them. Name them, one by one. Cast them on him. And take whatever practical step is wise — sleep, breath, water, walk, friend, counselor, doctor, prayer. All of it can be holy.",
    prayer:
      "Father, here is what I am carrying: [name them, one by one, out loud or in your heart]. I cast them on you. I am not strong enough to carry them. You care for me. Thank you. Amen.",
    nextStep:
      "Take five slow breaths in through the nose, out through the mouth. With each breath, name one worry and hand it over. If anxiety is heavy or constant, consider talking to a doctor or counselor — it is wisdom, not weakness.",
  },
  {
    day: 26,
    chapter: 5,
    chapterName: C5,
    theme: "When You Feel Worthless",
    subtitle: "The cross is the value he placed on you.",
    scriptureRef: "1 Peter 1:18-19",
    scriptureText:
      "Knowing that you were redeemed, not with corruptible things, with silver or gold, from the useless way of life handed down from your fathers, but with precious blood, as of a faultless and pure lamb, the blood of Christ.",
    reflection:
      "If you have ever wondered whether your existence is a mistake — whether the world, or your family, or God himself would be better off without you — that lie is so old and so loud and so cruel that it is worth taking apart slowly. If that thought feels active or urgent, pause here and call or text 988 now; if you are in immediate danger, call 911. Tell one safe person nearby, and do not sit alone with it. You are an image-bearer of the living God. He made you on purpose. He knit you together in your mother's womb. He gave you the face you have, the laugh you have, the hands you have. And then, after the fall, when sin made every human soul broken and unable to fix itself, he did not write you off. He came. He took on flesh. He went to a cross. And the price he paid for your soul was the blood of the Son of God. That is the value God placed on you. Silver and gold were not enough. Only the precious blood of Christ was enough. Look at the cross when the voice tells you that you are worthless. Look at what he paid. Your worth was not measured by the contempt of the men who tortured him; it was declared by the blood he chose to shed. He decided that, and the decision is final.",
    prayer:
      "Father, the lie that I am worthless is loud and old. I bring it to the cross. Tell me what you paid. Tell me what I am worth to you. Quiet the voices. Help me believe what the cross says is true. Amen.",
    nextStep:
      "Look at a cross — a real one, on a wall, in a building, on a chain, or in your mind. Say: 'This is what God paid for me. I am not worthless. I am bought.'",
  },
  {
    day: 27,
    chapter: 5,
    chapterName: C5,
    theme: "When You Feel Lost in the Crowd",
    subtitle: "The Shepherd knows you by name.",
    scriptureRef: "John 10:3",
    scriptureText:
      "The gatekeeper opens the gate for him, and the sheep listen to his voice. He calls his own sheep by name, and leads them out.",
    reflection:
      "There is a particular loneliness in cities, in crowds, in churches that have grown too large to know you, in workplaces that count headcount but not heartbeat. You can be surrounded by hundreds of people every day and still feel completely unknown. You can have followers and not friends. Hear the staggering picture Jesus gives. He is not a shepherd who has a flock; he is a shepherd who has a flock of named sheep. He does not herd you. He calls you. By name. The God who made the galaxies took the time to know what your mother whispered over you. He took the time to know what you go by, what you used to go by, what only one trusted friend has ever called you. You are not anonymous to him. You are not a face in a crowd. He sees you, by name, in every room you enter. Wherever you are walking today, the Shepherd is calling. Listen for your name.",
    prayer:
      "Good Shepherd, thank you that you know my name. Speak it. Lead me out by it. In a world that does not see me, you do. I am not anonymous to you. Help me listen for your voice. Amen.",
    nextStep:
      "Sit quietly for two minutes. Say your own name aloud, then say: 'Known by the Shepherd. Called by name.' Let it sink past the noise.",
  },
  {
    day: 28,
    chapter: 5,
    chapterName: C5,
    theme: "When You Are Tempted",
    subtitle: "There is a way out — and a High Priest who has been there.",
    scriptureRef: "1 Corinthians 10:13",
    scriptureText:
      "No temptation has taken you except what is common to man. God is faithful, who will not allow you to be tempted above what you are able, but will with the temptation also make the way of escape, that you may be able to endure it.",
    reflection:
      "Temptation is not the same as sin. Jesus was tempted, and Jesus never sinned. Being tempted does not make you unworthy; it makes you human. The shame of temptation is one of the most effective lies in the enemy's toolbox, because shame drives temptation into the dark, and the dark is where it grows. Bring it into the light. Hear two promises today. First, you are not the first or the only. The temptation you are facing — the addiction, the relationship, the bitterness, the lie, the click, the drink, the rage — is common. Other believers have faced it and have come through. You are not alone. Second, God is faithful. He has not abandoned you to it. He has built into every temptation a way of escape — sometimes a phone to pick up, a brother or sister to call, a song to put on, a door to walk out of, a Scripture to speak. Look for the way out. He has made one. And remember the High Priest. Jesus has been tempted in every way you have been tempted, yet without sin. He is not far off from you. He is sympathetic. Run to him, not from him.",
    prayer:
      "Father, you know what I am being tempted with. I will not hide it. Show me the way of escape you have already made. Lord Jesus, my High Priest, you have been here. Help me. I cannot do this alone. Amen.",
    nextStep:
      "Name the temptation to one safe person today. Hidden temptation grows; shared temptation loses power. If you are fighting an addiction, do not fight it alone — find help.",
  },
  {
    day: 29,
    chapter: 5,
    chapterName: C5,
    theme: "When You Need Strength",
    subtitle: "His strength is made perfect in your weakness.",
    scriptureRef: "Isaiah 40:29",
    scriptureText:
      "He gives power to the weak. He increases the strength of him who has no might.",
    reflection:
      "Christian strength is not the same as worldly strength. Worldly strength is the absence of weakness. Christian strength is the presence of God in weakness. Paul, the apostle who planted churches across the empire and wrote half of your New Testament, said it plainly: 'When I am weak, then I am strong.' He did not say, 'When I act strong.' He said, 'When I am weak.' If you feel weak today — physically, emotionally, spiritually — you are not disqualified. You are exactly the kind of person God specializes in. He gives power to the weak. He increases the strength of those who have no might. He does not require you to manufacture strength before he will use you; he gives you his. Isaiah continues a few verses later: those who wait on the Lord will renew their strength. They will mount up with wings as eagles. They will run and not be weary. They will walk and not faint. The strength is on the way. It is not yours to muster; it is his to give. Receive it today. Even one small step at a time. The God who made the universe is your strength.",
    prayer:
      "Father, I am weak today. I am not going to pretend otherwise. Give power to the weak. Give strength to the one with no might. Be my strength. I am yours, weak as I am. Amen.",
    nextStep:
      "Do one small obedience today — one thing you have been putting off. Not a great heroic act; a small faithful one. Strength is given as you take the next step.",
  },
  {
    day: 30,
    chapter: 5,
    chapterName: C5,
    theme: "Christ in You, the Hope of Glory",
    subtitle: "Where this journey ends, your life begins again.",
    scriptureRef: "Colossians 1:27",
    scriptureText:
      "To whom God was pleased to make known what are the riches of the glory of this mystery among the Gentiles, which is Christ in you, the hope of glory.",
    reflection:
      "Thirty days is a small thing. The pain you have carried into this journey may not be gone. The grief may not be resolved. The waiting may not be over. The wound may still ache. Do not measure these thirty days by the absence of pain. Measure them by the presence of Christ. Because that is what the gospel promises. Not a life without pain. A Christ who entered the pain, bore the sin, broke the grave, and now — by his Spirit — lives inside the heart of every believer. Christ in you, the hope of glory. This is the great mystery the Old Testament prophets only glimpsed and the New Testament saints proclaimed with tears of joy. The God who made you does not stand at a distance from your suffering. He has come into it. He has made his home in you. He is the hope of glory — not just a hope, not just glory, but the hope of glory, the certain expectation that the same God who is with you now will one day wipe every tear from your eyes, raise this body new, set the world right, and bring you home. The earth will be filled with the knowledge of his glory as the waters cover the sea. And you, beloved hurting heart, are part of that filling. You are not at the end. You are at a beginning.",
    prayer:
      "Christ in me, the hope of glory. I cannot fathom it. I receive it. Whatever I carry from here, you are in me. Whatever lies ahead, you are with me. Whatever I have lost, you have not lost me. To you be all the glory. Amen.",
    nextStep:
      "Find one faithful local church near you. Tell one trusted Christian about what these thirty days have been. You were not meant to walk on alone — keep walking, but walk with company.",
  },
];

function assertCompleteHurtingHeartJourney(days: HurtingHeartDay[]) {
  if (days.length !== HURTING_HEART_TOTAL_DAYS) {
    throw new Error(
      `Expected ${HURTING_HEART_TOTAL_DAYS} hurting-heart days, received ${days.length}.`,
    );
  }

  days.forEach((d, index) => {
    const expectedDay = index + 1;
    if (d.day !== expectedDay) {
      throw new Error(
        `Expected hurting-heart day ${expectedDay}, received day ${d.day}.`,
      );
    }
  });
}

assertCompleteHurtingHeartJourney(HURTING_HEART_JOURNEY);

export function getHurtingDay(n: number): HurtingHeartDay | null {
  return HURTING_HEART_JOURNEY.find((d) => d.day === n) ?? null;
}
