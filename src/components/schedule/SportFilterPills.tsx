import { SPORT_FILTERS } from "@/src/constants/matchConstants";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

type Props = {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  onOpenFilterSheet: () => void;
};

const SportFilterPills = ({
  selectedFilter,
  onFilterChange,
  onOpenFilterSheet,
}: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingBottom: 8 }}
    >
      {/* Advanced filter button */}
      <TouchableOpacity
        onPress={onOpenFilterSheet}
        className="flex-row items-center bg-gray-200 rounded-full px-3 py-1.5"
        style={{ gap: 4 }}
      >
        <Text className="text-sm text-gray-700">Filters</Text>
        <FontAwesome6 name="sliders" size={10} color="#4B5563" />
      </TouchableOpacity>

      {/* Sport pills */}
      {SPORT_FILTERS.map((filter) => {
        const isActive = filter === selectedFilter;
        return (
          <TouchableOpacity
            key={filter}
            onPress={() => onFilterChange(isActive ? "" : filter)}
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
  );
};

export default SportFilterPills;
