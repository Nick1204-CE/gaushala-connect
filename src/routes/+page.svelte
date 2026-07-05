<script>
  // @ts-nocheck
  import { lang, shelters, distKm, adminAuth } from '$lib/stores';
  import { T } from '$lib/i18n';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  $: tr = T[$lang];

  let searchQuery = '';
  let userLat = null, userLng = null;
  let locating = false;
  let searched = false;
  let results = [];
  let selectedRole = null; // null | 'user' | 'admin'

  $: allShelters = $shelters;

  function getLocName(s) { return $lang === 'gu' ? (s.nameGu || s.name) : s.name; }
  function getLocAddr(s) { return $lang === 'gu' ? (s.addressGu || s.address) : s.address; }

  function selectUser() {
    selectedRole = 'user';
    // Smooth scroll to shelter section
    setTimeout(() => {
      document.getElementById('shelter-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  }

  function selectAdmin() {
    if ($adminAuth) goto('/admin');
    else goto('/admin/login');
  }

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
    selectedRole = 'user';
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

<!-- ═══════════ LANDING HERO ═══════════ -->
<section class="landing-hero">
  <div class="lh-bg-circles">
    <span class="circle c1"></span>
    <span class="circle c2"></span>
    <span class="circle c3"></span>
  </div>

  <div class="lh-content">
    <div class="lh-emoji">🐄</div>
    <h1 class="lh-title">{tr.appName}</h1>
    <p class="lh-sub">{tr.tagline}</p>
    <p class="lh-guj">{tr.heroGuj}</p>

    <!-- Role Selection Cards -->
    <div class="role-cards">
      <!-- User Card -->
      <button class="role-card user-card" id="btn-role-user" on:click={selectUser}>
        <div class="role-icon">👤</div>
        <div class="role-label">User Portal</div>
        <div class="role-desc">Browse & find nearby cow shelters</div>
        <div class="role-arrow">→</div>
      </button>

      <!-- Admin Card -->
      <button class="role-card admin-card" id="btn-role-admin" on:click={selectAdmin}>
        <div class="role-icon">🔐</div>
        <div class="role-label">Admin Portal</div>
        <div class="role-desc">Manage shelter data & records</div>
        <div class="role-arrow">→</div>
      </button>
    </div>
  </div>
</section>

<!-- ═══════════ USER SECTION ═══════════ -->
{#if selectedRole === 'user'}
  <!-- Search Bar -->
  <section class="search-section" id="shelter-section">
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
{/if}

<style>
  /* ── Landing Hero ── */
  .landing-hero {
    min-height: calc(100vh - 64px);
    background: linear-gradient(135deg, #FF6B00 0%, #FF8C38 45%, #2E7D32 100%);
    display: flex; align-items: center; justify-content: center;
    text-align: center; color: #fff; position: relative; overflow: hidden;
    padding: 40px 24px;
  }
  .lh-bg-circles { position: absolute; inset: 0; pointer-events: none; }
  .circle {
    position: absolute; border-radius: 50%;
    background: rgba(255,255,255,0.06);
  }
  .c1 { width: 420px; height: 420px; top: -100px; left: -120px; }
  .c2 { width: 300px; height: 300px; bottom: -80px; right: -60px; }
  .c3 { width: 200px; height: 200px; top: 50%; left: 70%; transform: translate(-50%,-50%); background: rgba(255,255,255,0.04); }

  .lh-content { position: relative; z-index: 1; max-width: 700px; width: 100%; }
  .lh-emoji { font-size: 72px; margin-bottom: 16px; animation: float 3s ease-in-out infinite; display: block; }
  .lh-title { font-size: clamp(32px, 6vw, 54px); font-weight: 900; margin-bottom: 10px; text-shadow: 0 3px 12px rgba(0,0,0,.25); letter-spacing: -1px; }
  .lh-sub { font-size: 20px; opacity: .92; margin-bottom: 6px; font-weight: 500; }
  .lh-guj { font-size: 14px; opacity: .75; margin-bottom: 40px; font-family: 'Noto Sans Gujarati', sans-serif; }

  /* ── Role Cards ── */
  .role-cards {
    display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;
  }
  .role-card {
    background: rgba(255,255,255,0.15);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    border: 2px solid rgba(255,255,255,0.25);
    border-radius: 20px;
    padding: 32px 36px;
    color: #fff;
    cursor: pointer;
    width: 220px;
    text-align: center;
    transition: transform .25s ease, background .25s ease, box-shadow .25s ease;
    position: relative;
    overflow: hidden;
  }
  .role-card::before {
    content: '';
    position: absolute; inset: 0;
    background: rgba(255,255,255,0);
    transition: background .25s ease;
    border-radius: 20px;
  }
  .role-card:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 20px 50px rgba(0,0,0,.25); }
  .role-card:hover::before { background: rgba(255,255,255,0.08); }
  .role-icon { font-size: 44px; margin-bottom: 12px; display: block; }
  .role-label { font-size: 20px; font-weight: 800; margin-bottom: 8px; }
  .role-desc { font-size: 13px; opacity: .85; margin-bottom: 16px; line-height: 1.4; }
  .role-arrow {
    font-size: 20px; font-weight: 700;
    width: 38px; height: 38px; border-radius: 50%;
    background: rgba(255,255,255,0.2);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto;
    transition: background .2s, transform .2s;
  }
  .role-card:hover .role-arrow { background: rgba(255,255,255,0.4); transform: translateX(4px); }

  .user-card { }
  .admin-card { }

  /* ── Search Section ── */
  .search-section {
    background: linear-gradient(135deg, #FF6B00 0%, #FF8C38 50%, #2E7D32 100%);
    padding: 40px 24px 52px; text-align: center;
  }
  .search-box {
    background: #fff; border-radius: 16px; padding: 24px;
    max-width: 600px; margin: 0 auto; box-shadow: 0 12px 40px rgba(0,0,0,.18);
  }
  .search-box h3 { color: #FF6B00; font-weight: 700; font-size: 16px; margin-bottom: 14px; text-align: left; }
  .search-row { display: flex; gap: 10px; flex-wrap: wrap; }
  .search-row .form-input { flex: 1; min-width: 160px; }

  /* ── Shelter Grid ── */
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
  @media(max-width:600px) {
    .search-row { flex-direction: column; }
    .role-cards { flex-direction: column; align-items: center; }
    .role-card { width: 100%; max-width: 300px; }
  }
</style>
