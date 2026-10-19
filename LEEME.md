# Landing SEO + SEM — Distribuidora de Huevos El Real (DEMO)

Propuesta conceptual de **GIANT IDEAS MARKETING** en HTML, CSS y JavaScript puro. **No es el sitio oficial.** Precios, referencias y mínimo de 150 bandejas son simulados. No se recopila ni envía información real mientras no se configure un canal de envío.

## Abrir y editar en Cursor

1. Descomprime la carpeta y ábrela desde `File > Open Folder` en Cursor.
2. Abre `index.html` en un navegador o usa una extensión de servidor local (Live Server).
3. Cambia los colores/diseño en `styles.css`, los productos y configuración en `config.js`, y la lógica en `app.js`.
4. Para publicar, sube la carpeta a un repositorio de GitHub. En Cloudflare Pages: conecta GitHub, framework `None`, comando de build `exit 0` y directorio de salida `.` (los archivos están en la raíz del repositorio).
5. Configura el dominio personalizado desde Cloudflare Pages.

## ¿Qué funciona ya?

- Navegación escritorio y móvil; botones y anclas de conversión.
- Segmentación por tipo de comprador (pestañas interactivos).
- Catálogo de 5 referencias de ejemplo.
- Cotizador real en navegador: añadir, quitar, editar cantidades, paquetes rápidos y límite de pedido, totales por referencia.
- Formulario de validación comercial y autorización de datos.
- Vista previa detallada, copia del resumen y enlace prellenado a WhatsApp **solamente cuando se configure el número real** en `config.js`.
- Atributos SEO, metadatos sociales, JSON-LD `Organization` en modo plantilla, favicon y responsive.
- Captura en memoria de UTM/GCLID en la visita actual. Etiquetas opcionales de GA4 y Ads después de consentir la medición (requieren IDs reales).
- Punto opcional `leadEndpoint` para recibir solicitudes en CRM/Sheets a través de backend propio seguro. **Por defecto queda apagado**.

## SEO: pasos obligatorios antes de publicar

1. **Sustituye `https://TU-DOMINIO.com/`** en `index.html` (canonical, Open Graph, JSON-LD) y en `sitemap-publicar.xml`/`robots-publicar.txt` por la URL final. No uses un canonical de otra empresa.
2. Cambia `<meta name="robots" content="noindex,nofollow">` por `index,follow` solo cuando el proyecto esté completo y autorizado.
3. Reemplaza `robots.txt` con el contenido de `robots-publicar.txt` y renombra `sitemap-publicar.xml` a `sitemap.xml` después de personalizar.
4. Confirma **nombre comercial, fotografías, productos, datos de contacto, cobertura, condiciones** y política de privacidad. Agrega domicilio real al Schema solo si lo confirma el cliente.
5. Verifica el sitio en Google Search Console y envía `sitemap.xml`.
6. Optimiza contenido local según las ciudades realmente atendidas (no prometer cobertura inexistente). Revisa Core Web Vitals con PageSpeed Insights y comprueba indexación.
7. Para SEO más amplio, desarrolla páginas diferenciadas de categorías/ciudades con contenido genuino en lugar de duplicar textos.
8. La etiqueta `FAQPage` no se incluye porque Google restringe la presentación de resultados enriquecidos de preguntas frecuentes en muchas categorías; el contenido HTML de FAQ sí existe y es accesible.

**Palabras clave propuestas (validar volumen y competencia):** huevos al por mayor, comprar huevos por bandeja, proveedor de huevos para restaurantes, distribuidora de huevos, huevos al por mayor para negocios, cotizar huevos al por mayor. Añade términos de ciudad solo si son reales.

## SEM: Google Ads y medición

1. Crea campañas de búsqueda separadas por intención: `huevos al por mayor`, `proveedor restaurantes` y `distribución por ciudad atendida`, con concordancias controladas y negativos como `empleo`, `recetas`, `cómo criar gallinas` si no son el público buscado.
2. Usa anuncios que dirijan directamente al `#cotizador` si corresponde a la intención, pero confirma que Google Ads respete las URL finales y fragmentos en tu campaña.
3. En `config.js`, coloca `ga4MeasurementId` (`G-...`), `googleAdsId` (`AW-...`) y `conversionLabel` obtenidos de las cuentas oficiales. **No inventar estos datos.**
4. Cuando estos IDs existan aparecerá un aviso de consentimiento antes de cargar etiquetas de analítica; debes adaptar esta implementación a la política legal de privacidad y a Consent Mode v2 si resulta aplicable a la implementación de Ads.
5. La conversión configurada se dispara al pulsar el enlace final **"Enviar por WhatsApp"**. Esto mide *intención de contacto*, **no** confirma que el mensaje haya sido enviado ni una venta. Para medir leads confirmados o calidad necesitas CRM/backend y, en su caso, conversiones offline.
6. Parámetros de campañas reconocidos: `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `gbraid`, `wbraid`. Si hay `leadEndpoint` configurado, el backend recibe la atribución con autorización del formulario.
7. Revisa Google Ads Tag Assistant / GA4 DebugView y realiza pruebas antes de invertir en pauta.

## Seguridad y restricciones

- Nunca coloques secretos de API, tokens o contraseñas en HTML o JS público.
- Valida / limita peticiones y aplica protección anti-spam desde el servidor cuando conectes la función de captura de datos. Cloudflare Turnstile puede añadirse.
- La configuración del formulario **no sustituye** una política de privacidad completa ni un servicio de captación de leads.
- El precio final de un pedido depende de condiciones comerciales, despacho y disponibilidad.
- No publicar con `demoMode: true`, con precios inventados o sin consentimiento del responsable de marca.
- Material gráfico ilustrativo vectorial original, sin uso de fotos, logos oficiales o imágenes ajenas.
