import { useEffect } from "react";

const upsertMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const upsertLinkTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
};

const SeoMeta = ({ title, description, path, image = "/logo.png" }) => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const canonicalUrl =
      typeof window !== "undefined"
        ? new URL(path || window.location.pathname, window.location.origin).toString()
        : path || "";
    const imageUrl = image.startsWith("http")
      ? image
      : `${baseUrl}${image.startsWith("/") ? image : `/${image}`}`;

    document.title = title;
    upsertMetaTag('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: "website",
    });
    upsertMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    upsertMetaTag('meta[property="og:image"]', {
      property: "og:image",
      content: imageUrl,
    });
    upsertMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertLinkTag('link[rel="canonical"]', {
      rel: "canonical",
      href: canonicalUrl,
    });
  }, [description, image, path, title]);

  return null;
};

export default SeoMeta;