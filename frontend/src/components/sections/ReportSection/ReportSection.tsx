import type { JSX } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

export function ReportSection(): JSX.Element {
  // Data for the report section
  const newsData = {
    title: "News",
    headline:
      "Concerns Over Global Supply Chain Disruption as Major Ports Ramp Up Container Operations",
    image: "/dominik-luckmann-4aoha4ptiy4-unsplash-1.png",
  };

  const reportData = {
    title: "Report",
    chartImage: "/a99b36c3482c808ee1c79bc53b776be5a9c16f3f631657e09be106dd183e08de.png",
  };

  return (
    <div className="flex flex-auto flex-col h-full gap-6">
      {/* News card */}
      <Card className="flex-1 border-[#8888888] border-[0.5px] overflow-hidden">
        <CardHeader className="bg-white p-4">
          <CardTitle className="text-xl font-medium leading-[22px]">{newsData.title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-64px)] p-0">
          <div
            className="bg-center bg-cover h-full relative"
            style={{ backgroundImage: `url(${newsData.image})` }}
          >
            <div className="text-white text-xl absolute bottom-5 font-medium leading-[22px] left-[15px] right-[15px]">
              {newsData.headline}
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Report card */}
      <Card className="flex-1 border-[#88888888] border-[0.5px] overflow-hidden">
        <CardHeader className="bg-white p-4">
          <CardTitle className="text-xl font-medium leading-[22px]">{reportData.title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-64px)] p-0">
          <img
            className="h-full w-full object-cover"
            alt="Report chart"
            src={reportData.chartImage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
