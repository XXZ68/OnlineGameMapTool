
export function SimpleSectionCard({ children }) {
  return (
    <section className="p-6 my-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      
      <div className="leading-relaxed">
        {children}
      </div>
    </section>
  );
}
