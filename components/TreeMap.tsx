import { MonitorState, MonitorTarget } from '@/uptime.types'
import { Card, Text, Tooltip } from '@mantine/core'

interface TreeMapProps {
  monitors: MonitorTarget[]
  state: MonitorState
}

export default function TreeMap({ monitors, state }: TreeMapProps) {
  // 获取每个监控的状态
  const getMonitorStatus = (id: string) => {
    if (!state || !state.incident) return 'operational'
    
    const incidents = state.incident[id]
    if (!incidents || incidents.length === 0) return 'operational'
    
    const hasOpenIncident = incidents.some((inc) => inc.end === undefined)
    if (hasOpenIncident) return 'down'
    
    const now = Date.now()
    const hasRecentIncident = incidents.some((inc) => {
      const startTime = inc.start[0] * 1000
      return now - startTime < 24 * 60 * 60 * 1000
    })
    if (hasRecentIncident) return 'degraded'
    
    return 'operational'
  }

  // 获取延迟数据
  const getLatency = (id: string) => {
    const latencyData = state?.latency?.[id]
    if (!latencyData?.recent || latencyData.recent.length === 0) return null
    const recent = latencyData.recent.slice(-10) // 最近10个数据点
    const avg = recent.reduce((sum, d) => sum + d.ping, 0) / recent.length
    return Math.round(avg)
  }

  const statusColors = {
    operational: {
      bg: 'rgba(76, 175, 80, 0.25)',
      border: 'rgba(76, 175, 80, 0.4)',
      text: '#2e7d32',
      label: '✅ 运行中'
    },
    degraded: {
      bg: 'rgba(255, 193, 7, 0.25)',
      border: 'rgba(255, 193, 7, 0.4)',
      text: '#f57f17',
      label: '⚠️ 降级'
    },
    down: {
      bg: 'rgba(244, 67, 54, 0.25)',
      border: 'rgba(244, 67, 54, 0.4)',
      text: '#c62828',
      label: '❌ 中断'
    }
  }

  // 计算总数用于百分比
  const totalCount = monitors.length

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px',
      width: '100%',
      marginTop: '16px',
    }}>
      {monitors.map((monitor) => {
        const status = getMonitorStatus(monitor.id)
        const colors = statusColors[status as keyof typeof statusColors] || statusColors.operational
        const latency = getLatency(monitor.id)

        return (
          <Tooltip
            key={monitor.id}
            label={`
              ${monitor.name}
              状态: ${colors.label}
              ${latency ? `延迟: ${latency}ms` : '等待数据...'}
              ${monitor.tooltip || ''}
            `}
            multiline
            style={{ fontSize: '12px' }}
          >
            <Card
              padding="md"
              radius="md"
              style={{
                background: colors.bg,
                border: `2px solid ${colors.border}`,
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '80px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)'
                e.currentTarget.style.boxShadow = `0 8px 25px ${colors.border}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <Text
                size="sm"
                fw={600}
                style={{
                  color: colors.text,
                  textAlign: 'center',
                  fontSize: '14px',
                  lineHeight: 1.3,
                }}
              >
                {monitor.name}
              </Text>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '6px',
              }}>
                <span style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: colors.text,
                  animation: status === 'down' ? 'pulse 1s ease-in-out infinite' : 'none',
                }} />
                <Text size="xs" style={{ color: colors.text, opacity: 0.8 }}>
                  {latency !== null ? `${latency}ms` : '⏳'}
                </Text>
              </div>

              {/* 状态占比条 */}
              <div style={{
                width: '100%',
                height: '3px',
                background: 'rgba(0,0,0,0.05)',
                borderRadius: '2px',
                marginTop: '8px',
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${(1 / totalCount) * 100}%`,
                  height: '100%',
                  background: colors.text,
                  borderRadius: '2px',
                  transition: 'width 0.5s ease',
                }} />
              </div>
            </Card>
          </Tooltip>
        )
      })}

      {/* 添加脉冲动画 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}
