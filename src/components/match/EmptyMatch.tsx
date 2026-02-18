/* eslint-disable react-hooks/exhaustive-deps */
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

const EmptyMatch = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      className="flex-1 items-center justify-center px-8 py-16"
    >
      {/* Icon container */}
      <View className="w-24 h-24 rounded-full bg-blue-50 items-center justify-center mb-6">
        <View className="w-16 h-16 rounded-full bg-blue-100 items-center justify-center">
          <MaterialCommunityIcons
            name="whistle-outline"
            size={34}
            color="#2563EB"
          />
        </View>
      </View>

      {/* Text */}
      <Text className="text-gray-900 text-lg font-bold mb-2 text-center">
        No Matches Found
      </Text>
      <Text className="text-gray-400 text-sm text-center leading-5">
        There are no matches scheduled for this selection.{"\n"}Try a different
        date or adjust your filters.
      </Text>

      {/* Decorative dots */}
      {/* <View className="flex-row mt-8" style={{ gap: 6 }}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            className={`rounded-full ${i === 2 ? "w-4 h-2 bg-blue-600" : "w-2 h-2 bg-gray-200"}`}
          />
        ))}
      </View> */}
    </Animated.View>
  );
};

export default EmptyMatch;
