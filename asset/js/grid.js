const symbols = [
    "🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓",
    "🍒","🍑","🥭","🍍","🥝","🍅","🥑","🥥",
    "🥕","🌽","🥔","🍆","🥒","🌶️","🥦","🧄",
    "🍞","🧀","🥨","🥐","🍪","🍰","🧁","🍩"
];

let cards = [...symbols, ...symbols];  // double chaque symbole

// Mélange
cards = cards.sort(() => Math.random() - 0.5);

const game = document.getElementById("game");
const clickStatus = document.getElementById("clickStatus");
const attemptsDisplay = document.getElementById("attempts");
const remainingDisplay = document.getElementById("remaining");

let firstCard = null;
let lock = false;
let attempts = 0;
let pairsRemaining = symbols.length;

// Affichage initial
remainingDisplay.textContent = "Paires restantes : " + pairsRemaining;

// Création des cartes
cards.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;

    card.addEventListener("click", () => {
        if (lock || card.classList.contains("flipped")) return;

        card.textContent = symbol;
        card.classList.add("flipped");

        if (!firstCard) {
            firstCard = card;
            clickStatus.textContent = "Sélectionnez la seconde carte";
        } else {
            // Deuxième carte
            attempts++;
            attemptsDisplay.textContent = "Tentatives : " + attempts;

            if (firstCard.dataset.symbol === card.dataset.symbol) {
                // Paire trouvée
                pairsRemaining--;
                remainingDisplay.textContent = "Paires restantes : " + pairsRemaining;

                firstCard = null;
                clickStatus.textContent = "Cliquez sur la première carte";

                if (pairsRemaining === 0) {
                    clickStatus.textContent = "🎉 Bravo ! Toutes les paires sont trouvées !";
                }

            } else {
                // Mauvaise paire → on retourne les cartes
                lock = true;
                clickStatus.textContent = "Raté ! Les cartes vont se retourner…";

                setTimeout(() => {
                    card.classList.remove("flipped");
                    card.textContent = "";

                    firstCard.classList.remove("flipped");
                    firstCard.textContent = "";

                    firstCard = null;
                    lock = false;
                    clickStatus.textContent = "Cliquez sur la première carte";
                }, 800);
            }
        }
    });

    game.appendChild(card);
});