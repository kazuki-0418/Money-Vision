import { cn } from "../../lib/utils";

export function Table({
  className,
  maxHeight = "300px",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { maxHeight?: string }) {
  return (
    <div className="border border-gray-200 rounded-lg w-full overflow-hidden">
      <div
        className="w-full"
        style={{
          maxHeight,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "#d1d5db transparent",
        }}
      >
        <table
          className={cn("w-full text-sm", className)}
          style={{ tableLayout: "fixed", width: "100%", padding: "0 1rem" }}
        >
          {props.children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn("bg-gray-100 sticky top-0 z-10", className)} {...props}>
      {props.children}
    </thead>
  );
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("[&>tr:nth-child(even)]:bg-[#e1f5f3]", className)} {...props}>
      {props.children}
    </tbody>
  );
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b border-gray-200", className)} {...props} />;
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn("px-4 py-3 text-left font-medium text-gray-800", className)} {...props} />
  );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-4 py-3", className)} {...props} />;
}

export function TableRowHeaderCell({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn("px-4 py-3 font-medium text-left", className)} {...props} />;
}

export function StatusBadge({ status }: { status: "Failed" | "Success" }) {
  return (
    <span
      className={cn(
        "px-3 py-1 text-xs rounded-md inline-flex items-center",
        status === "Failed"
          ? "bg-red-100 text-red-500 border border-red-200"
          : "bg-green-100 text-green-500 border border-green-200",
      )}
    >
      • {status}
    </span>
  );
}
