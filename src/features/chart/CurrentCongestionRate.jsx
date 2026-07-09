// src/features/chart/CurrentCongestionRate.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Label,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { theme } from "../../styles/theme";
import { fetchCurrentCongestion } from "../../lib/raspApi";
import {
  Wrapper,
  Title,
  SubText,
  ChartArea,
  StatsRow,
  StatBox,
  StatLabel,
  StatValue,
  StatusText,
} from "./CurrentCongestionRate.style";

// 전체 라즈베리파이 대수 (고정값 - 추후 대수 변경 시 이 값만 수정)
const TOTAL_DEVICES = 100;

// 실시간 반영을 위한 폴링 주기 (ms)
// 발표용 60배율 시연 시에도 "지금이 구간 안에 있는지"만 비교하는 로직이라
// 별도 수정 없이 그대로 동작함
const POLL_INTERVAL = 10000;

const CurrentCongestionRate = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const data = await fetchCurrentCongestion();
      setLogs(data);
      setError(null);
    } catch (e) {
      setError("혼잡도 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [loadData]);

  // deviceId가 여러 로그(중복 사용 이력)를 가질 수 있으므로,
  // "지금 이 순간 사용중인 로그가 하나라도 있는 deviceId"만 Set으로 모아 중복 집계를 방지
  const { inUseCount, idleCount, percent } = useMemo(() => {
    const now = new Date();
    const activeDeviceIds = new Set();

    logs.forEach((log) => {
      const start = new Date(log.createdAt);
      const end = new Date(log.finishAt);
      if (now >= start && now <= end) {
        activeDeviceIds.add(log.deviceId);
      }
    });

    const inUse = activeDeviceIds.size;
    const idle = Math.max(TOTAL_DEVICES - inUse, 0);
    const pct =
      TOTAL_DEVICES > 0 ? Math.round((inUse / TOTAL_DEVICES) * 100) : 0;

    return { inUseCount: inUse, idleCount: idle, percent: pct };
  }, [logs]);

  const chartData = [
    { name: "사용중", value: inUseCount },
    { name: "미사용", value: idleCount },
  ];

  // 혼잡도 개념이므로 "사용중"은 danger, "미사용"은 success로 매핑
  const COLORS = [theme.color.danger, theme.color.success];

  if (isLoading) {
    return (
      <Wrapper>
        <Title>실시간 혼잡도</Title>
        <StatusText>불러오는 중...</StatusText>
      </Wrapper>
    );
  }

  if (error) {
    return (
      <Wrapper>
        <Title>실시간 혼잡도</Title>
        <StatusText $isError>{error}</StatusText>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Title>실시간 혼잡도</Title>
      <SubText>전체 {TOTAL_DEVICES}대 기준</SubText>

      <ChartArea>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={65}
              paddingAngle={2}
              // label, labelLine 제거 - StatsRow에서 이미 숫자 보여주므로 중복/겹침 방지
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
              {/* 도넛 가운데에 혼잡도 % 표시 */}
              <Label
                value={`${percent}%`}
                position="center"
                fill={theme.color.text}
                style={{ fontSize: "20px", fontWeight: 700 }}
              />
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: theme.color.bgSoft,
                border: `1px solid ${theme.color.border}`,
                color: theme.color.text,
              }}
            />
            <Legend
              wrapperStyle={{ color: theme.color.text, fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartArea>

      <StatsRow>{/* 기존 그대로 */}</StatsRow>
    </Wrapper>
  );
};

export default CurrentCongestionRate;
