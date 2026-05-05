export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness", "FoodEstablishment"],
    "name": "BELUGA Catering",
    "url": "https://belugacatering.vn",
    "logo": "https://belugacatering.vn/logo.png",
    "image": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=90",
    "description": "Dịch vụ catering cao cấp tại TP.HCM — suất ăn văn phòng, tiệc sự kiện, buffet trọn gói cho doanh nghiệp.",
    "telephone": "+84909123456",
    "email": "hello@belugacatering.vn",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Thành phố Hồ Chí Minh",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 10.7769,
      "longitude": 106.7009
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "07:00",
        "closes": "20:00"
      }
    ],
    "servesCuisine": ["Vietnamese", "Asian", "International"],
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5"
    },
    "sameAs": [
      "https://facebook.com/belugacatering"
    ]
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "BELUGA Catering",
    "url": "https://belugacatering.vn",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://belugacatering.vn/menus?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ServiceJsonLd({ name, description, url }: { name: string; description: string; url: string }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": name,
    "description": description,
    "url": url,
    "provider": {
      "@type": "LocalBusiness",
      "name": "BELUGA Catering",
      "telephone": "+84909123456"
    },
    "areaServed": {
      "@type": "City",
      "name": "Thành phố Hồ Chí Minh"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "127",
      "bestRating": "5"
    }
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FaqJsonLd({ faqs }: { faqs: { q: string; a: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BlogPostJsonLd({ title, description, image, author, datePublished, url }: {
  title: string; description?: string; image?: string; author?: string; datePublished?: string; url: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image,
    "author": { "@type": "Person", "name": author ?? "BELUGA Team" },
    "publisher": {
      "@type": "Organization",
      "name": "BELUGA Catering",
      "logo": { "@type": "ImageObject", "url": "https://belugacatering.vn/logo.png" }
    },
    "datePublished": datePublished,
    "url": url,
    "mainEntityOfPage": { "@type": "WebPage", "@id": url }
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
