// ----------------------------
// Données
// ----------------------------
const symbols = [
    "🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓",
    "🍒","🍑","🥭","🍍","🥝","🍅","🥑","🥥",
    "🥕","🌽","🥔","🍆","🥒","🌶️","🥦","🧄",
    "🍞","🧀","🥨","🥐","🍪","🍰","🧁","🍩"
];

let cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);

// ----------------------------
// Éléments DOM
// ----------------------------
const game = document.getElementById("game");
const clickStatus = document.getElementById("clickStatus");
const attemptsDisplay = document.getElementById("attempts");
const remainingDisplay = document.getElementById("remaining");
const scoreDisplay = document.getElementById("score");

// ----------------------------
// État du jeu
// ----------------------------
let firstCard = null;
let lock = false;
let attempts = 0;
let pairsRemaining = symbols.length;
let startTime = Date.now();

remainingDisplay.textContent = "Paires restantes : " + pairsRemaining;

// ----------------------------
// Fonctions utilitaires
// ----------------------------
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
}

function playSound(type, style = "realiste") {
    if (audioManager && !musicPlayer?.isMuted) {
        audioManager.style = style;
        audioManager.play(type);
    }
}

// ----------------------------
// Système de score intégré
// ----------------------------
let score = 0;
const basePoints = 10; // +10 par paire trouvée

const scoreManager = {
    getScore() {
        return score;
    },

    resetScore() {
        score = 0;
        scoreDisplay.textContent = "Score : 0";
    },

    addPoints(comboValue = 1) {
        const gained = basePoints * comboValue;
        score += gained;
        scoreDisplay.textContent = "Score : " + score;
        return gained;
    }
};

// ----------------------------
// Animation flottante du score
// ----------------------------
function showFloatingScore(cardElement, points) {
    const floatEl = document.createElement("div");

    // Déterminer la couleur selon le niveau de combo
    let combo = typeof comboManager !== "undefined" ? comboManager.getComboCount() : 1;
    let color = '#FFD700'; // Or par défaut

    if (combo >= 10) {
        color = '#FF1493'; // Rose vif
    } else if (combo >= 7) {
        color = '#FF4500'; // Orange rouge
    } else if (combo >= 5) {
        color = '#FF8C00'; // Orange foncé
    }

    floatEl.textContent = `+${points}`;
    floatEl.style.position = "absolute";
    floatEl.style.color = color; // ← couleur dynamique selon combo !
    floatEl.style.fontWeight = "bold";
    floatEl.style.fontSize = "24px";

    // Contour noir
    floatEl.style.textShadow =
        "2px 2px 0 #000, -2px 2px 0 #000, 2px -2px 0 #000, -2px -2px 0 #000";

    floatEl.style.pointerEvents = "none";
    floatEl.style.transition = "all 1s ease-out";
    floatEl.style.zIndex = 1000;

    const rect = cardElement.getBoundingClientRect();
    floatEl.style.left = rect.left + rect.width / 2 - 20 + "px";
    floatEl.style.top = rect.top - 20 + "px";

    document.body.appendChild(floatEl);

    setTimeout(() => {
        floatEl.style.top = rect.top - 60 + "px";
        floatEl.style.opacity = 0;
    }, 50);

    setTimeout(() => floatEl.remove(), 1050);
}

// ----------------------------
// Création des cartes
// ----------------------------
cards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;

    const back = document.createElement("div");
    back.classList.add("card-face", "card-back");

    const front = document.createElement("div");
    front.classList.add("card-face", "card-front");
    front.textContent = symbol;

    card.appendChild(back);
    card.appendChild(front);

    card.addEventListener("click", () => {
        if (lock || card.classList.contains("flipped")) return;

        card.classList.add("flipped");

        if (!firstCard) {
            firstCard = card;
            clickStatus.textContent = "Sélectionnez la seconde carte";
            playSound("place", "casino");
        } else {
            attempts++;
            attemptsDisplay.textContent = "Tentatives : " + attempts;

            if (firstCard.dataset.symbol === card.dataset.symbol) {
                // Paire identique trouvée
                card.classList.add("matched");
                firstCard.classList.add("matched");

                if (typeof addToTicket === 'function') addToTicket(card.dataset.symbol);

                // Gestion du combo
                let comboCount = 1;
                let willShowCombo = false;
                if (typeof comboManager !== 'undefined') {
                    comboManager.incrementCombo();
                    comboCount = comboManager.getComboCount();
                    willShowCombo = comboCount >= 2;
                }

                // --- Délai pour synchroniser le +score avec la validation ---
                setTimeout(() => {
                    const points = scoreManager.addPoints(comboCount);
                    showFloatingScore(card, points);
                    console.log(`+${points} points (combo x${comboCount})`);
                }, 700);

                if (!willShowCombo) {
                    setTimeout(() => playSound("win", "realiste"), 500);
                }

                pairsRemaining--;
                remainingDisplay.textContent = "Paires restantes : " + pairsRemaining;

                clickStatus.textContent = "Cliquez sur la première carte";
                firstCard = null;

                // Fin de partie
                if (pairsRemaining === 0) {
                    clickStatus.textContent = "🎉 Bravo ! Toutes les paires sont trouvées !";
                    const elapsedTime = formatTime(Date.now() - startTime);

                    if (typeof comboManager !== 'undefined') {
                        comboManager.finalizeComboStats();
                    }

                    setTimeout(() => {
                        if (typeof showResultOverlay === 'function') {
                            showResultOverlay(attempts, elapsedTime);
                        }
                        if (musicPlayer) {
                            musicPlayer.switchToVictoryMode();
                        }
                    }, 1000);
                }

            } else {
                // Paire incorrecte
                playSound("place", "casino");

                if (typeof comboManager !== 'undefined') {
                    comboManager.resetCombo();
                }

                lock = true;
                clickStatus.textContent = "Raté ! Les cartes vont se retourner…";

                setTimeout(() => {
                    card.classList.remove("flipped");
                    firstCard.classList.remove("flipped");
                    firstCard = null;
                    lock = false;
                    clickStatus.textContent = "Cliquez sur la première carte";
                }, 900);
            }
        }
    });

    game.appendChild(card);
});
