import { useSignal } from "@preact/signals";

export default function ProgramInput({
  name,
  placeholder,
  initValue,
  deletePrograms,
}: {
  name: string;
  placeholder: string | undefined;
  initValue: string;
  deletePrograms: () => void;
}) {
  const textValue = useSignal(initValue);

  return (
    <div className="mt-3">
      <div className="relative w-full max-w-sm">
        <input
          type="text"
          name={name}
          value={textValue}
          className="w-full rounded-lg border px-4 py-2 pr-10 shadow outline-none hover:border-gray-500"
          placeholder={placeholder}
          onChange={(e) => textValue.value = e.currentTarget.value}
        />
        <button
          type="button"
          onClick={() => deletePrograms()}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            width="16"
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
