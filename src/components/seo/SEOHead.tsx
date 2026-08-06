import React, { useEffect } from 'react';
import { Product, BlogPost, BotanicalEntry } from '../../types';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import { useShop } from '../../context/ShopContext';

export interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  product?: Product;
  article?: BlogPost;
  botanical?: BotanicalEntry;
  breadcrumbItems?: { name: string; item: string }[];
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noIndex = false,
  product,
  article,
  botanical,
  breadcrumbItems
}) => {
  const { storeSettings } = useShop();

  const siteName = storeSettings.seo?.defaultMetaTitle || storeSettings.brand?.name || 'OMIAÁ • Alquimia Ancestral';
  const defaultDesc =
    storeSettings.seo?.defaultMetaDescription ||
    storeSettings.brand?.description ||
    'Casa e alta botânica de Alquimia Ancestral, elixires botânicos, séruns faciais, óleos macerados sob a lua, infusões solares e criação de fragrâncias exclusivas sob medida.';
  const defaultKeywords =
    storeSettings.seo?.defaultKeywords || [
      'Alquimia',
      'Botânica Ancestral',
      'Elixires',
      'Sérum Facial',
      'Maceração Lunar',
      'Fragrâncias Exclusivas',
      'Fitoterapia',
      'Perfumaria Artesanal',
      'OMIAÁ Alquimia Ancestral'
    ];
  const baseUrl = 'https://omiaa.com.br';

  const fullTitle = title ? `${title} | ${storeSettings.brand?.name || 'OMIAÁ Alquimia'}` : siteName;
  const metaDesc = description || defaultDesc;
  const metaKeywords = (keywords || defaultKeywords).join(', ');
  const currentCanonical = canonicalUrl ? `${baseUrl}${canonicalUrl}` : baseUrl;
  const imageUrl = getOptimizedImageUrl(
    ogImage ||
      product?.images?.[0] ||
      article?.coverImage ||
      botanical?.imageUrl ||
      storeSettings.seo?.ogImageUrl ||
      storeSettings.visualIdentity?.shareImageUrl ||
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200',
    1200,
    85
  );

  useEffect(() => {
    // 1. Update Title
    document.title = fullTitle;

    // Helper to set or update meta tag
    const setMeta = (nameAttr: string, keyName: string, contentVal: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${keyName}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, keyName);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentVal);
    };

    // Helper to set or update link tag
    const setLink = (rel: string, hrefVal: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', hrefVal);
    };

    // 2. Set Standard Meta Tags
    setMeta('name', 'description', metaDesc);
    setMeta('name', 'keywords', metaKeywords);
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    setLink('canonical', currentCanonical);

    // 3. Set Open Graph Tags
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', metaDesc);
    setMeta('property', 'og:url', currentCanonical);
    setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:type', ogType);
    setMeta('property', 'og:site_name', 'OMIAÁ Alquimia Ancestral');
    setMeta('property', 'og:locale', 'pt_BR');

    // 4. Set Twitter Tags
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', metaDesc);
    setMeta('name', 'twitter:image', imageUrl);

    // 5. Build Dynamic JSON-LD Structured Data
    const schemas: any[] = [];

    // Store / LocalBusiness Schema
    schemas.push({
      '@type': 'LocalBusiness',
      '@id': `${baseUrl}/#store`,
      name: 'OMIAÁ Alquimia Ancestral',
      url: baseUrl,
      image: imageUrl,
      priceRange: '$$',
      telephone: '+5511987654321',
      description: metaDesc
    });

    // Product Schema (SEO para Produtos)
    if (product) {
      schemas.push({
        '@type': 'Product',
        '@id': `${baseUrl}/produto/${product.slug}#product`,
        name: product.name,
        description: product.fullDescription || product.shortDescription,
        image: product.images?.map((img) => getOptimizedImageUrl(img, 1200)) || [imageUrl],
        sku: product.sku || `SKU-${product.id}`,
        brand: {
          '@type': 'Brand',
          name: 'OMIAÁ Alquimia Ancestral'
        },
        offers: {
          '@type': 'Offer',
          url: `${baseUrl}/produto/${product.slug}`,
          priceCurrency: 'BRL',
          price: product.price.toFixed(2),
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          seller: {
            '@type': 'Organization',
            name: 'OMIAÁ Alquimia Ancestral'
          }
        },
        aggregateRating: product.rating
          ? {
              '@type': 'AggregateRating',
              ratingValue: product.rating.toString(),
              reviewCount: (product.reviewsCount || 10).toString()
            }
          : undefined
      });
    }

    // Blog Posting Schema (SEO para Blog)
    if (article) {
      schemas.push({
        '@type': 'BlogPosting',
        '@id': `${baseUrl}/blog/${article.slug}#article`,
        headline: article.title,
        description: article.excerpt,
        articleBody: article.content,
        image: getOptimizedImageUrl(article.coverImage, 1200),
        author: {
          '@type': 'Person',
          name: article.author || 'Mestre Alquimista Omiaá'
        },
        publisher: {
          '@type': 'Organization',
          name: 'OMIAÁ Alquimia Ancestral',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        },
        datePublished: article.publishedAt || '2026-07-20',
        dateModified: article.publishedAt || '2026-07-20',
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/blog/${article.slug}`
        },
        keywords: article.tags?.join(', ')
      });
    }

    // Botanical Library Schema (SEO para Guia das Ervas)
    if (botanical) {
      schemas.push({
        '@type': 'DefinedTerm',
        '@id': `${baseUrl}/botanica/${botanical.slug}#term`,
        name: `${botanical.popularName} (${botanical.botanicalName})`,
        description: `${botanical.historicalOrigin} Propriedades: ${botanical.medicinalProperties?.join(', ')}.`,
        termCode: botanical.slug,
        inDefinedTermSet: {
          '@type': 'DefinedTermSet',
          name: 'Guia das Ervas OMIAÁ Alquimia Ancestral',
          url: `${baseUrl}/botanica`
        }
      });

      schemas.push({
        '@type': 'MedicalWebPage',
        '@id': `${baseUrl}/botanica/${botanical.slug}#medical_page`,
        name: botanical.popularName,
        about: {
          '@type': 'Substance',
          name: botanical.botanicalName,
          description: botanical.medicinalProperties?.join(', ')
        },
        aspect: ['Overview', 'Treatment', 'Usage'],
        lastReviewed: '2026-07-27'
      });
    }

    // Breadcrumb Schema
    if (breadcrumbItems && breadcrumbItems.length > 0) {
      schemas.push({
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.item}`
        }))
      });
    }

    // Inject Script Tag
    let scriptTag = document.querySelector('#dynamic-seo-jsonld') as HTMLScriptElement;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'dynamic-seo-jsonld';
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    scriptTag.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': schemas
    });
  }, [
    fullTitle,
    metaDesc,
    metaKeywords,
    currentCanonical,
    imageUrl,
    ogType,
    noIndex,
    product,
    article,
    botanical,
    breadcrumbItems
  ]);

  return null;
};
