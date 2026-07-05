<script>
  // @ts-nocheck
  import { lang, shelters, distKm } from '$lib/stores';
  import { T } from '$lib/i18n';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  $: tr = T[$lang];

  let searchQuery = '';
  let userLat = null, userLng = null;
  let locating = false;
  let searched = false;
  let results = [];

  $: allShelters = $shelters;

  function getLocName(s) { return $lang === 'gu' ? (s.nameGu || s.name) : s.name; }
  function getLocAddr(s) { return $lang === 'gu' ? (s.addressGu || s.address) : s.address; }

  async function useLocation() {
    locating = true;
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
      );
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;
      doSearch();
    } catch {
      alert(tr.locationError);
    } finally { locating = false; }
  }

  function doSearch() {
    searched = true;
    if (userLat && userLng) {
      results = allShelters
        .map(s => ({ ...s, dist: distKm(userLat, userLng, s.lat, s.lng) }))
        .sort((a, b) => a.dist - b.dist);
    } else if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = allShelters.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q)
      ).map(s => ({ ...s, dist: null }));
    } else {
      results = allShelters.map(s => ({ ...s, dist: null }));
    }
  }

  function viewShelter(id) { goto(`/shelter/${id}`); }

  function cowCount(s) { return s.cows ? s.cows.length : 0; }
  function statusColor(s) {
    if (s.cows && s.cows.some(c => c.status === 'sick')) return 'badge-red';
    return 'badge-green';
  }
  function statusText(s) {
    if (s.cows && s.cows.some(c => c.status === 'sick')) return '⚠️ Needs Help';
    return '✅ Active';
  }
</script>

<svelte:head><title>{tr.appName} – {tr.tagline}</title></svelte:head>

<!-- Hero -->
<section class="hero">
  <div class="hero-emoji">🐄</div>
  <h1>{tr.appName}</h1>
  <p class="hero-sub">{tr.tagline}</p>
  <p class="hero-guj">{tr.heroGuj}</p>

  <div class="search-box">
    <h3>🔍 {tr.searchBtn}</h3>
    <div class="search-row">
      <input
        class="form-input" id="search-input"
        placeholder={tr.searchPlaceholder}
        bind:value={searchQuery}
        on:keydown={e => e.key === 'Enter' && doSearch()}
      />
      <button class="btn btn-primary" on:click={doSearch} id="btn-search">{tr.searchBtn}</button>
      <button class="btn btn-outline" on:click={useLocation} id="btn-location" disabled={locating}>
        {locating ? tr.locating : tr.useLocation}
      </button>
    </div>
  </div>
</section>

<!-- Results / All Shelters -->
<div class="section">
  {#if !searched}
    <h2 class="section-title">{tr.allShelters}</h2>
    <div class="divider"></div>
    <div class="shelters-grid">
      {#each allShelters as s}
        <div class="card shelter-card" on:click={() => viewShelter(s.id)} role="button" tabindex="0"
             on:keydown={e => e.key === 'Enter' && viewShelter(s.id)} id="shelter-{s.id}">
          <div class="card-img">{s.emoji}</div>
          <div class="card-body">
            <div class="card-name">{getLocName(s)}</div>
            <div class="card-loc">📍 {getLocAddr(s)}</div>
            <div class="card-tags">
              <span class="badge {statusColor(s)}">{statusText(s)}</span>
              <span class="badge badge-orange">🐮 {cowCount(s)} {tr.cows}</span>
            </div>
          </div>
          <div class="card-foot">
            <span class="city-tag">🏘️ {s.city}</span>
            <span class="yr-tag">Est. {s.established}</span>
          </div>
        </div>
      {/each}
    </div>
  {:else if results.length === 0}
    <div class="empty">
      <div class="empty-icon">🔍</div>
      <h3>{tr.noResults}</h3>
      <p>{tr.noResultsDesc}</p>
      <button class="btn btn-primary mt" on:click={() => { searched = false; searchQuery = ''; userLat = null; userLng = null; }}>
        {tr.allShelters}
      </button>
    </div>
  {:else}
    <h2 class="section-title">{userLat ? tr.nearbyShelters : tr.allShelters}</h2>
    <div class="divider"></div>
    <div class="shelters-grid">
      {#each results as s}
        <div class="card shelter-card" on:click={() => viewShelter(s.id)} role="button" tabindex="0"
             on:keydown={e => e.key === 'Enter' && viewShelter(s.id)} id="shelter-{s.id}">
          <div class="card-img">{s.emoji}</div>
          <div class="card-body">
            <div class="card-name">{getLocName(s)}</div>
            <div class="card-loc">📍 {getLocAddr(s)}</div>
            <div class="card-tags">
              <span class="badge {statusColor(s)}">{statusText(s)}</span>
              <span class="badge badge-orange">🐮 {cowCount(s)} {tr.cows}</span>
            </div>
          </div>
          <div class="card-foot">
            {#if s.dist !== null}
              <span class="dist">📏 {s.dist.toFixed(1)} {tr.kmAway}</span>
            {:else}
              <span class="city-tag">🏘️ {s.city}</span>
            {/if}
            <button class="btn btn-primary btn-sm" on:click|stopPropagation={() => viewShelter(s.id)}>
              {tr.viewDetails}
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .hero {
    background: linear-gradient(135deg, #FF6B00 0%, #FF8C38 50%, #2E7D32 100%);
    padding: 72px 24px 52px; text-align: center; color: #fff; position: relative; overflow: hidden;
  }
  .hero::before {
    content: ''; position: absolute; inset: 0;
    background: radial-gradient(circle at 20% 80%, rgba(255,255,255,.07) 0%, transparent 60%);
  }
  .hero-emoji { font-size: 64px; margin-bottom: 14px; animation: float 3s ease-in-out infinite; }
  .hero h1 { font-size: clamp(28px,5vw,48px); font-weight: 800; margin-bottom: 10px; text-shadow: 0 2px 8px rgba(0,0,0,.2); }
  .hero-sub { font-size: 18px; opacity: .9; margin-bottom: 6px; }
  .hero-guj { font-size: 14px; opacity: .75; margin-bottom: 32px; font-family: 'Noto Sans Gujarati', sans-serif; }
  .search-box {
    background: #fff; border-radius: 16px; padding: 24px;
    max-width: 600px; margin: 0 auto; box-shadow: 0 12px 40px rgba(0,0,0,.18);
  }
  .search-box h3 { color: #FF6B00; font-weight: 700; font-size: 16px; margin-bottom: 14px; text-align: left; }
  .search-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .search-row .form-input { flex: 1; min-width: 160px; }
  .shelters-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px,1fr)); gap: 22px; }
  .shelter-card { cursor: pointer; }
  .card-img {
    height: 150px; background: linear-gradient(135deg,#FFE0B2,#FFF3E0);
    display: flex; align-items: center; justify-content: center; font-size: 64px;
  }
  .card-body { padding: 18px 18px 10px; }
  .card-name { font-size: 17px; font-weight: 700; margin-bottom: 5px; }
  .card-loc { color: #6B6B6B; font-size: 13px; margin-bottom: 10px; }
  .card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
  .card-foot {
    padding: 12px 18px; border-top: 1px solid #E8DDD0;
    display: flex; justify-content: space-between; align-items: center;
  }
  .city-tag, .yr-tag, .dist { font-size: 13px; color: #6B6B6B; font-weight: 500; }
  .mt { margin-top: 20px; }
  @media(max-width:600px) { .search-row { flex-direction: column; } }
</style>
