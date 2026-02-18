import TeamAvatar from "@/src/components/match/TeamAvatar";
import { LEAGUE_COLORS } from "@/src/constants/matchConstants";
import { Match } from "@/src/types/matchTypes";
import React from "react";
import { Text, View } from "react-native";
import CountdownTimer from "./coundownTimer";

type Props = {
  match: Match;
};

const MatchCard = ({ match }: Props) => {
  const accentColor = LEAGUE_COLORS[match.league] ?? "#555";

  return (
    <View className="bg-white mx-4 mb-3 rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* League label */}
      <View className="pt-3 pb-1 items-center">
        <Text
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: accentColor }}
        >
          {match.league}
        </Text>
      </View>

      {/* Kick-off time */}
      <Text className="text-center text-2xl font-bold text-gray-900">
        {match.time}
      </Text>

      {/* Live / countdown / odds / tips row */}
      <View className="items-center mb-1" style={{ gap: 2 }}>
        {match.isLive && match.timeLeft ? (
          <CountdownTimer initialTime={match.timeLeft} />
        ) : match.isLive ? (
          <View className="flex-row items-center gap-1">
            <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <Text className="text-xs font-semibold text-gray-500">Live</Text>
          </View>
        ) : null}

        {match.odds ? (
          <Text className="text-xs font-semibold text-orange-500">
            {match.odds}
          </Text>
        ) : null}

        {match.hasTips ? (
          <View className="bg-blue-50 border border-blue-200 rounded px-2 py-0.5 mt-1">
            <Text className="text-blue-600 text-xs font-semibold">Tips</Text>
          </View>
        ) : null}
      </View>

      {/* Teams */}
      <View className="flex-row items-center justify-between px-6 pb-4 pt-2">
        <View className="items-center flex-1">
          <TeamAvatar name={match.homeTeam} />
          <Text
            className="text-xs text-center text-gray-700 font-medium mt-2 leading-4"
            numberOfLines={2}
          >
            {match.homeTeam}
          </Text>
        </View>

        <Text className="text-gray-300 text-lg px-2">vs</Text>

        <View className="items-center flex-1">
          <TeamAvatar name={match.awayTeam} />
          <Text
            className="text-xs text-center text-gray-700 font-medium mt-2 leading-4"
            numberOfLines={2}
          >
            {match.awayTeam}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MatchCard;
