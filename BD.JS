// ==========================
// CARGAR FACTURAS
// ==========================

let facturas = [];
db.ref("facturas").on("value", snapshot => {

  facturas = [];

  snapshot.forEach(child => {

    facturas.push({
      id: child.key,
      ...child.val()
    });

  });

  mostrarFacturas();

});
const tbody =
  document.getElementById("tablaFacturas");

// ==========================
// MOSTRAR FACTURAS
// ==========================

function mostrarFacturas() {

  tbody.innerHTML = "";

  if (facturas.length === 0) {

    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center;">
          No hay facturas registradas
        </td>
      </tr>
    `;

    return;
  }

  facturas.forEach((f, index) => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${f.codigoInterno || "—"}</td>
      <td>${f.vendedor || "—"}</td>
      <td>${f.fecha || "—"}</td>
      <td>${f.serie || "—"}</td>
      <td>${f.numero || "—"}</td>
      <td>${f.cliente || "—"}</td>
      <td>Q ${Number(f.total || 0).toLocaleString("es-GT", {
        minimumFractionDigits: 2
      })}</td>
      <td>${f.archivo || "XML"}</td>
      <td>
        <button class="eliminar" onclick="eliminarFactura(${index})">
          ELIMINAR
        </button>
      </td>
    `;

    tbody.appendChild(tr);

  });
}

// ==========================
// ELIMINAR CON CONTRASEÑA
// ==========================

function eliminarFactura(index) {

  const pass =
    prompt("Ingrese contraseña para eliminar");

  if (pass !== "Hssj89") {

    alert("Contraseña incorrecta");
    return;

  }

  const confirmar =
    confirm("¿Seguro que deseas eliminar esta factura?");

  if (!confirmar) return;

  const factura = facturas[index];

  // 🔥 ELIMINAR FIREBASE
db.ref("facturas/" + factura.id).remove()
  .then(() => {

    // 🔥 REVISAR SI YA NO HAY FACTURAS
    db.ref("facturas").once("value", snapshot => {

      if (!snapshot.exists()) {

        localStorage.setItem(
          "ultimoCodigoInterno",
          0
        );

        localStorage.removeItem("facturas");

        console.log("🔄 Contador reiniciado");

      }

    });

  });
}

// ==========================
// BUSCAR
// ==========================

function filtrarFacturas() {

  const texto =
    document.getElementById("buscar").value.toLowerCase();

  const filas =
    tbody.getElementsByTagName("tr");

  for (let fila of filas) {

    const contenido = fila.textContent.toLowerCase();

    fila.style.display =
      contenido.includes(texto) ? "" : "none";
  }
}

// ==========================
// FILTROS
// ==========================

function aplicarFiltros() {

  const vendedor =
    document.getElementById("filtroVendedor")
    .value
    .toLowerCase();

  const codigo =
    document.getElementById("filtroCodigo")
    .value
    .toLowerCase();

  const filas =
    tbody.getElementsByTagName("tr");

  for (let fila of filas) {

    const texto =
      fila.textContent.toLowerCase();

    const coincideVendedor =
      texto.includes(vendedor);

    const coincideCodigo =
      texto.includes(codigo);

    fila.style.display =
      coincideVendedor && coincideCodigo
        ? ""
        : "none";
  }
}

// ==========================
// VOLVER
// ==========================

function volver() {
  window.location.href = "carta.html";
}

// ==========================
// INICIAR
// ==========================

mostrarFacturas();


// ==========================
// EXPORTAR A EXCEL
// ==========================
function exportarExcel() {

  // 🔥 USAR FACTURAS DE FIREBASE
  if (facturas.length === 0) {

    alert("No hay datos para exportar");
    return;

  }

  let csv =
    "CodigoInterno;Vendedor;Fecha;Serie;Numero;Cliente;Total;Archivo\n";

  facturas.forEach(f => {

    csv +=
      `${f.codigoInterno || ""};` +
      `${f.vendedor || ""};` +
      `${f.fecha || ""};` +
      `${f.serie || ""};` +
      `${f.numero || ""};` +
      `${f.cliente || ""};` +
      `${f.total || ""};` +
      `${f.archivo || ""}\n`;

  });

  // 🔥 BOM PARA EXCEL
  const blob = new Blob(
    ["\uFEFF" + csv],
    { type: "text/csv;charset=utf-8;" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = "facturas_excel.csv";

  a.click();

  URL.revokeObjectURL(url);

}