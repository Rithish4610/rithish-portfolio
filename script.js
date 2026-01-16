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

  if (text.includes("hi") || text.includes("hello")) {
    return "Hello 👋 I'm Rithish's AI assistant. Ask me about his skills, projects, education, or contact details!";
  }

  if (text.includes("name")) {
    return "His name is Rithish Kannan, a Computer Science student specializing in AI & ML.";
  }

  if (text.includes("skills")) {
    return "Rithish is skilled in Python, C, C++, HTML, CSS, JavaScript, and AI/ML. He is currently learning Java and full-stack development.";
  }

  if (text.includes("projects")) {
    return "Rithish has built multiple real-world projects including web apps, games, AI-based systems, and automation tools. You can explore them above in the Projects section 🚀";
  }

  if (text.includes("education") || text.includes("study")) {
    return "Rithish is currently a 2nd year BE Computer Science student specializing in Artificial Intelligence & Machine Learning (AIML).";
  }

  if (text.includes("resume") || text.includes("cv")) {
    return "You can download Rithish's resume using the 'Download Resume' button on this page 📄";
  }

  if (text.includes("contact") || text.includes("email") || text.includes("phone")) {
    return "You can contact Rithish via email at rithish4610@gmail.com or phone at 9363613681.";
  }

  if (text.includes("github")) {
    return "Here is Rithish's GitHub profile: https://github.com/Rithish4610";
  }

  if (text.includes("linkedin")) {
    return "Here is Rithish's LinkedIn profile: https://www.linkedin.com/in/rithish-kannan-22032007r/";
  }

  return "🤖 I didn’t quite understand that. Try asking about skills, projects, education, resume, or contact details.";
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
