/* eslint-disable react-hooks/exhaustive-deps */
import { DAY_ITEM_WIDTH, DAY_NAMES } from "@/src/constants/calendarConstants";
import React, { useEffect, useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export function getDaysInMonth(month: number, year: number): Date[] {
  const totalDays = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(year, month, i + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

// ─────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────

type Props = {
  selectedDate: Date;
  onDayPress: (date: Date) => void;
};

const DateStrip = ({ selectedDate, onDayPress }: Props) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const listRef = useRef<FlatList>(null);
  const monthDates = getDaysInMonth(
    selectedDate.getMonth(),
    selectedDate.getFullYear(),
  );

  // Auto-scroll to the selected date whenever it changes
  useEffect(() => {
    const index = monthDates.findIndex((d) => isSameDay(d, selectedDate));
    if (index === -1) return;
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }, 80);
  }, [selectedDate]);

  return (
    <FlatList
      ref={listRef}
      data={monthDates}
      horizontal
      keyExtractor={(item) => item.toISOString()}
      showsHorizontalScrollIndicator={false}
      getItemLayout={(_, index) => ({
        length: DAY_ITEM_WIDTH,
        offset: DAY_ITEM_WIDTH * index,
        index,
      })}
      onScrollToIndexFailed={(info) => {
        setTimeout(() => {
          listRef.current?.scrollToIndex({
            index: info.index,
            animated: true,
            viewPosition: 0.5,
          });
        }, 300);
      }}
      renderItem={({ item: date }) => {
        const isSelected = isSameDay(date, selectedDate);
        const isToday = isSameDay(date, today);

        return (
          <TouchableOpacity
            onPress={() => onDayPress(date)}
            style={{ width: DAY_ITEM_WIDTH }}
            className="items-center py-1.5 rounded-full"
            activeOpacity={0.8}
          >
            <Text className="text-xs mb-0.5 text-black/80">
              {DAY_NAMES[date.getDay()]}
            </Text>
            <View
              className={`w-7 h-7 flex-row items-center justify-center rounded-full ${
                isSelected ? "bg-blue-600" : "bg-white"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  isSelected
                    ? "text-white"
                    : isToday
                      ? "text-blue-500"
                      : "text-gray-800"
                }`}
              >
                {date.getDate()}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }}
      contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 16 }}
    />
  );
};

export default DateStrip;
