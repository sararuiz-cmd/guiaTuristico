/* style.css
    Paleta moderna y utilidades básicas
    Ubicación prevista: /C:/Users/Milton/OneDrive/Documentos/Guia2/guiaTuristico/css/style.css
*/

/* Variables de color modernos */
:root{
  --bg: #0f1724;             /* azul oscuro */
  --surface: #0b1220;        /* tarjeta / fondo secundario */
  --muted: #9aa4b2;          /* texto secundario */
  --primary: #7c5cff;        /* violeta moderno */
  --primary-600: #5b3df0;
  --accent: #00d4ff;         /* cyan brillante */
  --success: #34d399;        /* verde */
  --danger: #ff6b6b;         /* rojo suave */
  --glass: rgba(255,255,255,0.06);
  --glass-strong: rgba(255,255,255,0.08);
  --card-radius: 12px;
  --shadow-soft: 0 8px 24px rgba(2,6,23,0.6);
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
}

/* Soporte modo claro (opcional) */
@media (prefers-color-scheme: light){
  :root{
     --bg: #f6f8fb;
     --surface: #ffffff;
     --muted: #6b7280;
     --primary: #5b21b6;
     --primary-600: #4c1d95;
     --accent: #06b6d4;
     --glass: rgba(2,6,23,0.04);
     --glass-strong: rgba(2,6,23,0.06);
     --shadow-soft: 0 6px 18px rgba(15,23,42,0.06);
  }
}

/* Reset y base */
*{box-sizing:border-box}
html,body{
  height:100%;
  margin:0;
  background:linear-gradient(180deg, rgba(124,92,255,0.06), rgba(0,212,255,0.02)), var(--bg);
  color:#e6eef8;
  font-family:var(--font-sans);
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  line-height:1.45;
  font-size:16px;
}

/* Contenedores */
.container{
  max-width:1100px;
  margin:32px auto;
  padding:24px;
}

/* Tipografía */
h1,h2,h3,h4{
  color: white;
  margin:0 0 12px 0;
  letter-spacing:-0.01em;
}
p{ color:var(--muted); margin:0 0 12px 0; }

/* Tarjeta moderna */
.card{
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  backdrop-filter: blur(8px);
  border-radius:var(--card-radius);
  padding:20px;
  box-shadow:var(--shadow-soft);
  border:1px solid rgba(255,255,255,0.04);
}

/* Efecto glass */
.glass{
  background: linear-gradient(180deg, var(--glass), transparent);
  border-radius:12px;
  border:1px solid rgba(255,255,255,0.06);
  padding:16px;
}

/* Botones */
.btn{
  display:inline-flex;
  align-items:center;
  gap:10px;
  padding:10px 16px;
  border-radius:10px;
  cursor:pointer;
  border:0;
  color:white;
  background:linear-gradient(90deg, var(--primary), var(--primary-600));
  box-shadow: 0 6px 18px rgba(92, 60, 255, 0.18);
  transition:transform .12s ease, box-shadow .12s ease, opacity .12s;
  text-decoration:none;
  font-weight:600;
}
.btn:active{ transform:translateY(1px); }
.btn.secondary{
  background:transparent;
  color:var(--accent);
  border:1px solid rgba(255,255,255,0.06);
  box-shadow:none;
}

/* Link acentuado */
.a-accent{
  color:var(--accent);
  text-decoration:none;
  font-weight:600;
  transition:opacity .12s;
}
.a-accent:hover{ opacity:.9; text-decoration:underline; }

/* Tarjeta de destino turística (ejemplo) */
.tour-card{
  display:grid;
  grid-template-columns: 160px 1fr;
  gap:16px;
  align-items:center;
}
.tour-card img{
  width:160px;
  height:110px;
  object-fit:cover;
  border-radius:10px;
  border:1px solid rgba(255,255,255,0.04);
}

/* Badges y etiquetas */
.badge{
  display:inline-block;
  padding:6px 10px;
  border-radius:999px;
  background:linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
  color:var(--muted);
  font-size:13px;
  border:1px solid rgba(255,255,255,0.03);
}

/* Inputs */
.input{
  width:100%;
  padding:10px 12px;
  border-radius:10px;
  border:1px solid rgba(255,255,255,0.06);
  background:transparent;
  color:inherit;
  outline:none;
}
.input::placeholder{ color:rgba(255,255,255,0.25); }

/* Utilities */
.row{ display:flex; gap:12px; align-items:center; }
.col{ display:flex; flex-direction:column; gap:8px; }
.muted{ color:var(--muted); }
.accent{ color:var(--accent); }
.center{ display:flex; align-items:center; justify-content:center; }

/* Gradientes decorativos */
.gradient-deco{
  background: linear-gradient(135deg, rgba(124,92,255,0.18), rgba(0,212,255,0.12));
  border-radius:14px;
  padding:12px;
}

/* Responsive */
@media (max-width:720px){
  .tour-card{ grid-template-columns: 1fr; }
  .container{ padding:16px; margin:18px auto; }
}
