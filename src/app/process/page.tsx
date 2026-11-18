import { CtaBand, PageIntro } from "@/components/shared";
import { ProcessTimeline } from "@/components/process-timeline";

export const metadata = {
  title: "Manufacturing Process",
  description:
    "Follow the six stages of making submersible copper winding wire at Infinite Wires.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  return (
    <>
      <PageIntro
        eyebrow="Process"
        title={
          <>
            From copper to <em>finished</em> wire.
          </>
        }
        description="Every length is made around one idea: a single copper conductor, finished soft and smooth. Scroll to follow the wire through the line."
      />
      <section className="section process-section">
        <div className="wrap">
          <ProcessTimeline />
        </div>
      </section>
      <CtaBand
        title={
          <>
            See it in <em>your</em> winding room.
          </>
        }
      >
        Order a batch in the sizes you need.
      </CtaBand>
    </>
  );
}
