const symbols = [
    "🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓",
    "🍒","🍑","🥭","🍍","🥝","🍅","🥑","🥥",
    "🥕","🌽","🥔","🍆","🥒","🌶️","🥦","🧄",
    "🍞","🧀","🥨","🥐","🍪","🍰","🧁","🍩"
];

let cards = [...symbols, ...symbols];
cards = cards.sort(() => Math.random() - 0.5);

const game = document.getElementById("game");
const clickStatus = document.getElementById("clickStatus");
const attemptsDisplay = document.getElementById("attempts");
const remainingDisplay = document.getElementById("remaining");

let firstCard = null;
let lock = false;
let attempts = 0;
let pairsRemaining = symbols.length;
let startTime = Date.now();

remainingDisplay.textContent = "Paires restantes : " + pairsRemaining;

// Fonction pour formater le temps écoulé
function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
}

// Création des cartes
cards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;

    // Faces
    const back = document.createElement("div");
    back.classList.add("card-face", "card-back");

    const front = document.createElement("div");
    front.classList.add("card-face", "card-front");
    front.textContent = symbol;

    card.appendChild(back);
    card.appendChild(front);

    // Clic
    card.addEventListener("click", () => {
        if (lock || card.classList.contains("flipped")) return;

        card.classList.add("flipped");

        if (!firstCard) {
            firstCard = card;
            clickStatus.textContent = "Sélectionnez la seconde carte";
        } else {
            attempts++;
            attemptsDisplay.textContent = "Tentatives : " + attempts;

            if (firstCard.dataset.symbol === card.dataset.symbol) {
                // Paire trouvée
                card.classList.add("matched");
                firstCard.classList.add("matched");

                // Ajouter au ticket
                addToTicket(card.dataset.symbol);

                pairsRemaining--;
                remainingDisplay.textContent = "Paires restantes : " + pairsRemaining;

                clickStatus.textContent = "Cliquez sur la première carte";
                firstCard = null;

                if (pairsRemaining === 0) {
                    clickStatus.textContent = "🎉 Bravo ! Toutes les paires sont trouvées !";
                    
                    // Calculer le temps écoulé
                    const elapsedTime = formatTime(Date.now() - startTime);
                    
                    // Afficher l'overlay après un court délai
                    setTimeout(() => {
                        showResultOverlay(attempts, elapsedTime);
                    }, 1000);
                }

            } else {
                // Mauvaise paire
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