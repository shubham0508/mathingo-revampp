/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.mathzai.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ['/api/*'],
  changefreq: 'daily',
  priority: 0.7,
};
