const pageConfig = {
  title: "猫猫监控站",
  links: [
    { link: 'https://web.catfix.top', label: '博客', highlight: true },
    { link: 'https://github.com/maoxinhe', label: 'GitHub' }, 
  ],
}

const workerConfig = {
  kvWriteCooldownMinutes: 3,
  monitors: [
    {
      id: 'web.catfix.top',
      name: '博客',
      method: 'GET',
      target: 'https://web.catfix.top',
      tooltip: '博客网站监控',
      statusPageLink: 'https://web.catfix.top',
      timeout: 10000,
    },
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
    appriseApiServer: "https://apprise.example.com/notify",
    // 使用环境变量，不要在代码中硬编码
    recipientUrl: `mailto:///catkinr@163.com?from=onboarding@resend.dev&smtp=smtp.resend.com&port=587&user=resend&pass=${env.RESEND_API_KEY}`,
    timeZone: "Asia/Shanghai",
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
