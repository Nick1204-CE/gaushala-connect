<script>
  // @ts-nocheck
  import { lang, adminAuth, shelters, showToast } from '$lib/stores';
  import { T } from '$lib/i18n';
  import { goto } from '$app/navigation';

  $: tr = T[$lang];
  let username = '', password = '', error = '';

  function doLogin() {
    error = '';
    const found = $shelters.find(s => s.admin.username === username && s.admin.password === password);
    if (found) {
      $adminAuth = { shelterId: found.id, username };
      showToast('Welcome, ' + username + '! 🐄', 'success');
      goto('/admin');
    } else { error = tr.loginError; }
  }
</script>

<svelte:head><title>{tr.adminLogin} – {tr.appName}</title></svelte:head>

<div class="login-page">
  <div class="login-card">
    <div class="logo">🐄</div>
    <h2>{tr.adminLogin}</h2>
    <p>{tr.adminDesc}</p>

    {#if error}
      <div class="error-msg">⚠️ {error}</div>
    {/if}

    <div class="form-group">
      <label class="form-label" for="inp-user">{tr.username}</label>
      <input class="form-input" id="inp-user" bind:value={username} placeholder="e.g. shriram" />
    </div>
    <div class="form-group">
      <label class="form-label" for="inp-pass">{tr.password}</label>
      <input class="form-input" id="inp-pass" type="password" bind:value={password}
        on:keydown={e => e.key === 'Enter' && doLogin()} placeholder="••••••••" />
    </div>

    <button class="btn btn-primary w-full" on:click={doLogin} id="btn-login" style="width:100%;justify-content:center">
      🔐 {tr.login}
    </button>

    <div class="demo-hint">
      <strong>Demo:</strong><br/>
      shriram / gaushala123<br/>
      gokul / dham2001<br/>
      mahavir / kheda1972
    </div>

    <button class="back-link" on:click={() => goto('/')}>← {tr.back}</button>
  </div>
</div>

<style>
  .login-page { min-height:calc(100vh - 64px); display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg,#FF6B00,#FF8C38 50%,#2E7D32); padding:24px; }
  .login-card { background:#fff; border-radius:24px; padding:40px; max-width:380px; width:100%; box-shadow:0 24px 80px rgba(0,0,0,.25); animation:slideUp .4s ease; }
  .logo { font-size:48px; text-align:center; margin-bottom:8px; }
  h2 { text-align:center; font-size:22px; font-weight:800; color:#FF6B00; margin-bottom:4px; }
  p { text-align:center; color:#6B6B6B; font-size:14px; margin-bottom:24px; }
  .error-msg { background:#ffebee; color:#c62828; padding:10px 14px; border-radius:8px; font-size:14px; margin-bottom:16px; }
  .demo-hint { background:#F9F5F0; border-radius:10px; padding:12px 16px; font-size:13px; color:#6B6B6B; margin-top:16px; line-height:1.8; }
  .back-link { background:none; border:none; color:#FF6B00; font-size:14px; font-weight:600; cursor:pointer; margin-top:14px; display:block; text-align:center; width:100%; }
  .w-full { width:100%; justify-content:center; }
</style>
