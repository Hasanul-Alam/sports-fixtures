/* eslint-disable react-hooks/exhaustive-deps */
import FilterBottomSheet from "@/src/components/filter/FilterBottomSheet";
import MonthYearPicker from "@/src/components/MonthYearPicker";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─────────────────────────────────────────────
// DATE UTILS
// ─────────────────────────────────────────────

const DAY_NAMES = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_ITEM_WIDTH = 48;

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

// Returns all days in the given month/year
function getDaysInMonth(month: number, year: number): Date[] {
  const totalDays = new Date(year, month + 1, 0).getDate(); // day 0 of next month = last day of this month
  return Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(year, month, i + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

type Match = {
  id: string;
  league: string;
  time: string;
  timeAgo?: string;
  homeTeam: string;
  awayTeam: string;
  odds?: string;
  hasTips?: boolean;
  isLive?: boolean;
};

type FilterBottomSheetRef = { open: () => void; close: () => void };

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const MATCHES: Match[] = [
  {
    id: "1",
    league: "NBA",
    time: "11:00AM",
    timeAgo: "3m 45s",
    homeTeam: "Portland Trail Blazers",
    awayTeam: "Golden State Warriors",
    isLive: true,
  },
  {
    id: "2",
    league: "NRL",
    time: "11:15AM",
    timeAgo: "8m 45s",
    homeTeam: "St. George Illawarra Dragons",
    awayTeam: "Canterbury-Bankstown Bulldogs",
    hasTips: true,
    isLive: true,
  },
  {
    id: "3",
    league: "AFL",
    time: "11:20AM",
    timeAgo: "13m 45s",
    homeTeam: "Greater Western Sydney Giants",
    awayTeam: "North Melbourne Kangaroos",
    hasTips: true,
    isLive: true,
  },
  {
    id: "4",
    league: "AUSTRALIAN OPEN",
    time: "11:25AM",
    timeAgo: "18m 45s",
    homeTeam: "Djokovic N.",
    awayTeam: "Zverev A.",
    isLive: true,
  },
  {
    id: "5",
    league: "NFL",
    time: "11:05AM",
    odds: "23/1",
    homeTeam: "San Francisco 49ers",
    awayTeam: "Detroit Lions",
  },
  {
    id: "6",
    league: "EPL",
    time: "11:10AM",
    homeTeam: "Arsenal FC",
    awayTeam: "Leicester FC",
  },
];

const SPORT_FILTERS = ["All", "Australian Rules", "Rugby League"];

const LEAGUE_COLORS: Record<string, string> = {
  NBA: "#C8102E",
  NRL: "#003087",
  AFL: "#002B5C",
  "AUSTRALIAN OPEN": "#0098D4",
  NFL: "#013369",
  EPL: "#38003C",
};

// ─────────────────────────────────────────────
// TEAM AVATAR
// ─────────────────────────────────────────────

const TeamAvatar = ({ name }: { name: string }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <View className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center border border-gray-200">
      <Text className="text-base font-bold text-gray-500">{initials}</Text>
    </View>
  );
};

// ─────────────────────────────────────────────
// MATCH CARD
// ─────────────────────────────────────────────

const MatchCard = ({ match }: { match: Match }) => {
  const accentColor = LEAGUE_COLORS[match.league] ?? "#555";

  return (
    <View className="bg-white mx-4 mb-3 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <View className="pt-3 pb-1 items-center">
        <Text
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: accentColor }}
        >
          {match.league}
        </Text>
      </View>

      <Text className="text-center text-2xl font-bold text-gray-900">
        {match.time}
      </Text>

      <View className="items-center mb-1" style={{ gap: 2 }}>
        {match.isLive && match.timeAgo ? (
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <View className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <Text className="text-xs text-gray-400">{match.timeAgo}</Text>
          </View>
        ) : null}
        {match.odds ? (
          <Text className="text-xs font-semibold text-orange-500">
            {match.odds}
          </Text>
        ) : null}
        {match.hasTips ? (
          <View className="bg-blue-50 border border-blue-200 rounded px-2 py-0.5 mt-1">
            <Text className="text-blue-600 text-xs font-semibold">Tips</Text>
          </View>
        ) : null}
      </View>

      <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
        <View className="items-center flex-1">
          <TeamAvatar name={match.homeTeam} />
          <Text
            className="text-xs text-center text-gray-700 font-medium mt-2 leading-4"
            numberOfLines={2}
          >
            {match.homeTeam}
          </Text>
        </View>

        <Text className="text-gray-300 text-lg px-2">vs</Text>

        <View className="items-center flex-1">
          <TeamAvatar name={match.awayTeam} />
          <Text
            className="text-xs text-center text-gray-700 font-medium mt-2 leading-4"
            numberOfLines={2}
          >
            {match.awayTeam}
          </Text>
        </View>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────

const INITIAL_DATE = new Date();

export default function SportsScheduleScreen() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [selectedDate, setSelectedDate] = useState<Date>(INITIAL_DATE);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const filterSheetRef = useRef<FilterBottomSheetRef>(null);
  const dateListRef = useRef<FlatList>(null);

  // Only days of the currently selected month
  const monthDates = getDaysInMonth(
    selectedDate.getMonth(),
    selectedDate.getFullYear(),
  );

  // Scroll to selected date whenever it changes
  useEffect(() => {
    const index = monthDates.findIndex((d) => isSameDay(d, selectedDate));
    if (index !== -1) {
      setTimeout(() => {
        dateListRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition: 0.5,
        });
      }, 80);
    }
  }, [selectedDate]);

  // When month/year picker confirms — jump to 1st of that month
  const handlePickerConfirm = (month: number, year: number) => {
    const newDate = new Date(year, month, 1);
    setSelectedDate(newDate);
    setPickerVisible(false);
  };

  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
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

          {/* Date Strip — only days of selected month */}
          <FlatList
            ref={dateListRef}
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
                dateListRef.current?.scrollToIndex({
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
                  onPress={() => handleDayPress(date)}
                  style={{ width: DAY_ITEM_WIDTH }}
                  className={`items-center py-1.5 rounded-full `}
                  activeOpacity={0.8}
                >
                  <Text className={`text-xs mb-0.5 text-black/80`}>
                    {DAY_NAMES[date.getDay()]}
                  </Text>
                  <View
                    className={`w-7 h-7 flex-row items-center justify-center ${isSelected ? "bg-blue-600" : "bg-white"}  rounded-full`}
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

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          >
            <TouchableOpacity
              onPress={() => filterSheetRef.current?.open()}
              className="flex-row items-center bg-gray-200 rounded-full px-3 py-1.5"
              style={{ gap: 4 }}
            >
              <Text className="text-sm text-gray-700">Filters</Text>
              <FontAwesome6 name="sliders" size={10} color="#4B5563" />
            </TouchableOpacity>

            {SPORT_FILTERS.map((filter) => {
              const isActive = filter === selectedFilter;
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setSelectedFilter(isActive ? "" : filter)}
                  className={`flex-row items-center rounded-full px-4 py-1.5 ${
                    isActive ? "bg-blue-600" : "bg-gray-200"
                  }`}
                  style={{ gap: 4 }}
                >
                  <Text
                    className={`text-sm font-medium ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {filter}
                  </Text>
                  {isActive && <Text className="text-white text-xs">✕</Text>}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
