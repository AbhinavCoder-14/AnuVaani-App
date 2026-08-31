import { Layers, TrendingUp } from "lucide-react";

const chartPoints = [
  { x: 0, y: 72 },
  { x: 1, y: 58 },
  { x: 2, y: 64 },
  { x: 3, y: 42 },
  { x: 4, y: 28 },
];

const months = ["Jan", "Feb", "Mar", "Apr", "May"];

function VisitStatisticsChart() {
  const width = 320;
  const height = 120;
  const paddingX = 8;
  const paddingY = 16;
  const plotWidth = width - paddingX * 2;
  const plotHeight = height - paddingY * 2;

  const coords = chartPoints.map((point, index) => {
    const x = paddingX + (index / (chartPoints.length - 1)) * plotWidth;
    const y = paddingY + (point.y / 100) * plotHeight;
    return { x, y };
  });

  const linePath = coords.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");

  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white p-4">
      <p className="text-sm font-light text-[#999]">Visit statistics</p>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 h-[120px] w-full" aria-hidden>
        <path
          d={linePath}
          fill="none"
          stroke="#FFD026"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {coords.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="10" fill="#FFD026" opacity="0.25" />
            <circle cx={point.x} cy={point.y} r="5" fill="#FFD026" />
          </g>
        ))}
        {months.map((month, index) => {
          const x = paddingX + (index / (months.length - 1)) * plotWidth;
          return (
            <text
              key={month}
              x={x}
              y={height - 2}
              textAnchor="middle"
              className="fill-[#999] text-[11px] font-light"
            >
              {month}
            </text>
          );
        })}
      </svg>
      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-[#fe4a22] px-3 py-2 text-white shadow-[0_8px_20px_rgba(254,74,34,0.35)]">
        <span className="text-xs font-light">Rate</span>
        <span className="text-lg font-normal leading-none">+ 58%</span>
      </div>
    </div>
  );
}

export function AnalyticsAccessCard() {
  return (
    <article className="flex min-h-[380px] w-full flex-col overflow-hidden rounded-[38px] border border-[#e6e6e6] bg-white shadow-[0_38px_36px_-46px_rgba(205,204,204,0.6)] lg:min-h-[459px] lg:flex-row lg:items-end lg:justify-between lg:pl-11 lg:pt-11">
      <div className="flex flex-col px-6 pb-8 pt-8 lg:max-w-[300px] lg:px-0 lg:pb-12 lg:pt-0">
        <span className="inline-flex w-fit rounded-xl bg-[#ffd026] px-4 py-2 text-base font-light text-[#1a1a1a] shadow-[0_15px_24px_#ccac3a] md:text-[19px]">
          Setting up reports
        </span>
        <div className="mt-16 md:mt-[92px]">
          <h3 className="text-[clamp(1.5rem,2.2vw,1.78rem)] font-normal leading-[1.3] tracking-[-0.02em] text-[#1a1a1a]">
            Fast and easy access
          </h3>
          <h3 className="text-[clamp(1.5rem,2.2vw,1.78rem)] font-normal leading-[1.3] tracking-[-0.02em] text-[#1a1a1a]">
            to analytics
          </h3>
        </div>
        <p className="mt-5 max-w-[308px] text-base font-light leading-[1.5] text-[#999] md:text-[19px] md:leading-[1.5]">
          One platform is a comprehensive system of solutions that will be the first step towards
          digitalization of your business!
        </p>
      </div>

      <div className="relative w-full shrink-0 overflow-hidden bg-[#f9f9f9] lg:w-[406px] lg:rounded-tl-[24px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-40 -top-36 size-[325px] rounded-full bg-[#c8c8c8] blur-[50px]"
        />
        <div className="relative flex min-h-[360px] flex-col justify-between rounded-tl-[24px] bg-white p-5 md:min-h-[410px] md:p-6">
          <div>
            <p className="text-base font-medium text-[#1a1a1a] md:text-[19px]">Sales statistic</p>
            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[#fe4a22] md:size-[61px]">
                  <Layers className="size-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <p className="text-sm font-light text-[#999] md:text-[15px]">Total profit</p>
                  <p className="text-[#1a1a1a]">
                    <span className="text-xl md:text-[23px]">$ </span>
                    <span className="text-2xl font-normal md:text-[32px]">264.2</span>
                    <span className="text-2xl font-normal md:text-[32px]">K</span>
                  </p>
                </div>
              </div>

              <div className="w-[154px] rounded-2xl bg-[#f2f2f2] p-4">
                <p className="text-sm font-normal text-[#1a1a1a]">Visitors</p>
                <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-[#e6e6e6]">
                  <div className="h-full w-[40%] rounded-full bg-[#48c884]" />
                </div>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-2xl font-light leading-none text-[#1a1a1a] md:text-[29px]">
                    56K
                  </span>
                  <TrendingUp className="mb-1 size-4 text-[#48c884]" strokeWidth={2} />
                  <span className="mb-1 text-[10px] font-light text-[#48c884]">+14%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-5 h-[170px] overflow-hidden rounded-2xl bg-[#f9f9f9] md:mt-6 md:h-[193px]">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -top-16 size-[179px] rounded-full bg-[#c8c8c8] blur-[50px]"
            />
            <VisitStatisticsChart />
          </div>
        </div>
      </div>
    </article>
  );
}
