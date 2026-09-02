import Image from "next/image";
import { exampleProjects } from "../lib/marketplace-data";

export default function ExampleProjects() {
  return (
    <section id="projects" className="bg-white py-24">
      <div className="mx-auto w-[calc(100%-48px)] max-w-[1400px] px-6 sm:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
            Featured projects
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#111111] sm:text-4xl">
            Real orders from boutique brands.
          </h2>
          <p className="mt-4 text-base leading-8 text-[#7C7A74]">
            See the kinds of small-batch runs brands are sourcing through the
            marketplace.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {exampleProjects.map((project) => (
            <article
              key={project.title}
              className="flex h-full flex-col overflow-hidden rounded-[32px] border border-[#E5E0D8] bg-white"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#F6F3EE]">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-4 p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex rounded-full bg-[#EEF1E8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#7C8A6A]">
                    {project.category}
                  </span>
                  <span className="text-xs font-medium text-[#7C7A74]">
                    {project.delivery}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#111111]">
                  {project.title}
                </h3>
                <div className="grid gap-3 text-sm text-[#7C7A74] sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-[#111111]">Quantity</p>
                    <p className="mt-1">{project.quantity}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Budget</p>
                    <p className="mt-1">{project.budget}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Timeline</p>
                    <p className="mt-1">{project.timeline}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Delivery</p>
                    <p className="mt-1">{project.delivery}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
