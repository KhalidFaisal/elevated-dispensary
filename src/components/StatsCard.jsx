export default function StatsCard({ icon, label, value, accent = 'emerald' }) {
  const accentColors = {
    emerald: 'from-elevated-emerald/20 to-elevated-emerald/5 border-elevated-emerald/30 text-elevated-emerald',
    gold: 'from-elevated-gold/20 to-elevated-gold/5 border-elevated-gold/30 text-elevated-gold',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
    red: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
  };

  const colors = accentColors[accent] || accentColors.emerald;

  return (
    <div className={`glass-card bg-gradient-to-br ${colors} p-6`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-elevated-muted text-sm font-medium">{label}</span>
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
    </div>
  );
}
