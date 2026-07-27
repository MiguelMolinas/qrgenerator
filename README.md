# QR Crafter Pro - Generador de Códigos QR

**QR Crafter Pro** es una aplicación web y herramienta integral moderna para la creación, personalización y descarga de códigos QR interactivos y de alta calidad.

---

## 📌 ¿Qué es QR Crafter Pro?

Es una solución completa e intuitiva que permite generar códigos QR personalizados en tiempo real para diversos propósitos (sitios web, redes Wi-Fi, tarjetas de contacto vCard, WhatsApp, correos electrónicos y texto plano). Diseñada con una interfaz elegante y accesible, incluye opciones avanzadas de personalización visual como estilos de puntos, esquinas redondeadas, degradados de color, incorporación de logotipos centrales y soporte para exportación en formatos de alta resolución (**PNG** y **SVG**).

---

## ✨ Características Destacadas

- 🌐 **Soporte Multitipo**:
  - **URL / Enlaces Web**: Conexión rápida a sitios web y redes sociales.
  - **Wi-Fi**: Conexión directa a redes inalámbricas mediante escaneo (SSID, contraseña, encriptación WPA/WEP/Abierta).
  - **vCard / Contacto**: Generación de contactos completas para importar en la agenda del teléfono.
  - **WhatsApp**: Enlaces directos de chat con número y mensaje predeterminado.
  - **Correo Electrónico**: Direcciones con asunto y contenido listo para enviar.
  - **Texto Plano**: Cualquier nota o mensaje personalizado.

- 🎨 **Diseño y Personalización**:
  - **Colores y Degradados**: Colores sólidos o degradados lineales personalizables.
  - **Formas de Puntos y Esquinas**: Estilos cuadrados, redondeados, circulares y clase *classy*.
  - **Logotipos Centrales**: Preajustes con iconos populares (🌐, 📶, 💬, ⭐, ❤️, 👤) o carga de imagen/logo propio (PNG, SVG, JPG).
  - **Presets Visuales**: Temas preconfigurados (*Cyber Neon*, *Sunset*, *Esmeralda*, *Oro Real*, *Minimalista*).

- ⚡ **Exportación y Escáner Integrado**:
  - Exportación en **PNG** de alta resolución (300px a 2000px) y vectoriales **SVG**.
  - Copia rápida de imagen al portapapeles.
  - Historial de códigos generados reciente (almacenado localmente).
  - Escáner y decodificador de códigos QR mediante subida de imágenes.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3 (Variables CSS, Flexbox/Grid, Glassmorphism, Dark/Light Mode), JavaScript ES6+.
- **Motor de Renderizado**: Engine propio en JavaScript puro + librería `qr-code-styling`.
- **Servidor / Herramientas**: Vite, Python 3 CLI helper (`generador_qr.py`).

---

## 🚀 Instalación y Uso Local

1. **Abrir la aplicación directamente**:
   Abre el archivo `index.html` en cualquier navegador web.

2. **Ejecutar servidor local con Node/pnpm**:
   ```bash
   pnpm dev
   ```

3. **Ejecutar herramienta CLI / Servidor con Python**:
   ```bash
   python3 generador_qr.py
   ```