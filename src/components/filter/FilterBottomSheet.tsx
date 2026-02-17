import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import { FILTER_CATEGORIES } from "@/src/data/filterData";
import {
  FilterBottomSheetProps,
  FilterBottomSheetRef,
  SportCategory,
} from "@/src/types/filterTypes";
import CategoryRow from "./categoryRow";

const FilterBottomSheet = forwardRef<
  FilterBottomSheetRef,
  FilterBottomSheetProps
>(function FilterBottomSheet({ onApply }, ref) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["85%"], []);

  const [categories, setCategories] =
    useState<SportCategory[]>(FILTER_CATEGORIES);
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {},
  );

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.expand(),
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleClose = useCallback(() => bottomSheetRef.current?.close(), []);

  const handleReset = useCallback(() => {
    setCategories(FILTER_CATEGORIES);
    setSearchQueries({});
  }, []);

  const handleToggleExpand = useCallback((id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, expanded: !c.expanded } : c)),
    );
  }, []);

  const handleToggleCategory = useCallback((id: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              selected: !c.selected,
              leagues: c.leagues.map((l) => ({ ...l, selected: !c.selected })),
            }
          : c,
      ),
    );
  }, []);

  const handleToggleLeague = useCallback((catId: string, leagueId: string) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        const updatedLeagues = c.leagues.map((l) =>
          l.id === leagueId ? { ...l, selected: !l.selected } : l,
        );
        return {
          ...c,
          leagues: updatedLeagues,
          selected: updatedLeagues.every((l) => l.selected),
        };
      }),
    );
  }, []);

  const handleSearchChange = useCallback((id: string, text: string) => {
    setSearchQueries((prev) => ({ ...prev, [id]: text }));
  }, []);

  const handleApply = useCallback(() => {
    onApply?.(categories);
    bottomSheetRef.current?.close();
  }, [categories, onApply]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#CBD5E1", width: 40 }}
      backgroundStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
    >
      <BottomSheetView style={{ flex: 1 }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
          <Text className="text-xl font-black text-gray-900 tracking-wider uppercase">
            Filters
          </Text>
          <TouchableOpacity
            onPress={handleClose}
            className="w-8 h-8 items-center justify-center"
          >
            <Text className="text-gray-500 text-lg">✕</Text>
          </TouchableOpacity>
        </View>

        {/* Reset all */}
        <View className="flex-row justify-end px-4 py-2">
          <TouchableOpacity
            onPress={handleReset}
            className="flex-row items-center"
            style={{ gap: 4 }}
          >
            <Text className="text-blue-500 text-sm">↺</Text>
            <Text className="text-blue-500 text-sm font-medium">Reset all</Text>
          </TouchableOpacity>
        </View>

        {/* Category list */}
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CategoryRow
              category={item}
              onToggleExpand={handleToggleExpand}
              onToggleCategory={handleToggleCategory}
              onToggleLeague={handleToggleLeague}
              searchQuery={searchQueries[item.id] ?? ""}
              onSearchChange={handleSearchChange}
            />
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        />

        {/* Apply button */}
        <View className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-3 bg-white border-t border-gray-200">
          <TouchableOpacity
            onPress={handleApply}
            className="bg-blue-600 rounded-xl py-4 items-center"
          >
            <Text className="text-white font-semibold text-base">Apply</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default FilterBottomSheet;
export type { FilterBottomSheetRef };
