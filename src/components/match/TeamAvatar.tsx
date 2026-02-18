import React from "react";
import { Text, View } from "react-native";

type Props = {
  name: string;
};

const TeamAvatar = ({ name }: Props) => {
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

export default TeamAvatar;
