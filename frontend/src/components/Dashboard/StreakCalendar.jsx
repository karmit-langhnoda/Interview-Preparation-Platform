const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDayStyle = (solvedCount) => {
  if (solvedCount <= 0) {
    return 'bg-slate-50 text-slate-400 border border-transparent hover:bg-slate-100';
  }

  if (solvedCount === 1) {
    return 'bg-blue-100 text-blue-700 border border-blue-200 shadow-sm';
  }

  if (solvedCount === 2) {
    return 'bg-blue-300 text-blue-950 border border-blue-300 shadow-sm';
  }

  return 'bg-blue-600 text-white border border-blue-700 shadow-sm';
};

const StreakCalendar = ({ year, month, days = {}, streak = 0 }) => {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const blanks = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const monthName = firstDay.toLocaleString('default', { month: 'long' });

  const cells = [];
  for (let i = 0; i < blanks; i++) cells.push(null);
  for (let i = 1; i <= totalDays; i++) cells.push(i);

  const formatDate = (day) => {
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  return (
    <div className="card card-body">
      <div className="flex items-center justify-between mb-5">
        <h3 className="section-title">{monthName} {year}</h3>
        <span className="badge badge-blue">🔥 {streak} day streak</span>
      </div>

      <div className="grid grid-cols-7 gap-1.5 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-[.65rem] text-center text-slate-400 font-semibold uppercase tracking-wider py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, index) => {
          if (!day) return <div key={`blank-${index}`} className="h-9" />;

          const key = formatDate(day);
          const item = days[key];
          const solvedCount = (item?.quizCount || 0) + (item?.dsaCount || 0);

          return (
            <div
              key={key}
              className={`h-9 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-200 ${getDayStyle(
                solvedCount
              )}`}
              title={
                solvedCount
                  ? `Solved: ${solvedCount} | Quiz: ${item.quizCount || 0}, DSA: ${item.dsaCount || 0}, Notes: ${
                      item.noteCount || 0
                    }`
                  : ''
              }
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StreakCalendar;