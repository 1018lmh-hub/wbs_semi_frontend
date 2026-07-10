// src/features/chart/SerialCongestionRate.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { theme } from "../../styles/theme";
import { fetchSerialCongestion } from "../../lib/raspApi";
import {
  Wrapper,
  Title,
  SubText,
  ChartArea,
  StatusText,
} from "./SerialCongestionRate.style";

const TOTAL_DEVICES = 100;

// 최근 14분, 10초 단위로 집계
const RANGE_MINUTES = 14;
const BUCKET_INTERVAL_SECONDS = 10;

// X축 눈금: 2분 간격 (10분/2분 = 5개 눈금)
const TICK_INTERVAL_MINUTES = 2;
const BUCKETS_PER_TICK = (TICK_INTERVAL_MINUTES * 60) / BUCKET_INTERVAL_SECONDS;

const formatTimeLabel = (timestamp) => {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const buildTimeline = (logs) => {
  const now = new Date();
  const startTime = now.getTime() - RANGE_MINUTES * 60 * 1000;
  const bucketMs = BUCKET_INTERVAL_SECONDS * 1000;
  const bucketCount = Math.floor(
    (RANGE_MINUTES * 60) / BUCKET_INTERVAL_SECONDS,
  );

  const events = [];
  logs.forEach((log) => {
    events.push({
      time: new Date(log.createdAt).getTime(),
      delta: 1,
      deviceId: log.deviceId,
    });
    events.push({
      time: new Date(log.finishAt).getTime(),
      delta: -1,
      deviceId: log.deviceId,
    });
  });
  events.sort((a, b) => a.time - b.time);

  const activeCountMap = new Map();
  let eventIdx = 0;
  const points = [];

  for (let i = 0; i <= bucketCount; i += 1) {
    const bucketTime = startTime + i * bucketMs;

    while (eventIdx < events.length && events[eventIdx].time <= bucketTime) {
      const ev = events[eventIdx];
      const cur = activeCountMap.get(ev.deviceId) || 0;
      const next = cur + ev.delta;
      if (next > 0) activeCountMap.set(ev.deviceId, next);
      else activeCountMap.delete(ev.deviceId);
      eventIdx += 1;
    }

    const percent = Math.round((activeCountMap.size / TOTAL_DEVICES) * 100);
    const isTick = i % BUCKETS_PER_TICK === 0;

    points.push({ time: bucketTime, isTick, percent });
  }

  return points;
};

const SerialCongestionRate = () => {
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const logs = await fetchSerialCongestion();
      setTimeline(buildTimeline(logs));
      setError(null);
    } catch (e) {
      console.error("[SerialCongestionRate] fetch/build error:", e);
      setError("혼잡도 추이 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, 10000);
    return () => clearInterval(timer);
  }, [loadData]);

  const tickTimes = useMemo(
    () => timeline.filter((p) => p.isTick).map((p) => p.time),
    [timeline],
  );

  if (isLoading) {
    return (
      <Wrapper>
        <Title>실시간 혼잡도 추이</Title>
        <StatusText>불러오는 중...</StatusText>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <Title>실시간 혼잡도 추이</Title>
        <StatusText $isError>{error}</StatusText>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>실시간 혼잡도 추이</Title>
      <SubText>최근 10분 · 10초 단위 집계</SubText>

      <ChartArea>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.color.border} />
            <XAxis
              dataKey="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              ticks={tickTimes}
              tickFormatter={formatTimeLabel}
              stroke={theme.color.sub}
              tick={{ fill: theme.color.sub, fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              unit="%"
              stroke={theme.color.sub}
              tick={{ fill: theme.color.sub, fontSize: 12 }}
            />
            <Tooltip
              labelFormatter={(t) =>
                new Date(t).toLocaleTimeString("ko-KR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                })
              }
              formatter={(value) => [`${value}%`, "혼잡도"]}
              contentStyle={{
                backgroundColor: theme.color.bgSoft,
                border: `1px solid ${theme.color.border}`,
                color: theme.color.text,
              }}
            />
            <Line
              type="monotone"
              dataKey="percent"
              stroke={theme.color.accent}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartArea>
    </Wrapper>
  );
};

export default SerialCongestionRate;
