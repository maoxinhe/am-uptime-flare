const pageConfig = {
  // 状态页标题
  title: "猫猫监控站",
  // 页眉链接
  links: [
    { link: 'https://web.catfix.top', label: '博客', highlight: true },
    { link: ''https://web.catfix.top', label: 'Blog'},
    { link: 'https://github.com/maoxinhe', label: 'GitHub' }, 
  ],
}

const workerConfig = {
  // KV 写入冷却时间（分钟）
  kvWriteCooldownMinutes: 3,
  
  // 如需 HTTP 基本认证，取消注释并设置用户名密码
  // passwordProtection: 'username:password',
  
  monitors: [
    // HTTP 监控示例 - 监控博客网站
    {
      id: 'blog-http',                    // 唯一ID
      name: '博客 (HTTP)',                // 显示名称
      method: 'GET',                      // 请求方法
      target: 'https://web.catfix.top',   // 监控目标URL
      tooltip: '博客网站 HTTP 可用性监控',
      statusPageLink: 'https://web.catfix.top',
      timeout: 10000,                     // 超时时间 10秒
      expectedCodes: [200, 301, 302],    // 接受的状态码
    },
    
    // TCP 监控示例 - 监控另一个站点
    {
      id: 'blog-tcp',                     // 唯一ID
      name: 'Blog (TCP)',                // 显示名称
      method: 'TCP_PING',                // TCP 监控使用 TCP_PING
      target: '809098.xyz:443',          // TCP 监控格式: host:port
      tooltip: '博客网站 TCP 端口可用性监控',
      statusPageLink: 'https://809098.xyz',
      timeout: 10000,
    },
  ],
  
  // 通知配置
  notification: {
    // Apprise API 服务器地址（需要替换成你自己的）
    appriseApiServer: "https://your-apprise-server.com/notify",
    // 接收通知的地址（需要替换）
    recipientUrl: "tgram://你的BotToken/你的ChatID",
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
      // 状态变化时的回调
      console.log(`监控 ${monitor.name} 状态变更: ${isUp ? '恢复' : '故障'}`);
      console.log(`原因: ${reason}`);
    },
    onIncident: async (
      env: any,
      monitor: any,
      timeIncidentStart: number,
      timeNow: number,
      reason: string
    ) => {
      // 持续故障时的回调（每分钟触发）
      console.log(`监控 ${monitor.name} 持续故障中...`);
    },
  },
}

export { pageConfig, workerConfig }
