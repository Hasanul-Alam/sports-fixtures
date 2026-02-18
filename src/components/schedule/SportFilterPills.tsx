import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import React from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";

type Props = {
  selectedFilters: string[];
  onRemoveFilter: (name: string) => void;
  onOpenFilterSheet: () => void;
};

const SportFilterPills = ({
  selectedFilters,
  onRemoveFilter,
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

      {/* Active filter pills */}
      {selectedFilters.map((name) => (
        <TouchableOpacity
          key={name}
          onPress={() => onRemoveFilter(name)}
          className="flex-row items-center bg-blue-600 rounded-full px-4 py-1.5"
          style={{ gap: 6 }}
        >
          <Text className="text-sm font-medium text-white">{name}</Text>
          <Text className="text-white text-xs">✕</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default SportFilterPills;
