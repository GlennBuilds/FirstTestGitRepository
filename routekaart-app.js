const { days, colors, fullRouteIds, routeFilterGroups } = window.tripData;
const ROUTE_FETCH_TIMEOUT_MS = 3500;

const map = L.map('map', { preferCanvas: true }).setView([42.95, 18.9], 8);
const baseTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
  attribution: '&copy; OpenStreetMap'
}).addTo(map);
let tileErrorReported = false;

baseTiles.on('tileerror', () => {
  if (tileErrorReported) return;
  tileErrorReported = true;
  document.body.classList.add('map-tiles-failed');
  setMapStatus("Kaarttegels laden niet, maar de routes blijven zichtbaar als fallback.");
});

const dayLayers = [];
const allBounds = L.latLngBounds([]);
let activeDayIndex = null;
let routeGeometryLoading = true;

function pointsToCoords(points) {
  return points.map(p => [p.lon, p.lat]).join(';');
}

async function fetchRoadGeometry(points) {
  if (points.length < 2) return null;
  const coords = pointsToCoords(points);
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), ROUTE_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.routes && data.routes[0] && data.routes[0].geometry) return data.routes[0].geometry.coordinates;
  } catch (e) { }
  finally {
    window.clearTimeout(timeoutId);
  }
  return null;
}

function addMarkers(points, layer, color) {
  points.forEach((p, idx) => {
    const n = idx + 1;
    const marker = L.circleMarker([p.lat, p.lon], {
      radius: idx === 0 || idx === points.length - 1 ? 6.5 : 5,
      color: color,
      weight: 2,
      fillColor: '#ffffff',
      fillOpacity: 1
    }).bindPopup(`<strong>${p.name}</strong><br>Stop ${n}`);
    marker.addTo(layer);
    allBounds.extend([p.lat, p.lon]);
  });
}

function drawFallbackRoute(day, group, color) {
  if (day.points.length >= 2) {
    L.polyline(day.points.map(p => [p.lat, p.lon]), { color, weight: 4, opacity: 0.45, dashArray: "7 8" }).addTo(group);
  }
}

function drawRoadRoute(day, group, color, road) {
  if (road && road.length) {
    const latlngs = road.map(c => [c[1], c[0]]);
    L.polyline(latlngs, { color, weight: 5, opacity: 0.82 }).addTo(group);
    latlngs.forEach(ll => allBounds.extend(ll));
  }
}

function buildDay(day, index) {
  const color = colors[index % colors.length];
  const group = L.layerGroup();
  drawFallbackRoute(day, group, color);
  addMarkers(day.points, group, color);
  dayLayers[index] = { group, day, color, hasRoadGeometry: false };
}

async function enhanceDayGeometry(day, index) {
  const layer = dayLayers[index];
  if (!layer) return;
  const road = await fetchRoadGeometry(day.points);
  if (!road || !road.length) return;
  layer.group.clearLayers();
  drawRoadRoute(day, layer.group, layer.color, road);
  addMarkers(day.points, layer.group, layer.color);
  layer.hasRoadGeometry = true;
  if (activeDayIndex === index) fitDayBounds(index);
}

async function enhanceAllGeometries(concurrency = 4) {
  let nextIndex = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (nextIndex < days.length) {
      const index = nextIndex;
      nextIndex += 1;
      await enhanceDayGeometry(days[index], index);
    }
  });
  await Promise.allSettled(workers);
}

function setView(view) {
  document.body.dataset.view = view;
  document.querySelectorAll('[data-view-target]').forEach((button) => {
    button.setAttribute('aria-current', String(button.dataset.viewTarget === view));
  });

  if (view === 'map') {
    setTimeout(() => {
      map.invalidateSize();
      if (activeDayIndex !== null && dayLayers[activeDayIndex]) {
        fitDayBounds(activeDayIndex);
      } else {
        fitAll();
      }
    }, 80);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleViewTargetEvent(event) {
  const button = event.target.closest('[data-view-target]');
  if (!button) return;
  event.preventDefault();
  setView(button.dataset.viewTarget);
}

function setupViewNavigation() {
  document.querySelectorAll('[data-view-target]').forEach((button) => {
    button.addEventListener('click', handleViewTargetEvent);
    button.addEventListener('pointerup', handleViewTargetEvent);
    button.addEventListener('touchend', handleViewTargetEvent, { passive: false });
  });

  document.addEventListener('click', handleViewTargetEvent, true);
  document.addEventListener('pointerup', handleViewTargetEvent, true);
}

function setupBlockControls() {
  document.querySelectorAll('.block-card').forEach((block) => {
    block.querySelectorAll('.collapse-block').forEach((button) => {
      button.addEventListener('click', () => {
        const sticky = block.querySelector('.block-sticky');
        if (sticky) {
          sticky.classList.remove('is-fixed');
          sticky.removeAttribute('style');
        }
        block.querySelectorAll('details').forEach((details) => {
          details.open = false;
        });
        block.open = false;
        block.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    block.addEventListener('toggle', updateStickyBlockBars);
  });
}

function setupRouteViewerButtons() {
  document.querySelectorAll('[data-route-view]').forEach((button) => {
    button.addEventListener('click', () => {
      focusRouteById(button.dataset.routeView);
    });
  });
}

function setupMapRouteFilter() {
  const reset = document.getElementById('reset-route-filter');
  const close = document.getElementById('close-route-filter');
  const dateGrid = document.getElementById('route-date-grid');
  const routeList = document.getElementById('route-day-routes');
  const selectedDate = document.getElementById('selected-route-date');
  const control = document.getElementById('map-control');
  if (!dateGrid || !routeList || !reset) return;

  const routesByDay = days.reduce((groups, route) => {
    const calendarDate = parseRouteDate(route.date);
    if (!calendarDate) return groups;
    const key = String(calendarDate.day);
    if (!groups.has(key)) {
      groups.set(key, { ...calendarDate, routes: [] });
    }
    groups.get(key).routes.push(route);
    return groups;
  }, new Map());

  function renderRoutesForDay(group) {
    routeList.replaceChildren();
    dateGrid.querySelectorAll('[data-route-day]').forEach((button) => {
      button.classList.toggle('is-selected', button.dataset.routeDay === String(group.day));
      button.setAttribute('aria-pressed', String(button.dataset.routeDay === String(group.day)));
    });
    if (selectedDate) selectedDate.textContent = `${group.weekdayLong} ${group.day} juni`;

    group.routes.forEach((route) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'route-filter-button';
      button.dataset.routeFilter = route.id;
      button.textContent = route.title;
      button.addEventListener('click', () => {
        focusRouteById(route.id);
        if (control) control.open = false;
      });
      routeList.appendChild(button);
    });
  }

  Array.from(routesByDay.values()).sort((a, b) => a.day - b.day).forEach((group) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'route-date-button';
    button.dataset.routeDay = String(group.day);
    button.setAttribute('aria-label', `${group.weekdayLong} ${group.day} juni, ${group.routes.length} route${group.routes.length === 1 ? '' : 's'}`);
    button.innerHTML = `
      <span class="route-date-weekday">${group.weekday}</span>
      <span class="route-date-number">${group.day}</span>
      <span class="route-date-count">${group.routes.length} route${group.routes.length === 1 ? '' : 's'}</span>
    `;
    button.addEventListener('click', () => renderRoutesForDay(group));
    dateGrid.appendChild(button);
  });

  const firstGroup = routesByDay.values().next().value;
  if (firstGroup) renderRoutesForDay(firstGroup);

  reset.addEventListener('click', () => {
    showAll();
    if (control) control.open = false;
  });

  if (close && control) close.addEventListener('click', () => {
    control.open = false;
  });
}

function parseRouteDate(dateLabel) {
  const match = dateLabel.match(/^(\S+)\s+(\d{1,2})\s+juni\s+2026$/i);
  if (!match) return null;
  const weekdayMap = {
    Ma: "Maandag",
    Di: "Dinsdag",
    Wo: "Woensdag",
    Do: "Donderdag",
    Vr: "Vrijdag",
    Za: "Zaterdag",
    Zo: "Zondag"
  };
  return {
    weekday: match[1],
    weekdayLong: weekdayMap[match[1]] || match[1],
    day: Number(match[2])
  };
}

function setupStayNavigation() {
  document.querySelectorAll('[data-block-target]').forEach((button) => {
    button.addEventListener('click', () => {
      const block = document.getElementById(button.dataset.blockTarget);
      if (!block) return;

      setView('blocks');
      block.open = true;

      setTimeout(() => {
        block.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateStickyBlockBars();
      }, 120);
    });
  });
}

function setupStickyBlockBars() {
  const side = document.querySelector('.side');
  const update = () => requestAnimationFrame(updateStickyBlockBars);

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  if (side) side.addEventListener('scroll', update, { passive: true });

  updateStickyBlockBars();
}

function updateStickyBlockBars() {
  const side = document.querySelector('.side');
  const mobile = isMobileLayout();
  const stickyTop = mobile || !side ? 0 : side.getBoundingClientRect().top;

  document.querySelectorAll('.block-card').forEach((block) => {
    const sticky = block.querySelector('.block-sticky');
    if (!sticky) return;

    const blockRect = block.getBoundingClientRect();
    const stickyHeight = sticky.offsetHeight;
    const shouldFix = block.open && blockRect.top < stickyTop && blockRect.bottom > stickyTop + stickyHeight + 16;

    if (!shouldFix) {
      sticky.classList.remove('is-fixed');
      sticky.removeAttribute('style');
      return;
    }

    const width = Math.min(blockRect.width, window.innerWidth);
    const left = Math.max(blockRect.left, 0);
    sticky.style.setProperty('--sticky-top', `${stickyTop}px`);
    sticky.style.setProperty('--sticky-left', `${left}px`);
    sticky.style.setProperty('--sticky-width', `${width}px`);
    sticky.style.setProperty('--sticky-height', `${stickyHeight}px`);
    sticky.classList.add('is-fixed');
  });
}

function isMobileLayout() {
  return window.matchMedia('(max-width: 980px)').matches;
}

function markActiveDay(idx) {
  const activeRouteId = idx !== null && dayLayers[idx] ? dayLayers[idx].day.id : null;
  document.querySelectorAll('[data-route-view], [data-route-filter]').forEach((button) => {
    const routeId = button.dataset.routeView || button.dataset.routeFilter;
    const active = routeId === activeRouteId;
    button.classList.toggle('is-active-route', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

function fitDayBounds(idx) {
  const bounds = L.latLngBounds([]);
  const points = dayLayers[idx].day.points;
  points.forEach(p => bounds.extend([p.lat, p.lon]));
  map.invalidateSize();
  map.fitBounds(bounds.pad(0.25));
}

function boundsForRouteIds(routeIds) {
  const bounds = L.latLngBounds([]);
  routeIds.forEach((routeId) => {
    const layer = dayLayers.find(obj => obj.day.id === routeId);
    if (!layer) return;
    layer.day.points.forEach(p => bounds.extend([p.lat, p.lon]));
  });
  return bounds;
}

function revealMapOnMobile(idx) {
  if (!isMobileLayout()) return;

  setView('map');

  setTimeout(() => {
    map.invalidateSize();
    fitDayBounds(idx);
  }, 350);
}

function focusDay(idx) {
  activeDayIndex = idx;
  markActiveDay(idx);

  dayLayers.forEach((obj, i) => {
    if (map.hasLayer(obj.group)) map.removeLayer(obj.group);
    if (i === idx) obj.group.addTo(map);
  });
  fitDayBounds(idx);
  updateMapFilterState(dayLayers[idx].day.id);
  revealMapOnMobile(idx);
}

function focusRouteById(routeId) {
  const idx = dayLayers.findIndex(obj => obj.day.id === routeId);
  if (idx === -1) return;
  focusDay(idx);
  if (!isMobileLayout()) setView('map');
}

function showAll(options = {}) {
  const { openMap = true } = options;
  activeDayIndex = null;
  markActiveDay(null);
  dayLayers.forEach((obj) => {
    if (fullRouteIds.includes(obj.day.id)) {
      obj.group.addTo(map);
    } else if (map.hasLayer(obj.group)) {
      map.removeLayer(obj.group);
    }
  });
  updateMapFilterState('all');
  if (openMap && isMobileLayout()) setView('map');
  fitAll();
}

function setMapStatus(message) {
  const status = document.getElementById('map-status');
  if (!status) return;
  status.textContent = tileErrorReported && !message.includes("Kaarttegels")
    ? `${message} Kaarttegels laden mogelijk beperkt.`
    : message;
}

function updateMapFilterState(routeId) {
  const title = document.getElementById('current-route-title');
  const meta = document.getElementById('current-route-meta');
  const mapsLink = document.getElementById('current-route-maps');

  if (routeId === 'all') {
    if (title) title.textContent = "Huidige totaalroute";
    if (meta) meta.textContent = "Alle hoofdtrajecten zichtbaar.";
    if (mapsLink) {
      mapsLink.hidden = true;
      mapsLink.removeAttribute('href');
    }
    setMapStatus(routeGeometryLoading ? "Huidige totaalroute zichtbaar. Weglijnen laden op de achtergrond." : "Huidige totaalroute zichtbaar.");
    return;
  }

  const route = days.find(day => day.id === routeId);
  if (title) title.textContent = route ? route.title : "Route";
  if (meta) meta.textContent = route ? `${route.date} · Dag ${route.dayNumber}` : "";
  if (mapsLink) {
    if (route && route.routeLink) {
      mapsLink.href = route.routeLink;
      mapsLink.hidden = false;
    } else {
      mapsLink.hidden = true;
      mapsLink.removeAttribute('href');
    }
  }
  setMapStatus(route ? `${route.date} · ${route.title} zichtbaar.` : "");
}

function fitAll() {
  map.invalidateSize();
  const bounds = boundsForRouteIds(fullRouteIds);
  if (bounds.isValid()) map.fitBounds(bounds.pad(0.1));
}

async function init() {
  setupViewNavigation();
  setupBlockControls();
  setupStickyBlockBars();
  setupRouteViewerButtons();
  setupStayNavigation();
  setupMapRouteFilter();
  setView(isMobileLayout() ? 'overview' : 'map');

  days.forEach((day, index) => buildDay(day, index));
  showAll({ openMap: false });
  enhanceAllGeometries().then(() => {
    routeGeometryLoading = false;
    if (activeDayIndex === null) {
      fitAll();
      updateMapFilterState('all');
    }
  });
  setTimeout(() => {
    map.invalidateSize();
    fitAll();
  }, 250);
}

Object.assign(window, { setView, showAll, fitAll, focusRouteById });

init();
window.addEventListener('resize', () => {
  map.invalidateSize();
  if (!isMobileLayout()) {
    document.body.dataset.view = 'map';
  }
  if (activeDayIndex !== null) {
    fitDayBounds(activeDayIndex);
  } else {
    fitAll();
  }
});
