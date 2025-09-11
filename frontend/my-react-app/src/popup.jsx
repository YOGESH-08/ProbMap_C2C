import React from "react";
import "./popup.css";

function Popup({ onClose }) {
    return (
        <div className="popup-container">
            <button className="popup-close" onClick={onClose}>X</button>
            <p>1. “Every big change begins with a small step. 🌱 Welcome home!”<br/>(Moral: Small efforts lead to big impact)</p>
            <p>2. Be the reason someone smiles today. 😊 Explore and contribute!<br/>(Moral: Kindness creates ripples of positivity)</p>
            <p>3. Don’t wait for change—be the change. 🚀 You’re at the right place to start.<br/>(Moral: Take initiative, not just inspiration)</p>
            <p>4. Great things happen when people come together. 🤝 Welcome aboard!<br/>(Moral: Unity and collaboration bring growth)</p>
            <p>5. Sharing is caring ❤. Let’s make the world better, one action at a time.<br/>(Moral: Generosity enriches both giver and receiver)</p>
            <p>6. Your journey starts here… and so does someone else’s hope. 🌍<br/>(Moral: Every action you take can help others)</p>
        </div>
    );
}

export default Popup;
