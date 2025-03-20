import type { JSX } from "react";
import { IoDownloadOutline } from "react-icons/io5";
import { Button } from "../../components/ui/button";
import { DashboardSection } from "../sections/DashboardSection/DashboardSection";
import { ReportSection } from "../sections/ReportSection/ReportSection";
import { SummarySection } from "../sections/SummarySection/SummarySection";

export function Goals(): JSX.Element {
  return (
    <main className="flex bg-[#f8f8f8] h-screen w-full">
      <div className="flex-1 h-screen w-[calc(100%-278px)] pl-[278px]">
        <div className="flex flex-col h-full p-6 gap-6 overflow-y-auto">
          <div className="flex justify-end">
            <Button
              variant="outline"
              className="flex bg-white border border-gray-200 rounded-md gap-2 items-center"
            >
              <IoDownloadOutline className="color h-4 text-green-950 w-4" />
              <span className="text-green-950 font-medium">Import</span>
            </Button>
          </div>

          <div className="flex gap-6 overflow-auto">
            <div className="flex flex-2 flex-col gap-6">
              <SummarySection />
              <DashboardSection />
            </div>

            <div className="flex-1 w-[300px]">
              <ReportSection />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
