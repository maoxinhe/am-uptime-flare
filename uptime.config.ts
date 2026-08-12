const pageConfig = {
  // Title for your status page
  title: "猫猫监控站",
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'https://web.catfix.top', label: '博客', highlight: true },
    { link: 'https://github.com/maoxinhe', label: 'GitHub' }, 
  ],
}

const workerConfig = {
  // Write KV at most every 3 minutes unless the status changed
  kvWriteCooldownMinutes: 3,
  // Enable HTTP Basic auth for status page & API by uncommenting the line below, format `<USERNAME>:<PASSWORD>`
  // passwordProtection: 'username:password',
  // Define all your monitors here
  monitors: [
    // HTTP Monitor
    {
      id: 'web.catfix.top',
      name: '博客',
      method: 'GET',
      target: 'https://web.catfix.top',
      tooltip: '博客网站监控',
      statusPageLink: 'https://web.catfix.top',
      timeout: 10000,
    },
    // TCP Monitor
    {
      id: '809098.xyz',
      name: 'Blog',
      method: 'TCP_PING',
      target: '809098.xyz:443',
      tooltip: '博客网站端口监控',
      statusPageLink: 'https://809098.xyz',
      timeout: 10000,
    },
  ],
  notification: {
    // Apprise API server URL
    appriseApiServer: "https://apprise.example.com/notify",
    // Resend 测试模式 - 直接写入 API Key
    recipientUrl: "mailto:///catkinr@163.com?from=onboarding@resend.dev&smtp=smtp.resend.com&port=587&user=resend&pass=re_DpXVX647_KpRfGECTkb3JHKNmz31DATpm",
    // 时区
    timeZone: "Asia/Shanghai",
    // 宽限期：连续失败5分钟后才发送通知
    gracePeriod: 5,
  },
  callbacks: {
    onStatusChange: async (
      env: any,
      monitor: any,
      isUp: boolean,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 状态变化回调
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 持续故障回调
    },
  },
}

export { pageConfig, workerConfig }
