import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBdlHar22iODe81f-nrUi06PLWKQReb9Gc",
  authDomain: "siteescolaeduarda.firebaseapp.com",
  databaseURL: "https://siteescolaeduarda-default-rtdb.firebaseio.com",
  projectId: "siteescolaeduarda",
  storageBucket: "siteescolaeduarda.firebasestorage.app",
  messagingSenderId: "381495876879",
  appId: "1:381495876879:web:4366dc25b119a2567e327a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let nome = localStorage.getItem("nome") || prompt("Como deseja ser chamado?") || "Anônimo";
localStorage.setItem("nome", nome);

// SISTEMA DE ABAS
window.mudarAba = (id) => {
    document.querySelectorAll(".aba").forEach(a => a.classList.remove("active"));
    document.querySelectorAll(".sidebar button").forEach(b => b.classList.remove("active-btn"));
    
    document.getElementById(id).classList.add("active");
    const btnId = "btn-" + id;
    if(document.getElementById(btnId)) document.getElementById(btnId).classList.add("active-btn");
};

// CHAT
window.salvarMensagem = () => {
    const input = document.getElementById("input-msg");
    if (!input.value.trim()) return;
    push(ref(db, "mensagens"), {
        nome,
        texto: input.value,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    input.value = "";
};

onValue(ref(db, "mensagens"), (snapshot) => {
    const feed = document.getElementById("feed-forum");
    if(!feed) return;
    feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        const div = document.createElement("div");
        div.className = `msg-post ${d.nome === nome ? 'me' : 'outro'}`;
        div.innerHTML = `
            <span class="msg-name">${d.nome}</span>
            <span class="msg-text">${d.texto}</span>
            <span class="msg-time">${d.hora}</span>
        `;
        feed.appendChild(div);
    });
    feed.scrollTop = feed.scrollHeight;
});

// MURAL
window.salvarIdeia = () => {
    const input = document.getElementById("input-ideia");
    if (!input.value.trim()) return;
    push(ref(db, "mural"), {
        autor: nome,
        texto: input.value,
        data: new Date().toLocaleDateString()
    });
    input.value = "";
    alert("Enviado para o mural!");
};

onValue(ref(db, "mural"), (snapshot) => {
    const feed = document.getElementById("feed-mural");
    if(!feed) return;
    feed.innerHTML = "";
    snapshot.forEach((child) => {
        const d = child.val();
        const div = document.createElement("div");
        div.className = "msg-post outro";
        div.style.maxWidth = "100%";
        div.innerHTML = `<b>${d.autor}</b><br>${d.texto}<br><small>${d.data}</small>`;
        feed.appendChild(div);
    });
});

// OUTRAS FUNÇÕES
window.votarHumor = (tipo) => { push(ref(db, "humor"), { usuario: nome, voto: tipo }); alert("Voto registrado!"); };
window.enviarFeedback = () => {
    const txt = document.getElementById("texto-feedback");
    push(ref(db, "feedback"), { usuario: nome, comentario: txt.value });
    txt.value = ""; alert("Enviado!");
};
