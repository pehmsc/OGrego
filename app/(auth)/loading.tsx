export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-sm px-6 pt-28 pb-10">
      <div className="grid gap-6">
        <div className="h-10 w-44 mx-auto animate-pulse rounded-xl bg-[#1E3A8A]/10" />
        <div className="h-8 w-56 mx-auto animate-pulse rounded-xl bg-[#1E3A8A]/10" />

        <div className="grid gap-4 rounded-3xl border border-[#1E3A8A]/15 bg-[#F4F7FB] p-6">
          <div className="h-11 w-full animate-pulse rounded-xl bg-[#1E3A8A]/10" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-[#1E3A8A]/10" />
          <div className="h-4 w-40 mx-auto animate-pulse rounded-xl bg-[#1E3A8A]/10" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-[#1E3A8A]/10" />
          <div className="h-11 w-full animate-pulse rounded-xl bg-[#1E3A8A]/10" />
          <div className="h-11 w-full animate-pulse rounded-full bg-[#1E3A8A]/10" />
        </div>
      </div>
    </div>
  );
}
