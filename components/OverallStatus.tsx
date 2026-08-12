import { Center, Text, RingProgress, Paper } from '@mantine/core'
import { MonitorState } from '@/uptime.types'

export default function OverallStatus({ state }: { state: MonitorState }) {
  // 从 state 中获取整体状态数据
  const up = state?.overallUp || 0
  const down = state?.overallDown || 0
  const total = up + down || 1 // 避免除以0
  const percentage = total > 0 ? (up / total) * 100 : 100

  return (
    <Paper
      p="xl"
      radius="lg"
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(255, 154, 158, 0.15)',
        marginBottom: '30px',
      }}
    >
      <Center>
        <RingProgress
          size={120}
          thickness={12}
          roundCaps
          sections={[
            { value: percentage, color: percentage === 100 ? '#ff9a9e' : '#ff6b8a' },
          ]}
          label={
            <Center>
              <div>
                <Text size="xl" fw={700} style={{ color: '#5a3d5a' }}>
                  {percentage.toFixed(0)}%
                </Text>
                <Text size="xs" style={{ color: '#7a5a7a' }}>
                  正常率
                </Text>
              </div>
            </Center>
          }
        />
        <div style={{ marginLeft: '30px' }}>
          <Text size="lg" fw={600} style={{ color: '#5a3d5a' }}>
            🐱 系统状态
          </Text>
          <Text size="sm" style={{ color: '#7a5a7a' }}>
            {up} 个服务正常运行
          </Text>
          {down > 0 && (
            <Text size="sm" style={{ color: '#ff6b8a' }}>
              {down} 个服务异常
            </Text>
          )}
          {down === 0 && total > 0 && (
            <Text size="sm" style={{ color: '#4a9e6a' }}>
              ✨ 所有服务运行正常
            </Text>
          )}
          <Text size="xs" style={{ color: '#9a7a9a', marginTop: '4px' }}>
            最后更新: {state?.lastUpdate ? new Date(state.lastUpdate).toLocaleString('zh-CN') : '--'}
          </Text>
        </div>
      </Center>
    </Paper>
  )
}
