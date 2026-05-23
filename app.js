// =============================================
//  OVERTHINK.EXE — app.js
//  Spiral Simulator Engine v2.7.1
// =============================================

'use strict';

// ─── STATE ───────────────────────────────────────────────────────────────────
const state = {
  selectedCategory: null,
  selectedScenario: null,
  isRunning: false,
  currentStep: 0,
  rogueNotifTimeout: null,
  rogueNotifFired: false,
};

// ─── SPIRAL DATABASE ─────────────────────────────────────────────────────────
const scenarios = {
  relationship: [
    {
      trigger: "They used a period at the end of 'OK.'",
      thoughts: [
        "they never use periods. ever. this is unprecedented.",
        "that period was deliberate. loaded. weaponized punctuation.",
        "they are actively revoking our friendship via grammar.",
        "they are hosting a group chat right now dissecting every single thing i've ever said.",
        "i am legally dead to them. they have already replaced me with someone better at replying.",
        "changing my identity, moving to a remote goat farm in Iceland. the goats won't judge my texting style."
      ]
    },
    {
      trigger: "They texted 'haha' instead of 'lmaoo' or 'lol'",
      thoughts: [
        "'haha' is technically a response. technically.",
        "they said 'haha' the way a doctor says 'interesting' when looking at your scan results.",
        "this is not laughter. this is a polite hostage situation where they're holding my self-esteem captive.",
        "they are telling me, in encrypted haha-language, that i am no longer funny to them.",
        "the person who would have sent 'lmaooo' is gone. they were replaced by someone who tolerates me at best.",
        "drafting my 'ok so i noticed something' paragraph. it has seven subsections and a footnote."
      ]
    },
    {
      trigger: "They viewed my story within 30 seconds but left the DM on seen",
      thoughts: [
        "the view was immediate. they were literally watching for my story. suspicious.",
        "they watched it. absorbed it. and chose silence. calculated.",
        "the seen timestamp is a diagnosis. i have been evaluated and found not worth typing to.",
        "they screenshot it. they are in another chat right now showing people. the group chat is feasting.",
        "i have been seen in the most literal and metaphorical way possible and still found invisible.",
        "creating a 47-slide presentation titled 'the seen receipt and what it means for us as a society'."
      ]
    },
  ],

  school: [
    {
      trigger: "Teacher said 'Can you stay behind for a second after class?'",
      thoughts: [
        "'a second.' teachers never mean a second. this is temporal deception.",
        "going through every single assignment from the past 3 months. something is wrong. something is deeply wrong.",
        "they know about the time i googled the answer on the bathroom break. they have been watching.",
        "there is a file. with my name on it. they have been compiling evidence since september.",
        "this is not a stay behind. this is a formal deposition. i need legal representation.",
        "i will not survive secondary education. dropping out, becoming a lighthouse keeper, and texting no one ever again."
      ]
    },
    {
      trigger: "My essay got a lower grade than I expected with no comment",
      thoughts: [
        "no comment means the grade is the comment. and the comment is devastation.",
        "they read it, felt something, and chose the most passive-aggressive response: silence.",
        "this grade is not about the essay. this is personal. they have always hated my sentence structure.",
        "they showed this to the other teachers. it is a cautionary tale now. a syllabus example of what not to do.",
        "i will never write again. my creative spirit has been graded and found to be a C+.",
        "going back and auditing every essay i've ever written to understand where the collapse began."
      ]
    },
    {
      trigger: "Got left on read by the group project chat",
      thoughts: [
        "two ticks. blue. fully seen by four people. processing in progress.",
        "they are in a different group chat making decisions without me. the real project chat exists elsewhere.",
        "i have been strategically excluded from the planning phase. my contribution is decorative at best.",
        "they will submit the project with my name on it out of legal obligation but my section will be 'revised'.",
        "this is the professional world in miniature. i am already being left out of the adult group chats.",
        "taking myself off the title page, apologizing to no one, and starting a competing project solo."
      ]
    },
  ],

  social: [
    {
      trigger: "My friend posted a photo dump and I'm not in a single slide",
      thoughts: [
        "eleven photos. i was present for at least four of those occasions. this is a selection process.",
        "they curated me out. there was a photo of me, they looked at it, and they chose not to.",
        "the algorithm will show these to mutual friends. who will notice my absence. who will take notes.",
        "i have been cropped from the aesthetic. i am the negative space in their content strategy.",
        "they are rewriting our friendship history in real time via carousel format. this is revisionism.",
        "building a rival photo dump with better lighting, better vibes, and exactly zero pictures of them."
      ]
    },
    {
      trigger: "I posted and the first 3 hours were just dead silence",
      thoughts: [
        "three hours. the critical engagement window. and nothing.",
        "the algorithm saw it, evaluated it, and decided it was not worthy of distribution. brutal.",
        "people saw it and actively chose not to interact. this required effort on their part.",
        "the mutual friends who did see it had a reaction. it was pity. they didn't want to engage with pity.",
        "my entire online presence has flatlined. i am clinically unfollowable as a concept.",
        "deleting the post, deleting the app, deleting my entire digital footprint, becoming a cryptid."
      ]
    },
  ],

  bestie: [
    {
      trigger: "The 'Typing...' bubble appeared for 2 full minutes then disappeared",
      thoughts: [
        "they had something to say. they wrote it. and then they deleted it.",
        "what you delete says more than what you send. they started a whole paragraph and aborted it.",
        "the deleted message was the truth. what they actually think. and they decided to protect me from it.",
        "they are composing the real message in a notes app first. editing. workshopping. this is deliberate.",
        "i am a topic of careful consideration. people do not carefully consider things they don't care about. wait. or do they.",
        "sitting here watching this phone like it owes me an explanation. it does. it absolutely does."
      ]
    },
    {
      trigger: "They cancelled plans with 'something came up' and no further context",
      thoughts: [
        "'something came up.' passive voice. no subject. deeply legally suspicious.",
        "they are somewhere right now with other people. better people. people who don't need follow-up context.",
        "the 'something' is a different person. an upgraded version of me with fewer communication needs.",
        "i have been cancelled like a mid-season streaming show. good ratings but something didn't click with execs.",
        "they are posting in two hours. i will know within seconds what the 'something' was.",
        "writing a non-confrontational 'no worries!' text that has four layers of subtext and a ticking clock."
      ]
    },
    {
      trigger: "They reacted to my message with a 🙂 emoji",
      thoughts: [
        "🙂 is not an emoji. it is a formal letter of emotional distance in unicode format.",
        "they could have sent anything. a heart. a laugh. they chose the void emoji. they chose 🙂.",
        "🙂 is what you send when you don't know how to stop the conversation but can't commit to engagement.",
        "they have downgraded me from words to a single emotionally ambiguous circle with a flat expression.",
        "i am being managed. like a mild workplace conflict. professionally distanced with a 🙂.",
        "responding with 🙂 back and then both of us just floating in the void of mutual 🙂 energy forever."
      ]
    },
  ],

  existential: [
    {
      trigger: "Woke up at 3am for no reason and can't fall back asleep",
      thoughts: [
        "3am. the hour of ambient dread. fully awake with no justification.",
        "my brain has activated for unfinished business. something is wrong somewhere.",
        "cycling through every embarrassing thing i've said since 2016. chronologically. with full sensory detail.",
        "at some point i will have to go back to sleep and then tomorrow will happen and i have to participate in it.",
        "what is the actual point of sleeping when waking up means existing and existing is just a series of events happening until they stop.",
        "phone face down. phone face up. phone face down. 4:17am. incredible. phenomenal. cooked."
      ]
    },
    {
      trigger: "Read an old text conversation and realized how much has changed",
      thoughts: [
        "those people were us. we had no idea what was coming. we were so casual about everything.",
        "the person i was in that conversation no longer exists. they were discontinued sometime between then and now.",
        "what happened to all the energy i had for the things that mattered in those messages.",
        "every relationship has a peak. and you don't know you're at the peak until you're looking back at it.",
        "i am currently at the peak of something right now and i am not appreciating it and i will not until it's over.",
        "closing the app. opening the app. rereading from the beginning. crying a little. classic tuesday."
      ]
    },
  ],

  groupchat: [
    {
      trigger: "The group chat went quiet after something I said",
      thoughts: [
        "i said something. and then: nothing. the silence has a specific texture.",
        "they are all reading it. processing it. conferring in a side channel.",
        "someone screenshotted it. the screenshot has already been distributed. it's out there now.",
        "they are deciding collectively how to respond without making it weird. this is crisis management.",
        "i have become the thing they talk about when i'm not in the chat. i am the content now.",
        "typing 'haha jk' as damage control with the energy of someone defusing a bomb with autocorrect."
      ]
    },
    {
      trigger: "I got added to a new group chat with no context or explanation",
      thoughts: [
        "unexpected group chat addition. no description. no welcome message. this is intelligence gathering.",
        "everyone in this chat knows why they're here except me. i am the subject of the group chat i am in.",
        "scrolling up to find context and there is no context. the context was before i was added. deliberately.",
        "they are watching how i react to being in this group chat. my behavior is being logged.",
        "this is either a surprise or a trial. the jury is everyone who hasn't messaged yet.",
        "sending 'hey :)' with exactly the casual energy of someone who has absolutely no idea what's happening."
      ]
    },
  ],
};

// ─── DIAGNOSIS TITLES ─────────────────────────────────────────────────────────
const diagnosisTitles = [
  { title: "Certified Paragraph Architect", sub: "building novels from single punctuation marks since day one" },
  { title: "Olympic Scenario Fabricator™", sub: "medal-winning imagination, zero basis in reality" },
  { title: "Licensed Vibe Killer", sub: "accidentally radiating distress in a 15-foot radius" },
  { title: "Emotionally Dependent on 5G", sub: "the read receipts have more power than they should" },
  { title: "Professional Main Character", sub: "every minor interaction is a pivotal plot point" },
  { title: "Deluxe Brainrot Engineer", sub: "running 47 simultaneous worst-case simulations" },
  { title: "Receipts Department Director", sub: "nothing gets forgotten. nothing. ever." },
  { title: "Five-Star Galaxy-Brain Operator", sub: "connected dots that didn't exist and made them worse" },
  { title: "Certified 3AM Philosopher", sub: "specializing in unsolvable problems at inopportune hours" },
  { title: "Head of Worst-Case R&D", sub: "pioneering new territories of hypothetical suffering" },
];

// ─── AI VERDICTS ─────────────────────────────────────────────────────────────
const aiVerdicts = [
  "AI Verdict: 2% logic detected, 98% raw fanfiction. Probability they actually hate you: 0.4%. Probability you need a 12-hour nap: 100%.",
  "AI Verdict: Analysis complete. The situation: objectively fine. Your brain: actively harmful to itself. Recommended dosage of grass: touch some.",
  "AI Verdict: Scanned 847 social cues. 846 were fabricated. 1 was real but you misread it. Error rate: catastrophic. Prognosis: classic.",
  "AI Verdict: Detected 0 red flags in source material. Detected 17 red flags manufactured internally. You are the factory and also the product.",
  "AI Verdict: Likelihood this ends badly: 3.2%. Likelihood you will act like it's 97%: 99.8%. Confidence interval: you are so cooked.",
  "AI Verdict: Logic reserves at 1%. Running entirely on vibes, speculation, and a single text message sent at 11:43pm. System stability: questionable.",
  "AI Verdict: Cross-referenced with 200M similar situations. Outcome: literally fine. Your assessment: universe-ending. Discrepancy: significant.",
  "AI Verdict: This spiral was artisanal. Hand-crafted. Not one shred of it based in documented reality. Rating: 10/10 unhinged commitment.",
];

// ─── SURVIVAL BADGES ─────────────────────────────────────────────────────────
const survivalBadges = [
  { emoji: "🏅", text: "survived a 6-step spiral with no casualties except your own peace of mind. iconic behavior." },
  { emoji: "🧠", text: "your brain worked overtime and produced absolutely nothing actionable. very art. much craft." },
  { emoji: "📜", text: "this spiral has been logged in the ancient records of Things That Were Never That Deep." },
  { emoji: "🌀", text: "you looked into the void of a minor social interaction. the void was confused but fine." },
  { emoji: "⭐", text: "certified spiral survivor. the situation remains unchanged. you are slightly more tired." },
  { emoji: "🎖️", text: "awarded the order of the overthought. given annually to one extraordinary brainrot specialist." },
];

// ─── ROGUE NOTIFICATIONS ─────────────────────────────────────────────────────
const rogueNotifications = [
  "CRITICAL ALERT: Mom's footsteps detected in the hallway. Act normal. Close all tabs. Look busy.",
  "SYSTEM WARNING: Bestie is typing a paragraph in a completely different app. This cannot be good.",
  "BREAKING: Someone just checked your profile without messaging. Reason: unknown. Threat level: orange.",
  "ALERT: Person you haven't texted in 6 months just watched your story. They want something. Or worse, nothing.",
  "WARNING: Your read receipt is visible. They know you've seen it. The performance of not-replying has begun.",
  "CRITICAL: Group chat is at 3 unread messages. Stopped responding mid-conversation. This is intentional.",
  "SYSTEM NOTICE: Someone is describing your situation to their own friend right now. You are a cautionary tale.",
  "ALERT: The typing bubble appeared and disappeared twice. They are writing a draft. The draft is about you.",
];

// ─── CHAOS METER CONFIG ───────────────────────────────────────────────────────
const chaosStates = [
  { label: "Chilling (Fake News) 🫡", color: "cyan", percentage: 16, barClass: "state-cyan" },
  { label: "Sweating (Side-Eye) 🤨", color: "green", percentage: 33, barClass: "state-green" },
  { label: "Hyperventilating (It's Over) 😭", color: "yellow", percentage: 50, barClass: "state-yellow" },
  { label: "Delusional (They Are Testing Me) 🤡", color: "purple", percentage: 66, barClass: "state-purple" },
  { label: "Ego Death (Calling NASA) ☠️", color: "pink", percentage: 83, barClass: "state-pink" },
  { label: "FULLY COOKED (No Return) 💀", color: "red", percentage: 100, barClass: "state-pink" },
];

const chaosLabelColors = {
  cyan: "text-cyan-400",
  green: "text-green-400",
  yellow: "text-yellow-400",
  purple: "text-purple-400",
  pink: "text-pink-500",
  red: "text-red-500",
};

// ─── PARTICLE ENGINE ─────────────────────────────────────────────────────────
function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const colors = ["rgba(168,85,247,", "rgba(255,0,127,", "rgba(6,182,212,", "rgba(255,255,255,"];
  const particles = [];
  const PARTICLE_COUNT = 28;

  function createParticle() {
    return {
      x: Math.random() * W,
      y: H + Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.4 + 0.15),
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.15 + 0.03,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 600 + 400,
    };
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = createParticle();
    p.y = Math.random() * H;
    p.life = Math.floor(Math.random() * p.maxLife);
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.life++;
      p.x += p.vx;
      p.y += p.vy;
      const lifeRatio = p.life / p.maxLife;
      const alpha = lifeRatio < 0.1
        ? p.opacity * (lifeRatio / 0.1)
        : lifeRatio > 0.85
        ? p.opacity * ((1 - lifeRatio) / 0.15)
        : p.opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${alpha})`;
      ctx.fill();
      if (p.life >= p.maxLife || p.y < -20) {
        particles[i] = createParticle();
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}

// ─── CATEGORY SELECTION ────────────────────────────────────────────────────────
function selectCategory(category) {
  if (state.isRunning) return;

  // Deselect all buttons
  document.querySelectorAll(".panic-btn").forEach(btn => btn.classList.remove("selected"));

  if (state.selectedCategory === category) {
    // Toggle off
    state.selectedCategory = null;
    state.selectedScenario = null;
    document.getElementById("scenarioPreview").classList.add("hidden");
    document.getElementById("situationInput").disabled = false;
    return;
  }

  state.selectedCategory = category;

  // Select the clicked button
  const btn = document.querySelector(`.panic-btn[data-category="${category}"]`);
  if (btn) btn.classList.add("selected");

  // Pick a random scenario from that category
  const pool = scenarios[category];
  const scenario = pool[Math.floor(Math.random() * pool.length)];
  state.selectedScenario = scenario;

  // Show preview
  document.getElementById("scenarioPreviewText").textContent = `"${scenario.trigger}"`;
  document.getElementById("scenarioPreview").classList.remove("hidden");

  // Dim the text input
  const input = document.getElementById("situationInput");
  input.value = "";
  input.disabled = true;
  input.placeholder = "using fast-track scenario above";
}

// ─── CHAR COUNTER ─────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("situationInput");
  const counter = document.getElementById("charCount");

  input.addEventListener("input", () => {
    const len = input.value.length;
    counter.textContent = `${len}/280`;
    counter.style.color = len > 240 ? "rgba(239,68,68,0.7)" : "rgba(255,255,255,0.2)";

    // If user types, deselect category
    if (len > 0 && state.selectedCategory) {
      document.querySelectorAll(".panic-btn").forEach(b => b.classList.remove("selected"));
      state.selectedCategory = null;
      state.selectedScenario = null;
      document.getElementById("scenarioPreview").classList.add("hidden");
    }
  });

  initParticles();
});

// ─── SPIRAL ENGINE ────────────────────────────────────────────────────────────
async function startSpiral() {
  if (state.isRunning) return;

  const input = document.getElementById("situationInput");
  const customText = input.value.trim();

  // Need either custom input or a selected scenario
  if (!customText && !state.selectedScenario) {
    shakeElement(document.getElementById("inputPanel"), false);
    input.focus();
    input.placeholder = "bro... type something or pick a category 💀";
    setTimeout(() => { input.placeholder = "e.g. they used a period at the end of 'ok.'"; }, 2000);
    return;
  }

  // Determine which scenario/thoughts to use
  let triggerText, thoughts;

  if (state.selectedScenario) {
    triggerText = state.selectedScenario.trigger;
    thoughts = state.selectedScenario.thoughts;
  } else {
    // User typed their own situation — pick random thoughts from a random category
    const allCategories = Object.keys(scenarios);
    const randomCat = allCategories[Math.floor(Math.random() * allCategories.length)];
    const pool = scenarios[randomCat];
    const scenario = pool[Math.floor(Math.random() * pool.length)];
    triggerText = customText;
    thoughts = scenario.thoughts;
  }

  // Lock UI
  state.isRunning = true;
  state.currentStep = 0;
  state.rogueNotifFired = false;
  lockUI();

  // Show chaos meter
  const meterEl = document.getElementById("chaosMeter");
  meterEl.style.opacity = "0";
  meterEl.classList.remove("hidden");
  requestAnimationFrame(() => {
    meterEl.style.transition = "opacity 0.4s ease";
    meterEl.style.opacity = "1";
  });

  // Show spiral panel
  const spiralPanel = document.getElementById("spiralPanel");
  spiralPanel.classList.remove("hidden");
  spiralPanel.classList.add("fade-in-up");
  document.getElementById("spiralThoughts").innerHTML = "";

  // Reset diagnosis card
  document.getElementById("diagnosisCard").classList.add("hidden");

  // Scroll to spiral panel
  setTimeout(() => spiralPanel.scrollIntoView({ behavior: "smooth", block: "start" }), 200);

  // Run through thoughts
  for (let i = 0; i < thoughts.length; i++) {
    state.currentStep = i + 1;
    updateChaosBar(i);
    updateStepCounter(i + 1, thoughts.length);

    // Possibly trigger rogue notification at step 4 or 5
    if ((i === 3 || i === 4) && !state.rogueNotifFired && Math.random() > 0.25) {
      state.rogueNotifFired = true;
      setTimeout(() => triggerRogueNotif(), 500);
    }

    await renderThought(thoughts[i], i + 1);
    await wait(1400);
  }

  // All done — show diagnosis
  await wait(600);
  showDiagnosis();
  unlockUI();
}

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
function renderThought(text, stepNum) {
  return new Promise(async (resolve) => {
    const container = document.getElementById("spiralThoughts");

    const wrapper = document.createElement("div");
    wrapper.className = `thought-item step-${stepNum}`;
    wrapper.style.animationDelay = "0ms";

    const numBadge = document.createElement("span");
    numBadge.className = "thought-number";
    numBadge.textContent = `0${stepNum}`;

    const textEl = document.createElement("span");
    textEl.className = "thought-text";

    const cursor = document.createElement("span");
    cursor.className = "thought-cursor";
    textEl.appendChild(cursor);

    wrapper.appendChild(numBadge);
    wrapper.appendChild(textEl);
    container.appendChild(wrapper);

    // Scroll to new thought
    wrapper.scrollIntoView({ behavior: "smooth", block: "end" });

    // Typewrite character by character
    let i = 0;
    const chars = text.split("");
    const delay = () => 28 + Math.floor(Math.random() * 22);

    while (i < chars.length) {
      textEl.insertBefore(document.createTextNode(chars[i]), cursor);
      i++;
      // Scroll during typing
      if (i % 8 === 0) {
        container.scrollTop = container.scrollHeight;
      }
      await wait(delay());
    }

    // Remove cursor after done
    cursor.remove();
    resolve();
  });
}

// ─── CHAOS BAR UPDATE ─────────────────────────────────────────────────────────
function updateChaosBar(stepIndex) {
  const bar = document.getElementById("chaosBar");
  const label = document.getElementById("chaosLabel");
  const percent = document.getElementById("chaosPercent");
  const cfg = chaosStates[stepIndex];

  bar.style.width = `${cfg.percentage}%`;
  bar.className = `chaos-bar h-full rounded-full transition-all duration-700 ease-out ${cfg.barClass}`;
  label.textContent = cfg.label;
  label.className = `font-display font-bold text-xs uppercase tracking-wider ${chaosLabelColors[cfg.color]}`;
  percent.textContent = `${cfg.percentage}%`;

  // Screen shake at step 4 and 5
  if (stepIndex === 3) {
    setTimeout(() => shakeElement(document.body, false), 400);
  }
  if (stepIndex === 4) {
    setTimeout(() => shakeElement(document.body, true), 400);
    setTimeout(() => triggerGlitch(), 600);
  }
}

function updateStepCounter(current, total) {
  document.getElementById("stepCounter").textContent = `step ${current} / ${total}`;
}

// ─── GLITCH TITLE ─────────────────────────────────────────────────────────────
function triggerGlitch() {
  const title = document.getElementById("mainTitle");
  title.classList.add("glitch-active");
  setTimeout(() => title.classList.remove("glitch-active"), 3500);
}

// ─── SHAKE UTILITY ────────────────────────────────────────────────────────────
function shakeElement(el, extreme) {
  const cls = extreme ? "screen-shake-extreme" : "screen-shake";
  el.classList.remove("screen-shake", "screen-shake-extreme");
  requestAnimationFrame(() => {
    el.classList.add(cls);
    el.addEventListener("animationend", () => el.classList.remove(cls), { once: true });
  });
}

// ─── ROGUE NOTIFICATION ───────────────────────────────────────────────────────
function triggerRogueNotif() {
  const notif = document.getElementById("rogueNotif");
  const textEl = document.getElementById("rogueNotifText");
  const msg = rogueNotifications[Math.floor(Math.random() * rogueNotifications.length)];
  textEl.textContent = msg;

  notif.classList.remove("hidden", "hiding");
  // Auto-dismiss after 5s
  if (state.rogueNotifTimeout) clearTimeout(state.rogueNotifTimeout);
  state.rogueNotifTimeout = setTimeout(() => dismissNotif(), 5000);
}

function dismissNotif() {
  const notif = document.getElementById("rogueNotif");
  notif.classList.add("hiding");
  setTimeout(() => {
    notif.classList.add("hidden");
    notif.classList.remove("hiding");
  }, 300);
}

// ─── DIAGNOSIS CARD ────────────────────────────────────────────────────────────
function showDiagnosis() {
  const card = document.getElementById("diagnosisCard");

  // Random picks
  const diagnosis = diagnosisTitles[Math.floor(Math.random() * diagnosisTitles.length)];
  const verdict = aiVerdicts[Math.floor(Math.random() * aiVerdicts.length)];
  const badge = survivalBadges[Math.floor(Math.random() * survivalBadges.length)];

  // Stats
  const logicPct = `${Math.floor(Math.random() * 5 + 1)}%`;
  const delulPct = `${Math.floor(Math.random() * 15 + 85)}%`;
  const finePct = "99.6%";

  document.getElementById("diagnosisTitle").textContent = diagnosis.title;
  document.getElementById("diagnosisSubtitle").textContent = diagnosis.sub;
  document.getElementById("aiVerdict").textContent = verdict;
  document.getElementById("stat1Val").textContent = logicPct;
  document.getElementById("stat2Val").textContent = delulPct;
  document.getElementById("stat3Val").textContent = finePct;
  document.getElementById("survivalEmoji").textContent = badge.emoji;
  document.getElementById("survivalText").textContent = badge.text;

  card.classList.remove("hidden");
  card.classList.add("fade-in-up");

  // Scroll to it
  setTimeout(() => card.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
}

// ─── TOUCH GRASS PROTOCOL ────────────────────────────────────────────────────
function touchGrass() {
  // Flash
  const flash = document.createElement("div");
  flash.className = "flash-overlay";
  document.body.appendChild(flash);
  flash.addEventListener("animationend", () => flash.remove(), { once: true });

  // Show overlay after flash
  setTimeout(() => {
    const overlay = document.getElementById("touchGrassOverlay");
    overlay.classList.remove("hidden");
    overlay.classList.add("visible");
    document.body.style.overflow = "hidden";

    // Reset grass tip animations
    document.querySelectorAll(".grass-tip").forEach(el => {
      el.style.animation = "none";
      requestAnimationFrame(() => {
        el.style.animation = "";
      });
    });
  }, 250);
}

function dismissGrass() {
  const overlay = document.getElementById("touchGrassOverlay");
  overlay.style.opacity = "0";
  overlay.style.transition = "opacity 0.3s ease";
  setTimeout(() => {
    overlay.classList.add("hidden");
    overlay.classList.remove("visible");
    overlay.style.opacity = "";
    overlay.style.transition = "";
    document.body.style.overflow = "";
  }, 300);
}

// ─── RESET ───────────────────────────────────────────────────────────────────
function resetApp() {
  // Undo glitch
  document.getElementById("mainTitle").classList.remove("glitch-active");

  // Reset chaos meter
  const bar = document.getElementById("chaosBar");
  bar.style.width = "0%";
  bar.className = "chaos-bar h-full rounded-full transition-all duration-700 ease-out bg-cyan-400 state-cyan";
  document.getElementById("chaosLabel").textContent = "Chilling (Fake News) 🫡";
  document.getElementById("chaosLabel").className = "font-display font-bold text-xs uppercase tracking-wider text-cyan-400";
  document.getElementById("chaosPercent").textContent = "0%";

  const meterEl = document.getElementById("chaosMeter");
  meterEl.style.opacity = "0";
  setTimeout(() => meterEl.classList.add("hidden"), 500);

  // Clear spiral
  document.getElementById("spiralPanel").classList.add("hidden");
  document.getElementById("spiralThoughts").innerHTML = "";
  document.getElementById("stepCounter").textContent = "step 0 / 6";

  // Hide diagnosis
  document.getElementById("diagnosisCard").classList.add("hidden");

  // Reset input
  const input = document.getElementById("situationInput");
  input.value = "";
  input.disabled = false;
  input.placeholder = "e.g. they used a period at the end of 'ok.'";
  document.getElementById("charCount").textContent = "0/280";
  document.getElementById("scenarioPreview").classList.add("hidden");

  // Clear category selection
  state.selectedCategory = null;
  state.selectedScenario = null;
  document.querySelectorAll(".panic-btn").forEach(b => b.classList.remove("selected"));

  state.isRunning = false;
  state.currentStep = 0;
  state.rogueNotifFired = false;

  // Dismiss any notif
  dismissNotif();

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ─── UI LOCK / UNLOCK ────────────────────────────────────────────────────────
function lockUI() {
  const btn = document.getElementById("simulateBtn");
  const textEl = document.getElementById("simulateBtnText");
  btn.disabled = true;
  textEl.textContent = "⏳ spiraling...";

  document.querySelectorAll(".panic-btn").forEach(b => {
    b.style.pointerEvents = "none";
    b.style.opacity = "0.4";
  });
}

function unlockUI() {
  state.isRunning = false;
  const btn = document.getElementById("simulateBtn");
  const textEl = document.getElementById("simulateBtnText");
  btn.disabled = false;
  textEl.textContent = "⚡ Simulate Spiral";

  document.querySelectorAll(".panic-btn").forEach(b => {
    b.style.pointerEvents = "";
    b.style.opacity = "";
  });
}

// ─── WAIT HELPER ─────────────────────────────────────────────────────────────
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── EXPOSE GLOBALS ──────────────────────────────────────────────────────────
// (needed for inline onclick handlers)
window.startSpiral = startSpiral;
window.selectCategory = selectCategory;
window.touchGrass = touchGrass;
window.dismissGrass = dismissGrass;
window.resetApp = resetApp;
window.dismissNotif = dismissNotif;
