import { MonitorState, MonitorTarget } from '@/uptime.types'
import { Badge, Card, Group, Text, Tooltip } from '@mantine/core'

export default function MonitorDetail({
  monitor,
  state,
}: {
  monitor: MonitorTarget
  state: MonitorState
}) {
  // 检查是否有有效数据
  const hasValidData = state?.lastUpdate && state.lastUpdate > 1000000000

  // 获取该监控的状态
  const getStatus = () => {
    if (!hasValidData || !state || !state.incident) return 'unknown'
    
    const incidents = state.incident[monitor.id]
    if (!incidents || incidents.length === 0) return 'operational'
    
    const hasOpenIncident = incidents.some((inc) => inc.end === undefined)
    if (hasOpenIncident) return 'down'
    
    const now = Date.now()
    const hasRecentIncident = incidents.some((inc) => {
      const startTime = inc.start[0]
      return now - startTime < 24 * 60 * 60 * 1000
    })
    if (hasRecentIncident) return 'degraded'
    
    return 'operational'
  }

  const status = getStatus()
  
  const statusMap = {
    operational: { label: '✅ 正常运行', color: 'green' },
    degraded: { label: '⚠️ 性能下降', color: 'yellow' },
    down: { label: '❌ 服务中断', color: 'red' },
    unknown: { label: '⏳ 等待数据', color: 'gray' },
  }

  const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.unknown

  // 获取延迟数据
  const latencyData = state?.latency?.[monitor.id]
  const latestPing = latencyData?.recent?.slice(-1)[0]?.ping

  return (
    <Card
      shadow="none"
      padding="md"
      radius="md"
      style={{
        background: 'transparent',
        border: 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xs">
          <Text fw={600} size="md" style={{ color: '#4a2a4a' }}>
            {monitor.name}
          </Text>
          <Badge 
            color={statusInfo.color} 
            size="sm"
            style={{
              background: statusInfo.color === 'green' 
                ? 'rgba(76, 175, 80, 0.2)' 
                : statusInfo.color === 'yellow' 
                  ? 'rgba(255, 193, 7, 0.2)' 
                  : statusInfo.color === 'red'
                    ? 'rgba(244, 67, 54, 0.2)'
                    : 'rgba(158, 158, 158, 0.2)',
              color: statusInfo.color === 'green' 
                ? '#2e7d32' 
                : statusInfo.color === 'yellow' 
                  ? '#f57f17' 
                  : statusInfo.color === 'red'
                    ? '#c62828'
                    : '#616161',
              border: `1px solid ${statusInfo.color === 'green' 
                ? 'rgba(76, 175, 80, 0.3)' 
                : statusInfo.color === 'yellow' 
                  ? 'rgba(255, 193, 7, 0.3)' 
                  : statusInfo.color === 'red'
                    ? 'rgba(244, 67, 54, 0.3)'
                    : 'rgba(158, 158, 158, 0.3)'}`,
            }}
          >
            {statusInfo.label}
          </Badge>
        </Group>

        <Group gap="md">
          {latestPing !== undefined && hasValidData && (
            <Text size="sm" style={{ color: '#7a5a7a' }}>
              ⏱️ {latestPing}ms
            </Text>
          )}
          {!hasValidData && (
            <Text size="sm" style={{ color: '#9a7a9a' }}>
              ⏳ 采集数据中...
            </Text>
          )}
          {monitor.statusPageLink && (
            <Tooltip label="查看详情">
              <Text
                size="sm"
                style={{ color: '#ff6b8a' }}
                component="a"
                href={monitor.statusPageLink}
                target="_blank"
              >
                🔗
              </Text>
            </Tooltip>
          )}
        </Group>
      </Group>

      {monitor.tooltip && (
        <Text size="xs" style={{ color: '#9a7a9a', marginTop: '4px' }}>
          {monitor.tooltip}
        </Text>
      )}
    </Card>
  )
}
