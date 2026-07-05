<script>
  // @ts-nocheck
  import { lang, adminAuth, shelters } from '$lib/stores';
  import { T } from '$lib/i18n';

  $: tr = T[$lang];
  $: shelter = $adminAuth ? $shelters.find(s => s.id === $adminAuth.shelterId) : null;
  $: cows = shelter ? (shelter.cows || []) : [];
  $: healthyCount = cows.filter(c => c.status === 'healthy').length;
  $: sickCount    = cows.filter(c => c.status === 'sick').length;
  $: products = shelter ? (shelter.products || []) : [];
  $: services = shelter ? (shelter.services || []) : [];
  $: photos   = shelter ? (shelter.photos || []) : [];

  $: name = shelter ? ($lang === 'gu' ? (shelter.nameGu || shelter.name) : shelter.name) : '';
</script>

<svelte:head><title>{tr.dashboard} – {tr.adminPanel}</title></svelte:head>

<div class="dash-header">
  <div>
    <h2>{shelter?.emoji} {name}</h2>
    <p>{tr.dashboard} – {shelter?.city}</p>
  </div>
</div>

<div class="stats-row">
  <div class="stat-card orange">
    <div class="stat-num">{cows.length}</div>
    <div class="stat-lbl">{tr.totalRegistered}</div>
  </div>
  <div class="stat-card green">
    <div class="stat-num">{healthyCount}</div>
    <div class="stat-lbl">{tr.healthyCount}</div>
  </div>
  <div class="stat-card red">
    <div class="stat-num">{sickCount}</div>
    <div class="stat-lbl">{tr.sickCount}</div>
  </div>
  <div class="stat-card blue">
    <div class="stat-num">{products.length}</div>
    <div class="stat-lbl">{tr.totalProducts}</div>
  </div>
  <div class="stat-card purple">
    <div class="stat-num">{services.length}</div>
    <div class="stat-lbl">{tr.totalServices}</div>
  </div>
  <div class="stat-card teal">
    <div class="stat-num">{photos.length}</div>
    <div class="stat-lbl">{tr.photos}</div>
  </div>
</div>

<div class="quick-links">
  <a href="/admin/register" class="ql-card" id="ql-register">
    <span class="ql-icon">📋</span>
    <span>{tr.register}</span>
    <span class="ql-count">{cows.length}</span>
  </a>
  <a href="/admin/products" class="ql-card" id="ql-products">
    <span class="ql-icon">🥛</span>
    <span>{tr.products}</span>
    <span class="ql-count">{products.length}</span>
  </a>
  <a href="/admin/services" class="ql-card" id="ql-services">
    <span class="ql-icon">🌿</span>
    <span>{tr.services}</span>
    <span class="ql-count">{services.length}</span>
  </a>
  <a href="/admin/photos" class="ql-card" id="ql-photos">
    <span class="ql-icon">📷</span>
    <span>{tr.photos}</span>
    <span class="ql-count">{photos.length}</span>
  </a>
  <a href="/admin/info" class="ql-card" id="ql-info">
    <span class="ql-icon">🏠</span>
    <span>{tr.shelterInfo}</span>
    <span class="ql-count">→</span>
  </a>
</div>

<style>
  .dash-header { margin-bottom:24px; }
  .dash-header h2 { font-size:24px; font-weight:700; }
  .dash-header p { color:#6B6B6B; font-size:14px; margin-top:4px; }
  .stats-row { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:14px; margin-bottom:28px; }
  .stat-card { background:#fff; border-radius:12px; padding:20px 16px; text-align:center; box-shadow:0 4px 24px rgba(0,0,0,.08); border-top:4px solid #ccc; }
  .stat-card.orange { border-top-color:#FF6B00; }
  .stat-card.green  { border-top-color:#2E7D32; }
  .stat-card.red    { border-top-color:#C62828; }
  .stat-card.blue   { border-top-color:#1565C0; }
  .stat-card.purple { border-top-color:#6A1B9A; }
  .stat-card.teal   { border-top-color:#00695C; }
  .stat-num { font-size:30px; font-weight:800; margin-bottom:4px; }
  .stat-lbl { font-size:13px; color:#6B6B6B; }
  .quick-links { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:14px; }
  .ql-card { background:#fff; border-radius:12px; padding:20px; box-shadow:0 4px 24px rgba(0,0,0,.08); display:flex; flex-direction:column; align-items:center; gap:8px; text-decoration:none; color:#1A1A1A; transition:all .25s; border:1.5px solid transparent; }
  .ql-card:hover { border-color:#FF6B00; transform:translateY(-3px); box-shadow:0 8px 32px rgba(255,107,0,.18); }
  .ql-icon { font-size:36px; }
  .ql-count { background:#FFF3E0; color:#FF6B00; padding:2px 10px; border-radius:12px; font-size:13px; font-weight:700; }
</style>
