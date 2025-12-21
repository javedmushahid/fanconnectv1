import Head from 'next/head'

interface MetaTagsProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  tags?: string[]
  noIndex?: boolean
}

export default function MetaTags({
  title = 'FanConnect - Connect with Your Favorite Creators',
  description = 'Join FanConnect to support and connect with your favorite creators. Subscribe, watch live streams, and access exclusive content.',
  image = '/og-image.png',
  url = 'https://fanconnect.com',
  type = 'website',
  author,
  publishedTime,
  tags,
  noIndex = false,
}: MetaTagsProps) {
  const fullTitle = title.includes('FanConnect') ? title : `${title} | FanConnect`
  const fullUrl = url.startsWith('http') ? url : `https://fanconnect.com${url}`
  const fullImage = image.startsWith('http') ? image : `https://fanconnect.com${image}`

  // Structured Data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type === 'profile' ? 'Person' : type === 'article' ? 'Article' : 'WebSite',
    name: title,
    description,
    url: fullUrl,
    ...(image && { image: fullImage }),
    ...(author && { author: { '@type': 'Person', name: author } }),
    ...(publishedTime && { datePublished: publishedTime }),
    ...(tags && { keywords: tags.join(', ') }),
  }

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <link rel="canonical" href={fullUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="FanConnect" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content="@fanconnect" />
      
      {/* Article specific */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && author && (
        <meta property="article:author" content={author} />
      )}
      {type === 'article' && tags && tags.map((tag) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Profile specific */}
      {type === 'profile' && author && (
        <>
          <meta property="profile:username" content={author} />
          <meta property="profile:first_name" content={author.split(' ')[0]} />
        </>
      )}

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/icon-192.png" />
    </Head>
  )
}
