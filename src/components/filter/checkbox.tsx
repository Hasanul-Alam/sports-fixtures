import React from "react";
import { Text, TouchableOpacity } from "react-native";

type CheckboxProps = {
  checked: boolean;
  onPress: () => void;
  green?: boolean;
};

export default function Checkbox({
  checked,
  onPress,
  green = false,
}: CheckboxProps) {
  return (
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
}
