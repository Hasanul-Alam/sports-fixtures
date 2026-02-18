import React, { useEffect, useRef, useState } from "react";
import { Text } from "react-native";

type Props = {
  targetDate: string; // UTC ISO string
};

const CountdownTimer = ({ targetDate }: Props) => {
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const diff = new Date(targetDate).getTime() - Date.now();
    return diff > 0 ? diff : 0;
  });

  // Use number | null for React Native compatibility
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current !== null) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1000;
      });
    }, 1000) as unknown as number; // cast to number for TypeScript

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  return <Text className="text-xs text-gray-500">{formatTime(timeLeft)}</Text>;
};

export default CountdownTimer;
