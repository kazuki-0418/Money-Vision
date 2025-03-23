import { Tooltip as RadixTooltip } from "radix-ui";

type Props = {
  children: React.ReactNode;
  content: React.ReactNode;
};

export function Tooltip({ children, content }: Props) {
  return (
    <RadixTooltip.Provider delayDuration={100}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content className="TooltipContent" sideOffset={5}>
            {content}
            <RadixTooltip.Arrow width={0} height={0} />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
