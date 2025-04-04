import { useEffect, useState } from "react";
import init, { DrawingSpec, Spirograph } from "./pkg/spirograph_wasm";
import Input from "../../components/Input";
import ColorPicker from "../../components/ColorPicker";
import Button from "../../components/Button";
import Label from "../../components/Label";

export const WasmPage = () => {
  const [spiro, setSpiro] = useState<Spirograph>();
  const [values, setValues] = useState<DrawingSpec>({
    innerRadius: 25,
    phaseAngle: 0,
    offset: 50,
    color: "#f0abfc",
  });

  useEffect(() => {
    init().then(() => {
      const newSpiro = new Spirograph("spiro-canvas");
      newSpiro.draw_single(values);
      setSpiro(newSpiro);
    });
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl"
      style={{
        border: `2px solid ${values.color}`,
      }}
    >
      <canvas id="spiro-canvas" width="600" height="600"></canvas>
      <div className="grid grid-cols-2 gap-4 px-4 lg:grid-cols-3">
        <Input
          value={values.innerRadius}
          onChange={(v) =>
            setValues({ ...values, innerRadius: parseInt(v.target.value) })
          }
          step={1}
          id="inner-r"
          label="Inner Radius"
          type="number"
        />
        <Input
          value={values.phaseAngle}
          onChange={(v) =>
            setValues({ ...values, phaseAngle: parseInt(v.target.value) })
          }
          step={1}
          id="phase-angle"
          label="Phase Angle"
          type="number"
        />
        <Input
          type="number"
          value={values.offset}
          onChange={(v) =>
            setValues({ ...values, offset: parseInt(v.target.value) })
          }
          step={1}
          id="offset"
          label="Offset"
        />
        <div className="flex flex-row items-center gap-2">
          <Label>Color:</Label>
          <ColorPicker
            value={values.color}
            onChange={(v) => setValues({ ...values, color: v.target.value })}
            id="color"
            type="color"
          />
        </div>

        <div className="col-span-full flex flex-row gap-2 pb-4 pt-2">
          <Button
            style={{
              backgroundColor: values.color,
            }}
            name="Draw"
            onClick={() =>
              spiro?.draw_single(
                values.innerRadius,
                values.offset,
                values.phaseAngle,
                values.color,
              )
            }
          >
            Draw
          </Button>
          <Button
            style={{
              backgroundColor: values.color,
            }}
            name="Clear"
            onClick={() => spiro?.clear()}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
