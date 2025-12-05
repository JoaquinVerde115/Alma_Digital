// dashboard.js - Sistema Inteligente y Dinámico

// ================== BASE DE DATOS SIMULADA (Con Contactos Reales) ==================
let ordersData = [
  {
    id: "#3024",
    client: "Juan Pérez",
    phone: "999000111",
    email: "juan.perez@mail.com",
    service: "Cremación Premium",
    detail: "Urna Mármol",
    price: 3500,
    paymentStatus: "Pagado",
    status: "Pendiente",
    date: "Hoy, 10:30 AM",
    color: "blue",
    avatar: "JP",
  },
  {
    id: "#3023",
    client: "María González",
    phone: "988777666",
    email: "maria.g@mail.com",
    service: "Entierro Tradicional",
    detail: "Sala Capilla A",
    price: 5200,
    paymentStatus: "Pagado",
    status: "En Proceso",
    date: "Ayer, 04:15 PM",
    color: "purple",
    avatar: "MG",
  },
  {
    id: "#3022",
    client: "Carlos Ruiz",
    phone: "977555333",
    email: "carlos.ruiz@mail.com",
    service: "Urna de Mármol",
    detail: "Envío domicilio",
    price: 450,
    paymentStatus: "Pagado",
    status: "Completado",
    date: "12 Dic",
    color: "orange",
    avatar: "CR",
  },
  {
    id: "#3021",
    client: "Elena Rojas",
    phone: "966444222",
    email: "elena.rojas@mail.com",
    service: "Traslado Prov.",
    detail: "Reembolso",
    price: 0,
    paymentStatus: "Reembolsado",
    status: "Cancelado",
    date: "10 Dic",
    color: "gray",
    avatar: "ER",
  },
  {
    id: "#3020",
    client: "Roberto Gomez",
    phone: "955111000",
    email: "roberto.g@mail.com",
    service: "Arreglo Floral",
    detail: "Modelo Magno",
    price: 250,
    paymentStatus: "Pendiente",
    status: "Pendiente",
    date: "09 Dic",
    color: "teal",
    avatar: "RG",
  },
  {
    id: "#3019",
    client: "Ana Diaz",
    phone: "944222888",
    email: "ana.diaz@mail.com",
    service: "Plan Futuro",
    detail: "Suscripción",
    price: 120,
    paymentStatus: "Pagado",
    status: "Completado",
    date: "08 Dic",
    color: "pink",
    avatar: "AD",
  },
];

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  renderOrders(ordersData);
  updateMetrics(); // Calcular totales al inicio
});

// ================== 1. CÁLCULO DE MÉTRICAS (Blindado) ==================
function updateMetrics() {
  console.log("Calculando métricas..."); // Para depuración

  // 1. Total Ingresos
  // Filtramos solo los que NO están cancelados
  const validOrders = ordersData.filter((o) => o.status !== "Cancelado");

  // Sumamos: Convertimos el precio a número, quitando comas si las hubiera
  const totalRevenue = validOrders.reduce((sum, order) => {
    // Asegurar que sea número (ej: "3,500" -> 3500)
    let price = order.price.toString().replace(/,/g, "");
    return sum + parseFloat(price || 0);
  }, 0);

  // 2. Total Pedidos Activos (Pendiente + En Proceso)
  const activeOrders = ordersData.filter(
    (o) => o.status === "Pendiente" || o.status === "En Proceso"
  ).length;

  // 3. Total General de Pedidos (Para el badge del menú)
  const totalCount = ordersData.length;

  // --- ACTUALIZAR HTML ---

  // Tarjeta Ingresos
  const revenueEl = document.getElementById("metric-revenue");
  if (revenueEl) {
    // Formato moneda Perú (S/ 24,500.00)
    revenueEl.textContent = `S/ ${totalRevenue.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
    })}`;
  }

  // Tarjeta Pedidos Activos
  const ordersEl = document.getElementById("metric-orders");
  if (ordersEl) {
    ordersEl.textContent = activeOrders;
  }

  // Badge Rojo del Menú (Barra Lateral)
  const badgeEl = document.getElementById("menu-orders-count");
  if (badgeEl) {
    badgeEl.textContent = totalCount;
    // Mostrar u ocultar si es 0
    badgeEl.style.display = totalCount > 0 ? "inline-flex" : "none";
    // Asegurar que sea visible (quita clases hidden si las tuviera)
    badgeEl.classList.remove("hidden");
  }
}

// ================== 2. RENDERIZADOR DE TABLA ==================
function renderOrders(data) {
  const tbody = document.getElementById("orders-table-body");
  const countEl = document.getElementById("orders-count");

  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="7" class="p-8 text-center text-gray-500">No se encontraron pedidos.</td></tr>';
    if (countEl) countEl.textContent = "0 resultados";
    return;
  }

  data.forEach((order) => {
    let statusStyle = "";
    if (order.status === "Pendiente")
      statusStyle = "bg-yellow-100 text-yellow-800 border-yellow-200";
    else if (order.status === "En Proceso")
      statusStyle = "bg-blue-100 text-blue-800 border-blue-200";
    else if (order.status === "Completado")
      statusStyle = "bg-green-100 text-green-800 border-green-200";
    else if (order.status === "Cancelado")
      statusStyle = "bg-red-100 text-red-800 border-red-200";

    let paymentStyle =
      order.paymentStatus === "Pagado"
        ? "text-green-600 bg-green-50"
        : "text-orange-600 bg-orange-50";

    const row = `
          <tr class="hover:bg-gray-50 transition group border-b border-gray-50 last:border-none">
              <td class="p-4"><input type="checkbox" class="rounded text-dark-blue focus:ring-soft-gold"></td>
              <td class="p-4">
                  <span class="block font-mono text-xs font-bold text-dark-blue">${
                    order.id
                  }</span>
                  <span class="text-xs text-gray-400">${order.date}</span>
              </td>
              <td class="p-4">
                  <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-${
                        order.color
                      }-100 text-${
      order.color
    }-600 flex items-center justify-center text-xs font-bold">${
      order.avatar
    }</div>
                      <div>
                          <p class="font-bold text-dark-blue text-sm">${
                            order.client
                          }</p>
                          <p class="text-xs text-gray-400">${
                            order.phone
                          }</p> </div>
                  </div>
              </td>
              <td class="p-4">
                  <span class="block text-gray-700 font-medium text-sm">${
                    order.service
                  }</span>
                  <span class="text-xs text-gray-400">${order.detail}</span>
              </td>
              <td class="p-4">
                  <span class="block font-bold text-dark-blue text-sm">S/ ${Number(
                    order.price
                  ).toLocaleString("en-US")}</span>
                  <span class="text-[10px] ${paymentStyle} px-1.5 py-0.5 rounded font-bold">${
      order.paymentStatus
    }</span>
              </td>
              <td class="p-4"><span class="${statusStyle} px-3 py-1 rounded-full text-xs font-bold border shadow-sm">${
      order.status
    }</span></td>
              <td class="p-4 text-right">
                  <div class="flex justify-end gap-2">
                      <button class="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="WhatsApp"><i class="ph ph-whatsapp-logo text-lg"></i></button>
                      <button onclick="openOrderDetail('${
                        order.id
                      }')" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Ver detalle"><i class="ph ph-eye text-lg"></i></button>
                  </div>
              </td>
          </tr>
      `;
    tbody.innerHTML += row;
  });

  if (countEl) countEl.textContent = `Mostrando ${data.length} pedidos`;
}

// ================== 3. CREAR PEDIDO MANUAL (Validado) ==================
function addNewOrder(e) {
  e.preventDefault();

  // Obtener valores
  const name = document.getElementById("new-client-name").value;
  const phone = document.getElementById("new-client-phone").value;
  const email = document.getElementById("new-client-email").value;
  const service = document.getElementById("new-order-service").value;
  const price = document.getElementById("new-order-price").value;
  const paymentStatus = document.getElementById("new-payment-status").value;

  // Validación básica de teléfono (9 dígitos)
  if (phone.length !== 9 || isNaN(phone)) {
    alert("El teléfono debe tener 9 dígitos numéricos.");
    return;
  }

  // Generar ID Secuencial
  const existingIds = ordersData.map((order) =>
    parseInt(order.id.replace("#", ""))
  );
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 3000;
  const nextId = "#" + (maxId + 1);

  // Crear Objeto
  const newOrder = {
    id: nextId,
    client: name,
    phone: phone,
    email: email,
    service: service,
    detail: "Ingreso Manual",
    price: parseFloat(price),
    paymentStatus: paymentStatus,
    status: "Pendiente", // Por defecto
    date: "Hoy, Ahora",
    avatar: name.substring(0, 2).toUpperCase(),
    color: "gray",
  };

  // Agregar y Actualizar
  ordersData.unshift(newOrder);
  renderOrders(ordersData);
  updateMetrics(); // ¡Recalcular totales!

  toggleModal("modal-manual-order");
  e.target.reset();
}

// ================== 4. FILTROS Y BÚSQUEDA ==================
function filterOrders(status) {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    if (btn.textContent.includes(status)) {
      btn.classList.remove("bg-white", "text-gray-600", "border-gray-200");
      btn.classList.add(
        "bg-dark-blue",
        "text-white",
        "border-transparent",
        "shadow-md"
      );
    } else {
      btn.classList.add("bg-white", "text-gray-600", "border-gray-200");
      btn.classList.remove(
        "bg-dark-blue",
        "text-white",
        "border-transparent",
        "shadow-md"
      );
    }
  });

  if (status === "Todos") {
    renderOrders(ordersData);
  } else {
    const filtered = ordersData.filter((order) => order.status === status);
    renderOrders(filtered);
  }
}

function searchOrders() {
  const query = document.getElementById("search-orders").value.toLowerCase();
  const filtered = ordersData.filter(
    (order) =>
      order.client.toLowerCase().includes(query) ||
      order.id.toLowerCase().includes(query) ||
      order.service.toLowerCase().includes(query)
  );
  renderOrders(filtered);
}

// ================== 5. MODAL DE DETALLE (Con Datos Completos) ==================
function openOrderDetail(id) {
  const order = ordersData.find((o) => o.id === id);
  if (order) {
    document.getElementById(
      "modal-order-id"
    ).innerHTML = `<i class="ph ph-receipt"></i> Pedido ${order.id}`;
    document.getElementById("modal-order-date").textContent = order.date;
    document.getElementById("modal-order-status").textContent = order.status;

    // Colores del badge
    let statusClass = "bg-gray-100 text-gray-800";
    if (order.status === "Pendiente")
      statusClass = "bg-yellow-400 text-yellow-900";
    if (order.status === "En Proceso") statusClass = "bg-blue-500 text-white";

    document.getElementById(
      "modal-order-status"
    ).className = `text-xs font-bold px-3 py-1 rounded-full shadow-sm ${statusClass}`;

    const avatarEl = document.getElementById("modal-client-avatar");
    avatarEl.textContent = order.avatar;
    avatarEl.className = `w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg bg-${order.color}-100 text-${order.color}-600`;

    document.getElementById("modal-client-name").textContent = order.client;

    // Mostrar teléfono e email en el detalle
    document.getElementById(
      "modal-client-phone"
    ).innerHTML = `${order.phone} <br> <span class="text-xs text-blue-500">${order.email}</span>`;

    document.getElementById("modal-service-name").textContent = order.service;
    document.getElementById("modal-service-price").textContent = `S/ ${Number(
      order.price
    ).toLocaleString("en-US")}`;
    document.getElementById("modal-service-detail").textContent = order.detail;

    toggleModal("modal-pedido");
  }
}

// ================== 6. EXPORTAR A EXCEL (CSV) ==================
// ================== 6. EXPORTAR A EXCEL (Columnas Reales) ==================
function exportToExcel() {
  // 1. Crear el contenido de la tabla HTML para Excel
  let tableContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
          <meta charset="UTF-8"> 
      </head>
      <body>
          <table border="1">
              <thead>
                  <tr style="background-color: #203264; color: white;">
                      <th>ID Pedido</th>
                      <th>Cliente</th>
                      <th>Teléfono</th>
                      <th>Email</th>
                      <th>Servicio</th>
                      <th>Detalle</th>
                      <th>Precio</th>
                      <th>Estado Pago</th>
                      <th>Estado Servicio</th>
                      <th>Fecha</th>
                  </tr>
              </thead>
              <tbody>
  `;

  // 2. Agregar cada fila de datos
  ordersData.forEach((order) => {
    tableContent += `
          <tr>
              <td>${order.id}</td>
              <td>${order.client}</td>
              <td>${order.phone}</td>
              <td>${order.email}</td>
              <td>${order.service}</td>
              <td>${order.detail}</td>
              <td>${order.price}</td> <td>${order.paymentStatus}</td>
              <td>${order.status}</td>
              <td>${order.date}</td>
          </tr>
      `;
  });

  tableContent += `
              </tbody>
          </table>
      </body>
      </html>
  `;

  // 3. Crear el archivo Blob con tipo Excel
  const blob = new Blob([tableContent], { type: "application/vnd.ms-excel" });
  const url = URL.createObjectURL(blob);

  // 4. Descargar
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", "reporte_pedidos_alma_digital.xls"); // Extensión .xls
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ================== CONFIGURACIÓN ==================
function saveSettings() {
  // Simulación de guardado
  const btn = document.querySelector('button[onclick="saveSettings()"]');
  const originalText = btn.innerHTML;

  btn.innerHTML =
    '<i class="ph ph-spinner animate-spin text-lg"></i> Guardando...';
  btn.disabled = true;
  btn.classList.add("opacity-75");

  setTimeout(() => {
    btn.innerHTML = '<i class="ph ph-check text-lg"></i> ¡Guardado!';
    btn.classList.remove("bg-dark-blue");
    btn.classList.add("bg-green-600");

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.classList.remove("opacity-75", "bg-green-600");
      btn.classList.add("bg-dark-blue");
    }, 2000);
  }, 1000);
}
// ================== UTILIDADES ==================
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebar-overlay");
  if (sidebar.classList.contains("-translate-x-full")) {
    sidebar.classList.remove("-translate-x-full");
    overlay.classList.remove("hidden");
  } else {
    sidebar.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  }
}

function toggleModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.toggle("hidden");
}

function showView(viewId, element) {
  const views = document.querySelectorAll(".section-view");
  views.forEach((view) => view.classList.remove("active"));
  document.getElementById("view-" + viewId).classList.add("active");

  // Títulos
  const titles = {
    dashboard: "Resumen General",
    pedidos: "Gestión de Pedidos",
    catalogo: "Catálogo",
    clientes: "Clientes",
    finanzas: "Finanzas",
    configuracion: "Configuración",
  };
  document.getElementById("page-title").textContent = titles[viewId] || "Panel";

  if (element) {
    const navLinks = document.querySelectorAll(".nav-item");
    navLinks.forEach((link) => {
      link.classList.remove("bg-soft-gold", "text-dark-blue", "shadow-md");
      link.classList.add("text-gray-300", "hover:bg-white/10");
    });
    element.classList.remove("text-gray-300", "hover:bg-white/10");
    element.classList.add("bg-soft-gold", "text-dark-blue", "shadow-md");
  }
}
