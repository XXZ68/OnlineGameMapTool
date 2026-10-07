
export function SectionCard({ title, children, badge }) {
  return (
    <section className="p-6 my-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        {badge && (
          <span className="px-2 py-2 text-xs font-semibold rounded-full bg-blue-50 text-blue-600">
            {badge}
          </span>
        )}
      </div>
      <div className="leading-relaxed">
        {children}
      </div>
    </section>
  );
}
