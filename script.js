// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-box");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-links");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}
const projectsGrid = document.getElementById("projects-grid");
const showAllBtn = document.getElementById("show-all-btn");
const username = "Rithish4610";

const chatArea = document.getElementById("chat-area");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clear-btn");
const typingIndicator = document.getElementById("typing-indicator");
const typingText = document.getElementById("typing-text");

// GITHUB PROJECTS

async function fetchAllRepos() {
  const res = await fetch(`https://api.github.com/users/${username}/repos`);
  return await res.json();
}

async function fetchStarredRepos() {
  const res = await fetch(`https://api.github.com/users/${username}/starred`);
  return await res.json();
}

function renderProjects(projects) {
  projectsGrid.innerHTML = "";
  projects.forEach(repo => {
    if (repo.owner.login !== username) return; // only your repos
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `<h3>${repo.name}</h3>
                      <p>${repo.description || "No description."}</p>
                      <a href="${repo.html_url}" target="_blank">View on GitHub</a>`;
    projectsGrid.appendChild(card);
  });
}

async function loadStarredOwnProjects() {
  const starred = await fetchStarredRepos();
  const ownStarred = starred.filter(repo => repo.owner.login === username);
  renderProjects(ownStarred);
}

// Show all
showAllBtn.addEventListener("click", async () => {
  const all = await fetchAllRepos();
  renderProjects(all);
  showAllBtn.style.display = "none";
});

loadStarredOwnProjects();

// AI BOT

function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.className = `message ${type}`;
  msg.innerText = text;
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function getBotReply(text) {
  text = text.toLowerCase();
  if(text.includes("name")) return "My name is Rithish Kannan.";
  if(text.includes("skills")) return "Python, C, C++, HTML, CSS, JavaScript, AI & ML.";
  if(text.includes("education")) return "2nd year BE CSE (AI & ML) student.";
  if(text.includes("projects")) return "Check out my projects above on GitHub!";
  if(text.includes("contact")) return "Email: rithish4610@gmail.com | Phone: 9363613681";
  return "Ask me about skills, projects, education, or contact info 😊";
}

input.addEventListener("input", () => { typingText.textContent = input.value; sendBtn.disabled = input.value.trim() === ""; });

function sendMessage() {
  const text = input.value.trim();
  if(!text) return;
  addMessage(text,"user");
  input.value=""; typingText.textContent="";
  sendBtn.disabled=true;
  typingIndicator.style.display="block";
  setTimeout(()=>{
    typingIndicator.style.display="none";
    addMessage(getBotReply(text),"bot");
  },800);
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress",(e)=>{ if(e.key==="Enter" && !sendBtn.disabled) sendMessage(); });
clearBtn.addEventListener("click",()=>{ chatArea.innerHTML=""; });
