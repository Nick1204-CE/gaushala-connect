<script>
  // @ts-nocheck
  import { lang, adminAuth, shelters, updateShelter, showToast, uid } from '$lib/stores';
  import { T } from '$lib/i18n';

  $: tr = T[$lang];
  $: shelter = $adminAuth ? $shelters.find(s => s.id === $adminAuth.shelterId) : null;
  $: services = shelter ? [...(shelter.services || [])] : [];

  let showForm = false, editId = null;
  let form = empty();
  function empty() { return { name:'', nameGu:'', icon:'🌿', desc:'' }; }

  function openAdd()  { form = empty(); editId = null; showForm = true; }
  function openEdit(sv){ form = { ...sv }; editId = sv.id; showForm = true; }
  function closeForm(){ showForm = false; }

  function save() {
    if (!form.name.trim()) return;
    const updated = { ...shelter };
    if (editId) {
      updated.services = updated.services.map(sv => sv.id === editId ? { ...form, id: editId } : sv);
    } else {
      updated.services = [...(updated.services||[]), { ...form, id: uid() }];
    }
    updateShelter(updated);
    showToast(tr.savedSuccess, 'success');
    showForm = false;
  }

  function del(id) {
    if (!confirm(tr.confirmDelete)) return;
    updateShelter({ ...shelter, services: shelter.services.filter(sv => sv.id !== id) });
    showToast(tr.deletedSuccess, 'success');
  }
</script>

<svelte:head><title>{tr.services} – {tr.adminPanel}</title></svelte:head>

<div class="page-head">
  <div><h2>{tr.services}</h2><p style="color:#6B6B6B;font-size:14px">{services.length} services</p></div>
  <button class="btn btn-primary" on:click={openAdd} id="btn-add-service">{tr.addService}</button>
</div>

{#if showForm}
<div class="modal-back" on:click|self={closeForm}>
  <div class="modal-box">
    <div class="modal-title">{editId ? tr.edit : tr.addService}</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">{tr.serviceName} (EN)</label>
        <input class="form-input" bind:value={form.name} id="inp-sname"/>
      </div>
      <div class="form-group">
        <label class="form-label">{tr.serviceName} (ગુ)</label>
        <input class="form-input" bind:value={form.nameGu} id="inp-sname-gu"/>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">{tr.serviceIcon}</label>
      <input class="form-input" bind:value={form.icon} placeholder="🌿" id="inp-sicon" style="font-size:24px;width:80px"/>
    </div>
    <div class="form-group">
      <label class="form-label">{tr.desc}</label>
      <textarea class="form-textarea" bind:value={form.desc} id="inp-sdesc"></textarea>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" on:click={save} id="btn-save-svc">{tr.save}</button>
      <button class="btn btn-outline" on:click={closeForm}>{tr.cancel}</button>
    </div>
  </div>
</div>
{/if}

{#if services.length === 0}
  <div class="empty"><div class="empty-icon">🌿</div><h3>No services yet.</h3></div>
{:else}
<div class="svc-list">
  {#each services as sv}
  <div class="svc-card">
    <span class="svc-icon">{sv.icon}</span>
    <div class="svc-body">
      <div class="svc-name">{sv.name}</div>
      {#if sv.nameGu}<div class="svc-name-gu">{sv.nameGu}</div>{/if}
      <div class="svc-desc">{sv.desc}</div>
    </div>
    <div class="svc-actions">
      <button class="btn btn-outline btn-sm" on:click={() => openEdit(sv)} id="edit-sv-{sv.id}">{tr.edit}</button>
      <button class="btn btn-danger btn-sm" on:click={() => del(sv.id)} id="del-sv-{sv.id}">{tr.deleteBtn}</button>
    </div>
  </div>
  {/each}
</div>
{/if}

<style>
  .page-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
  .page-head h2 { font-size:22px; font-weight:700; }
  .svc-list { display:flex; flex-direction:column; gap:14px; }
  .svc-card { background:#fff; border-radius:14px; padding:18px 20px; box-shadow:0 4px 24px rgba(0,0,0,.08); display:flex; gap:16px; align-items:center; }
  .svc-icon { font-size:36px; flex-shrink:0; }
  .svc-body { flex:1; }
  .svc-name { font-size:16px; font-weight:700; margin-bottom:2px; }
  .svc-name-gu { font-size:13px; color:#6B6B6B; }
  .svc-desc { font-size:14px; color:#6B6B6B; margin-top:4px; }
  .svc-actions { display:flex; gap:8px; flex-shrink:0; }
</style>
