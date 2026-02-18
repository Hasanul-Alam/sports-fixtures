/* eslint-disable react-hooks/exhaustive-deps */
import FilterBottomSheet from "@/src/components/filter/FilterBottomSheet";
import EmptyMatch from "@/src/components/match/EmptyMatch";
import LoadingMore from "@/src/components/match/LoadingMore";
import MatchCard from "@/src/components/match/MatchCard";
import DateStrip from "@/src/components/schedule/DateStrip";
import MonthYearPicker from "@/src/components/schedule/MonthYearPicker";
import SportFilterPills from "@/src/components/schedule/SportFilterPills";
import { MONTH_NAMES } from "@/src/constants/calendarConstants";
import { setSelectedDate } from "@/src/features/date/dateSlice";
import { applyFilters } from "@/src/features/filter/filterSlice";
import { appendMatches, setMatches } from "@/src/features/match/matchSlice";
import { toDateString } from "@/src/utils/dateUtils";
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
  const today = new Date();

  const [pickerVisible, setPickerVisible] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewingMonth, setViewingMonth] = useState(today.getMonth());
  const [viewingYear, setViewingYear] = useState(today.getFullYear());

  const isFetching = useRef(false);
  const filterSheetRef = useRef<FilterBottomSheetRef>(null);

  const dispatch = useDispatch();

  const matches = useSelector((state: any) => state.match.matches);
  const selectedTournamentIds = useSelector(
    (state: any) => state.filter.selectedTournamentIds,
  );
  const selectedSportsNames = useSelector(
    (state: any) => state.filter.selectedSportsNames,
  );
  const sports = useSelector((state: any) => state.filter.sports);
  const selectedDateStr = useSelector((state: any) => state.date.selectedDate);

  /**
   * 🔥 MAIN API FUNCTION
   */
  const getMatches = async (
    offset = 0,
    tournamentIds: number[] = selectedTournamentIds,
    date: string | null = selectedDateStr,
  ) => {
    if (isFetching.current) return;

    isFetching.current = true;

    if (offset > 0) setIsLoadingMore(true);

    try {
      const params: Record<string, any> = {
        timezone: "Australia/Sydney",
        status: "all",
        limit: 10,
        offset,
      };

      // Add tournament filter
      if (tournamentIds && tournamentIds.length > 0) {
        params.tournament_ids = tournamentIds.join(",");
      }

      // Add date filter
      if (date) {
        params.todate = date;
      }

      const response = await axios.get(
        "https://au.testing.smartb.com.au/soc-api/sports/matchList",
        { params },
      );

      const matchesData = response.data?.matches ?? [];

      if (offset === 0) {
        dispatch(setMatches(matchesData));
      } else {
        dispatch(appendMatches(matchesData));
      }
    } catch (error: any) {
      console.error("Error fetching matches:", error);
    } finally {
      isFetching.current = false;
      setIsLoadingMore(false);
    }
  };

  /**
   * 🔥 AUTO REFRESH WHEN DATE OR FILTERS CHANGE
   */
  useEffect(() => {
    getMatches(0, selectedTournamentIds, selectedDateStr);
  }, [selectedTournamentIds, selectedDateStr]);

  /**
   * 🔥 LOAD MORE (INFINITE SCROLL)
   */
  const loadMoreMatches = () => {
    getMatches(matches.length, selectedTournamentIds, selectedDateStr);
  };

  /**
   * 🔥 REMOVE FILTER PILL
   */
  const handleRemoveFilter = (name: string) => {
    const allTournaments = sports.flatMap((s: any) => s.tournaments);
    const tournament = allTournaments.find((t: any) => t.name === name);
    if (!tournament) return;

    const newIds = selectedTournamentIds.filter(
      (id: number) => id !== tournament.id,
    );

    dispatch(applyFilters(newIds));
  };

  /**
   * 🔥 APPLY FILTERS FROM BOTTOM SHEET
   */
  const handleApplyFilters = (selectedIds: number[]) => {
    dispatch(applyFilters(selectedIds));
  };

  /**
   * 🔥 MONTH PICKER CONFIRM
   */
  const handlePickerConfirm = (month: number, year: number) => {
    setViewingMonth(month);
    setViewingYear(year);

    const newDate = new Date(year, month, 1);
    dispatch(setSelectedDate(toDateString(newDate)));

    setPickerVisible(false);
  };

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
              {MONTH_NAMES[viewingMonth]} {viewingYear}
            </Text>
            <Text className="text-slate-600 text-2xl mb-1">▾</Text>
          </TouchableOpacity>

          {/* Date Strip */}
          <DateStrip viewingMonth={viewingMonth} viewingYear={viewingYear} />

          {/* Filter Pills */}
          <SportFilterPills
            selectedFilters={selectedSportsNames}
            onRemoveFilter={handleRemoveFilter}
            onOpenFilterSheet={() => filterSheetRef.current?.open()}
          />
        </View>

        {/* Match List */}
        <FlatList
          data={matches}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MatchCard match={item} />}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreMatches}
          onEndReachedThreshold={0.5}
          ListFooterComponent={<LoadingMore visible={isLoadingMore} />}
          ListEmptyComponent={<EmptyMatch />}
        />
      </SafeAreaView>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet ref={filterSheetRef} onApply={handleApplyFilters} />

      {/* Month / Year Picker */}
      <MonthYearPicker
        visible={pickerVisible}
        selectedMonth={viewingMonth}
        selectedYear={viewingYear}
        onConfirm={handlePickerConfirm}
        onCancel={() => setPickerVisible(false)}
      />
    </View>
  );
}
