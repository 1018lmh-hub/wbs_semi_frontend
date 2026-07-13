// src/features/chart/CurrentCongestionRate.jsx
import React, { useMemo } from "react";
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

const CurrentCongestionRate = ({ logs, isLoading, error }) => {
  // 백엔드 findCurrent()가 이미 "그 순간 활성인 세션"만 정확히 필터링해서 줌.
  // 클라이언트에서 now와 다시 비교하면, 캐시 지연 + 짧은 세션(최소 3초) 때문에
  // 이미 끝난 세션까지 걸러내며 혼잡도가 실제보다 낮게(심하면 0으로) 잘못 계산됨.
  // 따라서 여기서는 deviceId 중복 제거만 하고, 시간 재검증은 하지 않음.
  const { inUseCount, idleCount, percent } = useMemo(() => {
    const activeDeviceIds = new Set(logs.map((log) => log.deviceId));

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
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index]} />
              ))}
              <Label
                value={`${percent}%`}
                position="center"
                fill={theme.color.text}
                style={{ fontSize: "24px", fontWeight: 700 }}
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

      <StatsRow>
        <StatBox>
          <StatLabel>사용중</StatLabel>
          <StatValue $color={theme.color.danger}>{inUseCount}대</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>미사용</StatLabel>
          <StatValue $color={theme.color.success}>{idleCount}대</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>혼잡도</StatLabel>
          <StatValue $color={theme.color.accent}>{percent}%</StatValue>
        </StatBox>
      </StatsRow>
    </Wrapper>
  );
};

export default CurrentCongestionRate;
