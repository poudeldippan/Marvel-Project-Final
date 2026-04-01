
// ==========================================
// SCROLL ANIMATIONS / INTERSECTION OBSERVER
// ==========================================
const scrollElements = document.querySelectorAll(".scroll-anim");

const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;
    return (elementTop <= (window.innerHeight || document.documentElement.clientHeight) / dividend);
};

const displayScrollElement = (element) => {
    element.classList.add("appear");
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 1.15)) {
            displayScrollElement(el);
        }
    });
}
window.addEventListener("scroll", handleScrollAnimation);
window.addEventListener("load", handleScrollAnimation);


// ==========================================
// NAVBAR SCROLL SHRINK + MOBILE MENU
// ==========================================
const navbar = document.getElementById("navbar");

// Shrink navbar on scroll
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar && navbar.classList.add("scrolled");
    } else {
        navbar && navbar.classList.remove("scrolled");
    }
});

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
    });
}

// Close mobile menu when clicking any nav link
const navItems = document.querySelectorAll(".nav-links a");
navItems.forEach(item => {
    item.addEventListener("click", () => {
        if (hamburger && hamburger.classList.contains("active")) {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
        }
    });
});


// ==========================================
// DARK MODE TOGGLE
// ==========================================
const themeToggleBtn = document.getElementById('theme-toggle');

// Check Local Storage
let currentTheme = null;
try {
    currentTheme = localStorage.getItem('theme');
} catch (e) {
    console.log("LocalStorage restricted (likely running via file://)");
}

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark' && themeToggleBtn) {
        themeToggleBtn.textContent = '☀️';
    }
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.removeAttribute('data-theme');
            try { localStorage.setItem('theme', 'light'); } catch (e) { }
            themeToggleBtn.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            try { localStorage.setItem('theme', 'dark'); } catch (e) { }
            themeToggleBtn.textContent = '☀️';
        }
    });
}

// ==========================================
// CONTACT FORM VALIDATION
// ==========================================
const contactForm = document.getElementById("contact-form");

if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();

        let isValid = true;

        // Name validation
        const nameInput = document.getElementById("name");
        const nameError = document.getElementById("name-error");
        if (nameInput.value.trim() === "") {
            nameError.style.display = "block";
            isValid = false;
        } else {
            nameError.style.display = "none";
        }

        // Email validation
        const emailInput = document.getElementById("email");
        const emailError = document.getElementById("email-error");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailError.style.display = "block";
            isValid = false;
        } else {
            emailError.style.display = "none";
        }

        // Message validation
        const messageInput = document.getElementById("message");
        const messageError = document.getElementById("message-error");
        if (messageInput.value.trim().length < 10) {
            messageError.style.display = "block";
            isValid = false;
        } else {
            messageError.style.display = "none";
        }

        if (isValid) {
            // Prepare data as JSON for Web3Forms AJAX
            const formData = new FormData(contactForm);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);

            const web3FormsEndpoint = "https://api.web3forms.com/submit";

            // Try background transmission (AJAX) first
            fetch(web3FormsEndpoint, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: json
            })
                .then(async (response) => {
                    const data = await response.json();
                    if (response.status === 200 || data.success) {
                        document.getElementById("success-box").style.display = "block";
                        contactForm.reset();
                        setTimeout(() => {
                            document.getElementById("success-box").style.display = "none";
                        }, 5000);
                    } else {
                        throw new Error(data.message || "Web3Forms submission failed");
                    }
                })
                .catch(error => {
                    console.warn("AJAX Submission failed, falling back to standard redirect:", error);
                    // Standard POST submission fallback - works on file:// or if AJAX is blocked
                    contactForm.submit();
                });
        }
    });
}

// ==========================================
// DOOMSDAY COUNTDOWN TIMER
// ==========================================
const doomDaysEl = document.getElementById("days");
const doomHoursEl = document.getElementById("hours");
const doomMinsEl = document.getElementById("minutes");
const doomSecsEl = document.getElementById("seconds");
const doomMessage = document.getElementById("doomsday-message");
const countdownTimer = document.getElementById("countdown-timer");
const doomProgress = document.getElementById("countdown-progress");

// 8 months, 18 days, 19 hours, 20 mins, 10 secs from March 29, 2026.
const targetDoomsday = new Date("December 18, 2026 10:43:15").getTime();
const startDoomsday = new Date("March 29, 2026 15:23:05").getTime(); // Reference point
const totalDuration = targetDoomsday - startDoomsday;

if (doomDaysEl) {
    const updateCountdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDoomsday - now;

        // Progress bar calculation
        const timePassed = now - startDoomsday;
        let progressPercentage = (timePassed / totalDuration) * 100;
        if (progressPercentage > 100) progressPercentage = 100;
        if (progressPercentage < 0) progressPercentage = 0;
        doomProgress.style.width = `${progressPercentage}%`;

        // When countdown reaches 0
        if (distance < 0) {
            clearInterval(updateCountdown);
            countdownTimer.style.display = "none";
            doomMessage.style.display = "block";

            // Optional bonus sound effect
            try { new Audio('assets/explosion.mp3').play().catch(e => { }); } catch (e) { }
            return;
        }

        // Time calculations
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // UI Push
        doomDaysEl.textContent = days < 10 ? "0" + days : days;
        doomHoursEl.textContent = hours < 10 ? "0" + hours : hours;
        doomMinsEl.textContent = minutes < 10 ? "0" + minutes : minutes;
        doomSecsEl.textContent = seconds < 10 ? "0" + seconds : seconds;

    }, 1000);
}


// ==========================================
// TRIVIA GAME LOGIC
// ==========================================
const allQuizData = [
    { q: "What is the real name of Spider-Man?", a: "Peter Parker", b: "Steve Rogers", c: "Tony Stark", d: "Bruce Banner", c_ans: "a" },
    { q: "Which metal is Captain America’s shield made from?", a: "Adamantium", b: "Vibranium", c: "Uru", d: "Titanium", c_ans: "b" },
    { q: "Who is Tony Stark’s AI assistant?", a: "FRIDAY", b: "JARVIS", c: "KAREN", d: "EDITH", c_ans: "a" },
    { q: "What is Thor the god of?", a: "Fire", b: "Thunder", c: "War", d: "Mischief", c_ans: "b" },
    { q: "Who is the main villain in Avengers: Infinity War?", a: "Ultron", b: "Loki", c: "Thanos", d: "Hela", c_ans: "c" },
    { q: "What is Black Widow’s real name?", a: "Natasha Romanoff", b: "Wanda Maximoff", c: "Sharon Carter", d: "Peggy Carter", c_ans: "a" },
    { q: "Which superhero is known as the “Friendly Neighborhood” hero?", a: "Spider-Man", b: "Daredevil", c: "Iron Man", d: "Ant-Man", c_ans: "a" },
    { q: "What is the name of Peter Quill’s alter ego?", a: "Star Lord", b: "Rocket", c: "Drax", d: "Yondu", c_ans: "a" },
    { q: "Who is the king of Wakanda?", a: "Killmonger", b: "T’Challa", c: "M’Baku", d: "Shuri", c_ans: "b" },
    { q: "What is the name of Thor’s hammer?", a: "Stormbreaker", b: "Mjolnir", c: "Gungnir", d: "Infinity Hammer", c_ans: "b" },
    { q: "Which Infinity Stone is hidden in Vision’s forehead?", a: "Mind Stone", b: "Power Stone", c: "Time Stone", d: "Soul Stone", c_ans: "a" },
    { q: "Who trained Doctor Strange in the mystic arts?", a: "Kaecilius", b: "Wong", c: "The Ancient One", d: "Mordo", c_ans: "c" },
    { q: "What species is Loki originally?", a: "Human", b: "Frost Giant", c: "Elf", d: "Asgardian", c_ans: "b" },
    { q: "Who is Ant-Man’s daughter?", a: "Cassie Lang", b: "Hope van Dyne", c: "Janet van Dyne", d: "Nadia Pym", c_ans: "a" },
    { q: "What is the name of the raccoon in Guardians of the Galaxy?", a: "Groot", b: "Rocket", c: "Drax", d: "Cosmo", c_ans: "b" },
    { q: "Who breaks the Sokovia Accords by helping Captain America?", a: "Tony Stark", b: "Natasha Romanoff", c: "Bucky Barnes", d: "Sam Wilson", c_ans: "c" },
    { q: "What is the name of Iron Man’s company?", a: "Wayne Enterprises", b: "Stark Industries", c: "Hammer Tech", d: "Pym Technologies", c_ans: "b" },
    { q: "Which Avenger can shrink and grow in size?", a: "Ant-Man", b: "Wasp", c: "Hulk", d: "Vision", c_ans: "a" },
    { q: "What is the name of Hulk’s human form?", a: "Bruce Wayne", b: "Bruce Banner", c: "Tony Banner", d: "Peter Banner", c_ans: "b" },
    { q: "Which Avenger uses a bow and arrow?", a: "Hawkeye", b: "Green Arrow", c: "Rocket", d: "Falcon", c_ans: "a" },
    { q: "What is the name of the organization led by Nick Fury?", a: "S.H.I.E.L.D.", b: "HYDRA", c: "A.I.M.", d: "S.W.O.R.D.", c_ans: "a" },
    { q: "Who killed Tony Stark’s parents?", a: "Loki", b: "Bucky Barnes", c: "Thanos", d: "Ultron", c_ans: "b" },
    { q: "Which Infinity Stone controls time?", a: "Mind Stone", b: "Soul Stone", c: "Time Stone", d: "Reality Stone", c_ans: "c" },
    { q: "What planet is Thor from?", a: "Midgard", b: "Asgard", c: "Vanaheim", d: "Jotunheim", c_ans: "b" },
    { q: "Who is the Scarlet Witch’s brother?", a: "Pietro Maximoff", b: "Vision", c: "Quicksilver", d: "Wanda", c_ans: "a" },
    { q: "What is the name of the prison in Guardians of the Galaxy?", a: "The Raft", b: "The Kyln", c: "The Collector’s Prison", d: "The Vault", c_ans: "b" },
    { q: "Who is the villain in Black Panther?", a: "Killmonger", b: "M’Baku", c: "Klaw", d: "Thanos", c_ans: "a" },
    { q: "What is Doctor Strange’s profession before becoming a sorcerer?", a: "Scientist", b: "Neurosurgeon", c: "Archaeologist", d: "Engineer", c_ans: "b" },
    { q: "Which Avenger says “I can do this all day”?", a: "Steve Rogers", b: "Tony Stark", c: "Thor", d: "Clint Barton", c_ans: "a" },
    { q: "What is the name of Spider-Man’s best friend in the MCU?", a: "Ned Leeds", b: "Harry Osborn", c: "Flash Thompson", d: "Peter Parker Jr.", c_ans: "a" },
    { q: "What is the name of Thanos’s weapon?", a: "Infinity Gauntlet", b: "Nano Gauntlet", c: "Power Glove", d: "Infinity Blade", c_ans: "a" },
    { q: "Who is the first Avenger recruited by Nick Fury?", a: "Iron Man", b: "Captain America", c: "Thor", d: "Hulk", c_ans: "a" },
    { q: "What is the name of the AI that replaces JARVIS?", a: "KAREN", b: "FRIDAY", c: "EDITH", d: "VISION", c_ans: "a" },
    { q: "Which Avenger was a former KGB assassin?", a: "Black Widow", b: "Hawkeye", c: "Winter Soldier", d: "Scarlet Witch", c_ans: "a" },
    { q: "What is the name of the Asgardian bridge?", a: "Rainbow Bridge", b: "Bifrost", c: "Heimdall’s Gate", d: "Yggdrasil", c_ans: "a" },
    { q: "Who sacrifices themselves for the Soul Stone?", a: "Tony Stark", b: "Natasha Romanoff", c: "Gamora", d: "Vision", c_ans: "b" },
    { q: "What is the name of the battle in Avengers: Endgame final scene?", a: "Battle of Wakanda", b: "Battle of Titan", c: "Battle of Earth", d: "Battle of Asgard", c_ans: "c" },
    { q: "Who is the leader of the Guardians of the Galaxy?", a: "Rocket", b: "Drax", c: "Star-Lord", d: "Groot", c_ans: "c" },
    { q: "What element does Tony Stark discover to create a new arc reactor?", a: "Palladium", b: "Vibranium", c: "New element", d: "Adamantium", c_ans: "c" },
    { q: "What is the name of Captain Marvel’s alien race?", a: "Kree", b: "Skrull", c: "Asgardians", d: "Xandarians", c_ans: "a" },
    { q: "What does S.H.I.E.L.D. stand for?", a: "Strategic Homeland Intervention, Enforcement and Logistics Division", b: "Special Heroes International Logistics Department", c: "Secret Heroes Intervention and Leadership Division", d: "Strategic Heroes International League Department", c_ans: "a" },
    { q: "Who created Ultron?", a: "Hank Pym", b: "Tony Stark", c: "Bruce Banner", d: "Thanos", c_ans: "b" },
    { q: "What is the name of Hawkeye’s wife?", a: "Natasha Romanoff", b: "Wanda Maximoff", c: "Laura Barton", d: "Pepper Potts", c_ans: "c" },
    { q: "Which Avenger was trapped in the Quantum Realm?", a: "Tony Stark", b: "Scott Lang", c: "Steve Rogers", d: "Natasha Romanoff", c_ans: "b" },
    { q: "What is the name of the dark dimension ruler in Doctor Strange?", a: "Dormammu", b: "Mephisto", c: "Nightmare", d: "Kaecilius", c_ans: "a" },
    { q: "Who becomes Captain America after Steve Rogers?", a: "Sam Wilson", b: "Bucky Barnes", c: "Tony Stark", d: "Peter Parker", c_ans: "a" },
    { q: "What is the name of Thor’s sister?", a: "Hela", b: "Sif", c: "Valkyrie", d: "Frigga", c_ans: "a" },
    { q: "Which character can control minds with a stone?", a: "Loki", b: "Ultron", c: "Thanos", d: "Red Skull", c_ans: "a" },
    { q: "What is the name of the multiverse villain in Doctor Strange 2?", a: "Dormammu", b: "Mephisto", c: "Baron Mordo", d: "Gargantos", c_ans: "d" },
    { q: "What phrase does Thanos say before snapping his fingers?", a: "I am inevitable", b: "I am inevitable… maybe", c: "By my hand", d: "This is the end", c_ans: "a" }
];

let currentQuizSet = [];

function initQuizSet() {
    // Clone and shuffle the source array
    let pool = [...allQuizData];
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    // Pick 10 random questions
    currentQuizSet = pool.slice(0, 10);
    currentQuestion = 0;
    score = 0;
}

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");

const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const feedbackText = document.getElementById("feedback-text");
const nextBtn = document.getElementById("next-btn");
const scoreDisplay = document.getElementById("score-display");
const questionProgress = document.getElementById("question-progress");

const finalScoreEl = document.getElementById("final-score");
const resultMessageEl = document.getElementById("result-message");
const restartBtn = document.getElementById("restart-btn");

let currentQuestion = 0;
let score = 0;

// Audio Placeholders (Can be replaced by actual file paths provided by user later)
const correctSoundPath = ''; // e.g. 'assets/correct.mp3'
const wrongSoundPath = '';   // e.g. 'assets/wrong.mp3'

function playSound(isCorrect) {
    try {
        if (isCorrect && correctSoundPath) {
            new Audio(correctSoundPath).play().catch(e => console.log("Audio blocked", e));
        } else if (!isCorrect && wrongSoundPath) {
            new Audio(wrongSoundPath).play().catch(e => console.log("Audio blocked", e));
        }
    } catch (e) {
        console.log("Audio error:", e);
    }
}

if (startBtn) {
    startBtn.addEventListener("click", () => {
        initQuizSet();
        startScreen.style.display = "none";
        quizScreen.style.display = "block";
        loadQuestion();
    });
}

function loadQuestion() {
    // Reset state
    answersContainer.innerHTML = "";
    feedbackText.textContent = "";
    nextBtn.style.display = "none";

    // Build question
    const qData = currentQuizSet[currentQuestion];
    questionText.textContent = qData.q;
    questionProgress.textContent = `Question ${currentQuestion + 1}/${currentQuizSet.length}`;
    scoreDisplay.textContent = `Score: ${score}`;

    // Options mapping & Shuffle Options? The prompt didn't ask to shuffle options but why not? Actually, let's keep it steady (a b c d).
    const options = [
        { key: 'a', val: qData.a },
        { key: 'b', val: qData.b },
        { key: 'c', val: qData.c },
        { key: 'd', val: qData.d }
    ];

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.classList.add("answer-btn");
        btn.textContent = opt.val;
        btn.addEventListener("click", () => selectAnswer(opt.key, btn));
        answersContainer.appendChild(btn);
    });
}

function selectAnswer(selectedKey, selectedBtn) {
    const qData = currentQuizSet[currentQuestion];
    const isCorrect = (selectedKey === qData.c_ans);

    const allButtons = answersContainer.querySelectorAll(".answer-btn");

    // Disable all buttons to prevent multiple clicks
    allButtons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        feedbackText.textContent = "Correct! 🎯";
        feedbackText.style.color = "#28a745";
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        playSound(true);
    } else {
        selectedBtn.classList.add("wrong");
        feedbackText.textContent = "Wrong! ❌";
        feedbackText.style.color = "var(--primary-color)";
        playSound(false);

        // Highlight correct answer
        const optionKeys = ['a', 'b', 'c', 'd'];
        const correctIndex = optionKeys.indexOf(qData.c_ans);
        if (correctIndex >= 0 && allButtons[correctIndex]) {
            allButtons[correctIndex].classList.add("correct");
        }
    }

    nextBtn.style.display = "block";
}

if (nextBtn) {
    nextBtn.addEventListener("click", () => {
        currentQuestion++;
        if (currentQuestion < currentQuizSet.length) {
            loadQuestion();
        } else {
            showResults();
        }
    });
}

function showResults() {
    quizScreen.style.display = "none";
    resultScreen.style.display = "block";
    finalScoreEl.textContent = `${score} / ${currentQuizSet.length}`;

    const resultImageEl = document.getElementById("result-image");
    if (resultImageEl) resultImageEl.style.display = "block";

    // Reset minute details styles from prior rounds
    finalScoreEl.style.color = "var(--primary-color)";
    finalScoreEl.style.textShadow = "none";
    finalScoreEl.style.transform = "scale(1)";

    if (score === currentQuizSet.length) {
        if (resultImageEl) resultImageEl.src = "assets/stanlee.webp";
        resultMessageEl.textContent = "🏆 FLAWLESS VICTORY! Excelsior! You're a true Marvel Insider. Stan Lee would be immensely proud. You've earned a meeting with Eternity itself! ✨💥";

        // Eye-catching minute details for perfect score
        finalScoreEl.style.color = "#F4C430"; // Marvel Gold
        finalScoreEl.style.textShadow = "0 0 20px #F4C430";
        finalScoreEl.style.transform = "scale(1.3)";
        finalScoreEl.style.transition = "all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

        // Trigger party popper effect
        startConfetti();
    } else if (score >= 7) {
        if (resultImageEl) resultImageEl.src = "assets/spiderman.jpg";
        resultMessageEl.textContent = "🕷️ Great job, friendly neighborhood hero! You know your stuff. S.H.I.E.L.D. is currently reviewing your file for the Avengers Initiative!";
    } else if (score >= 5) {
        if (resultImageEl) resultImageEl.src = "assets/nickfury.avif";
        resultMessageEl.textContent = "👁️ Nick Fury is unimpressed. You know enough to survive, but not enough to lead. Get back to the training room, cadet!";
    } else if (score > 1) {
        if (resultImageEl) resultImageEl.src = "assets/nickfury.avif";
        resultMessageEl.innerHTML = "😭 <b>Are you even trying?</b> Your Marvel knowledge is depressing. Even Aunt May knows more than this! Study harder, you're embarrassing the multiverse!";
    } else {
        if (resultImageEl) resultImageEl.src = "assets/doomsday.jpg";
        resultMessageEl.innerHTML = "💀 <b>WOW, JUST WOW.</b> 💀<br>You managed to get almost everything wrong. Are you a Skrull trying to blend in? Because you're failing MISERABLY!<br>Maybe try a DC quiz next time? This is just embarrassing!";
    }
}

if (restartBtn) {
    restartBtn.addEventListener("click", () => {
        initQuizSet();
        resultScreen.style.display = "none";
        quizScreen.style.display = "block";
        loadQuestion();

        // Stop confetti on restart
        if (typeof stopConfetti === "function") {
            stopConfetti();
        }
    });
}

// ==========================================
// RUNAWAY 'CONTACT ME' BUTTON
// ==========================================
const runawayBtn = document.getElementById("runaway-btn");

if (runawayBtn) {
    const triggerRunaway = (e) => {
        // Prevent default touch behavior so it acts as hover for touchscreens
        if (e.type === 'touchstart') e.preventDefault();

        const container = runawayBtn.parentElement;
        const containerRect = container.getBoundingClientRect();

        const btnWidth = runawayBtn.offsetWidth;
        const btnHeight = runawayBtn.offsetHeight;

        // Boundaries inside the relative container
        const maxLeft = containerRect.width - btnWidth;
        const maxTop = containerRect.height - btnHeight;

        const newLeft = Math.floor(Math.random() * maxLeft);
        const newTop = Math.floor(Math.random() * maxTop);

        runawayBtn.style.left = `${newLeft}px`;
        runawayBtn.style.top = `${newTop}px`;
    };

    runawayBtn.addEventListener("mouseover", triggerRunaway);
    runawayBtn.addEventListener("touchstart", triggerRunaway, { passive: false });

    // Fallback if they somehow manage to click it
    runawayBtn.addEventListener("click", () => {
        const dpModal = document.getElementById("deadpool-modal");
        if (dpModal) {
            dpModal.classList.remove("hidden");
        } else {
            alert("Wait... how did you click that?! Dam i am amazed here's my number.\n\ncall me : 9863199634 ");
        }
    });
}

// Modal Closing Elements
const dpModal = document.getElementById("deadpool-modal");
const closeDpModal = document.getElementById("close-dp-modal");

if (dpModal && closeDpModal) {
    closeDpModal.addEventListener("click", () => dpModal.classList.add("hidden"));

    // Close on outside overlay click
    dpModal.addEventListener("click", (e) => {
        if (e.target === dpModal) {
            dpModal.classList.add("hidden");
        }
    });
}

// ==========================================
// CONFETTI ANIMATION (MINUTE DETAILS)
// ==========================================
let confettiAnimId;
const confettiCanvas = document.createElement("canvas");
confettiCanvas.style.position = "fixed";
confettiCanvas.style.top = "0";
confettiCanvas.style.left = "0";
confettiCanvas.style.width = "100%";
confettiCanvas.style.height = "100%";
confettiCanvas.style.pointerEvents = "none";
confettiCanvas.style.zIndex = "9999";
confettiCanvas.style.display = "none";
document.body.appendChild(confettiCanvas);

const ctx = confettiCanvas.getContext("2d");
let particles = [];
const confettiColors = ["#EC1D24", "#F4C430", "#ffffff", "#2f8c5b", "#1E90FF", "#8A2BE2"];

function createParticle() {
    return {
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * confettiCanvas.height - confettiCanvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * particles.length,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleInc: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0
    };
}

function startConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCanvas.style.display = "block";
    particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push(createParticle());
    }

    function animate() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        particles.forEach((p) => {
            p.tiltAngle += p.tiltAngleInc;
            p.y += (Math.cos(p.d) + 1 + p.r / 2) / 2;
            p.x += Math.sin(p.d);

            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();

            // Loop particle at top when it falls off screen
            if (p.y > confettiCanvas.height) {
                p.x = Math.random() * confettiCanvas.width;
                p.y = -20;
                p.tilt = Math.floor(Math.random() * 10) - 10;
            }
        });

        confettiAnimId = requestAnimationFrame(animate);
    }

    animate();
}

function stopConfetti() {
    confettiCanvas.style.display = "none";
    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles = [];
}
