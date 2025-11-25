// ==========================================
// TICKET.JS — VERSION OPTIMISÉE
// ==========================================

// Stockage de l'ordre des paires trouvées
let ticket = [];
let confettiStarted = false;

// ------------------------------------------
// UTILITAIRE : appliquer rapidement des styles
// ------------------------------------------
function applyStyles(el, styles) {
    Object.assign(el.style, styles);
}

// Ajouter une paire
function addToTicket(symbol) {
    ticket.push(symbol);
}

// Reset du ticket
function resetTicket() {
    ticket = [];
    confettiStarted = false;
}

// ------------------------------------------
// OVERLAY DE RÉSULTAT
// ------------------------------------------
function showResultOverlay(attempts, elapsedTime) {

    // --- Overlay ---
    const overlay = document.createElement("div");
    applyStyles(overlay, {
        position: "fixed",
        inset: "0",
        background: "rgba(0,0,0,0)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "background .6s ease",
    });

    // --- Conteneur principal ---
    const content = document.createElement("div");
    applyStyles(content, {
        background: "linear-gradient(145deg,#2a2a2a,#1a1a1a)",
        border: "3px solid #4caf50",
        borderRadius: "15px",
        padding: "40px",
        textAlign: "center",
        width: "550px",
        boxShadow: "0 10px 50px rgba(0,0,0,.5)",
        opacity: "0",
        transform: "scale(.8) translateY(20px)",
        transition: "all .6s cubic-bezier(.34,1.56,.64,1)"
    });

    // --- Titre ---
    const title = document.createElement("h2");
    title.textContent = "🎉 RÉSULTAT 🎉";
    applyStyles(title, {
        color: "#4caf50",
        fontSize: "2.4rem",
        marginBottom: "25px",
        textShadow: "0 0 10px rgba(76,175,80,.5)"
    });

    // --- Score ---
    const score = document.createElement("div");
    applyStyles(score, {
        background: "#333",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "25px",
        border: "2px solid #444"
    });
    score.innerHTML = `
        <div style="color:white;font-size:1.3rem;margin-bottom:10px;">
            ⏱️ <b>Temps :</b> ${elapsedTime}
        </div>
        <div style="color:white;font-size:1.3rem;">
            🎯 <b>Tentatives :</b> ${attempts}
        </div>
    `;

    // ------------------------------------------
    // TICKET VISUEL
    // ------------------------------------------

    const ticketContainer = document.createElement("div");
    applyStyles(ticketContainer, {
        background: "white",
        color: "black",
        borderRadius: "10px",
        padding: "25px",
        border: "3px dashed #888",
        margin: "25px 0"
    });

    const ticketHeader = document.createElement("div");
    ticketHeader.textContent = "🎫 TICKET DE RÉUSSITE";
    applyStyles(ticketHeader, {
        fontSize: "1.1rem",
        fontWeight: "bold",
        marginBottom: "15px",
        paddingBottom: "10px",
        borderBottom: "2px dashed #888",
        textAlign: "center"
    });

    const grid = document.createElement("div");
    applyStyles(grid, {
        display: "grid",
        gridTemplateColumns: "repeat(8,1fr)",
        gap: "8px"
    });

    ticket.forEach((sym, i) => {
        const c = document.createElement("div");
        c.textContent = sym;
        applyStyles(c, {
            fontSize: "1.8rem",
            padding: "5px",
            borderRadius: "5px",
            background: i % 2 ? "#e8e8e8" : "#f0f0f0",
            border: "1px solid #ccc",
            textAlign: "center"
        });
        grid.appendChild(c);
    });

    const ticketNumber = document.createElement("div");
    ticketNumber.textContent = "N° " + Math.random().toString(36).substring(2, 9).toUpperCase();
    applyStyles(ticketNumber, {
        marginTop: "15px",
        paddingTop: "10px",
        borderTop: "2px dashed #888",
        fontSize: ".9rem",
        color: "#666",
        textAlign: "center",
        fontFamily: "monospace"
    });

    ticketContainer.appendChild(ticketHeader);
    ticketContainer.appendChild(grid);
    ticketContainer.appendChild(ticketNumber);

    // ------------------------------------------
    // BOUTONS
    // ------------------------------------------

    const btnZone = document.createElement("div");
    applyStyles(btnZone, {
        display: "flex",
        gap: "15px",
        justifyContent: "center",
        marginTop: "25px"
    });

    // --- Bouton VOIR LA GRILLE ---
    const btnGrid = document.createElement("button");
    btnGrid.textContent = "🎯 Voir la grille";
    applyStyles(btnGrid, {
        background: "#2196F3",
        color: "white",
        border: "none",
        padding: "15px 40px",
        fontSize: "1.2rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: ".3s"
    });

    btnGrid.onmouseenter = () => btnGrid.style.transform = "scale(1.05)";
    btnGrid.onmouseleave = () => btnGrid.style.transform = "scale(1)";

    btnGrid.onclick = () => {
        content.style.opacity = "0";
        content.style.transform = "scale(0.9) translateY(-20px)";

        setTimeout(() => {
            content.style.display = "none";
            overlay.style.background = "rgba(0,0,0,0.10)";

            const back = document.createElement("button");
            back.textContent = "🎫 Voir le ticket";
            applyStyles(back, {
                position: "fixed",
                bottom: "25px",
                left: "50%",
                transform: "translateX(-50%) translateY(100px)",
                padding: "15px 40px",
                background: "#FF9800",
                color: "white",
                fontSize: "1.2rem",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
                opacity: "0",
                transition: ".4s cubic-bezier(.34,1.56,.64,1)",
                zIndex: "1600"
            });

            back.onclick = () => {
                overlay.style.background = "rgba(0,0,0,0.85)";
                content.style.display = "block";

                requestAnimationFrame(() => {
                    content.style.opacity = "1";
                    content.style.transform = "scale(1) translateY(0)";
                });

                // --- ❌ aucun relancement de confettis ici ---
                back.remove();
            };

            document.body.appendChild(back);

            requestAnimationFrame(() => {
                back.style.opacity = "1";
                back.style.transform = "translateX(-50%) translateY(0)";
            });

        }, 400);
    };

    // --- Bouton REJOUER ---
    const btnReplay = document.createElement("button");
    btnReplay.textContent = "🔄 Rejouer";
    applyStyles(btnReplay, {
        background: "#4caf50",
        color: "white",
        border: "none",
        padding: "15px 40px",
        fontSize: "1.2rem",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: ".3s"
    });

    btnReplay.onmouseenter = () => btnReplay.style.transform = "scale(1.05)";
    btnReplay.onmouseleave = () => btnReplay.style.transform = "scale(1)";
    btnReplay.onclick = () => location.reload();

    btnZone.appendChild(btnGrid);
    btnZone.appendChild(btnReplay);

    // Assemblage final
    content.appendChild(title);
    content.appendChild(score);
    content.appendChild(ticketContainer);
    content.appendChild(btnZone);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Animation d'entrée + confettis
    requestAnimationFrame(() => {
        overlay.style.background = "rgba(0,0,0,0.85)";
        content.style.opacity = "1";
        content.style.transform = "scale(1) translateY(0)";

        if (!confettiStarted && typeof launchConfetti === "function") {
            launchConfetti();
            confettiStarted = true;
        }
    });
}
