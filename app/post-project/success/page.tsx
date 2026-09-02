import Link from "next/link";
import { Check } from "lucide-react";
import Header from "../../../components/Header";

export default function ProjectSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F6F3EE] text-[#1F2937]">
      <Header compact />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-4xl items-center px-4 py-20 sm:px-8">
        <section className="w-full rounded-[32px] border border-[#E5E0D8] bg-white p-8 text-center shadow-sm sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EAF2EC] text-[#3F684F]"><Check size={26} /></div>
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">Flow complete</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[#111111] sm:text-5xl">Your project is ready</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#7C7A74]">The project submission flow is complete. Final account assignment and maker matching will be connected when the backend is added.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/" className="inline-flex items-center justify-center rounded-full border border-[#E5E0D8] bg-white px-6 py-3 text-sm font-semibold text-[#1F2937] transition hover:bg-[#EEF1E8]">Back to home</Link>
            <Link href="/find-makers" className="inline-flex items-center justify-center rounded-full border border-[#E5E0D8] bg-white px-6 py-3 text-sm font-semibold text-[#1F2937] transition hover:bg-[#EEF1E8]">Find Makers</Link>
            <Link href="/post-project?new=1" className="inline-flex items-center justify-center rounded-full bg-[#7C8A6A] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#667255]">Create another project</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
