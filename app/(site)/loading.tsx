export default function Loading() {
  return (
    <section className="grid gap-10">
      <div className="grid gap-4">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-[#1E3A8A]/10" />
        <div className="h-6 w-[70%] animate-pulse rounded-xl bg-[#1E3A8A]/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-3xl bg-[#1E3A8A]/10" />
        <div className="h-72 animate-pulse rounded-3xl bg-[#1E3A8A]/10" />
      </div>
    </section>
  );
}
