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

// X축 눈금: 시계 기준 2분 간격 (예: 14:32:00, 14:34:00...)
const TICK_INTERVAL_MINUTES = 2;
const TICK_INTERVAL_MS = TICK_INTERVAL_MINUTES * 60 * 1000;

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

    points.push({ time: bucketTime, percent });
  }

  return points;
};

// 주어진 [start, end] 구간 안에서, 시계 기준 TICK_INTERVAL_MS의 배수가 되는
// 시각들만 뽑아서 눈금으로 사용 (예: 14:32:00, 14:34:00, 14:36:00 ...)
const buildClockAlignedTicks = (start, end) => {
  if (!start || !end) return [];
  const first = Math.ceil(start / TICK_INTERVAL_MS) * TICK_INTERVAL_MS;
  const ticks = [];
  for (let t = first; t <= end; t += TICK_INTERVAL_MS) {
    ticks.push(t);
  }
  return ticks;
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

  const tickTimes = useMemo(() => {
    if (timeline.length === 0) return [];
    const start = timeline[0].time;
    const end = timeline[timeline.length - 1].time;
    return buildClockAlignedTicks(start, end);
  }, [timeline]);

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
