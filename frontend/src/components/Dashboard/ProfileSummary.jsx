const ProfileSummary = ({ profile }) => {
  if (!profile) return null;

  return (
    <div className="card card-body">
      <h3 className="section-title mb-5">Profile Summary</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">📝</span>
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Quiz Stats</p>
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{profile.quiz?.total || 0}</p>
          <p className="text-xs text-slate-500 mt-2">
            Best: {profile.quiz?.bestScore || 0}% · Avg: {profile.quiz?.averageScore || 0}%
          </p>
        </div>

        <div className="rounded-xl bg-emerald-50/60 border border-emerald-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">💻</span>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">DSA Solved</p>
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{profile.dsa?.total || 0}</p>
          <p className="text-xs text-slate-500 mt-2">problems completed</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSummary;