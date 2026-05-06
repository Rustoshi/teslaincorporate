import FullScreenSplit from "@/components/FullScreenSplit";
import BrandMark from "@/components/BrandMark";
import AmbientParticles from "@/components/AmbientParticles";

export default function Home() {
  return (
    <main className="w-full h-[100dvh] bg-black p-0 m-0 relative overflow-hidden">
      <BrandMark />
      <AmbientParticles />
      <FullScreenSplit />
    </main>
  );
}
