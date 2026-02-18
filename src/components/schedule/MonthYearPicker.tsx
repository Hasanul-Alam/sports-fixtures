import React, { useEffect, useState } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const MONTHS = [
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

type Props = {
  visible: boolean;
  selectedMonth: number; // 0–11
  selectedYear: number;
  onConfirm: (month: number, year: number) => void;
  onCancel: () => void;
};

export default function MonthYearPicker({
  visible,
  selectedMonth,
  selectedYear,
  onConfirm,
  onCancel,
}: Props) {
  const [month, setMonth] = useState(selectedMonth);
  const [year, setYear] = useState(selectedYear);

  useEffect(() => {
    if (visible) {
      setMonth(selectedMonth);
      setYear(selectedYear);
    }
  }, [visible, selectedMonth, selectedYear]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          className="items-center justify-center"
        >
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-2xl p-5 w-80">
              {/* Year row */}
              <View className="flex-row items-center justify-between mb-5">
                <TouchableOpacity
                  onPress={() => setYear((y) => y - 1)}
                  className="w-9 h-9 items-center justify-center bg-gray-100 rounded-full"
                >
                  <Text className="text-gray-600 text-lg font-semibold">‹</Text>
                </TouchableOpacity>

                <Text className="text-xl font-bold text-gray-900">{year}</Text>

                <TouchableOpacity
                  onPress={() => setYear((y) => y + 1)}
                  className="w-9 h-9 items-center justify-center bg-gray-100 rounded-full"
                >
                  <Text className="text-gray-600 text-lg font-semibold">›</Text>
                </TouchableOpacity>
              </View>

              {/* Month grid — 3 columns × 4 rows */}
              <View className="flex-row flex-wrap">
                {MONTHS.map((m, i) => {
                  const isSelected = i === month;
                  return (
                    <TouchableOpacity
                      key={m}
                      onPress={() => setMonth(i)}
                      style={{ width: "33.33%" }}
                      className={`py-3 items-center rounded-xl mb-1 ${
                        isSelected ? "bg-blue-600" : ""
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          isSelected ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {m.slice(0, 3)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Action buttons */}
              <View className="flex-row mt-4" style={{ gap: 8 }}>
                <TouchableOpacity
                  onPress={onCancel}
                  className="flex-1 py-3 items-center bg-gray-100 rounded-xl"
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onConfirm(month, year)}
                  className="flex-1 py-3 items-center bg-blue-600 rounded-xl"
                >
                  <Text className="text-white font-semibold">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
