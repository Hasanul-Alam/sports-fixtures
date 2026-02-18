import { SportCategory } from "@/src/types/filterTypes";
import React, { useMemo, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import Checkbox from "./checkbox";

type CategoryRowProps = {
  category: SportCategory;
  onToggleExpand: (id: number) => void;
  onToggleTournament: (sportId: number, tournamentId: number) => void;
};

export default function CategoryRow({
  category,
  onToggleExpand,
  onToggleTournament,
}: CategoryRowProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTournaments = useMemo(() => {
    if (!searchQuery.trim()) return category.tournaments;

    return category.tournaments.filter((t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [category.tournaments, searchQuery]);

  return (
    <View>
      {/* Category Header */}
      <View className="flex-row items-center justify-between px-4 py-3.5 bg-gray-100 border-b border-gray-200">
        <TouchableOpacity
          className="flex-row items-center flex-1"
          onPress={() => onToggleExpand(category.id)}
        >
          <Text className="text-gray-500 mr-2 text-sm">
            {category.expanded ? "∧" : "∨"}
          </Text>

          <Text className="font-semibold text-gray-800 text-sm">
            {category.sportName}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Expanded Content */}
      {category.expanded && (
        <View className="bg-white">
          {/* Search */}
          <View className="mx-4 my-2 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
            <Text className="text-gray-400 mr-2">🔍</Text>
            <TextInput
              placeholder="Search tournament"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-sm text-gray-800"
            />
          </View>

          {/* Tournament List */}
          {filteredTournaments.map((tournament) => (
            <TouchableOpacity
              key={tournament.id}
              onPress={() => onToggleTournament(category.id, tournament.id)}
              className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100"
            >
              <Text className="text-sm text-gray-700">{tournament.name}</Text>

              <Checkbox
                checked={tournament.selected}
                onPress={() => onToggleTournament(category.id, tournament.id)}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
