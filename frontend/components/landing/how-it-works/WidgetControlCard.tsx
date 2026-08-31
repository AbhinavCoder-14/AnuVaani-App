import type { ReactNode } from "react";

import Image from "next/image";

import { Layers, TrendingUp } from "lucide-react";

function WidgetTile({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={`relative size-[clamp(140px,38vw,192px)] overflow-hidden rounded-[38px] bg-[#131111] ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-10 h-[192px] w-[288px] rounded-full bg-[#4b4a4a] blur-[40px]"
      />
      <div
        className={`relative flex size-full flex-col rounded-[37px] border border-[#1f1f1f] bg-[#131111] ${innerClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

function LayersWidget() {
  return (
    <WidgetTile innerClassName="items-center justify-center gap-5">
      <div className="flex flex-col items-center gap-1">
        <Layers className="size-8 text-[#ffd026]" strokeWidth={1.5} />
        <Layers className="-mt-5 size-8 text-[#ffd026]/80" strokeWidth={1.5} />
        <Layers className="-mt-5 size-8 text-[#ffd026]/60" strokeWidth={1.5} />
      </div>
      <div className="flex items-center pl-2">
        <div className="relative size-11 overflow-hidden rounded-full border-2 border-[#131111]">
          <Image
            src="/images/how-it-works/widgets/avatar-1.png"
            alt=""
            width={46}
            height={46}
            className="size-full object-cover"
          />
        </div>
        <div className="-ml-3 relative size-11 overflow-hidden rounded-full border-2 border-[#131111]">
          <Image
            src="/images/how-it-works/widgets/avatar-2.png"
            alt=""
            width={46}
            height={46}
            className="size-full object-cover"
          />
        </div>
      </div>
    </WidgetTile>
  );
}

function TransactionsWidget() {
  return (
    <WidgetTile innerClassName="items-start justify-end p-6">
      <p className="text-sm font-normal text-white">Transactions</p>
      <div className="mt-auto flex items-end gap-1">
        <span className="text-[clamp(2.5rem,8vw,3.85rem)] font-normal leading-none text-white">
          43K
        </span>
        <TrendingUp className="mb-2 size-4 text-[#48c884]" strokeWidth={2} />
        <span className="mb-2 text-[10px] font-light text-[#48c884]">+14%</span>
      </div>
    </WidgetTile>
  );
}

export function WidgetControlCard() {
  return (
    <article className="flex min-h-[420px] w-full flex-col items-center justify-center gap-8 overflow-hidden rounded-[38px] bg-[#0d0d0d] px-6 py-10 shadow-[0_31px_36px_-15px_rgba(205,204,204,0.6)] md:min-h-[459px] md:gap-[31px] md:px-8">
      <div className="flex flex-wrap items-start justify-center gap-2.5">
        <LayersWidget />
        <TransactionsWidget />
      </div>

      <div className="max-w-[369px] text-center">
        <h3 className="text-[clamp(1.5rem,2.2vw,1.78rem)] font-normal leading-[1.3] tracking-[-0.02em] text-white">
          Widget control
        </h3>
        <p className="mt-4 text-base font-light leading-[1.5] text-[#999] md:text-[19px]">
          Reports provide a comprehensive overview of important aspects of web analytics
        </p>
      </div>
    </article>
  );
}
