/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

interface LoadingMoreProps {
  visible: boolean;
}

const LoadingMore = ({ visible }: LoadingMoreProps) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  return (
    // Fixed height always reserved — no layout jump
    <View
      style={{ height: 30, justifyContent: "center", alignItems: "center" }}
    >
      <Animated.View style={{ opacity, flexDirection: "row", gap: 6 }}>
        {[0, 1, 2].map((i) => (
          <BouncingDot key={i} delay={i * 150} />
        ))}
      </Animated.View>
    </View>
  );
};

const BouncingDot = ({ delay }: { delay: number }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: -6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#6B7280",
        transform: [{ translateY }],
      }}
    />
  );
};

export default LoadingMore;
