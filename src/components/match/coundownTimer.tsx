/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

/** Parse "3m 45s", "45s", "1m" → total seconds */
function parseTimeLeft(raw: string): number {
  const minutes = raw.match(/(\d+)m/);
  const seconds = raw.match(/(\d+)s/);
  return (
    (minutes ? parseInt(minutes[1], 10) * 60 : 0) +
    (seconds ? parseInt(seconds[1], 10) : 0)
  );
}

/** Format total seconds back to "Xm Ys" */
function formatSeconds(total: number): string {
  if (total <= 0) return "0s";
  const m = Math.floor(total / 60);
  const s = total % 60;
  if (m > 0 && s > 0) return `${m}m ${s}s`;
  if (m > 0) return `${m}m`;
  return `${s}s`;
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

type Props = {
  initialTime: string; // e.g. "3m 45s"
};

/**
 * Self-contained countdown timer.
 * Only this component re-renders every second — the parent MatchCard never ticks.
 *
 * Usage:
 *   <CountdownTimer initialTime="3m 45s" />
 */
const CountdownTimer = React.memo(({ initialTime }: Props) => {
  const [seconds, setSeconds] = useState(() => parseTimeLeft(initialTime));

  useEffect(() => {
    if (seconds <= 0) return;

    const id = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <View className="flex-row items-center" style={{ gap: 4 }}>
      <View className="w-1.5 h-1.5 rounded-full bg-red-500" />
      <Text className="text-xs text-gray-400">{formatSeconds(seconds)}</Text>
    </View>
  );
});

CountdownTimer.displayName = "CountdownTimer"; // 👈 fixes the ESLint error

export default CountdownTimer;
