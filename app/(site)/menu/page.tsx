import MenuViewer from "../../ui/components/MenuViewer";

export default function MenuPage() {
  return (
    <section className="grid gap-8">
      <header className="grid gap-4">
        <h1 className="text-4xl font-semibold tracking-tight text-[#1E3A8A] sm:text-5xl">
          Menu
        </h1>
      </header>

      <MenuViewer
        ptSrc="/menu/OGregoMenu_pt.pdf"
        enSrc="/menu/OGregoMenu_en.pdf"
      />
    </section>
  );
}
