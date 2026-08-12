import { MonitorState, MonitorTarget } from '@/uptime.types'
import { Card, Text, Box } from '@mantine/core'

interface TreeMapProps {
  monitors: MonitorTarget[]
  state: MonitorState
}

// ===== 分组表情映射 =====
const groupEmojis: Record<string, string> = {
  '网站': '🌐',
  '服务器': '🖥️',
  'API 服务': '⚡',
  '数据库': '🗄️',
  '其他': '📦'
}

// ===== 获取分组 =====
const getGroup = (monitor: MonitorTarget): string => {
  return (monitor as any).group || '网站'
}

// ===== 获取状态信息（含竖条颜色） =====
const getStatusInfo = (id: string, state: MonitorState) => {
  if (!state || !state.incident || !state.incident[id]) {
    return { label: '等待数据', color: '#9e9e9e', barColor: '#9e9e9e' }
  }

  const incidents = state.incident[id]
  if (incidents.length === 0) {
    return { label: '正常', color: '#2e7d32', barColor: '#43a047' }
  }

  const hasOpenIncident = incidents.some((inc) => inc.end === undefined)
  if (hasOpenIncident) {
    return { label: '服务中断', color: '#c62828', barColor: '#e53935' }
  }

  const now = Date.now()
  const hasRecentIncident = incidents.some((inc) => {
    const startTime = inc.start[0] * 1000
    return now - startTime < 24 * 60 * 60 * 1000
  })
  if (hasRecentIncident) {
    return { label: '降级', color: '#f57f17', barColor: '#fb8c00' }
  }

  return { label: '正常', color: '#2e7d32', barColor: '#43a047' }
}

// ===== 获取延迟 =====
const getLatencyDisplay = (id: string, state: MonitorState) => {
  const latencyData = state?.latency?.[id]
  if (!latencyData?.recent || latencyData.recent.length === 0) return null
  const recent = latencyData.recent.slice(-5)
  const avg = recent.reduce((sum, d) => sum + d.ping, 0) / recent.length
  return Math.round(avg)
}

// ===== 北京时间格式化 =====
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

export default function TreeMap({ monitors, state }: TreeMapProps) {
  // 按分组整理数据
  const groups: Record<string, MonitorTarget[]> = {}
  
  monitors.forEach((monitor) => {
    const group = getGroup(monitor)
    if (!groups[group]) {
      groups[group] = []
    }
    groups[group].push(monitor)
  })

  const sortedGroups = Object.keys(groups).sort()

  return (
    <Card
      padding="lg"
      radius="lg"
      style={{
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '16px',
      }}
    >
      {sortedGroups.map((groupName) => (
        <Box key={groupName}>
          {/* 分组标题 */}
          <Text 
            size="xs" 
            fw={500}
            style={{ 
              color: '#7a5a7a',
              marginBottom: '6px',
              paddingBottom: '4px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {groupEmojis[groupName] || '📁'} {groupName}
          </Text>

          {/* 组内服务列表 */}
          {groups[groupName].map((monitor) => {
            const statusInfo = getStatusInfo(monitor.id, state)
            const latency = getLatencyDisplay(monitor.id, state)

            return (
              <Box
                key={monitor.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  marginBottom: '2px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                }}
              >
                {/* 左侧：名称 + 延迟 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Text size="sm" style={{ color: '#3a2a3a', fontWeight: 500 }}>
                    {monitor.name}
                  </Text>
                  {latency !== null && (
                    <Text size="xs" style={{ color: '#9a8a9a' }}>
                      {latency}ms
                    </Text>
                  )}
                </div>

                {/* 右侧：状态标签 + 竖条 */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    background: statusInfo.color === '#2e7d32' ? 'rgba(46,125,50,0.12)' :
                               statusInfo.color === '#f57f17' ? 'rgba(245,127,23,0.12)' :
                               statusInfo.color === '#c62828' ? 'rgba(198,40,40,0.12)' :
                               'rgba(158,158,158,0.12)',
                    padding: '2px 12px 2px 8px',
                    borderRadius: '12px',
                  }}>
                    <span style={{ 
                      fontSize: '10px',
                      color: statusInfo.color,
                    }}>●</span>
                    <Text size="xs" style={{ color: statusInfo.color, fontWeight: 500 }}>
                      {statusInfo.label}
                    </Text>
                  </div>

                  {/* ===== 右侧竖条（状态指示条） ===== */}
                  <div style={{
                    width: '4px',
                    height: '28px',
                    borderRadius: '4px',
                    background: statusInfo.barColor,
                    transition: 'background 0.5s ease',
                  }} />
                </div>
              </Box>
            )
          })}
        </Box>
      ))}

      {/* 底部更新时间 */}
      <Box mt="md" pt="sm" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <Text size="xs" style={{ color: '#9a8a9a' }}>
          📅 最后更新: {formatBeijingTime(state?.lastUpdate)}
        </Text>
      </Box>
    </Card>
  )
}
