/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://dles.fun",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  // Exclude private/authenticated routes
  exclude: ["/admin", "/admin/*", "/dashboard", "/dashboard/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/dashboard", "/api"],
      },
    ],
  },
};
