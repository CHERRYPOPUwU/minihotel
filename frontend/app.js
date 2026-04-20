/* ── STATE ── */
let allUsers    = [];
let allRooms    = [];
let allBookings = [];

/* ── HELPERS ── */
const $ = id => document.getElementById(id);

function toast(msg, type = 'default') {
  const c = $('toasts');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.prepend(t);
  setTimeout(() => t.style.opacity = '0', 3000);
  setTimeout(() => t.remove(), 3400);
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
}

/* ── INIT / HERO ── */
function showApp() {
  $('heroSection').style.display = 'none';
  const app = $('app');
  app.classList.add('visible');
  checkStatus();
  loadUsers();
}

/* ── TABS ── */
function switchTab(name) {
  ['users','rooms','bookings'].forEach(t => {
    $(`tab-${t}`).classList.toggle('active', t === name);
    document.querySelector(`[data-tab="${t}"]`).classList.toggle('active', t === name);
  });
  if (name === 'users')    loadUsers();
  if (name === 'rooms')    loadRooms();
  if (name === 'bookings') loadBookings();
}

/* ── STATUS ── */
async function checkStatus() {
  const dot = $('statusDot'), txt = $('statusText');
  dot.className = 'dot';
  txt.textContent = 'Verificando…';
  try {
    const r = await fetch('/api/users');
    if (r.ok) { dot.className = 'dot online'; txt.textContent = 'Conectado'; }
    else throw new Error();
  } catch {
    dot.className = 'dot offline'; txt.textContent = 'Sin conexión';
  }
}

/* ══════════════════════════════
   USERS
══════════════════════════════ */
async function loadUsers() {
  try {
    allUsers = await apiFetch('/api/users');
    renderUsers(allUsers);
    $('userCount').textContent = allUsers.length;
  } catch { renderUsersEmpty('Error cargando huéspedes'); }
}

function renderUsers(list) {
  const tbody = $('usersBody');
  if (!list.length) { tbody.innerHTML = `<tr><td colspan="3" class="empty">Sin huéspedes registrados</td></tr>`; return; }
  tbody.innerHTML = list.map(u => `
    <tr>
      <td><span class="id-badge">#${u.id}</span></td>
      <td>${u.name}</td>
      <td>
        <div class="action-group">
          <button class="btn-edit"   onclick="openEditUser(${u.id})">Editar</button>
          <button class="btn-delete" onclick="confirmDelete('user',${u.id},'¿Eliminar al huésped &quot;${u.name}&quot;?')">Eliminar</button>
        </div>
      </td>
    </tr>`).join('');
}

function renderUsersEmpty(msg) {
  $('usersBody').innerHTML = `<tr><td colspan="3" class="empty">${msg}</td></tr>`;
}

function filterUsers() {
  const q = $('userSearch').value.toLowerCase();
  renderUsers(allUsers.filter(u => u.name.toLowerCase().includes(q) || String(u.id).includes(q)));
}

async function createUser(name) {
  const u = await apiFetch('/api/users', { method: 'POST', body: JSON.stringify({ name }) });
  toast(`Huésped "${u.name}" registrado`, 'success');
  loadUsers();
}

async function updateUser(id, name) {
  await apiFetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify({ name }) });
  toast('Huésped actualizado', 'success');
  loadUsers();
}

async function deleteUser(id) {
  await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
  toast('Huésped eliminado');
  loadUsers();
}

/* ══════════════════════════════
   ROOMS
══════════════════════════════ */
async function loadRooms() {
  try {
    allRooms = await apiFetch('/api/rooms');
    renderRooms(allRooms);
    $('roomCount').textContent = allRooms.length;
  } catch { renderRoomsEmpty('Error cargando habitaciones'); }
}

function renderRooms(list) {
  const tbody = $('roomsBody');
  if (!list.length) { tbody.innerHTML = `<tr><td colspan="4" class="empty">Sin habitaciones registradas</td></tr>`; return; }
  tbody.innerHTML = list.map(r => `
    <tr>
      <td><span class="id-badge">#${r.id}</span></td>
      <td>${r.number || r.roomNumber || '—'}</td>
      <td><span class="price-badge">$${r.price || r.roomPrice || 0}</span></td>
      <td>
        <div class="action-group">
          <button class="btn-edit"   onclick="openEditRoom(${r.id})">Editar</button>
          <button class="btn-delete" onclick="confirmDelete('room',${r.id},'¿Eliminar la habitación #${r.number || r.roomNumber}?')">Eliminar</button>
        </div>
      </td>
    </tr>`).join('');
}

function renderRoomsEmpty(msg) {
  $('roomsBody').innerHTML = `<tr><td colspan="4" class="empty">${msg}</td></tr>`;
}

function filterRooms() {
  const q = $('roomSearch').value.toLowerCase();
  renderRooms(allRooms.filter(r => {
    const n = String(r.number || r.roomNumber || '');
    const p = String(r.price || r.roomPrice || '');
    return n.includes(q) || p.includes(q) || String(r.id).includes(q);
  }));
}

async function createRoom(number, price) {
  const r = await apiFetch('/api/rooms', { method: 'POST', body: JSON.stringify({ number, price: Number(price) }) });
  toast(`Habitación #${r.number || number} creada`, 'success');
  loadRooms();
}

async function updateRoom(id, number, price) {
  await apiFetch(`/api/rooms/${id}`, { method: 'PUT', body: JSON.stringify({ number, price: Number(price) }) });
  toast('Habitación actualizada', 'success');
  loadRooms();
}

async function deleteRoom(id) {
  await apiFetch(`/api/rooms/${id}`, { method: 'DELETE' });
  toast('Habitación eliminada');
  loadRooms();
}

/* ══════════════════════════════
   BOOKINGS
══════════════════════════════ */
async function loadBookings() {
  try {
    allBookings = await apiFetch('/api/bookings');
    renderBookings(allBookings);
    $('bookingCount').textContent = allBookings.length;
  } catch { renderBookingsEmpty('Error cargando reservas'); }
}

function renderBookings(list) {
  const tbody = $('bookingsBody');
  if (!list.length) { tbody.innerHTML = `<tr><td colspan="5" class="empty">Sin reservas activas</td></tr>`; return; }
  tbody.innerHTML = list.map(b => `
    <tr>
      <td><span class="id-badge">#${b.id}</span></td>
      <td>${getUserName(b.userId)}</td>
      <td>${getRoomNumber(b.roomId)}</td>
      <td><span class="date-text">${b.date}</span></td>
      <td>
        <div class="action-group">
          <button class="btn-edit"   onclick="openEditBooking(${b.id})">Editar</button>
          <button class="btn-delete" onclick="confirmDelete('booking',${b.id},'¿Eliminar la reserva #${b.id}?')">Eliminar</button>
        </div>
      </td>
    </tr>`).join('');
}

function renderBookingsEmpty(msg) {
  $('bookingsBody').innerHTML = `<tr><td colspan="5" class="empty">${msg}</td></tr>`;
}

function filterBookings() {
  const q = $('bookingSearch').value.toLowerCase();
  renderBookings(allBookings.filter(b =>
    String(b.userId).includes(q) ||
    String(b.roomId).includes(q) ||
    (b.date || '').includes(q) ||
    String(b.id).includes(q)
  ));
}

async function createBooking(userId, roomId, date) {
  const b = await apiFetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({ userId: Number(userId), roomId: Number(roomId), date })
  });
  toast(`Reserva #${b.id} creada`, 'success');
  loadBookings();
}

async function updateBooking(id, userId, roomId, date) {
  await apiFetch(`/api/bookings/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ userId: Number(userId), roomId: Number(roomId), date })
  });
  toast('Reserva actualizada', 'success');
  loadBookings();
}

async function deleteBooking(id) {
  await apiFetch(`/api/bookings/${id}`, { method: 'DELETE' });
  toast('Reserva eliminada');
  loadBookings();
}

/* ── LOOKUP HELPERS ── */
function getUserName(id) {
  const u = allUsers.find(u => u.id === id || u.id === Number(id));
  return u ? `${u.name} <span class="id-badge">#${id}</span>` : `<span class="id-badge">#${id}</span>`;
}
function getRoomNumber(id) {
  const r = allRooms.find(r => r.id === id || r.id === Number(id));
  const n = r ? (r.number || r.roomNumber) : null;
  return n ? `Hab. ${n} <span class="id-badge">#${id}</span>` : `<span class="id-badge">#${id}</span>`;
}

/* ══════════════════════════════
   MODALS
══════════════════════════════ */
function openModal(type, data = {}) {
  const modal = $('modal');
  const title = $('modalTitle');
  const body  = $('modalBody');
  const isEdit = !!data.id;

  if (type === 'user') {
    title.textContent = isEdit ? 'Editar huésped' : 'Nuevo huésped';
    body.innerHTML = `
      <div class="form-field">
        <label>Nombre completo</label>
        <input id="f_name" type="text" placeholder="Ej. María García" value="${data.name || ''}" />
      </div>
      <div class="form-actions">
        <button class="btn-secondary" onclick="closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="submitUser(${data.id || 'null'})">${isEdit ? 'Guardar' : 'Registrar'}</button>
      </div>`;
  }

  if (type === 'room') {
    title.textContent = isEdit ? 'Editar habitación' : 'Nueva habitación';
    const n = data.number || data.roomNumber || '';
    const p = data.price  || data.roomPrice  || '';
    body.innerHTML = `
      <div class="form-field">
        <label>Número de habitación</label>
        <input id="f_number" type="text" placeholder="Ej. 301" value="${n}" />
      </div>
      <div class="form-field">
        <label>Precio por noche (USD)</label>
        <input id="f_price" type="number" min="0" placeholder="Ej. 250" value="${p}" />
      </div>
      <div class="form-actions">
        <button class="btn-secondary" onclick="closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="submitRoom(${data.id || 'null'})">${isEdit ? 'Guardar' : 'Agregar'}</button>
      </div>`;
  }

  if (type === 'booking') {
    title.textContent = isEdit ? 'Editar reserva' : 'Nueva reserva';
    const userOpts    = allUsers.map(u => `<option value="${u.id}" ${u.id == data.userId ? 'selected' : ''}>${u.name} (#${u.id})</option>`).join('');
    const roomOpts    = allRooms.map(r => `<option value="${r.id}" ${r.id == data.roomId ? 'selected' : ''}>Hab. ${r.number || r.roomNumber} — $${r.price || r.roomPrice} (#${r.id})</option>`).join('');
    const today       = new Date().toISOString().split('T')[0];
    body.innerHTML = `
      <div class="form-field">
        <label>Huésped</label>
        <select id="f_userId">
          <option value="">— Seleccionar huésped —</option>
          ${userOpts || '<option disabled>Sin huéspedes registrados</option>'}
        </select>
      </div>
      <div class="form-field">
        <label>Habitación</label>
        <select id="f_roomId">
          <option value="">— Seleccionar habitación —</option>
          ${roomOpts || '<option disabled>Sin habitaciones registradas</option>'}
        </select>
      </div>
      <div class="form-field">
        <label>Fecha de ingreso</label>
        <input id="f_date" type="date" value="${data.date || today}" />
      </div>
      <div class="form-actions">
        <button class="btn-secondary" onclick="closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="submitBooking(${data.id || 'null'})">${isEdit ? 'Guardar' : 'Crear reserva'}</button>
      </div>`;
  }

  modal.classList.add('open');
  setTimeout(() => {
    const first = body.querySelector('input, select');
    if (first) first.focus();
  }, 50);
}

function closeModal() { $('modal').classList.remove('open'); }
function closeModalBackdrop(e) { if (e.target === $('modal')) closeModal(); }

/* ── EDIT OPENERS ── */
function openEditUser(id) {
  const u = allUsers.find(u => u.id === id);
  if (u) openModal('user', u);
}
function openEditRoom(id) {
  const r = allRooms.find(r => r.id === id);
  if (r) openModal('room', r);
}
function openEditBooking(id) {
  const b = allBookings.find(b => b.id === id);
  if (b) openModal('booking', b);
}

/* ── SUBMIT HANDLERS ── */
async function submitUser(editId) {
  const name = $('f_name').value.trim();
  if (!name) { toast('El nombre es requerido', 'error'); return; }
  try {
    closeModal();
    if (editId) await updateUser(editId, name);
    else        await createUser(name);
  } catch(e) { toast(`Error: ${e.message}`, 'error'); }
}

async function submitRoom(editId) {
  const number = $('f_number').value.trim();
  const price  = $('f_price').value.trim();
  if (!number || !price) { toast('Número y precio son requeridos', 'error'); return; }
  try {
    closeModal();
    if (editId) await updateRoom(editId, number, price);
    else        await createRoom(number, price);
  } catch(e) { toast(`Error: ${e.message}`, 'error'); }
}

async function submitBooking(editId) {
  const userId = $('f_userId').value;
  const roomId = $('f_roomId').value;
  const date   = $('f_date').value;
  if (!userId || !roomId || !date) { toast('Todos los campos son requeridos', 'error'); return; }
  try {
    closeModal();
    if (editId) await updateBooking(editId, userId, roomId, date);
    else        await createBooking(userId, roomId, date);
  } catch(e) { toast(`Error: ${e.message}`, 'error'); }
}

/* ── CONFIRM DELETE ── */
function confirmDelete(type, id, msg) {
  $('confirmMsg').innerHTML = msg;
  $('confirmModal').classList.add('open');
  $('confirmBtn').onclick = async () => {
    closeConfirm();
    try {
      if (type === 'user')    await deleteUser(id);
      if (type === 'room')    await deleteRoom(id);
      if (type === 'booking') await deleteBooking(id);
    } catch(e) { toast(`Error al eliminar: ${e.message}`, 'error'); }
  };
}
function closeConfirm() { $('confirmModal').classList.remove('open'); }
function closeConfirmBackdrop(e) { if (e.target === $('confirmModal')) closeConfirm(); }

/* ── KEYBOARD ESC ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeConfirm();
  }
});

/* ── REFRESH ALL ── */
function refreshAll() {
  checkStatus();
  loadUsers();
  loadRooms();
  loadBookings();
}