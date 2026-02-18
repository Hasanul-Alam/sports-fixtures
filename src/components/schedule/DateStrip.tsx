/* eslint-disable react-hooks/exhaustive-deps */
import { DAY_ITEM_WIDTH, DAY_NAMES } from "@/src/constants/calendarConstants";
import { setSelectedDate } from "@/src/features/date/dateSlice";
import {
  fromDateString,
  getDaysInMonth,
  isSameDay,
  toDateString,
} from "@/src/utils/dateUtils";
import React, { useEffect, useRef } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  viewingMonth: number;
  viewingYear: number;
};

const DateStrip = ({ viewingMonth, viewingYear }: Props) => {
  const dispatch = useDispatch();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedDateStr = useSelector((state: any) => state.date.selectedDate);
  const selectedDate = selectedDateStr ? fromDateString(selectedDateStr) : null;

  const listRef = useRef<FlatList>(null);
  const monthDates = getDaysInMonth(viewingMonth, viewingYear);

  const handleDayPress = (date: Date) => {
    dispatch(setSelectedDate(toDateString(date)));
  };

  // Auto-scroll to selected date or today when month/year changes
  useEffect(() => {
    const targetDate = selectedDate ?? today;
    const index = monthDates.findIndex((d) => isSameDay(d, targetDate));
    if (index === -1) return;
    setTimeout(() => {
      listRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    }, 80);
  }, [selectedDateStr, viewingMonth, viewingYear]);

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
        const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
        const isToday = isSameDay(date, today);

        return (
          <TouchableOpacity
            onPress={() => handleDayPress(date)}
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
                    ? "text-white" // selected → white text on blue bg
                    : isToday
                      ? "text-blue-500" // today unselected → blue text, white bg
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
