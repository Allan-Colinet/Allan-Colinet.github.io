// Menu Mobile
function toggleMenu() {
  const nav = document.getElementById("nav-menu");
  nav.classList.toggle("active");
}

// Logique du Quiz / Tunnel
let quizScore = 0;
let selectedBranch = "";

function startQuiz(e) {
  if (e) e.preventDefault();
  const modal = document.getElementById("cyber-quiz-modal");
  if (modal) {
    modal.style.display = "flex";
    showQuizStep("quiz-step-1");
    quizScore = 0;
    document.querySelectorAll(".quiz-input").forEach((el) => (el.value = "0"));
  }
}

function closeQuiz() {
  document.getElementById("cyber-quiz-modal").style.display = "none";
}

function showQuizStep(stepId) {
  document.querySelectorAll(".quiz-step").forEach((step) => {
    step.classList.remove("active");
  });
  document.getElementById(stepId).classList.add("active");
}

function goToBranch(branch) {
  selectedBranch = branch;
  showQuizStep("quiz-step-" + branch);
}

function calculateBranch(branch) {
  quizScore = 0;
  const q1 = parseInt(document.getElementById(branch + "-q1").value) || 0;
  const q2 = parseInt(document.getElementById(branch + "-q2").value) || 0;
  const q3 = parseInt(document.getElementById(branch + "-q3").value) || 0;

  quizScore = q1 + q2 + q3;
  displayResult();
}

function displayResult() {
  showQuizStep("quiz-step-result");
  const contentBox = document.getElementById("quiz-result-content");
  const actionBtn = document.getElementById("quiz-action-button");

  let html = `<h4>Votre Score : ${quizScore} / 9</h4>`;

  if (quizScore <= 3) {
    html += `<div style="padding:15px; background:#ffebee; color:#c62828; border-radius:8px; margin-top:10px;">
      <strong>Alerte Critique 🚨</strong><br>Votre infrastructure présente des failles majeures. Un arrêt d'activité prolongé est un risque réel.
    </div>`;
    actionBtn.innerHTML = `<a href="mailto:allan@proxysafe.be?subject=Demande%20d'Audit%20Flash&body=Bonjour%20Allan%2C%20mon%20score%20de%20maturit%C3%A9%20est%20faible.%20Pouvons-nous%20planifier%20un%20audit%20flash%20de%2010%20minutes%20%3F" class="btn" style="width:100%">Planifier un audit flash (10 min)</a>`;
  } else if (quizScore <= 6) {
    html += `<div style="padding:15px; background:#fff3e0; color:#ef6c00; border-radius:8px; margin-top:10px;">
      <strong>Vulnérabilités Silencieuses ⚠️</strong><br>Les bases sont là, mais le manque de surveillance active vous expose.
    </div>`;
    actionBtn.innerHTML = `<a href="tel:+3260860256" class="btn" style="width:100%">Faire le point par téléphone</a>`;
  } else {
    html += `<div style="padding:15px; background:#e8f5e9; color:#2e7d32; border-radius:8px; margin-top:10px;">
      <strong>Bonne Maturité ✅</strong><br>Vous avez de bons réflexes. L'objectif est maintenant de maintenir cette conformité.
    </div>`;
    actionBtn.innerHTML = `<a href="mailto:allan@proxysafe.be?subject=Informations%20Gouvernance" class="btn btn-secondary" style="width:100%" onclick="closeQuiz()">Découvrir l'accompagnement GRC</a>`;
  }
  contentBox.innerHTML = html;
}
// Centrage automatique du carousel sur mobile
window.addEventListener("DOMContentLoaded", (event) => {
  if (window.innerWidth <= 900) {
    const grid = document.querySelector(".pricing-grid");
    const popularCard = document.querySelector(".pricing-card.highlight");
    if (grid && popularCard) {
      const scrollPos =
        popularCard.offsetLeft -
        window.innerWidth / 2 +
        popularCard.offsetWidth / 2;
      grid.scrollLeft = scrollPos;
    }
  }
});
