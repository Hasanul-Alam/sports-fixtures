import FilterBottomSheet from "@/src/components/filter/FilterBottomSheet";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

// ─────────────────────────────────────────────
// CONSTANTS / MOCK DATA
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

const DAYS = [
  { day: "Su", date: 19 },
  { day: "M", date: 20 },
  { day: "Tu", date: 21 },
  { day: "W", date: 22 },
  { day: "Th", date: 23 },
  { day: "F", date: 24 },
  { day: "Sa", date: 25 },
];

const LEAGUE_COLORS: Record<string, string> = {
  NBA: "#C8102E",
  NRL: "#003087",
  AFL: "#002B5C",
  "AUSTRALIAN OPEN": "#0098D4",
  NFL: "#013369",
  EPL: "#38003C",
};

// ─────────────────────────────────────────────
// SMALL COMPONENTS
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

const Checkbox = ({
  checked,
  onPress,
  green = false,
}: {
  checked: boolean;
  onPress: () => void;
  green?: boolean;
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`w-6 h-6 rounded-md items-center justify-center border-2 ${
      checked
        ? green
          ? "bg-green-500 border-green-500"
          : "bg-blue-600 border-blue-600"
        : "border-gray-300 bg-white"
    }`}
  >
    {checked && <Text className="text-white text-xs font-bold">✓</Text>}
  </TouchableOpacity>
);

// ─────────────────────────────────────────────
// MATCH CARD
// ─────────────────────────────────────────────

const MatchCard = ({ match }: { match: Match }) => {
  const accentColor = LEAGUE_COLORS[match.league] ?? "#555";

  return (
    <View className="bg-white mx-4 mb-3 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* League label */}
      <View className="pt-3 pb-1 items-center">
        <Text
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: accentColor }}
        >
          {match.league}
        </Text>
      </View>

      {/* Time */}
      <Text className="text-center text-2xl font-bold text-gray-900">
        {match.time}
      </Text>

      {/* Live / odds / tips */}
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

      {/* Teams */}
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
// FILTER BOTTOM SHEET — CATEGORY ROW
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// FILTER BOTTOM SHEET
// ─────────────────────────────────────────────

type FilterBottomSheetRef = { open: () => void; close: () => void };

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────

export default function SportsScheduleScreen() {
  const [selectedDay, setSelectedDay] = useState(22);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const filterSheetRef = useRef<FilterBottomSheetRef>(null);

  return (
    <View className="flex-1">
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />

        <View className="px-4 pt-4 pb-2">
          {/* Month Header */}
          <TouchableOpacity
            className="flex-row items-center justify-center mb-4"
            style={{ gap: 4 }}
          >
            <Text className="text-lg font-semibold text-gray-900">
              January 2025
            </Text>
            <Text className="text-gray-400 text-sm">▾</Text>
          </TouchableOpacity>

          {/* Day Selector */}
          <View className="flex-row justify-between mb-4">
            {DAYS.map(({ day, date }) => {
              const isSelected = date === selectedDay;
              return (
                <TouchableOpacity
                  key={date}
                  onPress={() => setSelectedDay(date)}
                  className={`items-center w-10 py-1.5 rounded-full ${
                    isSelected ? "bg-blue-600" : ""
                  }`}
                >
                  <Text
                    className={`text-xs mb-0.5 ${
                      isSelected ? "text-blue-200" : "text-gray-400"
                    }`}
                  >
                    {day}
                  </Text>
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {date}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
          >
            {/* Filters button — opens bottom sheet */}
            <TouchableOpacity
              onPress={() => filterSheetRef.current?.open()}
              className="flex-row items-center bg-gray-200 rounded-full px-3 py-1.5"
              style={{ gap: 4 }}
            >
              <Text className="text-sm text-gray-700">Filters</Text>
              <Text className="text-gray-500">⚙</Text>
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

      {/* Filter Bottom Sheet — outside SafeAreaView so it overlays everything */}
      <FilterBottomSheet
        ref={filterSheetRef}
        onApply={(selected: any) => console.log("Filters applied:", selected)}
      />
    </View>
  );
}
