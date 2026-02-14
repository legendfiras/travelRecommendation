let apiData = null;

async function loadData() {
  if (apiData) return apiData;

  try {
    const res = await fetch("travel_recommendation_api.json");
    apiData = await res.json();
    console.log("Loaded JSON:", apiData); // Task 6 console.log requirement
    return apiData;
  } catch (err) {
    console.error("Failed to load JSON:", err);
    return null;
  }
}

function normalizeKeyword(value) {
  return value.trim().toLowerCase();
}

function clearResultsUI() {
  const resultsDiv = document.getElementById("results");
  const emptyState = document.getElementById("emptyState");

  resultsDiv.innerHTML = "";
  emptyState.style.display = "block";
}

function renderCards(items) {
  const resultsDiv = document.getElementById("results");
  const emptyState = document.getElementById("emptyState");

  resultsDiv.innerHTML = "";
  emptyState.style.display = items.length ? "none" : "block";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "result-card";

    const img = document.createElement("img");
    img.className = "result-img";
    img.src = item.imageUrl;
    img.alt = item.name;

    const body = document.createElement("div");
    body.className = "result-body";

    const title = document.createElement("h3");
    title.className = "result-title";
    title.textContent = item.name;

    const desc = document.createElement("p");
    desc.className = "result-desc";
    desc.textContent = item.description;

    const link = document.createElement("a");
    link.className = "visit";
    link.href = item.link || "https://www.google.com/search?q=" + encodeURIComponent(item.name);
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Visit";

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(link);

    card.appendChild(img);
    card.appendChild(body);

    resultsDiv.appendChild(card);
  });
}

function buildBeachResults(data) {
  // Ensure at least 2
  return (data.beaches || []).slice(0, 2);
}

function buildTempleResults(data) {
  // Ensure at least 2
  return (data.temples || []).slice(0, 2);
}

function buildCountryResults(data) {
  // For country: show cities from first 2 countries (2+ results)
  const out = [];
  const countries = data.countries || [];

  for (let i = 0; i < countries.length && out.length < 2; i++) {
    const c = countries[i];
    if (c.cities && c.cities.length) {
      out.push(c.cities[0]); // one city per country
    }
  }

  // fallback if not enough
  if (out.length < 2 && countries.length && countries[0].cities && countries[0].cities.length > 1) {
    out.push(countries[0].cities[1]);
  }

  return out.slice(0, 2);
}

// Task 7/8: keyword search variations
async function searchRecommendation() {
  const input = document.getElementById("searchInput");
  const keyword = normalizeKeyword(input.value);

  const data = await loadData();
  if (!data) return;

  // accept variations
  const isBeach = keyword === "beach" || keyword === "beaches";
  const isTemple = keyword === "temple" || keyword === "temples";
  const isCountry = keyword === "country" || keyword === "countries";

  let results = [];

  if (isBeach) results = buildBeachResults(data);
  else if (isTemple) results = buildTempleResults(data);
  else if (isCountry) results = buildCountryResults(data);
  else results = []; // unknown keyword => empty

  renderCards(results);
}

// Task 9: Clear button
function resetSearch() {
  document.getElementById("searchInput").value = "";
  clearResultsUI();
}

// On load: empty state
document.addEventListener("DOMContentLoaded", () => {
  clearResultsUI();
});
