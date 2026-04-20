/* ── HELPERS ── */
const $ = id => document.getElementById(id);
const apiBase = () => '';

function toast(msg, type = 'default') {
  const c = $('toasts');
  if (!c) return;
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  c.prepend(t);
  setTimeout(() => t.remove(), 3500);
}

async function apiFetch(path, opts = {}) {
  try {
    const res = await fetch(apiBase() + path, {
      headers: { 'Content-Type': 'application/json' },
      ...opts
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    toast('Error de conexión con la API: ' + e.message, 'error');
    throw e;
  }
}

/* ── NAV / INIT ── */
function showApp() {
  const hero = $('heroSection');
  const app = $('app');

  if (hero) hero.style.display = 'none';
  if (app) app.classList.add('visible');

  checkStatus();
  loadUsers();
}

/* ── TABS ── */
function switchTab(name) {
  const tabs = ['users', 'rooms', 'bookings'];

  tabs.forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.style.display = (t === name) ? '' : 'none';
  });

  // activar botón visual
  document.querySelectorAll('.nav-tab').forEach((btn, i) => {
    btn.classList.toggle('active', tabs[i] === name);
  });

  // cargar datos según pestaña
  if (name === 'users') loadUsers();
  if (name === 'rooms') loadRooms();
  if (name === 'bookings') loadBookings();
}

/* ── STATUS ── */
async function checkStatus() {
  const dot = $('statusDot'), txt = $('statusText');
  if (!dot || !txt) return;

  dot.className = 'status-dot';
  txt.textContent = 'Verificando…';

  try {
    const res = await fetch('/api/users');
    if (res.ok) {
      dot.className = 'status-dot online';
      txt.textContent = 'Conectado';
    } else throw new Error();
  } catch {
    dot.className = 'status-dot offline';
    txt.textContent = 'Sin conexión';
  }
}

/* ── USERS ── */
async function loadUsers() {
  const container = $('usersTable');
  if (!container) return;

  container.innerHTML = 'Cargando...';

  try {
    const users = await apiFetch('/api/users');
    $('userCount').textContent = users.length;

    container.innerHTML = users.map(user => `
      <div class="card">
        <p><strong>ID:</strong> ${user.id}</p>
        <p><strong>Nombre:</strong> ${user.name}</p>
      </div>
    `).join('');

  } catch {
    container.innerHTML = 'Error cargando usuarios';
  }
}

async function createUser() {
  const input = $('userName');
  if (!input) return;

  const name = input.value.trim();
  if (!name) return toast('Nombre requerido', 'error');

  await apiFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name })
  });

  input.value = '';
  loadUsers();
}

/* ── ROOMS ── */
async function loadRooms() {
  const container = $('roomsTable');
  if (!container) return;

  container.innerHTML = 'Cargando...';

  try {
    const rooms = await apiFetch('/api/rooms');
    $('roomCount').textContent = rooms.length;

    container.innerHTML = rooms.map(room => `
      <div class="card">
        <p><strong>ID:</strong> ${room.id}</p>
        <p><strong>Habitación:</strong> ${room.number}</p>
        <p><strong>Precio:</strong> $${room.price}</p>
      </div>
    `).join('');
  } catch {
    container.innerHTML = 'Error cargando habitaciones';
  }
}

async function createRoom() {
  const numberInput = $('roomNumber');
  const priceInput = $('roomPrice');

  if (!numberInput || !priceInput) return;

  const number = numberInput.value.trim();
  const price = priceInput.value.trim();

  if (!number || !price) return toast('Datos incompletos', 'error');

  await apiFetch('/api/rooms', {
    method: 'POST',
    body: JSON.stringify({ number, price: Number(price) })
  });

  numberInput.value = '';
  priceInput.value = '';

  loadRooms();
}

/* ── BOOKINGS ── */
async function loadBookings() {
  const container = $('bookingsTable');
  if (!container) return;

  container.innerHTML = 'Cargando...';

  try {
    const bookings = await apiFetch('/api/bookings');
    $('bookingCount').textContent = bookings.length;

    container.innerHTML = bookings.map(b => `
      <div class="card">
        <p><strong>ID:</strong> ${b.id}</p>
        <p><strong>Usuario:</strong> ${b.userId}</p>
        <p><strong>Habitación:</strong> ${b.roomId}</p>
        <p><strong>Fecha:</strong> ${b.date}</p>
      </div>
    `).join('');
  } catch {
    container.innerHTML = 'Error cargando reservas';
  }
}

async function createBooking() {
  const userIdInput = $('bookingUserId');
  const roomIdInput = $('bookingRoomId');
  const dateInput = $('bookingDate');

  if (!userIdInput || !roomIdInput || !dateInput) return;

  const userId = userIdInput.value.trim();
  const roomId = roomIdInput.value.trim();
  const date = dateInput.value;

  if (!userId || !roomId || !date)
    return toast('Datos incompletos', 'error');

  await apiFetch('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      userId: Number(userId),
      roomId: Number(roomId),
      date
    })
  });

  userIdInput.value = '';
  roomIdInput.value = '';
  dateInput.value = '';

  loadBookings();
}

/* ── INIT ── */
const dateInput = $('bookingDate');
if (dateInput) {
  dateInput.value = new Date().toISOString().split('T')[0];
}