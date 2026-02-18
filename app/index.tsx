import FilterBottomSheet from "@/src/components/filter/FilterBottomSheet";
import MatchCard from "@/src/components/match/MatchCard";
import MonthYearPicker from "@/src/components/MonthYearPicker";
import DateStrip from "@/src/components/schedule/DateStrip";
import SportFilterPills from "@/src/components/schedule/SportFilterPills";
import { MONTH_NAMES } from "@/src/constants/calendarConstants";
import { MATCHES } from "@/src/constants/matchConstants";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterBottomSheetRef = { open: () => void; close: () => void };

export default function SportsScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filterSheetRef = useRef<FilterBottomSheetRef>(null);

  const handlePickerConfirm = (month: number, year: number) => {
    setSelectedDate(new Date(year, month, 1));
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

        {/* Match List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 32 }}
        >
          {MATCHES.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </ScrollView>
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
