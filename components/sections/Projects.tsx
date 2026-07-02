import ProjectCard from "@/components/ui/ProjectCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { projects } from "@/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="relative scroll-mt-24 py-28 md:py-36">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-purple/30 to-transparent"
      />
      <div
        aria-hidden
        className="absolute left-1/2 top-24 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-neon-purple/[0.06] blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading
          index="02"
          eyebrow="PROJECT UNIVERSE"
          title="Systems in the field"
          description="Mission cards from every domain I build in — mobile, embedded, robotics, commerce, optimization and education. Each one is a real system with real constraints."
        />

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
