import { Center, Text, RingProgress, Paper } from '@mantine/core'
import { MonitorState } from '@/uptime.types'

// ===== 强制北京时间格式化函数 =====
function formatBeijingTime(timestamp: number): string {
  if (!timestamp || timestamp < 1000000000) {
    return '等待数据采集...'
  }
  
  const date = new Date(timestamp * 1000)
  const beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000)
  
  const year = beijingTime.getUTCFullYear()
  const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0')
  const day = String(beijingTime.getUTCDate()).padStart(2, '0')
  const hours = String(beijingTime.getUTCHours()).padStart(2, '0')
  const minutes = String(beijingTime.getUTCMinutes()).padStart(2, '0')
  const seconds = String(beijingTime.getUTCSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

export default function OverallStatus({ state }: { state: MonitorState }) {
  const hasValidData = state?.lastUpdate && state.lastUpdate > 1000000000
  
  const up = state?.overallUp || 0
  const down = state?.overallDown || 0
  const total = up + down || 1
  const percentage = total > 0 ? (up / total) * 100 : 0

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
            { value: hasValidData ? percentage : 0, color: percentage === 100 && hasValidData ? '#ff9a9e' : '#ff6b8a' },
          ]}
          label={
            <Center>
              <div>
                <Text size="xl" fw={700} style={{ color: '#5a3d5a' }}>
                  {hasValidData ? percentage.toFixed(0) : '--'}%
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
          {hasValidData ? (
            <>
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
            </>
          ) : (
            <Text size="sm" style={{ color: '#ff6b8a' }}>
              📡 等待监控数据采集...
            </Text>
          )}
          <Text size="xs" style={{ color: '#9a7a9a', marginTop: '4px' }}>
            {hasValidData ? `📅 最后更新: ${formatBeijingTime(state.lastUpdate)}` : '⏳ 首次数据采集中，请稍候...'}
          </Text>
        </div>
      </Center>
    </Paper>
  )
}
