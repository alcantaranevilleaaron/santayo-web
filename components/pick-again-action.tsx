"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

type PickAgainActionProps = {
  isPickingAgain: boolean;
  onPickAgain: () => void;
  disabled?: boolean;
};

export function PickAgainAction({
  isPickingAgain,
  onPickAgain,
  disabled = false,
}: PickAgainActionProps) {
  const isBusy = disabled || isPickingAgain;

  return (
    <div className="mt-3">
      <Button
        variant="outline"
        size="lg"
        onClick={onPickAgain}
        disabled={isBusy}
        className="w-full rounded-[14px] border border-rose-200 bg-rose-50 px-4 py-4 text-left text-sm font-semibold text-rose-900 shadow-sm transition duration-150 ease-out transform-gpu hover:border-rose-300 hover:bg-rose-100 active:scale-[0.97]"
        aria-busy={isPickingAgain}
      >
        {isPickingAgain ? (
          // <div className="premium-soft-pulse flex w-full flex-col items-center gap-1 text-center">
          //   <span className="text-sm font-semibold tracking-tight text-rose-900">
          //     Picking something good...
          //   </span>
          //   <span className="text-xs text-rose-900/80">Trust us on this one ✨</span>
          // </div>
          <div className="premium-soft-pulse flex flex-col items-center gap-1">
            <span className="text-sm font-semibold tracking-tight">
              Picking something good...
            </span>
            <span className="text-xs opacity-80">Trust us on this one ✨</span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span>Ikaw na bahala ulit</span>
            <Sparkles className="size-5 text-rose-600" />
          </div>
        )}
      </Button>
    </div>
  );
}
