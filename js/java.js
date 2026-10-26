// =====================================================
// TOUSKAN
// CARRITO + PEDIDOS + PAGO
// =====================================================


// =====================================================
// CARRITO
// =====================================================

function leerCarrito() {

    try {

        const datos = JSON.parse(
            localStorage.getItem("carritoTouskan")
        );

        return Array.isArray(datos) ? datos : [];

    } catch (error) {

        return [];

    }

}

let carrito = leerCarrito();


// =====================================================
// MÉTODO DE PAGO
// =====================================================

let metodoPago = "tarjeta";

let billeteraSeleccionada = "";


// =====================================================
// FORMATO DE PESOS COLOMBIANOS
// =====================================================

function formatoCOP(valor) {

    return "$" + Math.round(
        Number(valor) || 0
    ).toLocaleString("es-CO");

}



// =====================================================
// ESCAPAR TEXTO (evita insertar HTML no deseado)
// =====================================================

function esc(texto) {

    return String(texto ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

}


// =====================================================
// AVISO DISCRETO (reemplaza al alert al agregar)
// =====================================================

function mostrarAviso(mensaje) {

    let aviso = document.getElementById("avisoTouskan");

    if (!aviso) {

        aviso = document.createElement("div");
        aviso.id = "avisoTouskan";
        aviso.setAttribute("role", "status");
        aviso.style.cssText =
            "position:fixed;left:50%;bottom:24px;" +
            "transform:translateX(-50%);z-index:2000;" +
            "background:#16120a;color:#ffd21f;" +
            "padding:12px 20px;border-radius:8px;" +
            "font-weight:600;box-shadow:0 4px 16px rgba(0,0,0,.35);" +
            "transition:opacity .25s;max-width:90vw;text-align:center";
        document.body.appendChild(aviso);

    }

    aviso.textContent = mensaje;
    aviso.style.opacity = "1";

    clearTimeout(aviso._t);
    aviso._t = setTimeout(() => { aviso.style.opacity = "0"; }, 1800);

}

// =====================================================
// GUARDAR CARRITO
// =====================================================

function guardar() {

    localStorage.setItem(
        "carritoTouskan",
        JSON.stringify(carrito)
    );

}


// =====================================================
// AGREGAR PRODUCTO
// =====================================================

function addProduct(
    nombre,
    precio,
    imagen,
    descripcion = ""
) {

    precio = Number(precio);


    const productoExistente = carrito.find(
        producto => producto.nombre === nombre
    );


    if (productoExistente) {

        productoExistente.cantidad += 1;

    } else {

        carrito.push({

            nombre: nombre,

            precio: precio,

            imagen: imagen,

            descripcion: descripcion,

            cantidad: 1

        });

    }


    guardar();

    actualizarCarrito();


    mostrarAviso(
        nombre + " se agregó a tu pedido."
    );

}


// =====================================================
// AGREGAR PRODUCTO - COMPATIBILIDAD
// =====================================================

function agregarProducto(
    nombre,
    precio,
    imagen,
    descripcion = ""
) {

    addProduct(
        nombre,
        precio,
        imagen,
        descripcion
    );

}


// =====================================================
// ACTUALIZAR CARRITO
// =====================================================

function actualizarCarrito() {

    const cantidad = carrito.reduce(
        (total, producto) => {

            return total +
                Number(producto.cantidad);

        },
        0
    );


    // Contador principal

    const cartNumber =
        document.getElementById("cartNumber");


    if (cartNumber) {

        cartNumber.textContent =
            cantidad;

    }


    // Segundo contador

    const cartNumber2 =
        document.getElementById("cartNumber2");


    if (cartNumber2) {

        cartNumber2.textContent =
            cantidad;

    }


    // Mostrar carrito

    mostrarCarritoMenu();


    // Mostrar pedidos

    mostrarPedidos();


    // Actualizar totales

    actualizarTotales();


    // Actualizar pago

    cargarResumenPago();

}


// =====================================================
// MOSTRAR CARRITO EN MENÚ
// =====================================================

function mostrarCarritoMenu() {

    const contenedor =
        document.getElementById("cartItems");


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML = "";


    // Carrito vacío

    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <div class="empty-cart text-center p-3">

                <i
                    class="bi bi-cart3"
                    style="font-size:35px;">
                </i>

                <p class="mt-2 mb-1">
                    Tu carrito está vacío
                </p>

                <small>
                    Selecciona un producto
                    para comenzar.
                </small>

            </div>

        `;

        return;

    }


    // Productos

    carrito.forEach(producto => {

        const elemento =
            document.createElement("div");


        elemento.className =
            "cart-product";


        const totalProducto =
            Number(producto.precio) *
            Number(producto.cantidad);


        elemento.innerHTML = `

            <div class="cart-product-image">

                <img
                    src="${esc(producto.imagen)}"
                    alt="${esc(producto.nombre)}"
                    onerror="this.style.display='none'"
                >

            </div>


            <div class="cart-product-info">

                <h5>
                    ${esc(producto.nombre)}
                </h5>

                <p>
                    Cantidad:
                    ${producto.cantidad}
                </p>

            </div>


            <div class="cart-product-price">

                ${formatoCOP(totalProducto)}

            </div>

        `;


        contenedor.appendChild(elemento);

    });

}


// =====================================================
// MOSTRAR PEDIDOS
// =====================================================

function mostrarPedidos() {

    const lista =
        document.getElementById(
            "listaCarrito"
        );


    const carritoVacio =
        document.getElementById(
            "carritoVacio"
        );


    if (!lista) {

        return;

    }


    lista.innerHTML = "";


    // Carrito vacío

    if (carrito.length === 0) {

        if (carritoVacio) {

            carritoVacio.style.display =
                "block";

        }

        return;

    }


    // Ocultar mensaje

    if (carritoVacio) {

        carritoVacio.style.display =
            "none";

    }


    // Productos

    carrito.forEach(
        (producto, index) => {

            const tarjeta =
                document.createElement("div");


            tarjeta.className =
                "product-card mb-3";


            const totalProducto =
                Number(producto.precio) *
                Number(producto.cantidad);


            tarjeta.innerHTML = `

                <div class="product-image">

                    <img
                        src="${esc(producto.imagen)}"
                        alt="${esc(producto.nombre)}"
                        onerror="this.style.display='none'"
                    >

                </div>


                <div class="product-info">

                    <div
                        class="d-flex justify-content-between">

                        <div>

                            <h5>
                                ${esc(producto.nombre)}
                            </h5>

                            <p>
                                ${esc(producto.descripcion || "Producto seleccionado")}
                            </p>

                        </div>


                        <button
                            type="button"
                            class="delete-btn"
                            onclick="eliminarProducto(${index})">

                            <i class="bi bi-trash"></i>

                        </button>

                    </div>


                    <div class="product-bottom">

                        <strong>

                            ${formatoCOP(totalProducto)}

                        </strong>


                        <div class="quantity">

                            <button
                                type="button"
                                onclick="disminuirCantidad(${index})">

                                −

                            </button>


                            <span>
                                ${producto.cantidad}
                            </span>


                            <button
                                type="button"
                                onclick="aumentarCantidad(${index})">

                                +

                            </button>

                        </div>

                    </div>

                </div>

            `;


            lista.appendChild(tarjeta);

        }
    );

}


// =====================================================
// AUMENTAR CANTIDAD
// =====================================================

function aumentarCantidad(index) {

    if (!carrito[index]) {

        return;

    }


    carrito[index].cantidad += 1;


    guardar();

    actualizarCarrito();

}


// =====================================================
// DISMINUIR CANTIDAD
// =====================================================

function disminuirCantidad(index) {

    if (!carrito[index]) {

        return;

    }


    if (
        Number(carrito[index].cantidad) > 1
    ) {

        carrito[index].cantidad -= 1;

    } else {

        carrito.splice(index, 1);

    }


    guardar();

    actualizarCarrito();

}


// =====================================================
// ELIMINAR PRODUCTO
// =====================================================

function eliminarProducto(index) {

    if (!carrito[index]) {

        return;

    }


    carrito.splice(index, 1);


    guardar();

    actualizarCarrito();

}


// =====================================================
// CALCULAR TOTALES
// =====================================================

function calcularTotales() {

    let subtotal = 0;

    let cantidad = 0;


    carrito.forEach(producto => {

        subtotal +=
            Number(producto.precio) *
            Number(producto.cantidad);


        cantidad +=
            Number(producto.cantidad);

    });


    // Impuesto 8%

    const impuestos =
        subtotal * 0.08;


    // Envío $5.000

    const envio =
        subtotal > 0
            ? 5000
            : 0;


    // Total

    const total =
        subtotal +
        impuestos +
        envio;


    return {

        subtotal,
        impuestos,
        envio,
        total,
        cantidad

    };

}


// =====================================================
// ACTUALIZAR TOTALES DE PEDIDOS Y MENÚ
// =====================================================

function actualizarTotales() {

    const datos =
        calcularTotales();


    const subtotalElemento =
        document.getElementById(
            "subtotal"
        );


    const impuestosElemento =
        document.getElementById(
            "impuestos"
        );


    const envioElemento =
        document.getElementById(
            "envio"
        );


    const totalElemento =
        document.getElementById(
            "total"
        );


    const cantidadElemento =
        document.getElementById(
            "cantidadArticulos"
        );


    if (subtotalElemento) {

        subtotalElemento.textContent =
            formatoCOP(datos.subtotal);

    }


    if (impuestosElemento) {

        impuestosElemento.textContent =
            formatoCOP(datos.impuestos);

    }


    if (envioElemento) {

        envioElemento.textContent =
            formatoCOP(datos.envio);

    }


    if (totalElemento) {

        totalElemento.textContent =
            formatoCOP(datos.total);

    }


    if (cantidadElemento) {

        cantidadElemento.textContent =
            datos.cantidad;

    }

}


// =====================================================
// CARGAR RESUMEN EN PAGO
// =====================================================

function cargarResumenPago() {

    const productosPago =
        document.getElementById(
            "productosPago"
        );


    if (!productosPago) {

        return;

    }


    const subtotalElemento =
        document.getElementById(
            "subtotalPago"
        );


    const envioElemento =
        document.getElementById(
            "envioPago"
        );


    const impuestosElemento =
        document.getElementById(
            "impuestosPago"
        );


    const totalElemento =
        document.getElementById(
            "totalPago"
        );


    const textoTotal =
        document.getElementById(
            "textoTotal"
        );


    productosPago.innerHTML = "";


    // Si está vacío

    if (carrito.length === 0) {

        productosPago.innerHTML = `

            <p class="text-muted">

                No hay productos en el pedido.

            </p>

        `;

    }


    // Mostrar productos

    carrito.forEach(producto => {

        const totalProducto =
            Number(producto.precio) *
            Number(producto.cantidad);


        const productoHTML =
            document.createElement("div");


        productoHTML.className =
            "producto-pago";


        productoHTML.innerHTML = `

            <div>

                <strong>

                    ${producto.cantidad}x
                    ${esc(producto.nombre)}

                </strong>

            </div>


            <strong>

                ${formatoCOP(totalProducto)}

            </strong>

        `;


        productosPago.appendChild(
            productoHTML
        );

    });


    const datos =
        calcularTotales();


    if (subtotalElemento) {

        subtotalElemento.textContent =
            formatoCOP(datos.subtotal);

    }


    if (envioElemento) {

        envioElemento.textContent =
            formatoCOP(datos.envio);

    }


    if (impuestosElemento) {

        impuestosElemento.textContent =
            formatoCOP(datos.impuestos);

    }


    if (totalElemento) {

        totalElemento.textContent =
            formatoCOP(datos.total);

    }


    if (textoTotal) {

        textoTotal.textContent =
            formatoCOP(datos.total);

    }

}


// =====================================================
// SELECCIONAR MÉTODO DE PAGO
// =====================================================

function seleccionarMetodo(metodo) {

    metodoPago = metodo;


    const btnTarjeta =
        document.getElementById(
            "btnTarjeta"
        );


    const btnBilletera =
        document.getElementById(
            "btnBilletera"
        );


    const btnEfectivo =
        document.getElementById(
            "btnEfectivo"
        );


    const formTarjeta =
        document.getElementById(
            "formTarjeta"
        );


    const formBilletera =
        document.getElementById(
            "formBilletera"
        );


    const formEfectivo =
        document.getElementById(
            "formEfectivo"
        );


    // Quitar activo

    if (btnTarjeta) {

        btnTarjeta.classList.remove(
            "activo"
        );

    }


    if (btnBilletera) {

        btnBilletera.classList.remove(
            "activo"
        );

    }


    if (btnEfectivo) {

        btnEfectivo.classList.remove(
            "activo"
        );

    }


    // Ocultar formularios

    if (formTarjeta) {

        formTarjeta.classList.add(
            "oculto"
        );

    }


    if (formBilletera) {

        formBilletera.classList.add(
            "oculto"
        );

    }


    if (formEfectivo) {

        formEfectivo.classList.add(
            "oculto"
        );

    }


    // Mostrar seleccionado

    if (metodo === "tarjeta") {

        if (btnTarjeta) {

            btnTarjeta.classList.add(
                "activo"
            );

        }


        if (formTarjeta) {

            formTarjeta.classList.remove(
                "oculto"
            );

        }

    }


    if (metodo === "billetera") {

        if (btnBilletera) {

            btnBilletera.classList.add(
                "activo"
            );

        }


        if (formBilletera) {

            formBilletera.classList.remove(
                "oculto"
            );

        }

    }


    if (metodo === "efectivo") {

        if (btnEfectivo) {

            btnEfectivo.classList.add(
                "activo"
            );

        }


        if (formEfectivo) {

            formEfectivo.classList.remove(
                "oculto"
            );

        }

    }

}


// =====================================================
// SELECCIONAR BILLETERA
// =====================================================

function seleccionarBilletera(nombre) {

    billeteraSeleccionada =
        nombre;


    const btnNequi =
        document.getElementById(
            "btnNequi"
        );


    const btnDaviplata =
        document.getElementById(
            "btnDaviplata"
        );


    if (btnNequi) {

        btnNequi.classList.remove(
            "activo"
        );

    }


    if (btnDaviplata) {

        btnDaviplata.classList.remove(
            "activo"
        );

    }


    if (nombre === "Nequi") {

        if (btnNequi) {

            btnNequi.classList.add(
                "activo"
            );

        }

    }


    if (nombre === "Daviplata") {

        if (btnDaviplata) {

            btnDaviplata.classList.add(
                "activo"
            );

        }

    }

}


// =====================================================
// FORMATEAR TARJETA
// =====================================================

function formatearTarjeta(input) {

    let valor =
        input.value.replace(
            /\D/g,
            ""
        );


    valor =
        valor.substring(
            0,
            16
        );


    let resultado = "";


    for (
        let i = 0;
        i < valor.length;
        i++
    ) {

        if (
            i > 0 &&
            i % 4 === 0
        ) {

            resultado += " ";

        }


        resultado += valor[i];

    }


    input.value =
        resultado;

}


// =====================================================
// FORMATEAR VENCIMIENTO
// =====================================================

function formatearVencimiento(input) {

    let valor =
        input.value.replace(
            /\D/g,
            ""
        );


    valor =
        valor.substring(
            0,
            4
        );


    if (
        valor.length >= 3
    ) {

        valor =
            valor.substring(
                0,
                2
            ) +
            "/" +
            valor.substring(
                2
            );

    }


    input.value =
        valor;

}


// =====================================================
// PROCESAR PAGO
// =====================================================

function procesarPago() {

    if (carrito.length === 0) {

        alert(
            "No tienes productos en tu pedido."
        );

        return;

    }


    const datos =
        calcularTotales();


    // ==========================================
    // TARJETA
    // ==========================================

    if (
        metodoPago === "tarjeta"
    ) {

        const nombre =
            document.getElementById(
                "nombreTarjeta"
            );


        const numero =
            document.getElementById(
                "numeroTarjeta"
            );


        const vencimiento =
            document.getElementById(
                "vencimiento"
            );


        const cvv =
            document.getElementById(
                "cvv"
            );


        if (
            !nombre ||
            !numero ||
            !vencimiento ||
            !cvv
        ) {

            alert(
                "No se encontraron los campos de tarjeta."
            );

            return;

        }


        if (
            nombre.value.trim() === ""
        ) {

            alert(
                "Ingresa el nombre de la tarjeta."
            );

            nombre.focus();

            return;

        }


        if (
            numero.value.replace(
                /\s/g,
                ""
            ).length < 16
        ) {

            alert(
                "Ingresa un número de tarjeta válido."
            );

            numero.focus();

            return;

        }


        if (
            vencimiento.value.length !== 5
        ) {

            alert(
                "Ingresa el vencimiento en formato MM/AA."
            );

            vencimiento.focus();

            return;

        }


        if (
            cvv.value.length < 3
        ) {

            alert(
                "Ingresa un CVV válido."
            );

            cvv.focus();

            return;

        }

    }


    // ==========================================
    // BILLETERA
    // ==========================================

    if (
        metodoPago === "billetera"
    ) {

        if (
            billeteraSeleccionada === ""
        ) {

            alert(
                "Selecciona Nequi o Daviplata."
            );

            return;

        }


        const numero =
            document.getElementById(
                "numeroBilletera"
            );


        if (
            !numero ||
            numero.value.trim().length < 10
        ) {

            alert(
                "Ingresa un número de celular válido."
            );

            if (numero) {

                numero.focus();

            }

            return;

        }

    }


    // ==========================================
    // EFECTIVO
    // ==========================================

    if (
        metodoPago === "efectivo"
    ) {

        // No necesita datos adicionales.

    }


    // ==========================================
    // CONFIRMACIÓN
    // ==========================================

    let metodoTexto =
        "";


    if (
        metodoPago === "tarjeta"
    ) {

        metodoTexto =
            "Tarjeta";

    }


    if (
        metodoPago === "billetera"
    ) {

        metodoTexto =
            billeteraSeleccionada;

    }


    if (
        metodoPago === "efectivo"
    ) {

        metodoTexto =
            "Efectivo";

    }


    const confirmar =
        confirm(
            "¿Deseas confirmar tu pedido?\n\n" +
            "Método de pago: " +
            metodoTexto +
            "\n" +
            "Total: " +
            formatoCOP(datos.total)
        );


    if (!confirmar) {

        return;

    }


    alert(
        "¡Pedido realizado correctamente!\n\n" +
        "Método de pago: " +
        metodoTexto +
        "\n" +
        "Total: " +
        formatoCOP(datos.total)
    );


    // Limpiar carrito

    carrito = [];


    guardar();


    // Volver al menú

    window.location.href =
        "menu.html";

}


// =====================================================
// CUANDO CARGA LA PÁGINA
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        carrito = leerCarrito();


        actualizarCarrito();


        // Si estamos en pago

        if (
            document.getElementById(
                "productosPago"
            )
        ) {

            cargarResumenPago();

            seleccionarMetodo(
                "tarjeta"
            );

        }

    }
);