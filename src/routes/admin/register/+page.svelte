<script>
  // @ts-nocheck
  import { lang, adminAuth, shelters, updateShelter, showToast, uid } from '$lib/stores';
  import { T } from '$lib/i18n';

  $: tr = T[$lang];
  $: shelter = $adminAuth ? $shelters.find(s => s.id === $adminAuth.shelterId) : null;
  $: cows = shelter ? [...(shelter.cows || [])] : [];

  let showForm = false;
  let editId = null;
  let form = emptyForm();

  function emptyForm() {
    return { name:'', breed:'', age:'', weight:'', color:'', status:'healthy', notes:'' };
  }

  function openAdd() { form = emptyForm(); editId = null; showForm = true; }
  function openEdit(c) { form = { ...c }; editId = c.id; showForm = true; }
  function closeForm() { showForm = false; }

  function saveCow() {
    if (!form.name.trim()) return;
    const updated = { ...shelter };
    if (editId) {
      updated.cows = updated.cows.map(c => c.id === editId ? { ...form, id: editId } : c);
    } else {
      updated.cows = [...(updated.cows || []), { ...form, id: uid() }];
    }
    updateShelter(updated);
    showToast(tr.savedSuccess, 'success');
    showForm = false;
  }

  function deleteCow(id) {
    if (!confirm(tr.confirmDelete)) return;
    const updated = { ...shelter, cows: shelter.cows.filter(c => c.id !== id) };
    updateShelter(updated);
    showToast(tr.deletedSuccess, 'success');
  }

  const statusBadge = { healthy:'badge-green', sick:'badge-red', pregnant:'badge-purple', new:'badge-blue' };
  const statusLabel = (s, tr) => ({ healthy: tr.healthy, sick: tr.sick, pregnant: tr.pregnant, new: tr.newArrival }[s] || s);
</script>

<svelte:head><title>{tr.register} – {tr.adminPanel}</title></svelte:head>

<div class="page-head">
  <div>
    <h2>{tr.register}</h2>
    <p style="color:#6B6B6B;font-size:14px">{tr.totalRegistered}: {cows.length}</p>
  </div>
  <button class="btn btn-primary" on:click={openAdd} id="btn-add-cow">{tr.addCow}</button>
</div>

{#if showForm}
<div class="modal-back" on:click|self={closeForm}>
  <div class="modal-box">
    <div class="modal-title">{editId ? tr.edit : tr.addCow}</div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">{tr.cowName}</label>
        <input class="form-input" bind:value={form.name} placeholder="e.g. Kamdhenu" id="inp-cow-name"/>
      </div>
      <div class="form-group">
        <label class="form-label">{tr.breed}</label>
        <select class="form-select" bind:value={form.breed} id="inp-breed">
          <option value="">-- Select --</option>
          <option>Gir</option><option>Kankrej</option><option>Sahiwal</option>
          <option>Tharparkar</option><option>Rathi</option><option>Other</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">{tr.age}</label>
        <input class="form-input" type="number" bind:value={form.age} id="inp-age"/>
      </div>
      <div class="form-group">
        <label class="form-label">{tr.weight}</label>
        <input class="form-input" type="number" bind:value={form.weight} id="inp-weight"/>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">{tr.color}</label>
        <input class="form-input" bind:value={form.color} id="inp-color"/>
      </div>
      <div class="form-group">
        <label class="form-label">{tr.status}</label>
        <select class="form-select" bind:value={form.status} id="inp-status">
          <option value="healthy">{tr.healthy}</option>
          <option value="sick">{tr.sick}</option>
          <option value="pregnant">{tr.pregnant}</option>
          <option value="new">{tr.newArrival}</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">{tr.notes}</label>
      <textarea class="form-textarea" bind:value={form.notes} id="inp-notes"></textarea>
    </div>
    <div style="display:flex;gap:10px">
      <button class="btn btn-primary" on:click={saveCow} id="btn-save-cow">{tr.save}</button>
      <button class="btn btn-outline" on:click={closeForm}>{tr.cancel}</button>
    </div>
  </div>
</div>
{/if}

{#if cows.length === 0}
  <div class="empty"><div class="empty-icon">🐄</div><h3>No cows registered yet.</h3></div>
{:else}
<div class="tbl-wrap">
  <table class="data-tbl">
    <thead>
      <tr>
        <th>#</th><th>{tr.cowName}</th><th>{tr.breed}</th>
        <th>{tr.age}</th><th>{tr.weight}</th><th>{tr.color}</th>
        <th>{tr.status}</th><th>{tr.notes}</th><th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each cows as c, i}
      <tr>
        <td>{i+1}</td>
        <td><strong>{c.name}</strong></td>
        <td>{c.breed}</td>
        <td>{c.age} yr</td>
        <td>{c.weight} kg</td>
        <td>{c.color}</td>
        <td><span class="badge {statusBadge[c.status] || 'badge-green'}">{statusLabel(c.status, tr)}</span></td>
        <td style="max-width:150px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{c.notes || '—'}</td>
        <td>
          <button class="btn btn-outline btn-sm" on:click={() => openEdit(c)} id="btn-edit-{c.id}">{tr.edit}</button>
          <button class="btn btn-danger btn-sm" on:click={() => deleteCow(c.id)} id="btn-del-{c.id}">{tr.deleteBtn}</button>
        </td>
      </tr>
      {/each}
    </tbody>
  </table>
</div>
{/if}

<style>
  .page-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px; }
  .page-head h2 { font-size:22px; font-weight:700; }
</style>
