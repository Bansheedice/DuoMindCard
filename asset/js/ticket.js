// ==========================================
// TICKET.JS — VERSION COMPLÈTE & CORRIGÉE
// ==========================================

// Stockage de l'ordre des paires trouvées
let ticket = [];

// Pour éviter de relancer les confettis en boucle
let confettiStarted = false;

// Ajouter une paire
function addToTicket(symbol) {
    ticket.push(symbol);
}

// Reset du ticket
function resetTicket() {
    ticket = [];
    confettiStarted = false;
}

// Fonction d'affichage du résultat
function showResultOverlay(attempts, elapsedTime) {

    // Créer overlay noir
    const overlay = document.createElement("div");
    overlay.id = "resultOverlay";
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0);
        display: flex;
        justify-content: center;
        align-items: center;
        transition: background .6s ease;
    `;

    // Conteneur du contenu
    const content = document.createElement("div");
    content.style.cssText = `
        background: linear-gradient(145deg,#2a2a2a,#1a1a1a);
        border: 3px solid #4caf50;
        border-radius: 15px;
        padding: 40px;
        text-align: center;
        width: 550px;
        box-shadow: 0 10px 50px rgba(0,0,0,.5);
        opacity: 0;
        transform: scale(.8) translateY(20px);
        transition: all .6s cubic-bezier(.34,1.56,.64,1);
    `;

    // Titre
    const title = document.createElement("h2");
    title.textContent = "🎉 RÉSULTAT 🎉";
    title.style.cssText = `
        color:#4caf50;
        font-size:2.4rem;
        margin-bottom:25px;
        text-shadow:0 0 10px rgba(76,175,80,.5);
    `;

    // Score
    const score = document.createElement("div");
    score.style.cssText = `
        background:#333;
        padding:20px;
        border-radius:10px;
        margin-bottom:25px;
        border:2px solid #444;
    `;
    score.innerHTML = `
        <div style="color:white;font-size:1.3rem;margin-bottom:10px;">
            ⏱️ <b>Temps :</b> ${elapsedTime}
        </div>
        <div style="color:white;font-size:1.3rem;">
            🎯 <b>Tentatives :</b> ${attempts}
        </div>
    `;

    // Ticket visuel
    const ticketContainer = document.createElement("div");
    ticketContainer.style.cssText = `
        background:white;
        color:black;
        border-radius:10px;
        padding:25px;
        border:3px dashed #888;
        margin:25px 0;
    `;

    const ticketHeader = document.createElement("div");
    ticketHeader.textContent = "🎫 TICKET DE RÉUSSITE";
    ticketHeader.style.cssText = `
        font-size:1.1rem;
        font-weight:bold;
        margin-bottom:15px;
        padding-bottom:10px;
        border-bottom:2px dashed #888;
        text-align:center;
    `;

    const grid = document.createElement("div");
    grid.style.cssText = `
        display:grid;
        grid-template-columns:repeat(8,1fr);
        gap:8px;
    `;

    ticket.forEach((sym, i) => {
        const c = document.createElement("div");
        c.textContent = sym;
        c.style.cssText = `
            font-size:1.8rem;
            padding:5px;
            border-radius:5px;
            background:${i%2===0 ? "#f0f0f0" : "#e8e8e8"};
            border:1px solid #ccc;
            text-align:center;
        `;
        grid.appendChild(c);
    });

    const ticketNumber = document.createElement("div");
    ticketNumber.textContent = "N° " + Math.random().toString(36).substring(2,9).toUpperCase();
    ticketNumber.style.cssText = `
        margin-top:15px;
        padding-top:10px;
        border-top:2px dashed #888;
        font-size:.9rem;
        color:#666;
        text-align:center;
        font-family:monospace;
    `;

    ticketContainer.appendChild(ticketHeader);
    ticketContainer.appendChild(grid);
    ticketContainer.appendChild(ticketNumber);

    // ----------------------
    // BOUTONS
    // ----------------------

    const btnZone = document.createElement("div");
    btnZone.style.cssText = `
        display:flex;
        gap:15px;
        justify-content:center;
        margin-top:25px;
    `;

    // Voir la grille
    const btnGrid = document.createElement("button");
    btnGrid.textContent = "🎯 Voir la grille";
    btnGrid.style.cssText = `
        background:#2196F3;
        color:white;
        border:none;
        padding:15px 40px;
        font-size:1.2rem;
        border-radius:8px;
        cursor:pointer;
        font-weight:bold;
        transition:.3s;
    `;
    btnGrid.onmouseenter = () => btnGrid.style.transform="scale(1.05)";
    btnGrid.onmouseleave = () => btnGrid.style.transform="scale(1)";

    btnGrid.onclick = () => {

        // DISPARITION du ticket
        content.style.opacity = "0";
        content.style.transform = "scale(0.9) translateY(-20px)";

        setTimeout(() => {

            content.style.display = "none";
            overlay.style.background = "rgba(0,0,0,0.10)";

            // Bouton BAS pour revenir au ticket
            const back = document.createElement("button");
            back.textContent = "🎫 Voir le ticket";
            back.style.cssText = `
                position:fixed;
                bottom:40px;
                left:50%;
                transform:translateX(-50%) translateY(100px);
                padding:15px 40px;
                background:#FF9800;
                color:white;
                font-size:1.2rem;
                border-radius:8px;
                border:none;
                cursor:pointer;
                font-weight:bold;
                opacity:0;
                transition:.4s cubic-bezier(.34,1.56,.64,1);
                z-index:1600;
            `;

            back.onclick = () => {
                // réaffiche le ticket
                overlay.style.background = "rgba(0,0,0,0.85)";

                content.style.display = "block";
                requestAnimationFrame(() => {
                    content.style.opacity = "1";
                    content.style.transform = "scale(1) translateY(0)";
                });

                // relance confettis
                if (typeof launchConfetti === "function") {
                    launchConfetti();
                }

                back.remove();
            };

            document.body.appendChild(back);

            requestAnimationFrame(() => {
                back.style.opacity = "1";
                back.style.transform = "translateX(-50%) translateY(0)";
            });

        }, 400);
    };

    // Rejouer
    const btnReplay = document.createElement("button");
    btnReplay.textContent = "🔄 Rejouer";
    btnReplay.style.cssText = `
        background:#4caf50;
        color:white;
        border:none;
        padding:15px 40px;
        font-size:1.2rem;
        border-radius:8px;
        cursor:pointer;
        font-weight:bold;
        transition:.3s;
    `;
    btnReplay.onmouseenter = () => btnReplay.style.transform="scale(1.05)";
    btnReplay.onmouseleave = () => btnReplay.style.transform="scale(1)";
    btnReplay.onclick = () => location.reload();

    btnZone.appendChild(btnGrid);
    btnZone.appendChild(btnReplay);

    // Assemble
    content.appendChild(title);
    content.appendChild(score);
    content.appendChild(ticketContainer);
    content.appendChild(btnZone);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Animation d'entrée
    requestAnimationFrame(() => {
        overlay.style.background = "rgba(0,0,0,0.85)";
        content.style.opacity = "1";
        content.style.transform = "scale(1) translateY(0)";

        // Lancer les confettis UNE SEULE FOIS
        if (!confettiStarted && typeof launchConfetti === "function") {
            launchConfetti();
            confettiStarted = true;
        }
    });
}
