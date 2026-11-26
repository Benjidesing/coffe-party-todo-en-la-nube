/* ===== Configuración ===== */
var WA_NUMBER = '5215500000000'; // ← cambia por tu número (código de país + número, sin + ni espacios)
var WA_TEXT = 'Hola, quiero mi assessment gratuito de seguridad Microsoft';
var PRIVACY_URL = 'https://todoenlanube.mx/aviso-de-privacidad/'; // ← pon aquí la URL de tu aviso de privacidad
var FORM_ENDPOINT = ''; // ← URL de tu webhook/CRM (HubSpot, Zapier, Make, etc.). Vacío = solo muestra confirmación.

(function () {
  /* WhatsApp: todos los enlaces con data-wa */
  var wa = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(WA_TEXT);
  document.querySelectorAll('[data-wa]').forEach(function (a) { a.href = wa; });

  /* Animación de la pantalla: "Security" → "OK" escribiéndose */
  var typed = document.getElementById('typed');
  var scene = document.getElementById('pc');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var words = ['Security', 'OK'];

  if (reduce) {
    typed.textContent = 'Security';
    scene.pauseAnimations && scene.pauseAnimations();
  } else if (typed && scene) {
    var w = 0, i = 0, deleting = false;
    (function tick() {
      var word = words[w];
      if (!deleting) {
        i++;
        typed.textContent = word.slice(0, i);
        if (i === word.length) {
          scene.classList.toggle('is-ok', word === 'OK');
          deleting = true;
          return setTimeout(tick, word === 'OK' ? 2600 : 1700);
        }
        return setTimeout(tick, 130);
      }
      scene.classList.remove('is-ok');
      i--;
      typed.textContent = word.slice(0, i);
      if (i === 0) { deleting = false; w = (w + 1) % words.length; return setTimeout(tick, 350); }
      setTimeout(tick, 70);
    })();
  }

  /* Aviso de privacidad */
  var pv = document.getElementById('privacy');
  if (pv) pv.href = PRIVACY_URL;

  /* Formulario */
  var form = document.getElementById('lead');
  function mark(el, bad) { el.closest('.f').classList.toggle('bad', bad); }
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var n = form.nombre, e = form.correo, t = form.telefono, c = form.empresa, p = form.puesto, k = form.consentimiento;
    var vn = n.value.trim().length > 2;
    var ve = /^\S+@\S+\.\S+$/.test(e.value.trim());
    var vt = t.value.replace(/\D/g, '').length >= 10;
    var vc = c.value.trim().length > 1;
    var vp = p.value.trim().length > 1;
    var vk = k.checked;
    mark(n, !vn); mark(e, !ve); mark(t, !vt); mark(c, !vc); mark(p, !vp); mark(k, !vk);
    if (!(vn && ve && vt && vc && vp && vk)) {
      var first = form.querySelector('.f.bad input');
      if (first) first.focus();
      return;
    }

    var data = {
      nombre: n.value.trim(), correo: e.value.trim(), telefono: t.value.trim(),
      extension: form.extension.value.trim(), empresa: c.value.trim(), puesto: p.value.trim(),
      consentimiento_aviso_privacidad: true,
      origen: location.href, fecha: new Date().toISOString()
    };
    if (FORM_ENDPOINT) {
      fetch(FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .catch(function (err) { console.error('Error al enviar el formulario', err); });
    }
    document.getElementById('formbox').classList.add('sent');
  });
})();
