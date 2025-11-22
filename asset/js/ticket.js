// Variable globale pour stocker l'ordre des paires trouvées
let ticket = [];

// Fonction pour ajouter une paire au ticket
function addToTicket(symbol) {
    ticket.push(symbol);
}

// Fonction pour réinitialiser le ticket
function resetTicket() {
    ticket = [];
}

// Fonction pour afficher l'overlay de résultat
function showResultOverlay(attempts, elapsedTime) {
    // Créer l'overlay
    const overlay = document.createElement("div");
    overlay.id = "resultOverlay";
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        animation: fadeIn 0.5s ease;
    `;

    // Créer le contenu
    const content = document.createElement("div");
    content.style.cssText = `
        background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
        border: 3px solid #4caf50;
        border-radius: 15px;
        padding: 40px;
        text-align: center;
        max-width: 500px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.5s ease;
    `;

    // Titre
    const title = document.createElement("h2");
    title.textContent = "🎉 RÉSULTAT 🎉";
    title.style.cssText = `
        color: #4caf50;
        font-size: 2.5rem;
        margin: 0 0 30px 0;
        text-shadow: 0 0 10px rgba(76, 175, 80, 0.5);
    `;

    // Score
    const scoreDiv = document.createElement("div");
    scoreDiv.style.cssText = `
        background: #333;
        border-radius: 10px;
        padding: 20px;
        margin-bottom: 25px;
        border: 2px solid #444;
    `;
    scoreDiv.innerHTML = `
        <div style="font-size: 1.3rem; color: #fff; margin-bottom: 10px;">
            ⏱️ <strong>Temps:</strong> ${elapsedTime}
        </div>
        <div style="font-size: 1.3rem; color: #fff;">
            🎯 <strong>Tentatives:</strong> ${attempts}
        </div>
    `;

    // Ticket de loto
    const ticketDiv = document.createElement("div");
    ticketDiv.style.cssText = `
        background: #fff;
        color: #000;
        border-radius: 10px;
        padding: 25px 20px;
        margin: 25px 0;
        border: 3px dashed #888;
        box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
        position: relative;
    `;

    // En-tête du ticket
    const ticketHeader = document.createElement("div");
    ticketHeader.textContent = "🎫 TICKET DE LOTTERIE";
    ticketHeader.style.cssText = `
        font-weight: bold;
        font-size: 1.1rem;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px dashed #888;
        letter-spacing: 1px;
    `;

    // Grille des symboles
    const ticketGrid = document.createElement("div");
    ticketGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 8px;
        margin: 15px 0;
    `;

    ticket.forEach((symbol, index) => {
        const symbolDiv = document.createElement("div");
        symbolDiv.textContent = symbol;
        symbolDiv.style.cssText = `
            font-size: 1.8rem;
            background: ${index % 2 === 0 ? '#f0f0f0' : '#e8e8e8'};
            border-radius: 5px;
            padding: 5px;
            border: 1px solid #ccc;
        `;
        ticketGrid.appendChild(symbolDiv);
    });

    // Numéro de ticket
    const ticketNumber = document.createElement("div");
    ticketNumber.textContent = `N° ${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    ticketNumber.style.cssText = `
        font-size: 0.9rem;
        margin-top: 15px;
        padding-top: 10px;
        border-top: 2px dashed #888;
        color: #666;
        font-family: monospace;
    `;

    ticketDiv.appendChild(ticketHeader);
    ticketDiv.appendChild(ticketGrid);
    ticketDiv.appendChild(ticketNumber);

    // Conteneur des boutons
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.cssText = `
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 20px;
    `;

    // Bouton voir la grille
    const viewGridButton = document.createElement("button");
    viewGridButton.textContent = "🎯 Voir la grille";
    viewGridButton.style.cssText = `
        background: #2196F3;
        color: white;
        border: none;
        padding: 15px 40px;
        font-size: 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: bold;
    `;
    viewGridButton.onmouseover = () => {
        viewGridButton.style.background = "#1976D2";
        viewGridButton.style.transform = "scale(1.05)";
    };
    viewGridButton.onmouseout = () => {
        viewGridButton.style.background = "#2196F3";
        viewGridButton.style.transform = "scale(1)";
    };
    viewGridButton.onclick = () => {
        // Cacher le contenu du résultat
        content.style.display = "none";
        
        // Réduire l'opacité de l'overlay pour mieux voir la grille
        overlay.style.background = "rgba(0, 0, 0, 0)";
        
        // Créer le bouton "Voir le ticket" en bas
        const backButton = document.createElement("button");
        backButton.id = "backToTicketButton";
        backButton.textContent = "🎫 Voir le ticket";
        backButton.style.cssText = `
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%);
            background: #FF9800;
            color: white;
            border: none;
            padding: 15px 40px;
            font-size: 1.2rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: bold;
            z-index: 1001;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        `;
        backButton.onmouseover = () => {
            backButton.style.background = "#F57C00";
            backButton.style.transform = "translateX(-50%) scale(1.05)";
        };
        backButton.onmouseout = () => {
            backButton.style.background = "#FF9800";
            backButton.style.transform = "translateX(-50%) scale(1)";
        };
        backButton.onclick = () => {
            // Restaurer l'overlay et afficher le contenu du ticket
            overlay.style.background = "rgba(0, 0, 0, 0.85)";
            content.style.display = "block";
            backButton.remove();
        };
        
        document.body.appendChild(backButton);
    };

    // Bouton rejouer
    const replayButton = document.createElement("button");
    replayButton.textContent = "🔄 Rejouer";
    replayButton.style.cssText = `
        background: #4caf50;
        color: white;
        border: none;
        padding: 15px 40px;
        font-size: 1.2rem;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: bold;
    `;
    replayButton.onmouseover = () => {
        replayButton.style.background = "#45a049";
        replayButton.style.transform = "scale(1.05)";
    };
    replayButton.onmouseout = () => {
        replayButton.style.background = "#4caf50";
        replayButton.style.transform = "scale(1)";
    };
    replayButton.onclick = () => {
        location.reload();
    };

    // Ajouter les boutons au conteneur
    buttonsContainer.appendChild(viewGridButton);
    buttonsContainer.appendChild(replayButton);

    // Assembler le contenu
    content.appendChild(title);
    content.appendChild(scoreDiv);
    content.appendChild(ticketDiv);
    content.appendChild(buttonsContainer);
    overlay.appendChild(content);

    // Ajouter les animations CSS
    const style = document.createElement("style");
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { 
                transform: translateY(50px);
                opacity: 0;
            }
            to { 
                transform: translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Ajouter l'overlay au body
    document.body.appendChild(overlay);
}