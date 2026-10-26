# Touskan

Sitio web de comida rápida: inicio, menú, pedidos, pago, soporte, registro e inicio de sesión.

## Cómo verlo
Abre `index.html` en el navegador, o sírvelo con `python3 -m http.server`.

## Estructura
- `index.html`, `menu.html`, `pedidos.html`, `pago.html`, `servicio.html`, `inicio.html`, `registro.html`
- `style/` hojas de estilo · `js/java.js` carrito, totales y pago · `fotos/` imágenes

## Importante
- El registro y el inicio de sesión son una **demostración**: la cuenta solo existe en el navegador (`localStorage`). Para una tienda real hace falta un servidor.
- El pago **no cobra nada**. Para cobrar de verdad usa una pasarela (Wompi, PayU, etc.). Nunca guardes datos de tarjeta.
- Pendiente de tus datos reales: correo (`hello@towskan.com`, `soporte@towskan.com`), teléfonos, dirección, redes sociales y Panel Admin.
