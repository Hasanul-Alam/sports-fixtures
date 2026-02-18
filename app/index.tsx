/* eslint-disable react-hooks/exhaustive-deps */
import FilterBottomSheet from "@/src/components/filter/FilterBottomSheet";
import LoadingMore from "@/src/components/match/LoadingMore";
import MatchCard from "@/src/components/match/MatchCard";
import MonthYearPicker from "@/src/components/MonthYearPicker";
import DateStrip from "@/src/components/schedule/DateStrip";
import SportFilterPills from "@/src/components/schedule/SportFilterPills";
import { MONTH_NAMES } from "@/src/constants/calendarConstants";
import { appendMatches, setMatches } from "@/src/features/match/matchSlice";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

type FilterBottomSheetRef = { open: () => void; close: () => void };

export default function SportsScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 👈 new state

  const isFetching = useRef(false);

  const matches = useSelector((state: any) => state.match.matches);

  const filterSheetRef = useRef<FilterBottomSheetRef>(null);
  const dispatch = useDispatch();

  const handlePickerConfirm = (month: number, year: number) => {
    setSelectedDate(new Date(year, month, 1));
    setPickerVisible(false);
  };

  const getMatches = async (offset = 0) => {
    if (isFetching.current) return;
    isFetching.current = true;
    if (offset > 0) setIsLoadingMore(true);

    console.log("Fetching matches with offset:", offset);
    try {
      const response = await axios.get(
        `https://au.testing.smartb.com.au/soc-api/sports/matchList`,
        {
          params: {
            timezone: "Australia/Sydney",
            status: "all",
            limit: 20,
            offset: offset,
          },
        },
      );

      if (offset === 0) {
        dispatch(setMatches(response.data.matches));
      } else {
        dispatch(appendMatches(response.data.matches));
      }
    } catch (error: any) {
      console.error(
        "Error fetching matches:",
        error.url,
        error.status,
        error.data,
      );
    } finally {
      isFetching.current = false; // ✅ Unlock after request completes
      setIsLoadingMore(false); // ✅ Stop loading more indicator
    }
  };

  const loadMoreMatches = () => {
    const newOffset = matches.length;
    getMatches(newOffset);
  };

  useEffect(() => {
    getMatches(0);
  }, []);

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />

        <View className="px-4 pt-4 pb-2">
          {/* Month / Year Header */}
          <TouchableOpacity
            onPress={() => setPickerVisible(true)}
            className="flex-row items-center justify-center mb-4"
            style={{ gap: 4 }}
          >
            <Text className="text-lg font-semibold text-gray-900">
              {MONTH_NAMES[selectedDate.getMonth()]}{" "}
              {selectedDate.getFullYear()}
            </Text>
            <Text className="text-slate-600 text-2xl mb-1">▾</Text>
          </TouchableOpacity>

          {/* Date Strip */}
          <DateStrip selectedDate={selectedDate} onDayPress={setSelectedDate} />

          {/* Sport Filter Pills */}
          <SportFilterPills
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            onOpenFilterSheet={() => filterSheetRef.current?.open()}
          />
        </View>

        {/* Match List Using Flatlist */}
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MatchCard match={item} />}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreMatches}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<LoadingMore visible={isLoadingMore} />} // 👈
        />
      </SafeAreaView>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        ref={filterSheetRef}
        onApply={(selected: any) => console.log("Filters applied:", selected)}
      />

      {/* Month / Year Picker */}
      <MonthYearPicker
        visible={pickerVisible}
        selectedMonth={selectedDate.getMonth()}
        selectedYear={selectedDate.getFullYear()}
        onConfirm={handlePickerConfirm}
        onCancel={() => setPickerVisible(false)}
      />
    </View>
  );
}
