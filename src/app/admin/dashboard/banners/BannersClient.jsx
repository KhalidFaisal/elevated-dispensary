'use client';

import { useState, useEffect } from 'react';

export default function BannersClient() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [editingBanner, setEditingBanner] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      if (!res.ok) throw new Error('Failed to fetch banners');
      const data = await res.json();
      setBanners(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete banner');
      fetchBanners();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const bannerData = {
      title: formData.get('title'),
      desktopImage: formData.get('desktopImage'),
      mobileImage: formData.get('mobileImage'),
      link: formData.get('link'),
      isActive: formData.get('isActive') === 'on',
      order: parseInt(formData.get('order') || 0),
    };

    try {
      const url = editingBanner ? `/api/admin/banners/${editingBanner.id}` : '/api/admin/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerData),
      });

      if (!res.ok) throw new Error('Failed to save banner');
      
      setIsFormOpen(false);
      setEditingBanner(null);
      fetchBanners();
    } catch (err) {
      alert(err.message);
    }
  };

  const ImageUploadField = ({ name, label, initialValue }) => {
    const [uploading, setUploading] = useState(false);
    const [value, setValue] = useState(initialValue || '');

    const handleUpload = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.details || errData.error || `Upload failed with status ${res.status}`);
        }
        const data = await res.json();
        setValue(data.url);
      } catch (err) {
        alert(err.message);
      } finally {
        setUploading(false);
      }
    };

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-pc-muted">{label}</label>
        <div className="flex items-center gap-4">
          {value && (
            <img src={value} alt="Preview" className="h-16 w-32 object-cover rounded border border-pc-border" />
          )}
          <input type="hidden" name={name} value={value} />
          <label className={`btn-secondary text-sm cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? 'Uploading...' : (value ? 'Change Image' : 'Upload Image')}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
          </label>
        </div>
      </div>
    );
  };

  if (loading) return <div className="text-pc-muted animate-pulse">Loading banners...</div>;
  if (error) return <div className="text-red-500 bg-red-500/10 p-4 rounded-xl">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => { setEditingBanner(null); setIsFormOpen(true); }}
          className="btn-primary"
        >
          + Add New Banner
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-pc-dark border border-pc-border rounded-2xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingBanner ? 'Edit Banner' : 'Create Banner'}
            </h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-pc-muted">Internal Title</label>
                <input 
                  type="text" 
                  name="title" 
                  defaultValue={editingBanner?.title}
                  className="input-field" 
                  placeholder="e.g. Summer Sale 2026"
                  required 
                />
              </div>

              <ImageUploadField 
                name="desktopImage" 
                label="Desktop Image (e.g. 1920x600)" 
                initialValue={editingBanner?.desktopImage} 
              />
              
              <ImageUploadField 
                name="mobileImage" 
                label="Mobile Image (e.g. 800x1200 or square)" 
                initialValue={editingBanner?.mobileImage} 
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-pc-muted">Link URL (Optional)</label>
                <input 
                  type="text" 
                  name="link" 
                  defaultValue={editingBanner?.link}
                  className="input-field" 
                  placeholder="/menu?category=FLOWER"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-pc-muted">Order (Priority)</label>
                  <input 
                    type="number" 
                    name="order" 
                    defaultValue={editingBanner?.order || 0}
                    className="input-field" 
                  />
                </div>

                <div className="flex items-center gap-3 pt-8 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="isActive" 
                    defaultChecked={editingBanner ? editingBanner.isActive : true}
                    className="modern-toggle"
                  />
                  <label className="text-sm font-medium text-white cursor-pointer">Active</label>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-pc-border">
                <button type="submit" className="btn-primary flex-1">Save Banner</button>
                <button type="button" onClick={() => setIsFormOpen(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banners List */}
      <div className="grid grid-cols-1 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="glass-card p-4 flex flex-col md:flex-row items-center gap-6">
            <div className="w-full md:w-48 h-24 bg-pc-smoke rounded-xl overflow-hidden relative shrink-0">
              <img src={banner.desktopImage} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-xs rounded text-white font-medium">Desktop</div>
            </div>
            <div className="w-full md:w-24 h-24 bg-pc-smoke rounded-xl overflow-hidden relative shrink-0">
              <img src={banner.mobileImage} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-xs rounded text-white font-medium">Mobile</div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-bold text-white text-lg">{banner.title}</h3>
                {!banner.isActive && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-500/20 text-red-500">Inactive</span>
                )}
              </div>
              <p className="text-sm text-pc-muted">Order: {banner.order}</p>
              {banner.link && <p className="text-sm text-pc-green mt-1">Link: {banner.link}</p>}
            </div>

            <div className="flex gap-2 w-full md:w-auto">
              <button onClick={() => handleEdit(banner)} className="btn-secondary flex-1 md:flex-none">Edit</button>
              <button onClick={() => handleDelete(banner.id)} className="px-4 py-2 rounded-xl text-red-500 hover:bg-red-500/10 font-medium transition-colors flex-1 md:flex-none">Delete</button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="text-center p-12 glass-card text-pc-muted">
            No banners found. Create your first banner to display on the storefront!
          </div>
        )}
      </div>
    </div>
  );
}
