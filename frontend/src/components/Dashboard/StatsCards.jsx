const StatsCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    { label: 'Quiz Attempts', value: stats.quiz?.totalAttempts || 0, icon: '📝', color: 'from-blue-500 to-blue-600' },
    { label: 'Average Score', value: `${stats.quiz?.averageScore || 0}%`, icon: '🎯', color: 'from-emerald-500 to-emerald-600' },
    { label: 'DSA Solved', value: stats.dsa?.totalSolved || 0, icon: '💻', color: 'from-violet-500 to-violet-600' },
    { label: 'Current Streak', value: `${stats.dsa?.streak || 0} days`, icon: '🔥', color: 'from-amber-500 to-amber-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="card card-body stat-accent flex items-start gap-4 animate-fade-in"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-lg flex-shrink-0 shadow-sm`}>
            {card.icon}
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{card.label}</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1 tracking-tight">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;