import { useState } from "preact/hooks";
import SaveButton from "../components/SaveButton.tsx";
import ProgramInput from "./ProgramInput.tsx";
import { ProgramTitle } from "../backend/schema.ts";

export default function ProgramForm(
  { initialPrograms }: { initialPrograms: ProgramTitle },
) {
  const [programs, setPrograms] = useState(initialPrograms.programs);

  const createDeletePrograms = (deleteIndex: number) => {
    return () => {
      setPrograms(programs.filter((_, index) => index !== deleteIndex));
    };
  };

  return (
    <form method="post">
      <div className="mt-3">
        {programs.map((program, index) => (
          <ProgramInput
            name="programs"
            placeholder="Programs"
            value={program.title}
            key={index}
            deletePrograms={createDeletePrograms(index)}
          />
        ))}
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setPrograms([...programs, { title: "" }]);
            }}
            className="h-8 whitespace-nowrap rounded-md border border-gray-200 bg-gray-100 px-3.5 leading-none text-gray-900  transition-colors duration-150 ease-in-out hover:border-gray-300 hover:bg-gray-200"
          >
            Add Fields
          </button>
          <SaveButton isDisabled={false} />
        </div>
      </div>
    </form>
  );
}
