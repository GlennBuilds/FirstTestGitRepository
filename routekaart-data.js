(() => {
const days = [
  {
    id: "arrival",
    dayNumber: 1,
    date: "Za 13 juni 2026",
    title: "Aankomst in Podgorica",
    overnight: "Podgorica",
    points: [
      { name: "Podgorica Airport (TGD)", lat: 42.3594, lon: 19.2519 },
      { name: "Podgorica", lat: 42.4304, lon: 19.2594 }
    ],
    notes: "Late aankomst rond 23:30. Alleen naar hotel, inchecken en slapen.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Podgorica%20Airport%2C%20Montenegro&destination=Podgorica%2C%20Montenegro&travelmode=driving"
  },
  {
    id: "to-virpazar",
    dayNumber: 2,
    date: "Zo 14 juni 2026",
    title: "Podgorica → Virpazar",
    overnight: "Virpazar / Lake Skadar",
    points: [
      { name: "Podgorica", lat: 42.4304, lon: 19.2594 },
      { name: "Virpazar", lat: 42.2467, lon: 19.0917 }
    ],
    notes: "Korte, makkelijke rit van ongeveer 30-35 km naar Lake Skadar.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Podgorica%2C%20Montenegro&destination=Virpazar%2C%20Montenegro&travelmode=driving"
  },
  {
    id: "skadar-base",
    dayNumber: 3,
    date: "Ma 15 juni 2026",
    title: "Lake Skadar basisroute",
    overnight: "Virpazar / Lake Skadar",
    points: [
      { name: "Virpazar", lat: 42.2467, lon: 19.0917 },
      { name: "Godinje", lat: 42.2477, lon: 19.1728 },
      { name: "Murici Beach", lat: 42.2149, lon: 19.1448 },
      { name: "Virpazar", lat: 42.2467, lon: 19.0917 }
    ],
    notes: "Basisvariant voor de Lake Skadar-dag: boottocht, lunch/rust, Godinje en eventueel Murići.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Virpazar%2C%20Montenegro&destination=Virpazar%2C%20Montenegro&travelmode=driving&waypoints=Godinje%2C%20Montenegro%7CMurici%20Beach%2C%20Montenegro"
  },
  {
    id: "skadar-extended",
    dayNumber: 3,
    date: "Ma 15 juni 2026",
    title: "Lake Skadar uitgebreide route",
    overnight: "Virpazar / Lake Skadar",
    points: [
      { name: "Virpazar", lat: 42.2467, lon: 19.0917 },
      { name: "Besac Fortress", lat: 42.2478, lon: 19.0947 },
      { name: "Godinje", lat: 42.2477, lon: 19.1728 },
      { name: "Murici Beach", lat: 42.2149, lon: 19.1448 },
      { name: "Karuc", lat: 42.3259, lon: 19.1401 },
      { name: "Virpazar", lat: 42.2467, lon: 19.0917 }
    ],
    notes: "Uitgebreide variant met Besac Fortress, Godinje, Murići en Karuč. Alleen kiezen bij genoeg energie.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Virpazar%2C%20Montenegro&destination=Virpazar%2C%20Montenegro&travelmode=driving&waypoints=Besac%20Fortress%2C%20Montenegro%7CGodinje%2C%20Montenegro%7CMurici%20Beach%2C%20Montenegro%7CKaruc%2C%20Montenegro"
  },
  {
    id: "to-perast",
    dayNumber: 4,
    date: "Di 16 juni 2026",
    title: "Virpazar → Perast via Pavlova Strana",
    overnight: "Perast / Kotor Bay",
    points: [
      { name: "Virpazar", lat: 42.2467, lon: 19.0917 },
      { name: "Pavlova Strana Viewpoint", lat: 42.3625, lon: 19.0674 },
      { name: "Cetinje", lat: 42.3906, lon: 18.9142 },
      { name: "Njegos Mausoleum / Lovcen", lat: 42.3992, lon: 18.8372 },
      { name: "Perast", lat: 42.4869, lon: 18.6994 }
    ],
    notes: "Scenic transferdag van Lake Skadar naar Kotor Bay.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Virpazar%2C%20Montenegro&destination=Perast%2C%20Montenegro&travelmode=driving&waypoints=Pavlova%20Strana%20Viewpoint%2C%20Montenegro%7CCetinje%2C%20Montenegro%7CNjegos%20Mausoleum%2C%20Montenegro"
  },
  {
    id: "kotor-heritage",
    dayNumber: 5,
    date: "Wo 17 juni 2026",
    title: "Klassieke erfgoeddag in de Baai van Kotor",
    overnight: "Perast / Kotor Bay",
    points: [
      { name: "Perast", lat: 42.4869, lon: 18.6994 },
      { name: "Risan Roman Mosaics", lat: 42.5142, lon: 18.6954 },
      { name: "Kotor Old Town", lat: 42.4250, lon: 18.7712 },
      { name: "Dobrota", lat: 42.4540, lon: 18.7680 },
      { name: "Perast", lat: 42.4869, lon: 18.6994 }
    ],
    notes: "Erfgoeddag met Perast, Our Lady of the Rocks, Risan, Kotor en Dobrota als rustige afsluiter.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Perast%2C%20Montenegro&destination=Perast%2C%20Montenegro&travelmode=driving&waypoints=Risan%20Roman%20Mosaics%2C%20Montenegro%7CKotor%20Old%20Town%2C%20Montenegro%7CDobrota%2C%20Montenegro"
  },
  {
    id: "kotor-cable",
    dayNumber: 6,
    date: "Do 18 juni 2026",
    title: "Rustige baaigevoelsdag",
    overnight: "Perast / Kotor Bay",
    points: [
      { name: "Perast", lat: 42.4869, lon: 18.6994 },
      { name: "Kotor Cable Car", lat: 42.4018, lon: 18.7634 },
      { name: "Kotor Old Town", lat: 42.4250, lon: 18.7712 },
      { name: "Morinj", lat: 42.4906, lon: 18.6518 },
      { name: "Perast", lat: 42.4869, lon: 18.6994 }
    ],
    notes: "Halve-dag-plus-rust-dag: Kotor Cable Car bij helder weer of een rustige baaiplek.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Perast%2C%20Montenegro&destination=Perast%2C%20Montenegro&travelmode=driving&waypoints=Kotor%20Cable%20Car%2C%20Montenegro%7CKotor%20Old%20Town%2C%20Montenegro%7CMorinj%2C%20Montenegro"
  },
  {
    id: "herceg-novi",
    dayNumber: 7,
    date: "Vr 19 juni 2026",
    title: "Extra baaidag met keuzevrijheid",
    overnight: "Perast / Kotor Bay",
    points: [
      { name: "Perast", lat: 42.4869, lon: 18.6994 },
      { name: "Herceg Novi", lat: 42.4531, lon: 18.5375 },
      { name: "Rose", lat: 42.4254, lon: 18.5580 },
      { name: "Perast", lat: 42.4869, lon: 18.6994 }
    ],
    notes: "Keuzedag: rustdag in Perast of richting Herceg Novi en eventueel Rose / Luštica.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Perast%2C%20Montenegro&destination=Perast%2C%20Montenegro&travelmode=driving&waypoints=Herceg%20Novi%2C%20Montenegro%7CRose%2C%20Montenegro"
  },
  {
    id: "to-zabljak",
    dayNumber: 8,
    date: "Za 20 juni 2026",
    title: "Perast → Žabljak via Nikšić",
    overnight: "Žabljak / Durmitor",
    points: [
      { name: "Perast", lat: 42.4869, lon: 18.6994 },
      { name: "Nikšić", lat: 42.7731, lon: 18.9445 },
      { name: "Žabljak", lat: 43.1555, lon: 19.1226 }
    ],
    notes: "Transferdag van de baai naar Durmitor, met Nikšić als koffie- of lunchstop.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Perast%2C%20Montenegro&destination=%C5%BDabljak%2C%20Montenegro&travelmode=driving&waypoints=Nik%C5%A1i%C4%87%2C%20Montenegro"
  },
  {
    id: "durmitor-black-lake",
    dayNumber: 9,
    date: "Zo 21 juni 2026",
    title: "Durmitor rustig verkennen",
    overnight: "Žabljak / Durmitor",
    points: [
      { name: "Žabljak", lat: 43.1555, lon: 19.1226 },
      { name: "Black Lake / Crno Jezero", lat: 43.1460, lon: 19.0860 },
      { name: "Ćurevac viewpoint", lat: 43.2080, lon: 19.0910 },
      { name: "Žabljak", lat: 43.1555, lon: 19.1226 }
    ],
    notes: "Rustige bergdag met Black Lake en eventueel Ćurevac viewpoint.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=%C5%BDabljak%2C%20Montenegro&destination=%C5%BDabljak%2C%20Montenegro&travelmode=driving&waypoints=Crno%20Jezero%2C%20Montenegro%7CCurevac%20viewpoint%2C%20Montenegro"
  },
  {
    id: "durmitor-sedlo",
    dayNumber: 10,
    date: "Ma 22 juni 2026",
    title: "Durmitor panoramadag",
    overnight: "Žabljak / Durmitor",
    points: [
      { name: "Žabljak", lat: 43.1555, lon: 19.1226 },
      { name: "Sedlo Pass", lat: 43.0825, lon: 18.9880 },
      { name: "Trsa", lat: 43.2510, lon: 18.7790 },
      { name: "Žabljak", lat: 43.1555, lon: 19.1226 }
    ],
    notes: "Weersafhankelijke panoramadag via Sedlo en eventueel een stuk richting Trsa / Durmitor Ring.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=%C5%BDabljak%2C%20Montenegro&destination=%C5%BDabljak%2C%20Montenegro&travelmode=driving&waypoints=Sedlo%20Pass%2C%20Montenegro%7CTrsa%2C%20Montenegro"
  },
  {
    id: "tara-canyon",
    dayNumber: 11,
    date: "Di 23 juni 2026",
    title: "Tara Canyon-dag",
    overnight: "Žabljak / Durmitor",
    points: [
      { name: "Žabljak", lat: 43.1555, lon: 19.1226 },
      { name: "Đurđevića Tara Bridge", lat: 43.1507, lon: 19.2957 },
      { name: "Žabljak", lat: 43.1555, lon: 19.1226 }
    ],
    notes: "Canyon- en uitzichtdag rond Đurđevića Tara Bridge zonder avontuur als basis.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=%C5%BDabljak%2C%20Montenegro&destination=%C5%BDabljak%2C%20Montenegro&travelmode=driving&waypoints=%C4%90ur%C4%91evi%C4%87a%20Tara%20Bridge%2C%20Montenegro"
  },
  {
    id: "to-tjentiste",
    dayNumber: 12,
    date: "Wo 24 juni 2026",
    title: "Žabljak → Tjentište via Piva",
    overnight: "Tjentište / Sutjeska",
    points: [
      { name: "Žabljak", lat: 43.1555, lon: 19.1226 },
      { name: "Piva Lake Viewpoint", lat: 43.1330, lon: 18.8360 },
      { name: "Piva Monastery", lat: 43.1078, lon: 18.8458 },
      { name: "Tjentište", lat: 43.3482, lon: 18.6902 }
    ],
    notes: "Scenic transfer via Piva Lake en Piva Monastery richting Sutjeska.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=%C5%BDabljak%2C%20Montenegro&destination=Tjenti%C5%A1te%2C%20Bosnia%20and%20Herzegovina&travelmode=driving&waypoints=Piva%20Lake%20Viewpoint%2C%20Montenegro%7CPiva%20Monastery%2C%20Montenegro"
  },
  {
    id: "to-sarajevo",
    dayNumber: 13,
    date: "Do 25 juni 2026",
    title: "Tjentište → Sarajevo via Valley of Heroes",
    overnight: "Sarajevo",
    points: [
      { name: "Tjentište", lat: 43.3482, lon: 18.6902 },
      { name: "Valley of Heroes Memorial Park", lat: 43.3457, lon: 18.6900 },
      { name: "Prijevor viewpoint", lat: 43.3215, lon: 18.7140 },
      { name: "Sarajevo", lat: 43.8563, lon: 18.4131 }
    ],
    notes: "Korte Sutjeska-ochtend met Valley of Heroes en eventueel Prijevor, daarna door naar Sarajevo.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Tjenti%C5%A1te%2C%20Bosnia%20and%20Herzegovina&destination=Sarajevo%2C%20Bosnia%20and%20Herzegovina&travelmode=driving&waypoints=Valley%20of%20Heroes%20Memorial%20Park%2C%20Tjenti%C5%A1te%7CPrijevor%2C%20Bosnia%20and%20Herzegovina"
  },
  {
    id: "sarajevo-city-walk",
    dayNumber: 14,
    date: "Vr 26 juni 2026",
    title: "Sarajevo stadsbasis te voet",
    overnight: "Sarajevo",
    points: [
      { name: "Baščaršija", lat: 43.8590, lon: 18.4316 },
      { name: "Sebilj", lat: 43.8592, lon: 18.4319 },
      { name: "Latin Bridge", lat: 43.8575, lon: 18.4287 },
      { name: "Vijećnica", lat: 43.8597, lon: 18.4336 },
      { name: "Baščaršija", lat: 43.8590, lon: 18.4316 }
    ],
    notes: "Compacte stadsbasis door de oude stad met Sebilj, Latin Bridge en Vijećnica.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Ba%C5%A1%C4%8Dar%C5%A1ija%2C%20Sarajevo&destination=Ba%C5%A1%C4%8Dar%C5%A1ija%2C%20Sarajevo&travelmode=walking&waypoints=Sebilj%2C%20Sarajevo%7CLatin%20Bridge%2C%20Sarajevo%7CVije%C4%87nica%2C%20Sarajevo"
  },
  {
    id: "sarajevo-tunnel",
    dayNumber: 14,
    date: "Vr 26 juni 2026",
    title: "Sarajevo met Tunnel of Hope",
    overnight: "Sarajevo",
    points: [
      { name: "Sarajevo", lat: 43.8563, lon: 18.4131 },
      { name: "Baščaršija", lat: 43.8590, lon: 18.4316 },
      { name: "Latin Bridge", lat: 43.8575, lon: 18.4287 },
      { name: "Tunnel of Hope", lat: 43.8197, lon: 18.3374 },
      { name: "Sarajevo", lat: 43.8563, lon: 18.4131 }
    ],
    notes: "Sarajevo-variant met oude stad, Latin Bridge en Tunnel of Hope als belangrijkste historische activiteit.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Sarajevo%2C%20Bosnia%20and%20Herzegovina&destination=Sarajevo%2C%20Bosnia%20and%20Herzegovina&travelmode=driving&waypoints=Ba%C5%A1%C4%8Dar%C5%A1ija%2C%20Sarajevo%7CLatin%20Bridge%2C%20Sarajevo%7CTunnel%20of%20Hope%2C%20Sarajevo"
  },
  {
    id: "sarajevo-trebevic",
    dayNumber: 14,
    date: "Vr 26 juni 2026",
    title: "Sarajevo met Trebević / cable car",
    overnight: "Sarajevo",
    points: [
      { name: "Baščaršija", lat: 43.8590, lon: 18.4316 },
      { name: "Latin Bridge", lat: 43.8575, lon: 18.4287 },
      { name: "Sarajevo Cable Car", lat: 43.8562, lon: 18.4310 },
      { name: "Baščaršija", lat: 43.8590, lon: 18.4316 }
    ],
    notes: "Zachtere Sarajevo-variant met oude stad, Latin Bridge en cable car richting Trebević.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Ba%C5%A1%C4%8Dar%C5%A1ija%2C%20Sarajevo&destination=Ba%C5%A1%C4%8Dar%C5%A1ija%2C%20Sarajevo&travelmode=walking&waypoints=Latin%20Bridge%2C%20Sarajevo%7CSarajevo%20Cable%20Car"
  },
  {
    id: "to-mostar",
    dayNumber: 15,
    date: "Za 27 juni 2026",
    title: "Sarajevo → Mostar via Konjic en Jablanica",
    overnight: "Mostar",
    points: [
      { name: "Sarajevo", lat: 43.8563, lon: 18.4131 },
      { name: "Konjic", lat: 43.6530, lon: 17.9608 },
      { name: "Jablanica", lat: 43.6600, lon: 17.7610 },
      { name: "Mostar", lat: 43.3438, lon: 17.8078 }
    ],
    notes: "Scenic transferdag door de Neretva-vallei via Konjic en eventueel Jablanica naar Mostar.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Sarajevo%2C%20Bosnia%20and%20Herzegovina&destination=Mostar%2C%20Bosnia%20and%20Herzegovina&travelmode=driving&waypoints=Konjic%2C%20Bosnia%20and%20Herzegovina%7CJablanica%2C%20Bosnia%20and%20Herzegovina"
  },
  {
    id: "mostar-herzegovina-base",
    dayNumber: 16,
    date: "Zo 28 juni 2026",
    title: "Mostar → Blagaj → Počitelj → Mostar",
    overnight: "Mostar",
    points: [
      { name: "Mostar", lat: 43.3438, lon: 17.8078 },
      { name: "Blagaj Tekke", lat: 43.2576, lon: 17.9022 },
      { name: "Počitelj", lat: 43.1347, lon: 17.7317 },
      { name: "Mostar", lat: 43.3438, lon: 17.8078 }
    ],
    notes: "Basisroute voor de klassieke Herzegovina-dag met Blagaj en Počitelj als kern.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Mostar%2C%20Bosnia%20and%20Herzegovina&destination=Mostar%2C%20Bosnia%20and%20Herzegovina&travelmode=driving&waypoints=Blagaj%20Tekke%2C%20Bosnia%20and%20Herzegovina%7CPo%C4%8Ditelj%2C%20Bosnia%20and%20Herzegovina"
  },
  {
    id: "mostar-herzegovina-kravica",
    dayNumber: 16,
    date: "Zo 28 juni 2026",
    title: "Mostar → Blagaj → Počitelj → Kravica → Mostar",
    overnight: "Mostar",
    points: [
      { name: "Mostar", lat: 43.3438, lon: 17.8078 },
      { name: "Blagaj Tekke", lat: 43.2576, lon: 17.9022 },
      { name: "Počitelj", lat: 43.1347, lon: 17.7317 },
      { name: "Kravica Waterfall", lat: 43.1566, lon: 17.6083 },
      { name: "Mostar", lat: 43.3438, lon: 17.8078 }
    ],
    notes: "Uitgebreide Herzegovina-route met Kravica als optionele bonus bij goede energie, warmte en drukte.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Mostar%2C%20Bosnia%20and%20Herzegovina&destination=Mostar%2C%20Bosnia%20and%20Herzegovina&travelmode=driving&waypoints=Blagaj%20Tekke%2C%20Bosnia%20and%20Herzegovina%7CPo%C4%8Ditelj%2C%20Bosnia%20and%20Herzegovina%7CKravica%20Waterfall%2C%20Bosnia%20and%20Herzegovina"
  },
  {
    id: "to-trebinje",
    dayNumber: 17,
    date: "Ma 29 juni 2026",
    title: "Mostar → Trebinje via Radimlja en Stolac",
    overnight: "Trebinje",
    points: [
      { name: "Mostar", lat: 43.3438, lon: 17.8078 },
      { name: "Radimlja Stećak Necropolis", lat: 43.0922, lon: 17.9254 },
      { name: "Stolac", lat: 43.0844, lon: 17.9575 },
      { name: "Trebinje", lat: 42.7119, lon: 18.3442 }
    ],
    notes: "Overgangsdag door zuidelijk Herzegovina met eventueel één korte stop bij Radimlja of Stolac.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Mostar%2C%20Bosnia%20and%20Herzegovina&destination=Trebinje%2C%20Bosnia%20and%20Herzegovina&travelmode=driving&waypoints=Radimlja%20Ste%C4%87ak%20Necropolis%2C%20Bosnia%20and%20Herzegovina%7CStolac%2C%20Bosnia%20and%20Herzegovina"
  },
  {
    id: "to-podgorica-airport",
    dayNumber: 18,
    date: "Di 30 juni 2026",
    title: "Trebinje → Podgorica Airport",
    overnight: "Terugvlucht",
    points: [
      { name: "Trebinje", lat: 42.7119, lon: 18.3442 },
      { name: "Podgorica Airport (TGD)", lat: 42.3594, lon: 19.2519 }
    ],
    notes: "Vertrekdag met grensovergang, tanken, auto-inleveren en vlucht rond 17:00.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Trebinje%2C%20Bosnia%20and%20Herzegovina&destination=Podgorica%20Airport%2C%20Montenegro&travelmode=driving"
  },
  {
    id: "trebinje-local",
    dayNumber: 17,
    date: "Ma 29 juni 2026",
    title: "Korte Trebinje-route",
    overnight: "Trebinje",
    points: [
      { name: "Trebinje Old Town", lat: 42.7111, lon: 18.3452 },
      { name: "Arslanagić / Perović Bridge", lat: 42.7162, lon: 18.3518 },
      { name: "Hercegovačka Gračanica", lat: 42.7104, lon: 18.3588 },
      { name: "Trebinje Old Town", lat: 42.7111, lon: 18.3452 }
    ],
    notes: "Optionele lokale route voor oude stad, rivierbrug en Hercegovačka Gračanica bij zonsondergang.",
    routeLink: "https://www.google.com/maps/dir/?api=1&origin=Trebinje%20Old%20Town%2C%20Bosnia%20and%20Herzegovina&destination=Trebinje%20Old%20Town%2C%20Bosnia%20and%20Herzegovina&travelmode=driving&waypoints=Arslanagi%C4%87%20Bridge%2C%20Trebinje%7CHercegova%C4%8Dka%20Gra%C4%8Danica%2C%20Trebinje"
  }
];
const colors = ["#1d4ed8", "#047857", "#b91c1c", "#7c3aed", "#ea580c", "#0f766e", "#4f46e5", "#0891b2", "#65a30d", "#c026d3", "#0369a1", "#be123c", "#0f766e", "#9333ea", "#ca8a04", "#334155", "#dc2626", "#2563eb", "#16a34a", "#475569"];
const fullRouteIds = ["arrival", "to-virpazar", "skadar-base", "to-perast", "kotor-heritage", "kotor-cable", "herceg-novi", "to-zabljak", "durmitor-black-lake", "durmitor-sedlo", "tara-canyon", "to-tjentiste", "to-sarajevo", "sarajevo-city-walk", "to-mostar", "mostar-herzegovina-base", "to-trebinje", "to-podgorica-airport"];
const routeFilterGroups = [
  { label: "Start en korte opening", ids: ["arrival", "to-virpazar"] },
  { label: "Lokale dagroutes", ids: ["skadar-base", "skadar-extended", "kotor-heritage", "kotor-cable", "herceg-novi", "durmitor-black-lake", "durmitor-sedlo", "tara-canyon", "sarajevo-city-walk", "sarajevo-tunnel", "sarajevo-trebevic", "mostar-herzegovina-base", "mostar-herzegovina-kravica", "trebinje-local"] },
  { label: "Reisdagen tussen slaapplekken", ids: ["to-perast", "to-zabljak", "to-tjentiste", "to-sarajevo", "to-mostar", "to-trebinje", "to-podgorica-airport"] }
];

window.tripData = { days, colors, fullRouteIds, routeFilterGroups };
})();
