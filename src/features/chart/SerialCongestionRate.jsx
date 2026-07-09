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

// 실제 데이터 조회 범위 (배속 시연이므로 실제로는 30분치만 쌓여있음)
const RANGE_MINUTES = 30;
const BUCKET_INTERVAL_SECONDS = 10;

// 화면에 "며칠치처럼" 보여줄지 - 실제 30분을 가상 7일로 늘려서 표시
const VIRTUAL_RANGE_DAYS = 7;

// X축 눈금 개수 (가상 7일 구간에 균등하게 배치)
const TICK_COUNT = 7;

/**
 * 실제 타임스탬프(realTime)를 "가상 7일 타임라인" 상의 시각으로 변환.
 * realStart~realEnd(실제 30분)를 virtualStart~virtualEnd(가상 7일)에 선형으로 매핑.
 */
const toVirtualTime = (realTime, realStart, realEnd) => {
  const fraction = (realTime - realStart) / (realEnd - realStart);
  const virtualEnd = Date.now(); // "지금"은 가상으로도 "오늘"
  const virtualStart = virtualEnd - VIRTUAL_RANGE_DAYS * 24 * 60 * 60 * 1000;
  return virtualStart + fraction * (virtualEnd - virtualStart);
};

// 가상 시각을 "요일 M/D" 형태로 표시 (예: "목 07/03")
const formatVirtualDateLabel = (virtualTime) => {
  const d = new Date(virtualTime);
  const weekday = d.toLocaleDateString("ko-KR", { weekday: "short" });
  const date = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(
    d.getDate(),
  ).padStart(2, "0")}`;
  return `${weekday} ${date}`;
};

/**
 * logs를 스윕라인 방식으로 처리해 각 버킷 시점의 "활성 디바이스 수"를 계산.
 * 같은 deviceId가 겹치는 구간을 여러 개 가져도 activeCountMap으로 dedupe 처리됨
 * (카운트가 0보다 크면 그 시점에 "사용중"인 디바이스로 판단).
 */
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
      if (next > 0) {
        activeCountMap.set(ev.deviceId, next);
      } else {
        activeCountMap.delete(ev.deviceId);
      }
      eventIdx += 1;
    }

    const activeDeviceCount = activeCountMap.size;
    const percent = Math.round((activeDeviceCount / TOTAL_DEVICES) * 100);

    points.push({
      time: bucketTime, // 실제 시각 (계산/정렬용, X축 domain에 사용)
      percent,
    });
  }

  return { points, startTime, endTime: now.getTime() };
};

const SerialCongestionRate = () => {
  const [timeline, setTimeline] = useState([]);
  const [realRange, setRealRange] = useState({ startTime: 0, endTime: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const logs = await fetchSerialCongestion();
      const { points, startTime, endTime } = buildTimeline(logs);
      setTimeline(points);
      setRealRange({ startTime, endTime });
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

  // 실제 30분 구간을 가상 7일 구간에 균등 배치한 눈금(실제 시각 기준) 계산
  const tickTimes = useMemo(() => {
    if (!realRange.endTime) return [];
    const { startTime, endTime } = realRange;
    const ticks = [];
    for (let k = 0; k < TICK_COUNT; k += 1) {
      const t = startTime + (k / (TICK_COUNT - 1)) * (endTime - startTime);
      ticks.push(t);
    }
    return ticks;
  }, [realRange]);

  // 실제 시각(tick 값) -> 가상 날짜 라벨로 변환
  const tickFormatter = useCallback(
    (realTime) =>
      formatVirtualDateLabel(
        toVirtualTime(realTime, realRange.startTime, realRange.endTime),
      ),
    [realRange],
  );

  const tooltipLabelFormatter = useCallback(
    (realTime) =>
      formatVirtualDateLabel(
        toVirtualTime(realTime, realRange.startTime, realRange.endTime),
      ),
    [realRange],
  );

  if (isLoading) {
    return (
      <Wrapper>
        <Title>주간 혼잡도 추이</Title>
        <StatusText>불러오는 중...</StatusText>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <Title>주간 혼잡도 추이</Title>
        <StatusText $isError>{error}</StatusText>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>주간 혼잡도 추이</Title>
      <SubText>최근 7일 · 시연 배속 적용</SubText>

      <ChartArea>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.color.border} />
            <XAxis
              dataKey="time"
              type="number"
              domain={["dataMin", "dataMax"]}
              ticks={tickTimes}
              tickFormatter={tickFormatter}
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
              labelFormatter={tooltipLabelFormatter}
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
