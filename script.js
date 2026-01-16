function showProjectCards(projects) {
  projects.forEach(project => {
    const card = document.createElement("div");
    card.className = "message bot project-card-chat";
    card.innerHTML = `
      <strong>${project.name}</strong>
      <p>${project.description}</p>
      <a href="${project.url}" target="_blank">🔗 View on GitHub</a>
    `;
    chatArea.appendChild(card);
  });
  chatArea.scrollTop = chatArea.scrollHeight;
}
// ===== AI MEMORY =====
let botMemory = {
  lastProject: null,
  lastTopic: null
};
// ===== PORTFOLIO DATA =====
const portfolioData = {
  name: "Rithish Kannan",
  github: "https://github.com/Rithish4610",
  linkedin: "https://www.linkedin.com/in/rithish-kannan-22032007r/",
  resume: "assets/Rithish_resume.pdf",
  username: "Rithish4610",
  projects: []
};
// ===== TYPING ANIMATION FOR BOT REPLIES =====
function typeBotMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message bot";
  chatArea.appendChild(msg);
  chatArea.scrollTop = chatArea.scrollHeight;

  let i = 0;
  const typingSpeed = 30; // ms per letter

  const interval = setInterval(() => {
    msg.textContent += text.charAt(i);
    i++;
    chatArea.scrollTop = chatArea.scrollHeight;
    if (i === text.length) {
      clearInterval(interval);
    }
  }, typingSpeed);
}
// ===== SCROLL REVEAL LOGIC =====
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  const windowHeight = window.innerHeight;
  const revealPoint = 100;

  reveals.forEach(el => {
    const revealTop = el.getBoundingClientRect().top;
    if (revealTop < windowHeight - revealPoint) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll(); // run on load
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

// ===== LOAD PROJECTS FOR AI BOT =====
async function loadProjectsForBot() {
  try {
    const res = await fetch(`https://api.github.com/users/${portfolioData.username}/repos`);
    const data = await res.json();

    portfolioData.projects = data
      .filter(repo => repo.owner.login === portfolioData.username)
      .map(repo => ({
        name: repo.name,
        description: repo.description || "No description provided",
        url: repo.html_url,
        stars: repo.stargazers_count
      }));
  } catch (err) {
    console.error("Failed to load projects for bot", err);
  }
}

loadProjectsForBot();

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


function getBotReply(message) {
  const text = message.toLowerCase();

  // Greetings
  if (text.includes("hi") || text.includes("hello")) {
    botMemory.lastTopic = "greeting";
    return `Hello 👋 I'm Rithish's AI assistant.\nAsk me about his projects, GitHub, LinkedIn, or resume.`;
  }

  // Resume
  if (text.includes("resume") || text.includes("cv")) {
    window.open(portfolioData.resume, "_blank");
    botMemory.lastTopic = "resume";
    return "📄 Opening Rithish's resume.";
  }

  // GitHub
  if (text.includes("github")) {
    window.open(portfolioData.github, "_blank");
    botMemory.lastTopic = "github";
    return "🚀 Opening GitHub profile.";
  }

  // LinkedIn
  if (text.includes("linkedin")) {
    window.open(portfolioData.linkedin, "_blank");
    botMemory.lastTopic = "linkedin";
    return "💼 Opening LinkedIn profile.";
  }

  // Specific project name detection
  if (portfolioData.projects.length > 0) {
    const foundProject = portfolioData.projects.find(p =>
      text.includes(p.name.toLowerCase())
    );

    if (foundProject) {
      botMemory.lastProject = foundProject;
      botMemory.lastTopic = "project-detail";
      setTimeout(() => showProjectCards([foundProject]), 400);
      return `Here’s a project by Rithish called **${foundProject.name}** 👇`;
    }
  }

  // Follow-up like "tell me more"
  if (
    (text.includes("more") || text.includes("explain")) &&
    botMemory.lastProject
  ) {
    return `${botMemory.lastProject.name} focuses on:\n${botMemory.lastProject.description}\n\nYou can check the source code using the GitHub link above 👆`;
  }

  // Projects overview
  if (text.includes("project")) {
    botMemory.lastTopic = "projects";

    const topProjects = portfolioData.projects
      .sort((a, b) => b.stars - a.stars)
      .slice(0, 3);

    setTimeout(() => showProjectCards(topProjects), 400);

    return `⭐ Rithish has built ${portfolioData.projects.length} projects.\nHere are some top ones:`;
  }

  // Skills
  if (text.includes("skill")) {
    botMemory.lastTopic = "skills";
    return "💡 Skills: Python, C, C++, HTML, CSS, JavaScript, AI & ML. Currently learning Java & full-stack development.";
  }

  // Contact
  if (text.includes("contact") || text.includes("email") || text.includes("phone")) {
    botMemory.lastTopic = "contact";
    return "📧 Email: rithish4610@gmail.com\n📱 Phone: 9363613681";
  }

  return "🤖 You can ask me about projects, a specific project name, GitHub, resume, or contact details.";
}

input.addEventListener("input", () => { typingText.textContent = input.value; sendBtn.disabled = input.value.trim() === ""; });


function sendMessage() {
  const text = input.value.trim();
  if(!text) return;
  addMessage(text,"user");
  input.value=""; typingText.textContent="";
  sendBtn.disabled=true;
  typingIndicator.style.display="block";
  setTimeout(() => {
    typingIndicator.style.display = "none";
    const reply = getBotReply(text);
    typeBotMessage(reply);
  }, 800);
}
// ===== FLOATING AI BOT TOGGLE =====
const aiBtn = document.getElementById("ai-float-btn");
const aiSection = document.getElementById("ai-bot");

aiBtn.addEventListener("click", () => {
  aiSection.classList.toggle("hidden-chat");
  aiSection.scrollIntoView({ behavior: "smooth" });
});

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress",(e)=>{ if(e.key==="Enter" && !sendBtn.disabled) sendMessage(); });
clearBtn.addEventListener("click",()=>{ chatArea.innerHTML=""; });
