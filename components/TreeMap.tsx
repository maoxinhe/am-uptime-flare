import { MonitorState, MonitorTarget } from '@/uptime.types'
import { Card, Text, Badge, Group, Box } from '@mantine/core'

interface TreeMapProps {
  monitors: MonitorTarget[]
  state: MonitorState
}

// 自定义分组配置 - 根据你的监控项名称来分组
const getGroup = (monitorName: string): string => {
  if (monitorName.includes('博客') || monitorName.includes('Blog')) {
    return '网站'
  }
  if (monitorName.includes('服务器') || monitorName.includes('Server')) {
    return '服务器'
  }
  return '其他'
}

// 获取状态标签
const getStatusInfo = (id: string, state: MonitorState) => {
  if (!state || !state.incident) {
    return { label: '⏳ 等待数据', color: 'gray' }
  }

  const incidents = state.incident[id]
  if (!incidents || incidents.length === 0) {
    return { label: '✅ 正常', color: 'green' }
  }

  const hasOpenIncident = incidents.some((inc) => inc.end === undefined)
  if (hasOpenIncident) {
    return { label: '❌ 服务中断', color: 'red' }
  }

  const now = Date.now()
  const hasRecentIncident = incidents.some((inc) => {
    const startTime = inc.start[0] * 1000
    return now - startTime < 24 * 60 * 60 * 1000
  })
  if (hasRecentIncident) {
    return { label: '⚠️ 降级', color: 'yellow' }
  }

  return { label: '✅ 正常', color: 'green' }
}

export default function TreeMap({ monitors, state }: TreeMapProps) {
  // 按分组整理数据
  const groups: Record<string, MonitorTarget[]> = {}
  
  monitors.forEach((monitor) => {
    const group = getGroup(monitor.name)
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(monitor)
  })

  // 获取延迟显示
  const getLatencyDisplay = (id: string) => {
    const latencyData = state?.latency?.[id]
    if (!latencyData?.recent || latencyData.recent.length === 0) return null
    const recent = latencyData.recent.slice(-5)
    const avg = recent.reduce((sum, d) => sum + d.ping, 0) / recent.length
    return Math.round(avg)
  }

  const groupEmojis: Record<string, string> = {
    '网站': '🌐',
    '服务器': '🖥️',
    '其他': '📦'
  }

  return (
    <Card
      padding="lg"
      radius="md"
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
      }}
    >
      {Object.entries(groups).map(([groupName, groupMonitors]) => (
        <Box key={groupName} mb="md">
          {/* 分组标题 */}
          <Text 
            size="sm" 
            fw={600} 
            style={{ 
              color: '#5a3d5a',
              marginBottom: '8px',
              paddingBottom: '4px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
            }}
          >
            {groupEmojis[groupName] || '📁'} {groupName}
          </Text>

          {/* 组内服务列表 */}
          {groupMonitors.map((monitor) => {
            const statusInfo = getStatusInfo(monitor.id, state)
            const latency = getLatencyDisplay(monitor.id)

            return (
              <Box
                key={monitor.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  marginBottom: '4px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                }}
              >
                <Group gap="xs">
                  <Text size="sm" style={{ color: '#4a2a4a' }}>
                    {monitor.name}
                  </Text>
                  {latency !== null && (
                    <Text size="xs" style={{ color: '#9a7a9a' }}>
                      {latency}ms
                    </Text>
                  )}
                </Group>

                <Badge
                  size="sm"
                  style={{
                    background: statusInfo.color === 'green' 
                      ? 'rgba(76, 175, 80, 0.15)' 
                      : statusInfo.color === 'yellow' 
                        ? 'rgba(255, 193, 7, 0.15)' 
                        : statusInfo.color === 'red'
                          ? 'rgba(244, 67, 54, 0.15)'
                          : 'rgba(158, 158, 158, 0.15)',
                    color: statusInfo.color === 'green' 
                      ? '#2e7d32' 
                      : statusInfo.color === 'yellow' 
                        ? '#f57f17' 
                        : statusInfo.color === 'red'
                          ? '#c62828'
                          : '#616161',
                    border: 'none',
                    fontWeight: 500,
                    padding: '4px 12px',
                    borderRadius: '20px',
                  }}
                >
                  {statusInfo.label}
                </Badge>
              </Box>
            )
          })}
        </Box>
      ))}

      {/* 底部更新时间 */}
      <Box mt="md" pt="sm" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Text size="xs" style={{ color: '#9a7a9a' }}>
          最后更新: {formatBeijingTime(state?.lastUpdate)}
        </Text>
      </Box>
    </Card>
  )
}

// ===== 强制北京时间格式化函数 =====
function formatBeijingTime(timestamp: number): string {
  if (!timestamp || timestamp < 1000000000) {
    return '等待数据采集...'
  }
  
  // 创建日期对象
  const date = new Date(timestamp * 1000)
  
  // 强制转换为北京时间 (UTC+8)
  const beijingTime = new Date(date.getTime() + 8 * 60 * 60 * 1000)
  
  const year = beijingTime.getUTCFullYear()
  const month = String(beijingTime.getUTCMonth() + 1).padStart(2, '0')
  const day = String(beijingTime.getUTCDate()).padStart(2, '0')
  const hours = String(beijingTime.getUTCHours()).padStart(2, '0')
  const minutes = String(beijingTime.getUTCMinutes()).padStart(2, '0')
  const seconds = String(beijingTime.getUTCSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
