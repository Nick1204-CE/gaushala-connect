<script>
  // @ts-nocheck
  import { lang, adminAuth, shelters, updateShelter, showToast, uid } from '$lib/stores';
  import { T } from '$lib/i18n';

  $: tr = T[$lang];
  $: shelter = $adminAuth ? $shelters.find(s => s.id === $adminAuth.shelterId) : null;
  $: photos = shelter ? [...(shelter.photos || [])] : [];

  let caption = '';

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const updated = { ...shelter };
      updated.photos = [...(updated.photos || []), { id: uid(), url: ev.target.result, caption }];
      updateShelter(updated);
      showToast(tr.savedSuccess, 'success');
      caption = '';
    };
    reader.readAsDataURL(file);
  }

  function del(id) {
    if (!confirm(tr.confirmDelete)) return;
    updateShelter({ ...shelter, photos: shelter.photos.filter(p => p.id !== id) });
    showToast(tr.deletedSuccess, 'success');
  }
</script>

<svelte:head><title>{tr.photos} – {tr.adminPanel}</title></svelte:head>

<div class="page-head">
  <div><h2>{tr.photos}</h2><p style="color:#6B6B6B;font-size:14px">{photos.length} photos</p></div>
</div>

<!-- Upload -->
<div class="upload-section">
  <div class="form-group">
    <label class="form-label">Caption (optional)</label>
    <input class="form-input" bind:value={caption} placeholder="e.g. Cows at morning feeding" id="inp-caption" style="max-width:320px"/>
  </div>
  <label class="upload-zone" for="file-upload">
    <div class="upload-icon">📷</div>
    <div>{tr.clickUpload}</div>
    <div style="font-size:12px;margin-top:4px;opacity:.7">JPG, PNG, WEBP</div>
  </label>
  <input type="file" id="file-upload" accept="image/*" style="display:none" on:change={handleFile}/>
</div>

<!-- Grid -->
{#if photos.length === 0}
  <div class="empty"><div class="empty-icon">📷</div><h3>{tr.noPhotos}</h3></div>
{:else}
<div class="photos-grid">
  {#each photos as ph}
  <div class="photo-wrap">
    <img src={ph.url} alt={ph.caption || 'Photo'} class="photo-img"/>
    {#if ph.caption}<div class="photo-caption">{ph.caption}</div>{/if}
    <button class="photo-del btn btn-danger btn-sm" on:click={() => del(ph.id)} id="del-ph-{ph.id}">✕</button>
  </div>
  {/each}
</div>
{/if}

<style>
  .page-head { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; }
  .page-head h2 { font-size:22px; font-weight:700; }
  .upload-section { margin-bottom:28px; }
  .upload-zone { display:block; border:2px dashed #E8DDD0; border-radius:10px; padding:28px; text-align:center; color:#6B6B6B; cursor:pointer; transition:all .2s; background:#F9F5F0; }
  .upload-zone:hover { border-color:#FF6B00; color:#FF6B00; background:#FFF8F0; }
  .upload-icon { font-size:36px; margin-bottom:8px; }
  .photos-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:14px; }
  .photo-wrap { position:relative; border-radius:10px; overflow:hidden; background:#FFE0B2; }
  .photo-img { width:100%; aspect-ratio:1; object-fit:cover; display:block; }
  .photo-caption { position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,.55); color:#fff; font-size:12px; padding:6px 8px; }
  .photo-del { position:absolute; top:6px; right:6px; padding:4px 8px; font-size:12px; }
</style>
