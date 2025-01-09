export default async function sitemap() {
  const site = process.env.NEXT_PUBLIC_FRONTEND_URL;

  return [
    {
      url: `${site}/`,
      changeFrequency: 'weekly',
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${site}/?sale=true`,
      changeFrequency: 'daily',
      priority: 0.7,
      lastModified: new Date(),
    },
    {
      url: `${site}/store`,
      changeFrequency: 'daily',
      priority: 0.7,
      lastModified: new Date(),
    },

  ];
}
