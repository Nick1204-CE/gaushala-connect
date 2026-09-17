<script>
  // @ts-nocheck
  import { page } from '$app/stores';
  import { lang, shelters } from '$lib/stores';
  import { T } from '$lib/i18n';
  import { goto } from '$app/navigation';

  $: tr = T[$lang];
  $: id = $page.params.id;
  $: shelter = $shelters.find(s => s.id === id);
  $: if (!shelter) goto('/');

  let activeTab = 'overview';
  const tabs = ['overview','health','products','services','photos','contact'];
  function tabLabel(t) {
    return { overview: tr.tabOverview, health: tr.tabHealth, products: tr.tabProducts,
             services: tr.tabServices, photos: tr.tabPhotos, contact: tr.tabContact }[t];
  }

  $: name = shelter ? ($lang === 'gu' ? (shelter.nameGu || shelter.name) : shelter.name) : '';
  $: addr = shelter ? ($lang === 'gu' ? (shelter.addressGu || shelter.address) : shelter.address) : '';
  $: desc = shelter ? ($lang === 'gu' ? (shelter.descriptionGu || shelter.description) : shelter.description) : '';
  $: cowCount = shelter ? (shelter.cows || []).length : 0;

  const conditionBadge = { healthy:'badge-green', sick:'badge-red', injured:'badge-orange', recovering:'badge-blue', pregnant:'badge-purple' };
  const conditionLabel = (k, tr) => ({ healthy: tr.healthy, sick: tr.sick, injured: tr.injured, recovering: tr.recovering, pregnant: tr.pregnant }[k] || k);
  function latestRemark(c) {
    const list = c.healthRemarks || [];
    return list.length ? list[list.length - 1] : null;
  }
  let openHistory = {};
  function toggleHistory(id) { openHistory = { ...openHistory, [id]: !openHistory[id] }; }
</script>

<svelte:head><title>{name} – {tr.appName}</title></svelte:head>

{#if shelter}
<div class="page">
  <div class="section" style="max-width:960px;margin:0 auto;padding-top:28px">
    <button class="back-btn" on:click={() => goto('/')} id="btn-back">← {tr.back}</button>

    <!-- Header -->
    <div class="shelter-header">
      <div class="shelter-emoji">{shelter.emoji}</div>
      <div>
        <h1 class="shelter-name">{name}</h1>
        <div class="shelter-meta">
          <span>📍 {addr}</span>
          <span>📅 Est. {shelter.established}</span>
          <span>🐮 {cowCount} {tr.cows}</span>
          <span>⏰ {shelter.openHours}</span>
        </div>
        <p class="shelter-desc">{desc}</p>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      {#each tabs as t}
        <button class="tab-btn {activeTab === t ? 'active' : ''}"
          on:click={() => activeTab = t} id="tab-{t}">{tabLabel(t)}</button>
      {/each}
    </div>

    <!-- Overview -->
    {#if activeTab === 'overview'}
    <div class="info-grid">
      <div class="info-card"><div class="info-label">{tr.address}</div><div class="info-val">{addr}</div></div>
      <div class="info-card"><div class="info-label">{tr.established}</div><div class="info-val">{shelter.established}</div></div>
      <div class="info-card"><div class="info-label">{tr.totalCows}</div><div class="info-val">{cowCount}</div></div>
      <div class="info-card"><div class="info-label">{tr.capacity}</div><div class="info-val">{shelter.capacity}</div></div>
      <div class="info-card"><div class="info-label">{tr.openHours}</div><div class="info-val">{shelter.openHours}</div></div>
      <div class="info-card"><div class="info-label">{tr.phone}</div><div class="info-val">{shelter.phone}</div></div>
    </div>
    {/if}

    <!-- Health -->
    {#if activeTab === 'health'}
    {#if cowCount === 0}
      <div class="empty"><div class="empty-icon">🐄</div><h3>{tr.noResults}</h3></div>
    {:else}
    <div class="health-grid">
      {#each shelter.cows as c}
      {@const last = latestRemark(c)}
      {@const history = (c.healthRemarks || []).slice(0, -1).reverse()}
      <div class="health-card">
        <div class="health-top">
          <div>
            <div class="health-name">🐄 {c.name}</div>
            <div class="health-meta">{c.breed} • {c.age} yr</div>
          </div>
          <span class="badge {conditionBadge[last ? last.condition : 'healthy'] || 'badge-green'}">
            {conditionLabel(last ? last.condition : 'healthy', tr)}
          </span>
        </div>
        {#if last}
          <p class="health-remark">{last.text}</p>
          <div class="health-foot">
            <span class="health-date">{tr.lastUpdated}: {last.date}</span>
            {#if history.length}
              <button class="health-toggle" on:click={() => toggleHistory(c.id)}>
                {openHistory[c.id] ? '▲' : '▼'} {history.length}
              </button>
            {/if}
          </div>
          {#if openHistory[c.id]}
          <div class="health-history">
            {#each history as r}
            <div class="health-hist-item">
              <span class="badge {conditionBadge[r.condition] || 'badge-green'}">{conditionLabel(r.condition, tr)}</span>
              <span class="health-date">{r.date}</span>
              <p class="health-remark">{r.text}</p>
            </div>
            {/each}
          </div>
          {/if}
        {:else}
          <p class="health-remark muted">{tr.noRemarksPublic}</p>
        {/if}
      </div>
      {/each}
    </div>
    {/if}
    {/if}

    <!-- Products -->
    {#if activeTab === 'products'}
    {#if (shelter.products || []).length === 0}
      <div class="empty"><div class="empty-icon">📦</div><h3>{tr.noResults}</h3></div>
    {:else}
    <div class="products-grid">
      {#each shelter.products as p}
      <div class="prod-card">
        <div class="prod-emoji">{p.emoji}</div>
        <div class="prod-name">{$lang === 'gu' ? (p.nameGu || p.name) : p.name}</div>
        <div class="prod-price">₹{p.price}</div>
        <div class="prod-unit">{$lang === 'gu' ? (p.unitGu || p.unit) : p.unit}</div>
        {#if p.desc}<div class="prod-desc">{p.desc}</div>{/if}
      </div>
      {/each}
    </div>
    {/if}
    {/if}

    <!-- Services -->
    {#if activeTab === 'services'}
    {#if (shelter.services || []).length === 0}
      <div class="empty"><div class="empty-icon">🌿</div><h3>{tr.noResults}</h3></div>
    {:else}
    <div class="services-list">
      {#each shelter.services as sv}
      <div class="svc-item">
        <span class="svc-icon">{sv.icon}</span>
        <div>
          <div class="svc-name">{$lang === 'gu' ? (sv.nameGu || sv.name) : sv.name}</div>
          <div class="svc-desc">{sv.desc}</div>
        </div>
      </div>
      {/each}
    </div>
    {/if}
    {/if}

    <!-- Photos -->
    {#if activeTab === 'photos'}
    {#if (shelter.photos || []).length === 0}
      <div class="empty"><div class="empty-icon">📷</div><h3>{tr.noPhotos}</h3></div>
    {:else}
    <div class="photos-grid">
      {#each shelter.photos as ph}
      <div class="photo-item">
        <img src={ph.url} alt={ph.caption || name} />
      </div>
      {/each}
    </div>
    {/if}
    {/if}

    <!-- Contact -->
    {#if activeTab === 'contact'}
    <div class="contact-card">
      <h3>📞 {tr.contactShelter}</h3>
      <div class="contact-rows">
        <div class="c-row">📍 <span>{addr}</span></div>
        <div class="c-row">📞 <a href="tel:{shelter.phone}">{shelter.phone}</a></div>
        <div class="c-row">✉️ <a href="mailto:{shelter.email}">{shelter.email}</a></div>
        <div class="c-row">⏰ <span>{shelter.openHours}</span></div>
      </div>
      <div class="contact-btns">
        <a href="tel:{shelter.phone}" class="btn btn-green" id="btn-call">📞 {tr.callNow}</a>
        <a href="https://wa.me/{shelter.phone.replace(/\D/g,'')}" target="_blank" class="btn btn-primary" id="btn-whatsapp">💬 WhatsApp</a>
        <a href="https://maps.google.com/?q={encodeURIComponent(shelter.address)}" target="_blank" class="btn btn-outline" id="btn-directions">🗺️ {tr.getDirections}</a>
      </div>
    </div>
    {/if}
  </div>
</div>
{/if}

<style>
  .page { background: #F9F5F0; min-height: calc(100vh - 64px); }
  .back-btn { background: none; border: none; color: #FF6B00; font-weight: 600; font-size: 15px; cursor: pointer; margin-bottom: 18px; display: inline-flex; align-items: center; gap: 6px; transition: gap .2s; }
  .back-btn:hover { gap: 10px; }
  .shelter-header { background: linear-gradient(135deg,#FF6B00,#FF8C38); border-radius: 16px; padding: 28px 32px; color: #fff; display: flex; gap: 20px; align-items: flex-start; margin-bottom: 22px; }
  .shelter-emoji { font-size: 56px; flex-shrink: 0; }
  .shelter-name { font-size: 26px; font-weight: 800; margin-bottom: 8px; }
  .shelter-meta { display: flex; gap: 14px; flex-wrap: wrap; font-size: 14px; opacity: .9; margin-bottom: 10px; }
  .shelter-desc { font-size: 14px; opacity: .85; }
  .tabs { display: flex; gap: 4px; flex-wrap: wrap; background: #fff; border-radius: 16px; padding: 6px; box-shadow: 0 4px 24px rgba(0,0,0,.08); margin-bottom: 24px; }
  .tab-btn { flex: 1; padding: 10px 12px; border-radius: 10px; border: none; background: transparent; font-size: 14px; font-weight: 600; color: #6B6B6B; cursor: pointer; transition: all .2s; white-space: nowrap; }
  .tab-btn.active { background: #FF6B00; color: #fff; box-shadow: 0 4px 12px rgba(255,107,0,.3); }
  .tab-btn:hover:not(.active) { background: #F9F5F0; color: #1A1A1A; }
  .info-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(220px,1fr)); gap: 14px; }
  .info-card { background: #fff; border-radius: 10px; padding: 18px; box-shadow: 0 4px 24px rgba(0,0,0,.08); border-left: 4px solid #FF6B00; }
  .info-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; color: #6B6B6B; margin-bottom: 4px; }
  .info-val { font-size: 15px; font-weight: 700; }
  .health-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(260px,1fr)); gap: 16px; }
  .health-card { background: #fff; border-radius: 14px; padding: 18px; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
  .health-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; margin-bottom: 10px; }
  .health-name { font-weight: 700; font-size: 16px; }
  .health-meta { font-size: 12px; color: #6B6B6B; margin-top: 2px; }
  .health-remark { font-size: 14px; color: #1A1A1A; margin: 0; }
  .health-remark.muted { color: #6B6B6B; font-style: italic; }
  .health-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
  .health-date { font-size: 12px; color: #6B6B6B; }
  .health-toggle { background: none; border: none; color: #FF6B00; font-weight: 600; font-size: 12px; cursor: pointer; }
  .health-history { margin-top: 10px; padding-top: 10px; border-top: 1px dashed #E8DDD0; display: flex; flex-direction: column; gap: 10px; }
  .health-hist-item { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .health-hist-item .health-remark { flex-basis: 100%; }
  .products-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap: 18px; }
  .prod-card { background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 24px rgba(0,0,0,.08); text-align: center; transition: all .25s; border: 1.5px solid transparent; }
  .prod-card:hover { border-color: #FF6B00; transform: translateY(-3px); }
  .prod-emoji { font-size: 40px; margin-bottom: 10px; }
  .prod-name { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
  .prod-price { color: #FF6B00; font-weight: 800; font-size: 18px; }
  .prod-unit { color: #6B6B6B; font-size: 12px; }
  .prod-desc { color: #6B6B6B; font-size: 12px; margin-top: 6px; }
  .services-list { display: flex; flex-direction: column; gap: 14px; }
  .svc-item { background: #fff; border-radius: 12px; padding: 18px 20px; box-shadow: 0 4px 24px rgba(0,0,0,.08); display: flex; gap: 16px; align-items: flex-start; }
  .svc-icon { font-size: 32px; }
  .svc-name { font-weight: 700; font-size: 16px; margin-bottom: 4px; }
  .svc-desc { color: #6B6B6B; font-size: 14px; }
  .photos-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(150px,1fr)); gap: 12px; }
  .photo-item { border-radius: 10px; overflow: hidden; aspect-ratio: 1; background: #FFE0B2; }
  .photo-item img { width: 100%; height: 100%; object-fit: cover; }
  .contact-card { background: linear-gradient(135deg,#2E7D32,#4CAF50); border-radius: 16px; padding: 28px; color: #fff; }
  .contact-card h3 { font-size: 20px; font-weight: 700; margin-bottom: 18px; }
  .contact-rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
  .c-row { display: flex; gap: 10px; align-items: center; font-size: 15px; }
  .c-row a { color: #fff; text-decoration: underline; }
  .contact-btns { display: flex; gap: 12px; flex-wrap: wrap; }
  @media(max-width:600px) { .shelter-header { flex-direction: column; } }
</style>
