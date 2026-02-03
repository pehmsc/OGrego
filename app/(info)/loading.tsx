export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-3xl px-6 pt-28 pb-10">
      <div className="grid gap-6">
        <div className="h-10 w-72 animate-pulse rounded-xl bg-[#1E3A8A]/10" />
        <div className="grid gap-3">
          <div className="h-5 w-full animate-pulse rounded-xl bg-[#1E3A8A]/10" />
          <div className="h-5 w-[92%] animate-pulse rounded-xl bg-[#1E3A8A]/10" />
          <div className="h-5 w-[85%] animate-pulse rounded-xl bg-[#1E3A8A]/10" />
        </div>

        <div className="h-8 w-56 animate-pulse rounded-xl bg-[#1E3A8A]/10" />
        <div className="grid gap-3">
          <div className="h-5 w-full animate-pulse rounded-xl bg-[#1E3A8A]/10" />
          <div className="h-5 w-[88%] animate-pulse rounded-xl bg-[#1E3A8A]/10" />
          <div className="h-5 w-[80%] animate-pulse rounded-xl bg-[#1E3A8A]/10" />
        </div>
      </div>
    </section>
  );
}
