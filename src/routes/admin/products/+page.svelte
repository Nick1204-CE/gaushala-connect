<script>
  // @ts-nocheck
  import { lang, adminAuth, shelters, updateShelter, showToast, uid } from '$lib/stores';
  import { T } from '$lib/i18n';

  $: tr = T[$lang];
  $: shelter = $adminAuth ? $shelters.find(s => s.id === $adminAuth.shelterId) : null;
  $: products = shelter ? [...(shelter.products || [])] : [];

  let showForm = false, editId = null;
  let form = empty();
  function empty() { return { name:'', nameGu:'', price:'', unit:'', unitGu:'', emoji:'🥛', desc:'' }; }

  function openAdd()  { form = empty(); editId = null; showForm = true; }
  function openEdit(p){ form = { ...p }; editId = p.id; showForm = true; }
  function closeForm(){ showForm = false; }

  function save() {
    if (!form.name.trim()) return;
    const updated = { ...shelter };
    if (editId) {
      updated.products = updated.products.map(p => p.id === editId ? { ...form, id: editId } : p);
    } else {
      updated.products = [...(updated.products||[]), { ...form, id: uid() }];
    }
    updateShelter(updated);
    showToast(tr.savedSuccess, 'success');
    showForm = false;
  }

  function del(id) {
    if (!confirm(tr.confirmDelete)) return;
    updateShelter({ ...shelter, products: shelter.products.filter(p => p.id !== id) });
    showToast(tr.deletedSuccess, 'success');
  }
</script>

<svelte:head><title>{tr.products} – {tr.adminPanel}</title></svelte:head>

<div class="page-head">
  <div><h2>{tr.products}</h2><p style="color:#6B6B6B;font-size:14px">{products.length} items</p></div>
  <button class="btn btn-primary" on:click={openAdd} id="btn-add-product">{tr.addProduct}</button>
</div>

{#if showForm}
<div class="modal-back" on:click|self={closeForm}>
  <div class="modal-box">
    <div class="modal-title">{editId ? tr.edit : tr.addProduct}</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">{tr.productName} (EN)</label>
        <input class="form-input" bind:value={form.name} id="inp-pname"/>
      </div>
      <div class="form-group">
        <label class="form-label">{tr.productName} (ગુ)</label>
        <input class="form-input" bind:value={form.nameGu} id="inp-pname-gu"/>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">{tr.price}</label>
        <input class="form-input" type="number" bind:value={form.price} id="inp-price"/>
      </div>
      <div class="form-group">
        <label class="form-label">{tr.unit} (EN)</label>
        <input class="form-input" bind:value={form.unit} placeholder="per kg" id="inp-unit"/>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">{tr.unit} (ગુ)</label>
        <input class="form-input" bind:value={form.unitGu} placeholder="પ્રતિ કિ." id="inp-unit-gu"/>
      </div>
      <div class="form-group">
        <label class="form-label">Emoji</label>
        <input class="form-input" bind:value={form.emoji} placeholder="🥛" id="inp-emoji"/>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">{tr.desc}</label>
      <textarea class="form-textarea" bind:value={form.desc} id="inp-desc"></textarea>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" on:click={save} id="btn-save-product">{tr.save}</button>
      <button class="btn btn-outline" on:click={closeForm}>{tr.cancel}</button>
    </div>
  </div>
</div>
{/if}

{#if products.length === 0}
  <div class="empty"><div class="empty-icon">📦</div><h3>No products yet.</h3></div>
{:else}
<div class="prod-grid">
  {#each products as p}
  <div class="prod-card">
    <div class="prod-top">
      <span class="prod-emoji">{p.emoji}</span>
      <div class="prod-actions">
        <button class="btn btn-outline btn-sm" on:click={() => openEdit(p)} id="edit-{p.id}">{tr.edit}</button>
        <button class="btn btn-danger btn-sm" on:click={() => del(p.id)} id="del-{p.id}">{tr.deleteBtn}</button>
      </div>
    </div>
    <div class="prod-name">{p.name}</div>
    {#if p.nameGu}<div class="prod-name-gu">{p.nameGu}</div>{/if}
    <div class="prod-price">₹{p.price} <span class="prod-unit">/ {p.unit}</span></div>
    {#if p.desc}<div class="prod-desc">{p.desc}</div>{/if}
  </div>
  {/each}
</div>
{/if}

<style>
  .page-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
  .page-head h2 { font-size:22px; font-weight:700; }
  .prod-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(210px,1fr)); gap:18px; }
  .prod-card { background:#fff; border-radius:14px; padding:20px; box-shadow:0 4px 24px rgba(0,0,0,.08); }
  .prod-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; }
  .prod-emoji { font-size:36px; }
  .prod-actions { display:flex; gap:6px; flex-direction:column; }
  .prod-name { font-size:16px; font-weight:700; margin-bottom:2px; }
  .prod-name-gu { font-size:13px; color:#6B6B6B; margin-bottom:6px; }
  .prod-price { font-size:17px; font-weight:800; color:#FF6B00; margin-bottom:4px; }
  .prod-unit { font-size:13px; color:#6B6B6B; font-weight:400; }
  .prod-desc { font-size:13px; color:#6B6B6B; margin-top:6px; }
</style>
