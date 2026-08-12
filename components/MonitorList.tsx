import { MonitorState, MonitorTarget } from '@/uptime.types'
import { Card, Center, Divider, Text } from '@mantine/core'
import MonitorDetail from './MonitorDetail'

export default function MonitorList({ monitors, state }: { monitors: any; state: MonitorState }) {
  // 如果没有监控数据，显示提示
  if (!monitors || monitors.length === 0) {
    return (
      <Center>
        <Card
          shadow="sm"
          padding="xl"
          radius="md"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '865px',
            marginTop: '20px',
            textAlign: 'center',
          }}
        >
          <Text style={{ color: '#7a5a7a' }}>
            📡 暂无监控数据，请检查 Worker 状态
          </Text>
        </Card>
      </Center>
    )
  }

  return (
    <Center>
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        ml="xl"
        mr="xl"
        mt="xl"
        style={{
          background: 'rgba(255, 255, 255, 0.10)',
          backdropFilter: 'blur(16px) saturate(180%)',
          WebkitBackdropFilter: 'blur(16px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.20)',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '865px',
          boxShadow: '0 8px 32px rgba(255, 154, 158, 0.10)',
        }}
      >
        {monitors.map((monitor: MonitorTarget, index: number) => (
          <div key={monitor.id}>
            <Card.Section ml="xs" mr="xs">
              <MonitorDetail monitor={monitor} state={state} />
            </Card.Section>
            {index < monitors.length - 1 && (
              <Divider 
                style={{ 
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  margin: '8px 0',
                }} 
              />
            )}
          </div>
        ))}
      </Card>
    </Center>
  )
}
