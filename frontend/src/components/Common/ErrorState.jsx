const ErrorState = ({ message = 'Something went wrong.' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-2xl mb-4">⚠️</div>
      <p className="text-sm font-medium text-red-600 text-center max-w-md">{message}</p>
    </div>
  );
};

export default ErrorState;