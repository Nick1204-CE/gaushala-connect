<script>
  // @ts-nocheck
  import '../app.css';
  import { lang, toast, adminAuth } from '$lib/stores';
  import { T } from '$lib/i18n';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  $: l = $lang;
  $: tr = T[l];

  function toggleLang() { $lang = $lang === 'en' ? 'gu' : 'en'; }

  function goAdmin() {
    if ($adminAuth) goto('/admin');
    else goto('/admin/login');
  }
  function doLogout() {
    $adminAuth = null;
    goto('/');
  }

  $: isAdmin = $page.url.pathname.startsWith('/admin');
</script>

<!-- Navbar -->
<nav class="navbar">
  <a href="/" class="brand">
    <span class="brand-logo">🐄</span>
    <span class="brand-name">{tr.appName}</span>
  </a>
  <div class="nav-actions">
    <button class="btn-lang" on:click={toggleLang} id="lang-toggle">
      {l === 'en' ? 'ગુજ' : 'ENG'}
    </button>
    {#if $adminAuth}
      <button class="btn btn-outline btn-sm" on:click={() => goto('/admin')} id="nav-admin">⚙️ Admin</button>
      <button class="btn btn-outline btn-sm" on:click={doLogout} id="nav-logout">{tr.logout}</button>
    {:else}
      <button class="btn btn-primary btn-sm" on:click={goAdmin} id="nav-admin-login">🔐 {tr.adminLogin}</button>
    {/if}
  </div>
</nav>

<!-- Page -->
<main>
  <slot />
</main>

<!-- Toast -->
{#if $toast}
  <div class="toast-wrap">
    <div class="toast-box {$toast.type}">{$toast.msg}</div>
  </div>
{/if}

<style>
  .navbar {
    position: sticky; top: 0; z-index: 500;
    background: #fff; border-bottom: 1px solid #E8DDD0;
    padding: 0 24px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 2px 12px rgba(0,0,0,.06);
  }
  .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .brand-logo {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, #FF6B00, #CC5500);
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }
  .brand-name { font-weight: 800; font-size: 18px; color: #FF6B00; }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .btn-lang {
    background: #F9F5F0; border: 1.5px solid #E8DDD0; border-radius: 20px;
    padding: 5px 14px; font-size: 13px; font-weight: 700; cursor: pointer;
    transition: all .2s; color: #1A1A1A;
  }
  .btn-lang:hover { border-color: #FF6B00; color: #FF6B00; }
  main { min-height: calc(100vh - 64px); }
</style>
