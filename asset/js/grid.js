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
// Éléments du DOM
// ----------------------------
const game = document.getElementById("game");
const clickStatus = document.getElementById("clickStatus");
const attemptsDisplay = document.getElementById("attempts");
const remainingDisplay = document.getElementById("remaining");

// ----------------------------
// État du jeu
// ----------------------------
let firstCard = null;
let lock = false;
let attempts = 0;
let pairsRemaining = symbols.length;
let startTime = Date.now();

// ----------------------------
// Initialisation
// ----------------------------
remainingDisplay.textContent = "Paires restantes : " + pairsRemaining;

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
                card.classList.add("matched");
                firstCard.classList.add("matched");

                setTimeout(() => playSound("win", "realiste"), 500);

                if (typeof addToTicket === 'function') addToTicket(card.dataset.symbol);

                pairsRemaining--;
                remainingDisplay.textContent = "Paires restantes : " + pairsRemaining;

                clickStatus.textContent = "Cliquez sur la première carte";
                firstCard = null;

                if (pairsRemaining === 0) {
                    clickStatus.textContent = "🎉 Bravo ! Toutes les paires sont trouvées !";
                    const elapsedTime = formatTime(Date.now() - startTime);
                    
                    // Afficher d'abord l'overlay de résultat
                    setTimeout(() => {
                        if (typeof showResultOverlay === 'function') {
                            showResultOverlay(attempts, elapsedTime);
                        }
                        
                        // Basculer vers la musique de victoire APRÈS l'affichage de l'overlay
                        if (musicPlayer) {
                            musicPlayer.switchToVictoryMode();
                        }
                    }, 1000);
                }

            } else {
                playSound("place", "casino");

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