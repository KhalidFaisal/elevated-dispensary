'use client';

import { useEffect, useState } from 'react';

export default function InventoryAuditPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);

  const fetchAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/admin/inventory-audit', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      
      if (!res.ok) {
        setError(result.error || 'Failed to run audit');
      } else {
        setData(result);
      }
    } catch (err) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const syncStock = async (productId, newStock) => {
    if (!confirm(`Update stock to ${newStock} on the site?`)) return;
    setSyncing(true);
    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ stock: newStock })
      });
      if (res.ok) {
        // Remove from stock mismatch array
        setData(prev => ({
          ...prev,
          stockMismatch: prev.stockMismatch.filter(item => item.id !== productId)
        }));
      } else {
        alert('Failed to update stock');
      }
    } catch (err) {
      alert('Error updating stock');
    }
    setSyncing(false);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white">Inventory Audit</h1>
          <p className="text-pc-muted">Cross-reference site products with your Google Sheet</p>
        </div>
        <button 
          onClick={fetchAudit}
          disabled={loading || syncing}
          className="px-6 py-2 bg-pc-green text-pc-black font-bold rounded-lg hover:bg-pc-green-light transition-colors disabled:opacity-50"
        >
          {loading ? 'Running Audit...' : 'Run Audit'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-200">
          <p className="font-bold">Audit Failed</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {!loading && !error && data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Missing from Site */}
          <div className="glass-card p-6 border-red-900/50">
            <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              Forgot to Post ({data.missingFromSite.length})
            </h2>
            <p className="text-sm text-pc-muted mb-6">These products exist in your Google Sheet but are missing from the website.</p>
            
            {data.missingFromSite.length === 0 ? (
              <p className="text-pc-green font-bold">All good! No missing products.</p>
            ) : (
              <div className="space-y-2">
                {data.missingFromSite.map((item, i) => (
                  <div key={i} className="flex justify-between p-3 bg-pc-black rounded-lg border border-pc-border">
                    <span className="text-white font-bold">{item.name}</span>
                    <span className="text-pc-muted">Sheet Stock: {item.sheetStock}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stock Mismatch */}
          <div className="glass-card p-6 border-orange-900/50">
            <h2 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Stock Mismatch ({data.stockMismatch.length})
            </h2>
            <p className="text-sm text-pc-muted mb-6">These products are on the site, but the inventory numbers don't match the Google Sheet.</p>

            {data.stockMismatch.length === 0 ? (
              <p className="text-pc-green font-bold">All good! Stock numbers match perfectly.</p>
            ) : (
              <div className="space-y-2">
                {data.stockMismatch.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-pc-black rounded-lg border border-pc-border gap-4">
                    <div>
                      <p className="text-white font-bold">{item.name}</p>
                      <p className="text-xs text-pc-muted">Site: {item.dbStock} | Sheet: {item.sheetStock}</p>
                    </div>
                    <button 
                      onClick={() => syncStock(item.id, item.sheetStock)}
                      disabled={syncing}
                      className="px-4 py-1.5 bg-pc-dark hover:bg-pc-border text-white text-sm rounded-md transition-colors"
                    >
                      Sync Site to {item.sheetStock}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing from Sheet */}
          <div className="glass-card p-6 border-pc-border">
            <h2 className="text-xl font-bold text-white mb-4">Not in Sheet ({data.missingFromSheet.length})</h2>
            <p className="text-sm text-pc-muted mb-6">These products are active on the site, but couldn't be found in your Google Sheet. (Check for typos in names!)</p>

            {data.missingFromSheet.length === 0 ? (
              <p className="text-pc-green font-bold">All site products are tracked in the sheet.</p>
            ) : (
              <div className="space-y-2">
                {data.missingFromSheet.map((item) => (
                  <div key={item.id} className="flex justify-between p-3 bg-pc-black rounded-lg border border-pc-border">
                    <span className="text-white font-bold">{item.name}</span>
                    <span className="text-pc-muted">Site Stock: {item.dbStock}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  );
}
