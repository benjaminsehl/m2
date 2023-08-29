import {
  defer,
  type LoaderArgs,
  type V2_MetaFunction,
} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Money, Image, flattenConnection} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import React from 'react';
import {MEDIA_FRAGMENT} from '~/lib/fragments';
import {Hero} from '~/components';

export const meta: V2_MetaFunction = () => {
  return [{title: 'Hydrogen | Home'}];
};

export async function loader({context}: LoaderArgs) {
  const {storefront} = context;
  const {heroBanners} = await storefront.query(HOMEPAGE_CONTENT_QUERY);

  return defer({banners: flattenConnection(heroBanners)});
}

export default function Homepage() {
  const {banners} = useLoaderData<typeof loader>();
  return (
    <div>
      {banners?.length > 0 &&
        banners.map((hero, i) => (
          <Hero
            key={hero.id}
            headline={hero?.headline?.value}
            media={hero?.media?.references?.nodes}
            product={hero?.product?.reference || null}
            textColour={hero?.textColour?.value.toLowerCase() || 'contrast'}
            loading={i === 1 ? 'eager' : 'lazy'}
          />
        ))}
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  const image = collection.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div>
          <Image
            data={image}
            sizes="(min-width: 45em) 40vw, 100vw"
            className="featured-collection-image"
            aspectRatio="1/1"
          />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery>;
}) {
  return (
    <div className="recommended-products">
      <h2>Recommended Products</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {({products}) => (
            <div className="recommended-products-grid">
              {products.nodes.map((product) => (
                <Link
                  key={product.id}
                  className="recommended-product"
                  to={`/products/${product.handle}`}
                >
                  <Image
                    data={product.images.nodes[0]}
                    aspectRatio="1/1"
                    sizes="(min-width: 45em) 20vw, 50vw"
                    style={{
                      height: 'auto',
                    }}
                  />
                  <h4>{product.title}</h4>
                  <small>
                    <Money
                      as={React.Fragment}
                      data={product.priceRange.minVariantPrice}
                    />
                  </small>
                </Link>
              ))}
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

const HOMEPAGE_CONTENT_QUERY = `#graphql
  ${MEDIA_FRAGMENT}
  query homepage($country: CountryCode) @inContext(country: $country) {
    heroBanners: metaobjects(type: "hero", first: 10, sortKey: "updated_at") {
      nodes {
        id
        headline: field(key: "headline") {
          value
        }
        media: field(key: "media") {
          references(first: 4) {
            nodes {
              ...Media
            }
          }
        }
        product: field(key: "product") {
          reference {
            ... on Product {
              handle
            }
          }
        }
        textColour: field(key: "text_colour") {
          value
        }
      }
    }
  }
`;

const HOMEPAGE_SEO_QUERY = `#graphql
  query shopInfo {
    shop {
      name
      description
    }
  }
`;
