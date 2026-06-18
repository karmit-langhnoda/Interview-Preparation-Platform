const EmptyState = ({ message = 'No data found.' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-2xl mb-4">📭</div>
      <p className="text-sm font-medium text-slate-500 text-center max-w-md">{message}</p>
    </div>
  );
};

export default EmptyState;