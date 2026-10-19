'use strict';
(() => {
  const config = window.EL_REAL_CONFIG;
  if (!config) { console.error('Falta config.js'); return; }
  const $ = (selector, root=document) => root.querySelector(selector);
  const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
  const num = (value) => new Intl.NumberFormat('es-CO').format(value);
  const peso = (value) => new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',maximumFractionDigits:0}).format(value);
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, letter => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[letter]));
  const items = Object.fromEntries(config.products.map(product => [product.id, 0]));
  const consentStorageKey = 'elreal_analytics_consent';
  let latestMessage = '';
  let toastTimer = null;
  let analyticsAllowed = false;
  const attribution = (() => {
    const q = new URLSearchParams(window.location.search);
    const picked = {};
    ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','gbraid','wbraid'].forEach(key => {
      const value = q.get(key);
      if (value) picked[key] = value.slice(0, 180);
    });
    return picked;
  })();

  function toast(message) {
    const el = $('#toast');
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3900);
  }
  function analyticsConfigured() {
    return Boolean(config.analytics?.ga4MeasurementId || config.analytics?.googleAdsId);
  }
  function measure(name, parameters={}) {
    if (!analyticsAllowed || typeof window.gtag !== 'function') return;
    window.gtag('event', name, parameters);
  }
  function initializeTag() {
    if (window.gtag || !analyticsConfigured()) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){window.dataLayer.push(arguments)};
    window.gtag('js', new Date());
    const tags = [config.analytics.ga4MeasurementId, config.analytics.googleAdsId].filter(Boolean);
    const s = document.createElement('script');
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tags[0])}`;
    document.head.appendChild(s);
    tags.forEach(id => window.gtag('config', id));
  }
  function setAnalyticsConsent(accept) {
    analyticsAllowed = Boolean(accept);
    try { localStorage.setItem(consentStorageKey, accept ? 'yes' : 'no'); } catch (_) {}
    $('#cookieBanner').hidden = true;
    if (accept) initializeTag();
  }
  function initAnalytics() {
    if (!analyticsConfigured()) return;
    let saved;
    try { saved = localStorage.getItem(consentStorageKey); } catch (_) {}
    if (saved === 'yes') { analyticsAllowed = true; initializeTag(); }
    else if (saved !== 'no') $('#cookieBanner').hidden = false;
    $('#acceptCookies').addEventListener('click', () => setAnalyticsConsent(true));
    $('#rejectCookies').addEventListener('click', () => setAnalyticsConsent(false));
  }

  function quote() {
    const lines = config.products.map(product => ({...product, qty: items[product.id] || 0})).filter(product => product.qty > 0);
    const trays = lines.reduce((sum, p) => sum + p.qty, 0);
    return {
      lines,
      trays,
      units: trays * config.eggsPerTray,
      total: lines.reduce((sum, p) => sum + p.price * p.qty, 0)
    };
  }
  function productMarkup(product) {
    return `<article class="product-card">
      <div class="product-art" style="--art-bg:${escapeHtml(product.bg)};--egg-tone:${escapeHtml(product.tone)}"><span class="product-tag">${escapeHtml(product.tag)}</span><span class="tray" aria-hidden="true"></span><span class="mini-egg" aria-hidden="true"></span><span class="mini-egg" aria-hidden="true"></span><span class="mini-egg" aria-hidden="true"></span></div>
      <div class="product-info"><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.summary)}</p><div class="product-price"><small>Precio de ejemplo / bandeja</small><strong>${peso(product.price)}</strong></div><button type="button" class="product-add" data-add="${escapeHtml(product.id)}">+ Agregar 10 bandejas</button></div></article>`;
  }
  function lineMarkup(product) {
    return `<div class="quote-line" data-line="${escapeHtml(product.id)}"><div class="quote-product"><span class="line-thumbnail" aria-hidden="true">◉</span><span><span class="line-product-title">${escapeHtml(product.name)}</span><span class="line-product-unit">${peso(product.price)} / bandeja</span></span></div><div class="quantity-control" aria-label="Bandejas ${escapeHtml(product.name)}"><button data-minus="${escapeHtml(product.id)}" type="button" aria-label="Quitar una bandeja de ${escapeHtml(product.name)}">−</button><input type="number" inputmode="numeric" min="0" max="99999" step="1" value="0" data-qty="${escapeHtml(product.id)}" aria-label="Bandejas ${escapeHtml(product.name)}"><button type="button" data-plus="${escapeHtml(product.id)}" aria-label="Agregar una bandeja de ${escapeHtml(product.name)}">+</button></div><strong class="line-total" data-line-total="${escapeHtml(product.id)}">${peso(0)}</strong></div>`;
  }
  function update() {
    const q = quote();
    $('#quoteTotal').textContent = peso(q.total);
    $('#sumTrays').textContent = num(q.trays);
    $('#sumEggs').textContent = num(q.units);
    $('#sumRefs').textContent = num(q.lines.length);
    $('#minLabel').textContent = `${num(config.minTrays)} bandejas`;
    $('#progressBar').style.width = `${config.minTrays ? Math.min(100, q.trays / config.minTrays * 100) : 100}%`;
    const status = $('#progressMessage');
    status.classList.toggle('is-done', q.trays >= config.minTrays);
    if (q.trays >= config.minTrays) status.textContent = '✓ Alcanzaste el mínimo de ejemplo. Puedes continuar.';
    else if (q.trays === 0) status.textContent = 'Agrega bandejas para calcular tu pedido.';
    else status.textContent = `Agrega ${num(config.minTrays - q.trays)} bandejas para alcanzar el mínimo de ejemplo.`;
    config.products.forEach(p => {
      const input = $(`[data-qty="${p.id}"]`);
      if (input && Number(input.value) !== items[p.id]) input.value = items[p.id];
      const el = $(`[data-line-total="${p.id}"]`);
      if (el) el.textContent = peso(items[p.id] * p.price);
    });
  }
  function setQty(id, qty) {
    if (!(id in items)) return;
    const parsed = Number(qty);
    items[id] = Number.isFinite(parsed) ? Math.min(99999, Math.max(0, Math.trunc(parsed))) : 0;
    update();
  }
  function initProductsAndQuote() {
    $('#productsGrid').innerHTML = config.products.map(productMarkup).join('');
    $('#quoteRows').innerHTML = config.products.map(lineMarkup).join('');
    $('#productsGrid').addEventListener('click', evt => {
      const button = evt.target.closest('[data-add]');
      if (!button) return;
      setQty(button.dataset.add, items[button.dataset.add] + 10);
      measure('add_to_quote', {item_id:button.dataset.add,quantity:10});
      toast('Agregamos 10 bandejas a tu cotizador.');
      $('#cotizador').scrollIntoView({behavior:'smooth',block:'start'});
    });
    $('#quoteRows').addEventListener('click', evt => {
      const plus = evt.target.closest('[data-plus]');
      const minus = evt.target.closest('[data-minus]');
      if (plus) setQty(plus.dataset.plus, items[plus.dataset.plus] + 1);
      if (minus) setQty(minus.dataset.minus, items[minus.dataset.minus] - 1);
    });
    $('#quoteRows').addEventListener('change', evt => {
      const input = evt.target.closest('[data-qty]');
      if (input) setQty(input.dataset.qty, input.value);
    });
    $$('[data-preset]').forEach(button => button.addEventListener('click', () => {
      const preferred = 'aa' in items ? 'aa' : config.products[0].id;
      const qty = Number(button.dataset.preset);
      setQty(preferred, items[preferred] + qty);
      measure('add_to_quote', {item_id:preferred,quantity:qty});
      toast(`Agregamos ${num(qty)} bandejas al pedido.`);
    }));
    $('#clearQuote').addEventListener('click', () => {
      Object.keys(items).forEach(key => {items[key] = 0});
      update();
      toast('El cotizador está vacío.');
    });
    $('#continueBtn').addEventListener('click', evt => {
      const q=quote();
      if (q.trays < config.minTrays) {
        evt.preventDefault();
        toast(`Aún necesitas ${num(config.minTrays-q.trays)} bandejas para el mínimo de prueba.`);
        $('#quoteRows').scrollIntoView({behavior:'smooth',block:'center'});
      } else measure('begin_quote_contact',{trays:q.trays,items:q.lines.length});
    });
    update();
  }

  const audiences = {
    rest: {icon:'01', label:'RESTAURANTES Y COCINAS', headline:'Planea tus compras sin interrumpir el servicio.',desc:'Cotiza las cantidades que necesitas y comunica al equipo comercial la frecuencia y ciudad de entrega que requiere tu operación.'},
    tiendas: {icon:'02', label:'TIENDAS Y PANADERÍAS',headline:'Ten a mano las referencias que buscan tus clientes.',desc:'Compara presentaciones, arma pedidos mixtos y prepara una solicitud organizada de abastecimiento para tu punto de venta.'},
    dist: {icon:'03', label:'COMPRADORES Y DISTRIBUIDORES',headline:'Consolida tus volúmenes en una sola solicitud.',desc:'Selecciona referencias, revisa cantidades totales y comparte tus condiciones comerciales para recibir una propuesta adecuada.'}
  };
  function initAudienceTabs() {
    $$('.audience-tab').forEach(button => button.addEventListener('click', () => {
      $$('.audience-tab').forEach(tab => {tab.classList.remove('active');tab.setAttribute('aria-selected','false')});
      button.classList.add('active');button.setAttribute('aria-selected','true');
      const data = audiences[button.dataset.audience];
      $('#audiencePanel').setAttribute('aria-labelledby',button.id);
      $('#audIcon').textContent = data.icon;
      $('#audLabel').textContent = data.label;
      $('#audHeadline').textContent = data.headline;
      $('#audDesc').textContent = data.desc;
    }));
  }

  function fieldValue(id) {return $('#'+id).value.trim().replace(/\s+/g,' ')}
  function validateLead(form) {
    const errors = [];
    const fields = ['leadName','leadBusiness','leadPhone','leadCity'];
    fields.forEach(id => {
      const input=$('#'+id);
      input.setAttribute('aria-invalid',String(!input.value.trim()));
      if (!input.value.trim()) errors.push(input);
    });
    const phone = fieldValue('leadPhone').replace(/[^\d]/g, '');
    if (phone.length < 7 || phone.length > 15) {
      $('#leadPhone').setAttribute('aria-invalid','true');
      if (!errors.includes($('#leadPhone'))) errors.push($('#leadPhone'));
    }
    if (!$('#leadConsent').checked) errors.push($('#leadConsent'));
    if (errors.length) {
      const info = $('#formError');
      info.hidden = false;
      info.textContent = 'Completa los datos obligatorios, verifica el número de WhatsApp y acepta el tratamiento de datos.';
      errors[0].focus();
      return false;
    }
    $('#formError').hidden = true;
    return true;
  }
  function createMessage(q) {
    const rows = q.lines.map(p=>`• ${p.name}: ${num(p.qty)} bandejas × ${peso(p.price)} = ${peso(p.qty*p.price)}`).join('\n');
    const observations = fieldValue('leadNotes');
    const meta = [attribution.utm_source && `Origen: ${attribution.utm_source}`,attribution.utm_campaign && `Campaña: ${attribution.utm_campaign}`].filter(Boolean).join(' | ');
    return `SOLICITUD DE COTIZACIÓN — ${config.brand}\n\nDATOS DEL NEGOCIO\nNombre: ${fieldValue('leadName')}\nEmpresa: ${fieldValue('leadBusiness')}\nTeléfono: ${fieldValue('leadPhone')}\nCiudad de entrega: ${fieldValue('leadCity')}\nTipo de negocio: ${fieldValue('leadType')||'Sin indicar'}\nFrecuencia: ${fieldValue('leadFrequency')}\n\nDETALLE DE PRODUCTOS\n${rows}\n\nTOTAL DE BANDEJAS: ${num(q.trays)}\nTOTAL DE HUEVOS: ${num(q.units)}\nVALOR ESTIMADO: ${peso(q.total)} COP\n\nObservaciones: ${observations||'Sin observaciones'}${meta?'\n\n'+meta:''}\n\n*Valores demostrativos, no constituyen oferta comercial ni pedido confirmado. Sujetos a actualización y validación.*`;
  }
  function captureLead(q) {
    if (!config.leadEndpoint) return;
    const payload = {
      name:fieldValue('leadName'),business:fieldValue('leadBusiness'),phone:fieldValue('leadPhone'),city:fieldValue('leadCity'),type:fieldValue('leadType'),frequency:fieldValue('leadFrequency'),notes:fieldValue('leadNotes'),
      trays:q.trays,totalEstimate:q.total,currency:'COP',products:q.lines.map(p=>({id:p.id,quantity:p.qty,unitPrice:p.price})),
      attribution,consent:true,submittedAt:new Date().toISOString(),demo:config.demoMode
    };
    // La API propia deberá validar/limitar peticiones. No colocar secretos de API en frontend.
    try {fetch(config.leadEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),keepalive:true}).catch(()=>{});} catch (_) {}
  }
  function sendAdsConversion() {
    if (!analyticsAllowed || !config.analytics?.googleAdsId || !config.analytics?.conversionLabel || typeof window.gtag !== 'function') return;
    window.gtag('event','conversion',{'send_to':`${config.analytics.googleAdsId}/${config.analytics.conversionLabel}`});
  }
  function initLeadForm() {
    const form=$('#leadForm');
    const dialog=$('#reviewDialog');
    form.addEventListener('submit',evt=>{
      evt.preventDefault();
      const q = quote();
      if (q.trays < config.minTrays) {
        toast(`Completa al menos ${num(config.minTrays)} bandejas para continuar (mínimo demo).`);
        $('#cotizador').scrollIntoView({behavior:'smooth',block:'start'});
        return;
      }
      if (!validateLead(form)) return;
      latestMessage = createMessage(q);
      $('#reviewContent').textContent = latestMessage;
      const validWhatsapp = /^\d{10,15}$/.test(config.whatsapp);
      $('#sendQuote').hidden = !validWhatsapp;
      $('#reviewHint').textContent = validWhatsapp
        ? 'Puedes copiar la solicitud o abrir WhatsApp con el mensaje precargado. El envío se confirma dentro de WhatsApp.'
        : 'WhatsApp todavía no está configurado. Usa “Copiar mensaje” para continuar con esta demostración.';
      if (validWhatsapp) $('#sendQuote').href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(latestMessage)}`;
      measure('quote_reviewed',{trays:q.trays,items:q.lines.length});
      dialog.showModal();
    });
    $('#closeDialog').addEventListener('click',()=>dialog.close());
    dialog.addEventListener('click',evt=>{if(evt.target===dialog) dialog.close()});
    $('#copyQuote').addEventListener('click',async()=>{
      try {
        await navigator.clipboard.writeText(latestMessage);
        toast('Solicitud copiada. Pégala en WhatsApp o correo.');
        measure('quote_copied');
      } catch (_) {
        const range=document.createRange();range.selectNodeContents($('#reviewContent'));
        const selection=window.getSelection();selection.removeAllRanges();selection.addRange(range);
        toast('Seleccionamos el texto. Usa Ctrl+C para copiarlo.');
      }
    });
    $('#sendQuote').addEventListener('click',()=>{
      const q=quote();
      measure('click_whatsapp_quote',{trays:q.trays});
      sendAdsConversion();
      captureLead(q);
    });
    $$('.field input').forEach(input=>input.addEventListener('input',()=>input.removeAttribute('aria-invalid')));
  }
  function initMobileNav() {
    const button=$('#menuButton'),nav=$('#mobileNav');
    button.addEventListener('click',()=>{
      const open = button.getAttribute('aria-expanded')!=='true';
      button.setAttribute('aria-expanded',String(open));
      button.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
      nav.hidden=!open;
    });
    $$('a',nav).forEach(a=>a.addEventListener('click',()=>{nav.hidden=true;button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Abrir menú')}));
    document.addEventListener('keydown',evt=>{if(evt.key==='Escape'){nav.hidden=true;button.setAttribute('aria-expanded','false')}});
  }
  function initFloatingContact() {
    $('#floatingContact').addEventListener('click',()=>measure('floating_contact_click'));
  }
  $('#year').textContent = new Date().getFullYear();
  initAnalytics();
  initProductsAndQuote();
  initAudienceTabs();
  initLeadForm();
  initMobileNav();
  initFloatingContact();
})();
