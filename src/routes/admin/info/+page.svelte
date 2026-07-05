<script>
  // @ts-nocheck
  import { lang, adminAuth, shelters, updateShelter, showToast } from '$lib/stores';
  import { T } from '$lib/i18n';

  $: tr = T[$lang];
  $: shelter = $adminAuth ? $shelters.find(s => s.id === $adminAuth.shelterId) : null;

  let form = {};
  $: if (shelter && !form.id) { form = { ...shelter }; }

  function save() {
    updateShelter({ ...shelter, ...form });
    showToast(tr.savedSuccess, 'success');
  }
</script>

<svelte:head><title>{tr.shelterInfo} – {tr.adminPanel}</title></svelte:head>

<div class="page-head">
  <div><h2>🏠 {tr.shelterInfo}</h2><p style="color:#6B6B6B;font-size:14px">Update your shelter details</p></div>
</div>

{#if shelter}
<div class="info-form">
  <div class="form-row">
    <div class="form-group">
      <label class="form-label">{tr.shelterName} (EN)</label>
      <input class="form-input" bind:value={form.name} id="inp-sname"/>
    </div>
    <div class="form-group">
      <label class="form-label">{tr.shelterName} (ગુ)</label>
      <input class="form-input" bind:value={form.nameGu} id="inp-sname-gu"/>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label class="form-label">{tr.shelterCity}</label>
      <input class="form-input" bind:value={form.city} id="inp-city"/>
    </div>
    <div class="form-group">
      <label class="form-label">{tr.shelterYear}</label>
      <input class="form-input" bind:value={form.established} id="inp-year"/>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label class="form-label">{tr.shelterPhone}</label>
      <input class="form-input" bind:value={form.phone} id="inp-phone"/>
    </div>
    <div class="form-group">
      <label class="form-label">{tr.shelterEmail}</label>
      <input class="form-input" bind:value={form.email} id="inp-email"/>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group">
      <label class="form-label">{tr.shelterCap}</label>
      <input class="form-input" type="number" bind:value={form.capacity} id="inp-cap"/>
    </div>
    <div class="form-group">
      <label class="form-label">{tr.shelterHours}</label>
      <input class="form-input" bind:value={form.openHours} id="inp-hours"/>
    </div>
  </div>
  <div class="form-group">
    <label class="form-label">{tr.shelterAddr} (EN)</label>
    <input class="form-input" bind:value={form.address} id="inp-addr"/>
  </div>
  <div class="form-group">
    <label class="form-label">{tr.shelterAddr} (ગુ)</label>
    <input class="form-input" bind:value={form.addressGu} id="inp-addr-gu"/>
  </div>
  <div class="form-group">
    <label class="form-label">{tr.shelterDesc} (EN)</label>
    <textarea class="form-textarea" bind:value={form.description} id="inp-desc"></textarea>
  </div>
  <div class="form-group">
    <label class="form-label">{tr.shelterDesc} (ગુ)</label>
    <textarea class="form-textarea" bind:value={form.descriptionGu} id="inp-desc-gu"></textarea>
  </div>
  <button class="btn btn-primary" on:click={save} id="btn-save-info">💾 {tr.save}</button>
</div>
{/if}

<style>
  .page-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
  .page-head h2 { font-size:22px; font-weight:700; }
  .info-form { background:#fff; border-radius:16px; padding:28px; box-shadow:0 4px 24px rgba(0,0,0,.08); max-width:700px; }
</style>
