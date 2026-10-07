
export function SimpleSectionCard({ children, className = "" }) {
  return (
    <section className="p-6 my-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      
      <div className={`leading-relaxed ${className}`}>
        {children}
      </div>
    </section>
  );
}
