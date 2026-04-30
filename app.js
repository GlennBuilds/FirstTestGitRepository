const tripData = {
  title: "Summer Escape 2026",
  summary:
    "This is placeholder content. We can swap in your actual trip details as soon as you share them.",
  dates: "July 12–19, 2026",
  location: "Lisbon, Portugal",
  travelers: ["Alex", "Jordan", "Sam", "Priya"],
  itinerary: [
    { day: "Day 1", activity: "Arrival + check-in + sunset walk" },
    { day: "Day 2", activity: "Old town food tour and tram ride" },
    { day: "Day 3", activity: "Beach day and dinner by the marina" },
    { day: "Day 4", activity: "Museum + free exploration" }
  ],
  budget: [
    "Flights: ~$650 per person",
    "Hotel: ~$180/night",
    "Food: ~$60/day",
    "Activities: ~$200 total"
  ],
  packing: ["Passport", "Travel adapters", "Walking shoes", "Light jacket"],
  notes:
    "This page is intentionally data-driven so future updates only require changing one object or connecting an API later."
};

const byId = (id) => document.getElementById(id);

byId("trip-title").textContent = tripData.title;
byId("trip-summary").textContent = tripData.summary;
byId("trip-dates").textContent = tripData.dates;
byId("trip-location").textContent = tripData.location;
byId("notes").textContent = tripData.notes;

tripData.travelers.forEach((person) => {
  const li = document.createElement("li");
  li.textContent = person;
  byId("travel-team").append(li);
});

tripData.itinerary.forEach((entry) => {
  const item = document.createElement("div");
  item.className = "timeline-item";
  item.innerHTML = `<small>${entry.day}</small><div>${entry.activity}</div>`;
  byId("itinerary").append(item);
});

tripData.budget.forEach((line) => {
  const li = document.createElement("li");
  li.textContent = line;
  byId("budget").append(li);
});

tripData.packing.forEach((item) => {
  const li = document.createElement("li");
  li.textContent = item;
  byId("packing").append(li);
});
