const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-10 h-10 border-[3px] border-blue-200 border-t-blue-600 rounded-full animate-spin-slow mb-4" />
      <p className="text-sm font-medium text-slate-500">{text}</p>
    </div>
  );
};

export default Loading;