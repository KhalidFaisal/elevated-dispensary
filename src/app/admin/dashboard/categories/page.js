import CategoriesClient from './CategoriesClient';

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Manage Categories</h1>
        <p className="text-pc-muted mt-1">Add, edit, and organize product categories.</p>
      </div>

      <CategoriesClient />
    </div>
  );
}
