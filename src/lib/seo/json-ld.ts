import { absoluteUrl, siteConfig } from "@/config/site";
import type { Course, Review, Teacher } from "@/lib/catalog/types";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icons/icon-512.png"),
    description: siteConfig.description,
    email: siteConfig.supportEmail,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteConfig.url}/courses?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function courseJsonLd(course: Course, teacher: Teacher | undefined, reviews: Review[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.subtitle,
    url: absoluteUrl(`/courses/${course.slug}`),
    inLanguage: "en",
    educationalLevel: course.level,
    provider: { "@type": "Organization", name: siteConfig.name, sameAs: siteConfig.url },
    ...(teacher && { instructor: { "@type": "Person", name: teacher.name, jobTitle: teacher.title } }),
    offers: {
      "@type": "Offer",
      category: course.price === 0 ? "Free" : "Paid",
      price: course.price,
      priceCurrency: course.currency,
      availability: "https://schema.org/InStock",
      url: absoluteUrl(`/courses/${course.slug}`),
    },
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "Online", courseWorkload: "PT2H" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: course.rating, ratingCount: course.ratingCount, bestRating: 5 },
    review: reviews.slice(0, 3).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.body,
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

export function personJsonLd(teacher: Teacher) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: teacher.name,
    jobTitle: teacher.title,
    description: teacher.bio,
    url: absoluteUrl(`/teachers/${teacher.slug}`),
    address: { "@type": "PostalAddress", addressLocality: teacher.city, addressCountry: teacher.country },
  };
}
