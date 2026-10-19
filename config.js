/*
 * CONFIGURACIÓN CENTRAL. Valores DEMOSTRATIVOS, NO oficiales.
 * Edítalos en Cursor antes de cualquier publicación comercial.
 * Número WhatsApp: 57 + celular de 10 dígitos, sin +, guiones ni espacios.
 * Para habilitar Google Analytics/Ads, añade las claves reales y configura consentimiento.
 */
window.EL_REAL_CONFIG = Object.freeze({
  brand: 'Distribuidora de Huevos El Real',
  whatsapp: '', // Ejemplo de formato: '573001234567' (NO usar un número inventado)
  minTrays: 150,
  eggsPerTray: 30,
  demoMode: true,
  // Integración de datos opcional. Debe ser un endpoint seguro propio, con validación y protección de datos.
  leadEndpoint: '',
  analytics: {
    ga4MeasurementId: '',     // G-XXXXXXXXXX
    googleAdsId: '',          // AW-XXXXXXXXX
    conversionLabel: ''       // Etiqueta exacta de la acción de conversión de Google Ads
  },
  products: [
    { id:'a', name:'Huevo tipo A',  tag:'Versátil',    price:15500, summary:'Para preparaciones y negocios de alto movimiento.', bg:'#f2eadd', tone:'#d8ad7c' },
    { id:'aa', name:'Huevo tipo AA', tag:'Más consultado',price:17800, summary:'Tamaño práctico para múltiples tipos de negocio.', bg:'#ecf0e5', tone:'#d7a574' },
    { id:'aaa',name:'Huevo tipo AAA',tag:'Seleccionado',price:19500, summary:'Otra alternativa para tu catálogo de productos.', bg:'#f2e7e4', tone:'#c98e69' },
    { id:'extra',name:'Huevo extra', tag:'Gran tamaño',price:21800, summary:'Presentación para necesidades específicas de compra.', bg:'#ece9dd', tone:'#bf885d' },
    { id:'blanco',name:'Huevo blanco',tag:'Alternativa',price:18300, summary:'Otra variedad para combinar en tu solicitud.', bg:'#e8efef', tone:'#f4ead8' }
  ]
});
