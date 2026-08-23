/* 📚 Jessica's Bookshelf — app logic 📚 */
(() => {
  "use strict";

  const STORE_KEY = "jessica-bookshelf-v1";
  const DEFAULT_SHELF_NAME = "Jessica";
  const DEFAULT_READ_SORT = "newest";

  /* ---------- state ---------- */
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        return {
          read: s.read && typeof s.read === "object" ? s.read : {},
          favs: Array.isArray(s.favs) ? [...new Set(s.favs)] : [],
          badges: Array.isArray(s.badges) ? s.badges : [],
          shelfName: cleanShelfName(s.shelfName),
          readSort: s.readSort === "oldest" ? "oldest" : DEFAULT_READ_SORT
        };
      }
    } catch (e) { /* corrupted data — start fresh */ }
    return defaultState();
  }

  function defaultState() {
    return { read: {}, favs: [], badges: [], shelfName: DEFAULT_SHELF_NAME, readSort: DEFAULT_READ_SORT };
  }

  function cleanShelfName(value) {
    return typeof value === "string" && value.trim() ? value.trim().slice(0, 40) : DEFAULT_SHELF_NAME;
  }

  function save() {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  }

  const readCount = () => Object.keys(state.read).length;
  const isRead = id => Object.prototype.hasOwnProperty.call(state.read, id);
  const isFav = id => state.favs.includes(id);

  /* ---------- elements ---------- */
  const $ = sel => document.querySelector(sel);
  const bookGrid = $("#bookGrid");
  const readGrid = $("#readGrid");
  const favGrid = $("#favGrid");
  const searchInput = $("#searchInput");
  const readSearchInput = $("#readSearchInput");
  const seriesFilter = $("#seriesFilter");
  const sortSelect = $("#sortSelect");
  const readSortSelect = $("#readSortSelect");
  const favReadFilter = $("#favReadFilter");
  const shelfNameInput = $("#shelfNameInput");

  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  /* ---------- floating sparkles ---------- */
  (function sparkles() {
    const layer = document.querySelector(".sparkle-layer");
    const glyphs = ["✨", "⭐", "📖", "💥", "🐛"];
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("i");
      s.textContent = glyphs[i % glyphs.length];
      s.style.left = Math.random() * 100 + "vw";
      s.style.fontSize = (10 + Math.random() * 14) + "px";
      s.style.animationDuration = (12 + Math.random() * 18) + "s";
      s.style.animationDelay = -Math.random() * 20 + "s";
      layer.appendChild(s);
    }
  })();

  /* ---------- series filter options ---------- */
  SERIES_NAMES.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    seriesFilter.appendChild(opt);
  });

  /* ---------- rendering ---------- */
  function coverHTML(book, big, favouriteOrder = 0) {
    const [c1, c2] = book.colors;
    const cover = book.cover;
    const image = cover ? `
        <img class="cover-image" src="${escapeHTML(cover.image)}" alt="${escapeHTML(book.title)} book cover"
          loading="${big ? "eager" : "lazy"}" decoding="async"${big ? ' fetchpriority="high"' : ""}>` : "";
    return `
      <div class="cover ${cover ? "has-image" : ""}${favouriteOrder ? " has-favourite-position" : ""}" style="background: linear-gradient(150deg, ${c1}, ${c2})">
        <div class="cover-fallback"${cover ? ' aria-hidden="true"' : ""}>
          <span class="cover-emoji">${book.emoji}</span>
          <span class="cover-name">${escapeHTML(book.title)}</span>
          <span class="cover-series">${book.seriesEmoji} ${escapeHTML(book.series)}</span>
        </div>
        ${image}
        ${book.num ? `<span class="cover-num">#${book.num}</span>` : `<span class="cover-num">⭐ Special</span>`}
        ${favouriteOrder ? `<span class="favourite-position" aria-label="Favourite position ${favouriteOrder}" title="Favourite #${favouriteOrder}">#${favouriteOrder}</span>` : ""}
        ${isRead(book.id) ? `<span class="read-stamp">🌟</span>` : ""}
      </div>`;
  }

  function cardHTML(book, options = {}) {
    const read = isRead(book.id);
    const {
      favouriteOrder = 0,
      favouriteTotal = 0,
      canMoveUp = favouriteOrder > 1,
      canMoveDown = favouriteOrder < favouriteTotal
    } = options;
    const reorderControls = favouriteOrder ? `
        <div class="favourite-order-controls">
          <button class="order-btn" data-act="fav-up" aria-label="Move ${escapeHTML(book.title)} up" title="Move up"${canMoveUp ? "" : " disabled"}>↑</button>
          <span class="order-number" aria-label="Favourite ${favouriteOrder} of ${favouriteTotal}">#${favouriteOrder}</span>
          <button class="order-btn" data-act="fav-down" aria-label="Move ${escapeHTML(book.title)} down" title="Move down"${canMoveDown ? "" : " disabled"}>↓</button>
          <button class="drag-handle" data-act="drag" aria-label="Drag ${escapeHTML(book.title)} to change its order" title="Drag to reorder">⠿ Drag to reorder</button>
        </div>` : "";
    return `
      <article class="book-card ${read ? "is-read" : ""}${favouriteOrder ? " favourite-card" : ""}" data-id="${book.id}" aria-label="${escapeHTML(book.title)}"${favouriteOrder ? ' draggable="true"' : ""}>
        ${coverHTML(book, false, favouriteOrder)}
        ${reorderControls}
        <div class="card-actions">
          <button class="fav-btn" data-act="fav" aria-label="Favourite">${isFav(book.id) ? "💖" : "🤍"}</button>
          <button class="read-btn ${read ? "done" : ""}" data-act="read">${read ? "Read it! 🌟" : "I read it!"}</button>
        </div>
      </article>`;
  }

  function getFilteredBooks() {
    const q = searchInput.value.trim().toLowerCase();
    const ser = seriesFilter.value;
    let list = BOOKS.filter(b =>
      (!ser || b.series === ser) &&
      (!q || b.title.toLowerCase().includes(q) || b.series.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    );
    const sort = sortSelect.value;
    if (sort === "az") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "fav") {
      const favouriteRanks = new Map(state.favs.map((id, index) => [id, index]));
      list = [...list].sort((a, b) => {
        const aRank = favouriteRanks.get(a.id);
        const bRank = favouriteRanks.get(b.id);
        if (aRank !== undefined && bRank !== undefined) return aRank - bRank;
        return (isFav(b.id) - isFav(a.id)) || ((a.num || 999) - (b.num || 999));
      });
    } else if (sort === "recent") {
      list = [...list].sort((a, b) => readTime(b.id) - readTime(a.id));
    } else if (sort === "unread") {
      list = [...list].sort((a, b) => (isRead(a.id) - isRead(b.id)) || ((a.num || 999) - (b.num || 999)));
    }
    return list;
  }

  function renderBooks() {
    const list = getFilteredBooks();
    bookGrid.innerHTML = list.map(cardHTML).join("");
    $("#booksEmpty").hidden = list.length > 0;
  }

  function renderRead() {
    const q = readSearchInput.value.trim().toLowerCase();
    const direction = state.readSort === "oldest" ? 1 : -1;
    const list = BOOKS.filter(book =>
      isRead(book.id) &&
      (!q || book.title.toLowerCase().includes(q) || book.series.toLowerCase().includes(q) || book.author.toLowerCase().includes(q))
    ).sort((a, b) => direction * (readTime(a.id) - readTime(b.id)) || a.title.localeCompare(b.title));
    readGrid.innerHTML = list.map(book => cardHTML(book)).join("");
    const empty = $("#readEmpty");
    empty.hidden = list.length > 0;
    empty.textContent = readCount()
      ? "No books read match that search! 🔍"
      : "Books you finish will shine here! 🌟";
  }

  function renderFavs() {
    const booksById = new Map(BOOKS.map(book => [book.id, book]));
    const status = favReadFilter.value;
    const favBooks = state.favs
      .map(id => booksById.get(id))
      .filter(Boolean)
      .filter(book => !status || (status === "read" ? isRead(book.id) : !isRead(book.id)));
    favGrid.innerHTML = favBooks.map((book, index) => cardHTML(book, {
      favouriteOrder: state.favs.indexOf(book.id) + 1,
      favouriteTotal: state.favs.length,
      canMoveUp: index > 0,
      canMoveDown: index < favBooks.length - 1
    })).join("");
    const empty = $("#favsEmpty");
    empty.hidden = favBooks.length > 0;
    empty.textContent = !state.favs.length
      ? "Tap the 🤍 on a book to add it here!"
      : status === "read"
        ? "No read favourites yet! 📚"
        : status === "unread"
          ? "No unread favourites yet! 📚"
          : "No favourites to show! 📚";
  }

  function renderProgress() {
    const total = BOOKS.length;
    const n = readCount();
    $("#progressFill").style.width = (n / total * 100) + "%";
    $("#progressText").textContent = `${n} of ${total} books read 📚`;
  }

  function renderShelfName() {
    const possessive = /s$/i.test(state.shelfName) ? `${state.shelfName}'` : `${state.shelfName}'s`;
    const title = `${possessive} Bookshelf`;
    $("#bookshelfTitle").textContent = title;
    shelfNameInput.value = state.shelfName;
    document.title = title;
  }

  function seriesProgress() {
    return SERIES.map(s => {
      const done = s.bookIds.filter(isRead).length;
      return { name: s.name, emoji: s.emoji, done, total: s.bookIds.length };
    });
  }

  function renderBadges() {
    const n = readCount();
    $("#badgeStats").innerHTML = `
      <div class="stat-card"><div class="num">${n}</div><div class="lbl">Books read</div></div>
      <div class="stat-card"><div class="num">${state.favs.length}</div><div class="lbl">Favourites</div></div>
      <div class="stat-card"><div class="num">${earnedBadges().length}</div><div class="lbl">Badges</div></div>`;

    $("#milestoneGrid").innerHTML = MILESTONES.map(m => `
      <div class="badge-card ${n >= m.count ? "earned" : "locked"}">
        <div class="badge-emoji">${m.emoji}</div>
        <div class="badge-name">${m.name}</div>
        <div class="badge-desc">${n >= m.count ? m.desc : `Read ${m.count} book${m.count > 1 ? "s" : ""} to unlock`}</div>
      </div>`).join("");

    $("#seriesBadgeGrid").innerHTML = seriesProgress().map(s => `
      <div class="badge-card ${s.done === s.total ? "earned" : "locked"}">
        <div class="badge-emoji">${s.emoji}</div>
        <div class="badge-name">${s.name}</div>
        <div class="badge-desc">${s.done} / ${s.total} read</div>
      </div>`).join("");
  }

  function earnedBadges() {
    const n = readCount();
    const earned = MILESTONES.filter(m => n >= m.count).map(m => "m" + m.count);
    seriesProgress().forEach(s => { if (s.done === s.total) earned.push("s:" + s.name); });
    return earned;
  }

  function renderAll() {
    renderBooks();
    renderRead();
    renderFavs();
    renderBadges();
    renderProgress();
    renderShelfName();
  }

  /* ---------- badge detection ---------- */
  function checkNewBadges() {
    const now = earnedBadges();
    const fresh = now.filter(id => !state.badges.includes(id));
    state.badges = now;
    save();
    if (!fresh.length) return;
    const id = fresh[0];
    let badge;
    if (id.startsWith("m")) {
      const m = MILESTONES.find(m => "m" + m.count === id);
      badge = { emoji: m.emoji, name: m.name, desc: m.desc };
    } else {
      const name = id.slice(2);
      const s = SERIES.find(s => s.name === name);
      badge = { emoji: s ? s.emoji : "👑", name: `${name} Complete!`, desc: `You read every single book in ${name}! Amazing!` };
    }
    showBadgePopup(badge);
  }

  function showBadgePopup(badge) {
    $("#badgePopupEmoji").textContent = badge.emoji;
    $("#badgePopupName").textContent = badge.name;
    $("#badgePopupDesc").textContent = badge.desc;
    $("#badgePopup").hidden = false;
    burstConfetti(120);
  }
  $("#badgePopupClose").addEventListener("click", () => { $("#badgePopup").hidden = true; });

  /* ---------- actions ---------- */
  function toggleRead(id) {
    if (isRead(id)) {
      delete state.read[id];
    } else {
      state.read[id] = new Date().toISOString();
      burstConfetti(45);
    }
    save();
    renderAll();
    checkNewBadges();
  }

  function readTime(id) {
    const timestamp = new Date(state.read[id]).getTime();
    return Number.isFinite(timestamp) ? timestamp : 0;
  }

  function dateInputValue(value) {
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) return "";
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function updateReadDate(id, value) {
    if (!isRead(id) || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
    const [year, month, day] = value.split("-").map(Number);
    const previous = new Date(state.read[id]);
    const hasPreviousTime = Number.isFinite(previous.getTime());
    const updated = new Date(
      year,
      month - 1,
      day,
      hasPreviousTime ? previous.getHours() : 12,
      hasPreviousTime ? previous.getMinutes() : 0,
      hasPreviousTime ? previous.getSeconds() : 0,
      hasPreviousTime ? previous.getMilliseconds() : 0
    );
    if (updated.getFullYear() !== year || updated.getMonth() !== month - 1 || updated.getDate() !== day) return;
    state.read[id] = updated.toISOString();
    save();
    renderAll();
    const status = $("#readDateStatus");
    if (status) status.textContent = "Date saved ✨";
  }

  function toggleFav(id) {
    const i = state.favs.indexOf(id);
    if (i >= 0) state.favs.splice(i, 1);
    else state.favs.push(id);
    save();
    renderAll();
  }

  function moveFavourite(id, offset) {
    const visibleIds = [...favGrid.querySelectorAll(".favourite-card")].map(card => card.dataset.id);
    const visibleFrom = visibleIds.indexOf(id);
    const visibleTo = visibleFrom + offset;
    if (visibleFrom < 0 || visibleTo < 0 || visibleTo >= visibleIds.length) return;
    const from = state.favs.indexOf(id);
    const to = state.favs.indexOf(visibleIds[visibleTo]);
    [state.favs[from], state.favs[to]] = [state.favs[to], state.favs[from]];
    save();
    renderBooks();
    renderFavs();
    announceFavouriteOrder(id);
    if (offset < 0) keepFavouriteVisible(id);
  }

  function keepFavouriteVisible(id) {
    requestAnimationFrame(() => {
      const card = favGrid.querySelector(`[data-id="${id}"]`);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const isOutsideComfortableView = rect.top < 12 || rect.bottom > window.innerHeight - 96;
      if (isOutsideComfortableView) {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        card.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center", inline: "nearest" });
      }
      card.querySelector('[data-act="fav-up"]')?.focus({ preventScroll: true });
    });
  }

  function announceFavouriteOrder(id) {
    const book = BOOKS.find(item => item.id === id);
    const position = state.favs.indexOf(id) + 1;
    $("#favOrderStatus").textContent = `${book?.title || "Favourite"} is now number ${position}.`;
  }

  /* ---------- card clicks (delegated) ---------- */
  function onGridClick(e) {
    const card = e.target.closest(".book-card");
    if (!card) return;
    const id = card.dataset.id;
    const act = e.target.closest("[data-act]")?.dataset.act;
    if (act === "fav") { toggleFav(id); return; }
    if (act === "read") { toggleRead(id); return; }
    if (act === "fav-up") { moveFavourite(id, -1); return; }
    if (act === "fav-down") { moveFavourite(id, 1); return; }
    if (act === "drag") return;
    openModal(id);
  }
  bookGrid.addEventListener("click", onGridClick);
  readGrid.addEventListener("click", onGridClick);
  favGrid.addEventListener("click", onGridClick);

  /* ---------- favourite ordering ---------- */
  let draggedFavouriteId = null;
  let dragTargetCard = null;

  function isBeforeCard(x, y, card) {
    const rect = card.getBoundingClientRect();
    const sameRow = y >= rect.top && y <= rect.bottom;
    return sameRow ? x < rect.left + rect.width / 2 : y < rect.top + rect.height / 2;
  }

  function commitFavouriteOrder(id) {
    const visibleIds = [...favGrid.querySelectorAll(".favourite-card")].map(card => card.dataset.id);
    const visibleSet = new Set(visibleIds);
    let visibleIndex = 0;
    state.favs = state.favs.map(favouriteId =>
      visibleSet.has(favouriteId) ? visibleIds[visibleIndex++] : favouriteId
    );
    save();
    renderBooks();
    renderFavs();
    announceFavouriteOrder(id);
  }

  favGrid.addEventListener("dragstart", e => {
    const card = e.target.closest(".favourite-card");
    if (!card) return;
    draggedFavouriteId = card.dataset.id;
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", draggedFavouriteId);
  });

  favGrid.addEventListener("dragover", e => {
    if (!draggedFavouriteId) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const target = e.target.closest(".favourite-card");
    if (dragTargetCard && dragTargetCard !== target) dragTargetCard.classList.remove("drag-target");
    dragTargetCard = target?.dataset.id !== draggedFavouriteId ? target : null;
    dragTargetCard?.classList.add("drag-target");
  });

  favGrid.addEventListener("drop", e => {
    e.preventDefault();
    const droppedId = draggedFavouriteId;
    const dragged = favGrid.querySelector(`[data-id="${draggedFavouriteId}"]`);
    const target = e.target.closest(".favourite-card");
    if (!dragged || dragged === target) return;
    if (target) favGrid.insertBefore(dragged, isBeforeCard(e.clientX, e.clientY, target) ? target : target.nextSibling);
    else favGrid.appendChild(dragged);
    draggedFavouriteId = null;
    dragTargetCard = null;
    commitFavouriteOrder(droppedId);
  });

  favGrid.addEventListener("dragend", () => {
    favGrid.querySelectorAll(".dragging, .drag-target").forEach(card => card.classList.remove("dragging", "drag-target"));
    draggedFavouriteId = null;
    dragTargetCard = null;
  });

  let pointerDrag = null;

  favGrid.addEventListener("pointerdown", e => {
    const handle = e.target.closest(".drag-handle");
    if (!handle || (e.button !== undefined && e.button !== 0)) return;
    e.preventDefault();
    const card = handle.closest(".favourite-card");
    pointerDrag = { pointerId: e.pointerId, handle, card, moved: false };
    handle.setPointerCapture?.(e.pointerId);
    card.classList.add("dragging");
  });

  favGrid.addEventListener("pointermove", e => {
    if (!pointerDrag || e.pointerId !== pointerDrag.pointerId) return;
    e.preventDefault();
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest(".favourite-card");
    if (!target || target === pointerDrag.card || target.parentElement !== favGrid) return;
    favGrid.insertBefore(pointerDrag.card, isBeforeCard(e.clientX, e.clientY, target) ? target : target.nextSibling);
    pointerDrag.moved = true;
  });

  function finishPointerDrag(e) {
    if (!pointerDrag || e.pointerId !== pointerDrag.pointerId) return;
    const { handle, card, moved } = pointerDrag;
    handle.releasePointerCapture?.(e.pointerId);
    card.classList.remove("dragging");
    pointerDrag = null;
    if (moved) commitFavouriteOrder(card.dataset.id);
  }

  favGrid.addEventListener("pointerup", finishPointerDrag);
  favGrid.addEventListener("pointercancel", finishPointerDrag);

  /* If a remote cover ever disappears, reveal the original generated fallback. */
  document.addEventListener("error", e => {
    if (!e.target.matches?.(".cover-image")) return;
    const cover = e.target.closest(".cover");
    cover?.classList.remove("has-image");
    cover?.querySelector(".cover-fallback")?.removeAttribute("aria-hidden");
    e.target.remove();
  }, true);

  /* ---------- modal ---------- */
  const backdrop = $("#modalBackdrop");
  const modal = $("#bookModal");

  function openModal(id) {
    const book = BOOKS.find(b => b.id === id);
    if (!book) return;
    const cover = book.cover;
    const read = isRead(id);
    const readDate = read ? dateInputValue(state.read[id]) : null;
    modal.innerHTML = `
      <div class="modal-toolbar">
        <button class="modal-close" aria-label="Close book details">✕</button>
      </div>
      <div class="modal-scroll" id="modalScroll">
        ${coverHTML(book, true)}
        <div class="modal-body">
          <span class="series-tag">${book.seriesEmoji} ${book.series}${book.num ? ` · Book #${book.num}` : " · Special Edition"}</span>
          <p class="bio">${book.bio}</p>
          ${cover ? `<a class="cover-source" href="${escapeHTML(cover.page)}" target="_blank" rel="noopener noreferrer">Cover from ${escapeHTML(cover.source)} ↗</a>` : ""}
          ${readDate ? `<div class="read-date">
            <label for="readDateInput">🌟 Read on</label>
            <input type="date" id="readDateInput" value="${readDate}" max="${dateInputValue(new Date())}">
            <span class="read-date-status" id="readDateStatus" role="status" aria-live="polite">Tap the date to change it</span>
          </div>` : ""}
          <div class="modal-actions">
            <button class="btn btn-ghost" data-act="fav">${isFav(id) ? "💖 Favourited" : "🤍 Favourite"}</button>
            <button class="btn btn-primary" data-act="read">${read ? "↩️ Not read yet" : "🌟 I read it!"}</button>
          </div>
        </div>
      </div>
      <button class="modal-back-to-top" aria-controls="modalScroll" hidden><span aria-hidden="true">↑</span> Back to top</button>`;
    backdrop.hidden = false;
    const scroller = modal.querySelector(".modal-scroll");
    const backToTop = modal.querySelector(".modal-back-to-top");
    scroller.addEventListener("scroll", () => {
      backToTop.hidden = scroller.scrollTop < 160;
    }, { passive: true });
    backToTop.onclick = () => scroller.scrollTo({
      top: 0,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
    modal.querySelector(".modal-close").onclick = closeModal;
    modal.querySelector('[data-act="fav"]').onclick = () => { toggleFav(id); openModal(id); };
    modal.querySelector('[data-act="read"]').onclick = () => { toggleRead(id); openModal(id); };
    modal.querySelector("#readDateInput")?.addEventListener("change", e => updateReadDate(id, e.target.value));
  }
  function closeModal() { backdrop.hidden = true; }
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal(); });

  /* ---------- navigation ---------- */
  function showView(viewName) {
      document.querySelectorAll(".nav-btn").forEach(btn => {
        const active = btn.dataset.view === viewName;
        btn.classList.toggle("active", active);
        if (active) btn.setAttribute("aria-current", "page");
        else btn.removeAttribute("aria-current");
      });
      const settingsBtn = $("#settingsBtn");
      settingsBtn.classList.toggle("active", viewName === "settings");
      settingsBtn.setAttribute("aria-label", viewName === "settings" ? "Settings open" : "Open settings");
      document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
      $("#view-" + viewName)?.classList.add("active");
      window.scrollTo({ top: 0 });
  }

  document.querySelectorAll(".nav-btn, .settings-btn").forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });

  /* ---------- search / filter / sort ---------- */
  searchInput.addEventListener("input", renderBooks);
  readSearchInput.addEventListener("input", renderRead);
  seriesFilter.addEventListener("change", renderBooks);
  sortSelect.addEventListener("change", renderBooks);
  readSortSelect.value = state.readSort;
  readSortSelect.addEventListener("change", () => {
    state.readSort = readSortSelect.value === "oldest" ? "oldest" : DEFAULT_READ_SORT;
    save();
    renderRead();
  });
  favReadFilter.addEventListener("change", renderFavs);

  $("#bookshelfNameForm").addEventListener("submit", e => {
    e.preventDefault();
    state.shelfName = cleanShelfName(shelfNameInput.value);
    save();
    renderShelfName();
    $("#shelfNameStatus").textContent = "Bookshelf name saved ✨";
  });

  /* ---------- export / import / reset ---------- */
  $("#exportBtn").addEventListener("click", () => {
    const payload = {
      app: "jessica-bookshelf",
      version: 2,
      exportedAt: new Date().toISOString(),
      read: state.read,
      favs: state.favs,
      shelfName: state.shelfName,
      readSort: state.readSort
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `jessica-bookshelf-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("#importBtn").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (data.app !== "jessica-bookshelf" || !data.read || Array.isArray(data.read) || typeof data.read !== "object") throw new Error("wrong file");
        const merge = confirm("Merge with what's already on this device?\n\nOK = merge together\nCancel = replace everything");
        if (merge) {
          state.read = { ...state.read, ...data.read };
          state.favs = [...new Set([...state.favs, ...(Array.isArray(data.favs) ? data.favs : [])])];
          if (typeof data.shelfName === "string" && data.shelfName.trim()) state.shelfName = cleanShelfName(data.shelfName);
          if (data.readSort === "oldest" || data.readSort === "newest") state.readSort = data.readSort;
        } else {
          state.read = data.read || {};
          state.favs = Array.isArray(data.favs) ? [...new Set(data.favs)] : [];
          state.shelfName = cleanShelfName(data.shelfName);
          state.readSort = data.readSort === "oldest" ? "oldest" : DEFAULT_READ_SORT;
        }
        state.badges = earnedBadges();
        readSortSelect.value = state.readSort;
        save();
        renderAll();
        alert("📚 Your bookshelf has arrived! 📚");
      } catch {
        alert("Oh no — that doesn't look like a bookshelf file. 📚");
      }
      e.target.value = "";
    };
    reader.readAsText(file);
  });

  $("#resetBtn").addEventListener("click", () => {
    if (confirm("Really wipe ALL read books, favourites and badges on this device?")) {
      state = { ...defaultState(), shelfName: state.shelfName, readSort: state.readSort };
      save();
      renderAll();
    }
  });

  /* ---------- confetti ---------- */
  const canvas = $("#confetti");
  const ctx = canvas.getContext("2d");
  let pieces = [];
  let raf = null;

  function burstConfetti(count) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const colors = ["#ff5a36", "#ffb100", "#ffd43b", "#7ed957", "#2bc5b4", "#4fb3ff", "#14879f"];
    for (let i = 0; i < count; i++) {
      pieces.push({
        x: innerWidth / 2 + (Math.random() - 0.5) * 120,
        y: innerHeight / 2,
        vx: (Math.random() - 0.5) * 12,
        vy: -Math.random() * 12 - 4,
        size: 5 + Math.random() * 6,
        color: colors[i % colors.length],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 90 + Math.random() * 40
      });
    }
    if (!raf) tick();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces = pieces.filter(p => p.life > 0);
    for (const p of pieces) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rot += p.vr;
      p.life--;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.min(1, p.life / 30);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    if (pieces.length) {
      raf = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      raf = null;
    }
  }

  /* ---------- service worker ---------- */
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }

  /* ---------- go! ---------- */
  state.badges = earnedBadges();
  save();
  renderAll();
})();
