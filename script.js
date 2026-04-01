// Substitua pelas suas chaves do Firebase Console
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    projectId: "seu-projeto-id",
    appId: "seu-app-id"
};

if (firebaseConfig.apiKey !== "SUA_API_KEY_AQUI") {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
}

// Troca de Abas
function abrirAba(nomeAba) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('aba-' + nomeAba).classList.remove('hidden');
    event.currentTarget.classList.add('active');
    if (nomeAba === 'forum') carregarForum();
}

// Modo Escuro
document.getElementById('theme-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('theme-toggle').textContent = isDark ? '🌙' : '☀️';
});

// Fórum
function postarNoForum() {
    const user = document.getElementById('post-user').value || "Anônimo";
    const text = document.getElementById('post-text').value;
    const emoji = document.getElementById('post-emoji').value;

    if (!text) return alert("Escreva algo no post!");

    if (typeof db !== 'undefined') {
        db.collection("forum").add({
            nome: user,
            mensagem: text,
            sentimento: emoji,
            data: new Date()
        }).then(() => { document.getElementById('post-text').value = ""; });
    } else {
        alert("Firebase não conectado!");
    }
}

function carregarForum() {
    const mural = document.getElementById('mural-mensagens');
    if (typeof db !== 'undefined') {
        db.collection("forum").orderBy("data", "desc").limit(10).onSnapshot(snap => {
            mural.innerHTML = "";
            snap.forEach(doc => {
                const d = doc.data();
                mural.innerHTML += `<div class="post-card"><span>${d.sentimento}</span> <b>${d.nome}:</b> ${d.mensagem}</div>`;
            });
        });
    }
}

// Apoio e Triagem
function enviarDesabafo() {
    const texto = document.getElementById('desabafo-text').value;
    const emojiSel = document.querySelector('input[name="sentimento"]:checked');

    if (!emojiSel || !texto) return alert("Preencha o emoji e o texto.");

    const emoji = emojiSel.value;
    const urgente = (emoji === '😭' || emoji === '😡' || emoji === '😢');

    if (typeof db !== 'undefined') {
        db.collection("desabafos").add({
            texto: texto,
            sentimento: emoji,
            prioridade: urgente,
            data: new Date()
        }).then(() => {
            alert(urgente ? "Recebido! Vamos te dar atenção prioritária." : "Obrigado por compartilhar.");
            document.getElementById('desabafo-text').value = "";
        });
    }
}
