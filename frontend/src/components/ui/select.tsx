import * as Form from "@radix-ui/react-form";
import * as RadixSelect from "@radix-ui/react-select";

interface SelectOption {
  id: string;
  name: string;
}

interface CustomSelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (name: string, value: string) => void;
  placeholder?: string;
  errorMessage?: string;
  required?: boolean;
  className?: string;
}

export function Select({
  label,
  name,
  options,
  value,
  onChange,
  placeholder = "Select an option",
  errorMessage = "This field is required",
  required = false,
  className = "",
}: CustomSelectProps) {
  return (
    <Form.Field name={name} className={className}>
      <div className="flex items-baseline justify-between">
        <Form.Label className="text-sm font-medium">{label}</Form.Label>
        {required && (
          <Form.Message className="text-xs text-red-500" match="valueMissing">
            {errorMessage}
          </Form.Message>
        )}
      </div>
      <RadixSelect.Root
        onValueChange={(selectedValue) => onChange(name, selectedValue)}
        value={value}
        name={name}
        required={required}
      >
        <RadixSelect.Trigger className="w-full inline-flex items-center justify-between border border-gray-300 rounded-md px-4 py-2.5 text-sm bg-white hover:border-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 focus:outline-none transition-colors">
          <RadixSelect.Value placeholder={placeholder} className="text-gray-700" />
          <RadixSelect.Icon>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-500"
            >
              <title>Dropdown Icon</title>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content
            position="popper"
            className="bg-white rounded-md shadow-lg border border-gray-200 p-1 z-50 overflow-hidden"
            sideOffset={4}
          >
            <RadixSelect.ScrollUpButton className="flex items-center justify-center h-7 bg-white text-gray-700 cursor-default">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Scroll Up</title>
                <path d="M18 15l-6-6-6 6" />
              </svg>
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport>
              {options.length > 0 ? (
                options.map((option) => (
                  <RadixSelect.Item
                    key={option.id}
                    value={option.id}
                    className="text-sm px-4 py-2.5 rounded-md cursor-pointer text-gray-700 outline-none data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900 data-[selected]:font-medium"
                  >
                    <RadixSelect.ItemText>{option.name}</RadixSelect.ItemText>
                  </RadixSelect.Item>
                ))
              ) : (
                <div className="text-sm px-4 py-2.5 text-gray-500 italic">No options available</div>
              )}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton className="flex items-center justify-center h-7 bg-white text-gray-700 cursor-default">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>Scroll Down</title>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </Form.Field>
  );
}
