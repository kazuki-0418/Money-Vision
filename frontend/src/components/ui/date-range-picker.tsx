import * as Popover from "@radix-ui/react-popover";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import type React from "react";
import { useEffect, useState } from "react";
import {
  IoCalendarOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { cn } from "../../lib/utils";

export type DateRange = {
  from?: Date;
  to?: Date;
};

export type DateRangePickerProps = {
  value: DateRange;
  onChange: (dateRange: DateRange) => void;
  className?: string;
};

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<DateRange>(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectionState, setSelectionState] = useState<"start" | "end">("start");

  const handleDateSelect = (date: Date) => {
    if (selectionState === "start") {
      const newValue = { from: date, to: undefined };
      setInternalValue(newValue);
      setSelectionState("end");
    } else {
      if (internalValue.from && isBefore(date, internalValue.from)) {
        const newValue = { from: date, to: internalValue.from };
        setInternalValue(newValue);
        onChange(newValue);
        setIsOpen(false);
        setSelectionState("start");
      } else {
        const newValue = { ...internalValue, to: date };
        setInternalValue(newValue);
        onChange(newValue);
        setIsOpen(false);
        setSelectionState("start");
      }
    }
  };

  const handleClear = () => {
    const newValue = { from: undefined, to: undefined };
    setInternalValue(newValue);
    onChange(newValue);
    setSelectionState("start");
  };

  const isInRange = (date: Date) => {
    if (!internalValue.from) return false;
    if (!internalValue.to) return false;
    return (
      isAfter(startOfDay(date), startOfDay(internalValue.from)) &&
      isBefore(startOfDay(date), startOfDay(internalValue.to))
    );
  };

  const isSelected = (date: Date) => {
    if (!internalValue.from && !internalValue.to) return false;

    if (
      internalValue.from &&
      startOfDay(date).getTime() === startOfDay(internalValue.from).getTime()
    ) {
      return true;
    }

    if (internalValue.to && startOfDay(date).getTime() === startOfDay(internalValue.to).getTime()) {
      return true;
    }

    return false;
  };

  const generateCalendarDays = (year: number, month: number): Date[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysFromPrevMonth = firstDay.getDay();
    const prevMonthDays: Date[] = [];
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      prevMonthDays.push(date);
    }

    const currentMonthDays: Date[] = [];
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      currentMonthDays.push(date);
    }

    const daysFromNextMonth = 6 - lastDay.getDay();
    const nextMonthDays: Date[] = [];
    for (let i = 1; i <= daysFromNextMonth; i++) {
      const date = new Date(year, month + 1, i);
      nextMonthDays.push(date);
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const displayValue = () => {
    if (internalValue.from && internalValue.to) {
      return `${format(internalValue.from, "MMM dd, yyyy")} - ${format(internalValue.to, "MMM dd, yyyy")}`;
    }
    if (internalValue.from) {
      return `${format(internalValue.from, "MMM dd, yyyy")} - Select end date`;
    }
    if (internalValue.to) {
      return `Select start date - ${format(internalValue.to, "MMM dd, yyyy")}`;
    }
    return "Select date range";
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          className={cn(
            "flex h-10 items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <div className="flex items-center gap-2">
            <IoCalendarOutline className="h-4 w-4 opacity-70" />
            <span>{displayValue()}</span>
          </div>
          {(value.from || value.to) && (
            <button
              className="ml-2 text-gray-400 hover:text-gray-500"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              <IoCloseOutline className="h-4 w-4" />
            </button>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-auto rounded-md border bg-white p-4 text-black shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          sideOffset={4}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {selectionState === "start" ? "Select start date" : "Select end date"}
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={goToPreviousMonth}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <IoChevronBackOutline className="h-4 w-4" />
                </button>
                <button
                  onClick={goToNextMonth}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <IoChevronForwardOutline className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="text-center font-medium py-1">
                {format(currentMonth, "MMMM yyyy")}
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                <div className="py-1">Su</div>
                <div className="py-1">Mo</div>
                <div className="py-1">Tu</div>
                <div className="py-1">We</div>
                <div className="py-1">Th</div>
                <div className="py-1">Fr</div>
                <div className="py-1">Sa</div>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()).map(
                  (date) => {
                    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();

                    return (
                      <button
                        key={date.getTime()}
                        onClick={() => handleDateSelect(date)}
                        className={cn(
                          "h-8 w-8 rounded-md text-center text-sm p-0 font-normal",
                          "hover:bg-gray-100 hover:!bg-gray-100",
                          !isCurrentMonth && "text-gray-400",
                          isSelected(date) &&
                            "bg-primary text-primary-foreground font-medium hover:!bg-primary/80",
                          isInRange(date) && "bg-primary/20 hover:!bg-primary/30",
                          internalValue.from &&
                            startOfDay(date).getTime() ===
                              startOfDay(internalValue.from).getTime() &&
                            "rounded-l-md",
                          internalValue.to &&
                            startOfDay(date).getTime() === startOfDay(internalValue.to).getTime() &&
                            "rounded-r-md",
                        )}
                      >
                        {date.getDate()}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
                onClick={handleClear}
              >
                Clear
              </button>

              {internalValue.from && (
                <div className="text-sm">
                  {selectionState === "start"
                    ? "Select start date"
                    : `${format(internalValue.from, "MMM dd, yyyy")} - Select end date`}
                </div>
              )}
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
