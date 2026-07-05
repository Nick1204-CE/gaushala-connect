<script>
  // @ts-nocheck
  import { lang, adminAuth } from '$lib/stores';
  import { T } from '$lib/i18n';
  import { goto, page } from '$app/navigation';
  import { onMount } from 'svelte';
  import { page as pg } from '$app/stores';

  $: tr = T[$lang];
  $: if (typeof window !== 'undefined' && !$adminAuth) goto('/admin/login');

  const navItems = [
    { key: 'dashboard', icon: '📊', href: '/admin' },
    { key: 'register',  icon: '📋', href: '/admin/register' },
    { key: 'products',  icon: '🥛', href: '/admin/products' },
    { key: 'services',  icon: '🌿', href: '/admin/services' },
    { key: 'photos',    icon: '📷', href: '/admin/photos' },
    { key: 'shelterInfo', icon: '🏠', href: '/admin/info' },
  ];

  $: currentPath = $pg.url.pathname;
</script>

{#if $adminAuth}
<div class="admin-wrap">
  <aside class="sidebar">
    <div class="sb-head">
      <div class="sb-logo">🐄</div>
      <div class="sb-title">{tr.adminPanel}</div>
      <div class="sb-user">@{$adminAuth.username}</div>
    </div>
    <nav class="sb-nav">
      {#each navItems as item}
        <a href={item.href} class="sb-link {currentPath === item.href ? 'active' : ''}" id="nav-{item.key}">
          <span class="sb-icon">{item.icon}</span>
          <span>{tr[item.key]}</span>
        </a>
      {/each}
    </nav>
  </aside>
  <div class="admin-content">
    <slot />
  </div>
</div>
{/if}

<style>
  .admin-wrap { display:flex; min-height:calc(100vh - 64px); }
  .sidebar { width:220px; background:#fff; border-right:1px solid #E8DDD0; display:flex; flex-direction:column; flex-shrink:0; position:sticky; top:64px; height:calc(100vh - 64px); overflow-y:auto; }
  .sb-head { padding:24px 16px 16px; border-bottom:1px solid #E8DDD0; }
  .sb-logo { font-size:32px; margin-bottom:4px; }
  .sb-title { font-size:14px; font-weight:800; color:#FF6B00; }
  .sb-user { font-size:12px; color:#6B6B6B; margin-top:2px; }
  .sb-nav { padding:12px 8px; display:flex; flex-direction:column; gap:2px; }
  .sb-link { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px; font-size:14px; font-weight:500; color:#6B6B6B; text-decoration:none; transition:all .2s; }
  .sb-link:hover { background:#F9F5F0; color:#1A1A1A; }
  .sb-link.active { background:#FFF3E0; color:#FF6B00; font-weight:700; }
  .sb-icon { font-size:18px; }
  .admin-content { flex:1; padding:32px 28px; overflow-x:hidden; }
  @media(max-width:768px) {
    .admin-wrap { flex-direction:column; }
    .sidebar { width:100%; height:auto; position:relative; top:0; flex-direction:row; flex-wrap:wrap; }
    .sb-head { display:none; }
    .sb-nav { flex-direction:row; flex-wrap:wrap; padding:8px; }
    .sb-link { flex-direction:column; font-size:11px; gap:2px; min-width:60px; padding:8px 4px; text-align:center; }
    .admin-content { padding:20px 16px; }
  }
</style>
