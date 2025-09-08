export async function getPortfolio() {
  return portfolio;
}

export async function upsertPortfolio(data) {
  portfolio = { ...portfolio, ...data };
  return portfolio;
}

// --- SKILLS ---
export async function getSkills() {
  return skills;
}

export async function saveSkills(newSkills) {
  skills = newSkills.map((s, index) => ({ id: index + 1, ...s }));
  return skills;
}

// --- PROJECTS ---
export async function getProjects() {
  return projects;
}

export async function addProject(data) {
  const id = projects.length ? projects[projects.length - 1].id + 1 : 1;
  const project = { id, ...data };
  projects.push(project);
  return project;
}

export async function updateProject(id, data) {
  const index = projects.findIndex(p => p.id === parseInt(id));
  if (index === -1) throw new Error("Proyecto no encontrado");
  projects[index] = { ...projects[index], ...data };
  return projects[index];
}

export async function deleteProject(id) {
  const index = projects.findIndex(p => p.id === parseInt(id));
  if (index === -1) return false;
  projects.splice(index, 1);
  return true;
}

// --- LOGIN / USERS ---
export async function getUser(username) {
  return users.find(u => u.username === username);
}