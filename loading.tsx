export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background-light dark:bg-background-dark font-display">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="spinner" />
        <p className="text-lg font-medium text-background-dark dark:text-background-light">
          Loading...
        </p>
      </div>

      <style jsx>{`
        .spinner {
          width: 56px;
          height: 56px;
          border: 8px solid;
          border-color: #38e07b transparent #38e07b transparent;
          border-radius: 50%;
          animation: spin-anim 1.2s linear infinite;
        }
        @keyframes spin-anim {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
