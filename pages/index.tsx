import Head from 'next/head'
import { Inter } from 'next/font/google'
import { MonitorState, MonitorTarget } from '@/uptime.types'
import { KVNamespace } from '@cloudflare/workers-types'
import { pageConfig, workerConfig } from '@/uptime.config'
import OverallStatus from '@/components/OverallStatus'
import Header from '@/components/Header'
import MonitorList from '@/components/MonitorList'
import { Center, Divider, Text, Container } from '@mantine/core'
import MonitorDetail from '@/components/MonitorDetail'

export const runtime = 'experimental-edge'
const inter = Inter({ subsets: ['latin'] })

export default function Home({
  state: stateStr,
  monitors,
}: {
  state: string
  monitors: MonitorTarget[]
  tooltip?: string
  statusPageLink?: string
}) {
  let state;
  if (stateStr !== undefined) {
    state = JSON.parse(stateStr) as MonitorState
  }

  const monitorId = window.location.hash.substring(1);
  if (monitorId) {
    const monitor = monitors.find((monitor) => monitor.id === monitorId);
    if (!monitor || !state) {
      return (
        <Container>
          <Text fw={700} style={{ color: '#5a3d5a' }}>
            Monitor with id {monitorId} not found!
          </Text>
        </Container>
      )
    }
    return (
      <Container>
        <div style={{ maxWidth: '810px', margin: '0 auto' }}>
          <MonitorDetail monitor={monitor} state={state} />
        </div>
      </Container>
    )
  }

  return (
    <>
      <Head>
        <title>{pageConfig.title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Header />

        <Container size="md" py="xl">
          {state === undefined ? (
            <Center>
              <Text fw={700} style={{ color: '#5a3d5a' }}>
                Monitor State is not defined now, please check your worker&apos;s status and KV
                binding!
              </Text>
            </Center>
          ) : (
            <div>
              <OverallStatus state={state} />
              <MonitorList monitors={monitors} state={state} />
            </div>
          )}

          <Divider 
            mt="xl" 
            style={{ 
              borderColor: 'rgba(255, 255, 255, 0.3)',
              marginTop: '40px',
            }} 
          />
          <Text 
            size="xs" 
            mt="md" 
            mb="lg" 
            style={{
              textAlign: 'center',
              color: 'rgba(90, 61, 90, 0.6)',
            }}
          >
            ✨ 开源监控系统 · 由{' '}
            <a 
              href="https://github.com/maoxinhe" 
              target="_blank"
              style={{ 
                color: '#ff6b8a',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Uptime
            </a>
            {' '}和{' '}
            <a 
              href="https://www.cloudflare.com/" 
              target="_blank"
              style={{ 
                color: '#ff6b8a',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              maoxinhe
            </a>
            {' '}驱动 · 感谢猫慧云提供技术支持
          </Text>
        </Container>
      </main>
    </>
  )
}

export async function getServerSideProps() {
  const { UPTIMEFLARE_STATE } = process.env as unknown as {
    UPTIMEFLARE_STATE: KVNamespace
  }

  const state = (await UPTIMEFLARE_STATE?.get('state')) as unknown as MonitorState

  const monitors = workerConfig.monitors.map((monitor) => {
    return {
      id: monitor.id,
      name: monitor.name,
      tooltip: monitor?.tooltip,
      statusPageLink: monitor?.statusPageLink
    }
  })

  return { props: { state, monitors } }
}
