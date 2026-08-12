const pageConfig = {
  // Title for your status page
  title: "猫猫监控站",
  // Links shown at the header of your status page, could set `highlight` to `true`
  links: [
    { link: 'https://web.catfix.top', label: '博客', highlight: true },
    { link: 'https://809098.xyz', label: 'Blog'}, 
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
    // Example HTTP Monitor
    {
      id: 'web.catfix.top',
      name: '博客',
      method: 'GET',
      target: 'https://am.809098.xyz',
      tooltip: 'This is a tooltip for this monitor',
      statusPageLink: 'https://am.809098.xyz',
      timeout: 10000,
    },
    // Example TCP Monitor
    {
      id: '809098.xyz',
      name: 'Blog',
      method: 'TCP_PING',  // ← 这里也要改，应该是 TCP_PING
      target: '809098.xyz:443',  // ← TCP 监控格式是 host:port
      tooltip: 'My production server monitor',
      statusPageLink: 'https://809098.xyz',
      timeout: 10000,
    },
  ],
  notification: {
    appriseApiServer: "https://apprise.example.com/notify",
    recipientUrl: "tgram://bottoken/ChatID",
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
      // This callback will be called when there's a status change for any monitor
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // This callback will be called EVERY 1 MINTUE if there's an on-going incident for any monitor
    },
  },
}

export { pageConfig, workerConfig }
