export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3 rounded-xl border border-gray-200 bg-white p-5">
      <div className="h-4 w-2/3 rounded bg-gray-200" />
      <div className="h-8 w-1/2 rounded bg-gray-200" />
      <div className="h-3 w-full rounded bg-gray-200" />
    </div>
  );
}
