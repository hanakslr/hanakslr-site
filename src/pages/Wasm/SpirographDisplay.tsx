import { useEffect, useState } from "react";
import init, { Spirograph } from "./pkg/spirograph_wasm";
import { Tab, TabGroup, TabList } from "@headlessui/react";

interface DrawingOptions {
  innerRadius: number;
  phaseAngle: number;
  offset: number;
  color: string;
}

interface Display {
  title: string;
  description: string;
  drawings: DrawingOptions[];
}

const OPTIONS: Display[] = [
  {
    title: "2 rotations",
    description: "The common factor is 4",
    drawings: [
      {
        innerRadius: 20,
        phaseAngle: 0,
        offset: 25,
        color: "#3b82f6",
      },
    ],
  },
  {
    title: "Single rotation",
    description:
      "An offset of 0 with a radius that is a multiple of the fixed radius only makes 1 rotation.",
    drawings: [
      {
        innerRadius: 50,
        phaseAngle: 0,
        offset: 0,
        color: "#ec4899",
      },
    ],
  },
  {
    title: "Many rotation",
    description:
      "Prime numbers and those with high common factors make many rotations",
    drawings: [
      {
        innerRadius: 13,
        phaseAngle: 0,
        offset: 37,
        color: "#f0abfc",
      },
    ],
  },
  {
    title: "Combos",
    description: "Just some pretty combinations",
    drawings: [
      {
        innerRadius: 26,
        phaseAngle: 0,
        offset: -84,
        color: "#8b5cf6",
      },
      {
        innerRadius: 126,
        phaseAngle: 0,
        offset: 63,
        color: "#0d9488",
      },
      {
        innerRadius: 20,
        phaseAngle: 0,
        offset: 25,
        color: "#f97316",
      },
    ],
  },
];

export const SpirographDisplay = () => {
  const [index, setIndex] = useState(0);
  const [spiro, setSpiro] = useState<Spirograph>();

  useEffect(() => {
    init().then(() => {
      const newSpiro = new Spirograph("canvas-display");
      setSpiro(newSpiro);
    });
  }, []);

  useEffect(() => {
    if (!spiro) return;

    spiro.clear();

    OPTIONS[index].drawings.forEach((o) =>
      spiro.draw_single(o.innerRadius, o.offset, o.phaseAngle, o.color),
    );
  }, [index, spiro]);

  return (
    <div className="w-full rounded-lg bg-slate-800 p-4">
      <TabGroup selectedIndex={index} onChange={setIndex}>
        <TabList className="flex items-center gap-4">
          {OPTIONS.map((o, index) => (
            <Tab
              key={index}
              className="rounded-full px-3 py-1 text-sm/6 font-semibold text-white focus:outline-none data-[hover]:bg-white/5 data-[selected]:bg-white/10 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
            >
              {o.title}
            </Tab>
          ))}
        </TabList>
      </TabGroup>
      <div className="p-4 text-white">{OPTIONS[index].description}</div>
      <canvas id={"canvas-display"} width={600} height={600}></canvas>
      <div className="mt-4 flex flex-row gap-4 text-sm">
        {OPTIONS[index].drawings.map((drawing, i) => (
          <div
            key={i}
            className="mb-2 flex flex-col"
            style={{ color: drawing.color }}
          >
            <div>Inner Radius: {drawing.innerRadius}</div>
            <div>Phase Angle: {drawing.phaseAngle}</div>
            <div>Offset: {drawing.offset}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
