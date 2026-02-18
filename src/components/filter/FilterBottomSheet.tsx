import {
  fetchSportsFilters,
  resetSelections,
  toggleExpand,
  toggleTournament,
} from "@/src/features/filter/filterSlice";
import { AppDispatch, RootState } from "@/src/store/store";
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
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import CategoryRow from "./categoryRow";

export interface FilterBottomSheetRef {
  open: () => void;
  close: () => void;
}

interface Props {
  onApply?: (selectedTournamentIds: number[]) => void;
}

const FilterBottomSheet = forwardRef<FilterBottomSheetRef, Props>(
  function FilterBottomSheet({ onApply }, ref) {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["85%"], []);

    const dispatch = useDispatch<AppDispatch>();

    const { sports, loading } = useSelector((state: RootState) => state.filter);
    useImperativeHandle(ref, () => ({
      open: () => {
        bottomSheetRef.current?.expand();

        // Fetch only if not already loaded
        if (sports.length === 0) {
          dispatch(fetchSportsFilters());
        }
      },
      close: () => bottomSheetRef.current?.close(),
    }));

    const handleApply = useCallback(() => {
      const selectedIds = sports
        .flatMap((sport) => sport.tournaments)
        .filter((t) => t.selected)
        .map((t) => t.id);

      onApply?.(selectedIds);
      bottomSheetRef.current?.close();
    }, [sports, onApply]);

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
              onPress={() => bottomSheetRef.current?.close()}
              className="w-8 h-8 items-center justify-center"
            >
              <Text className="text-gray-500 text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Reset */}
          <View className="flex-row justify-end px-4 py-2">
            <TouchableOpacity
              onPress={() => dispatch(resetSelections())}
              className="flex-row items-center"
            >
              <Text className="text-blue-500 text-sm font-medium">
                Reset all
              </Text>
            </TouchableOpacity>
          </View>

          {/* Loading */}
          {loading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" />
            </View>
          ) : (
            <FlatList
              data={sports}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <CategoryRow
                  category={item}
                  onToggleExpand={(id: number) => dispatch(toggleExpand(id))}
                  onToggleTournament={(sportId: number, tournamentId: number) =>
                    dispatch(toggleTournament({ sportId, tournamentId }))
                  }
                />
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
            />
          )}

          {/* Apply */}
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
  },
);

export default FilterBottomSheet;
