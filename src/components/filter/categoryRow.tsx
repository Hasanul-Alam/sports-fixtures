import { SportCategory } from "@/src/types/filterTypes";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Checkbox from "./checkbox";

type CategoryRowProps = {
  category: SportCategory;
  onToggleExpand: (id: string) => void;
  onToggleCategory: (id: string) => void;
  onToggleLeague: (catId: string, leagueId: string) => void;
  searchQuery: string;
  onSearchChange: (id: string, text: string) => void;
};

export default function CategoryRow({
  category,
  onToggleExpand,
  onToggleCategory,
  onToggleLeague,
  searchQuery,
  onSearchChange,
}: CategoryRowProps) {
  const filteredLeagues = category.leagues.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View>
      {/* Category header */}
      <View className="flex-row items-center justify-between px-4 py-3.5 bg-gray-100 border-b border-gray-200">
        <TouchableOpacity
          className="flex-row items-center flex-1"
          onPress={() => onToggleExpand(category.id)}
        >
          <Text className="text-gray-500 mr-2 text-sm">
            {category.expanded ? "∧" : "∨"}
          </Text>
          <Text className="font-semibold text-gray-800 text-sm">
            {category.name}
          </Text>
        </TouchableOpacity>
        <Checkbox
          checked={category.selected}
          onPress={() => onToggleCategory(category.id)}
          green
        />
      </View>

      {/* Expanded content */}
      {category.expanded && (
        <View className="bg-white">
          {/* Search bar */}
          <View className="mx-4 my-2 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              placeholder="Search"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={(t) => onSearchChange(category.id, t)}
              className="flex-1 text-sm text-gray-800"
            />
          </View>

          {/* League rows */}
          {filteredLeagues.map((league) => (
            <TouchableOpacity
              key={league.id}
              onPress={() => onToggleLeague(category.id, league.id)}
              className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
            >
              <Text className="text-sm text-gray-700">{league.name}</Text>
              <Checkbox
                checked={league.selected}
                onPress={() => onToggleLeague(category.id, league.id)}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
