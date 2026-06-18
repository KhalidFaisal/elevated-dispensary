import BannersClient from './BannersClient';

export default function BannersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Manage Banners</h1>
        <p className="text-elevated-muted mt-1">Upload and manage promotional banners for desktop and mobile.</p>
      </div>

      <BannersClient />
    </div>
  );
}
