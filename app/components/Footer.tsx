import {useMatches, Link} from '@remix-run/react';
import type {FooterQuery} from 'storefrontapi.generated';

export function Footer({menu}: FooterQuery) {
  return (
    <footer className="footer">
      <FooterMenu menu={menu} />
    </footer>
  );
}

function FooterMenu({menu}: Pick<FooterQuery, 'menu'>) {
  const [root] = useMatches();
  const publicStoreDomain = root?.data?.publicStoreDomain;
  return (
    <nav className="footer-menu" role="navigation">
      {(menu || FALLBACK_FOOTER_MENU).items.map((item) => {
        if (!item.url) return null;
        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain)
            ? new URL(item.url).pathname
            : item.url;
        const isExternal = !url.startsWith('/');
        return isExternal ? (
          <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
            {item.title}
          </a>
        ) : (
          <Link key={item.id} prefetch="intent" to={url}>
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}

const FALLBACK_FOOTER_MENU = {
  items: [
    {
      id: 'gid://shopify/MenuItem/1',
      title: 'Privacy Policy',
      url: '/policies/privacy-policy',
    },
    {
      id: 'gid://shopify/MenuItem/2',
      title: 'Refund Policy',
      url: '/policies/refund-policy',
    },
    {
      id: 'gid://shopify/MenuItem/3',
      title: 'Shipping Policy',
      url: '/policies/shipping-policy',
    },
    {
      id: 'gid://shopify/MenuItem/4',
      title: 'Terms of Service',
      url: '/policies/terms-of-service',
    },
  ],
};
