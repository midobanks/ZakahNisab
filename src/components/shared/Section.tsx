export function Section({ title, description, children }: { title?: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      {title && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}
