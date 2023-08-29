import {Image, Video} from '@shopify/hydrogen';
import {Link} from '@remix-run/react';
import {
  ExternalVideo,
  MediaImage,
  Model3d,
  Product,
  Video as VideoType,
} from '@shopify/hydrogen/storefront-api-types';

import {Heading, Logo} from '~/components';

export function Hero({
  headline,
  media,
  product,
  loading = 'eager',
  textColour = 'contrast',
}: {
  headline: string;
  media: Array<ExternalVideo | MediaImage | Model3d | VideoType>;
  product: Product;
  loading: 'eager' | 'lazy';
  textColour: 'primary' | 'contrast';
}) {

  return (
    <section
      className={`relative w-full aspect-square md:h-screen md:snap-center`}
    >
      <Link to={`/products/${product?.handle}`}>
        <div className="flex w-full aspect-square md:h-screen">
          {media.map((item, i) => (
            <div
              className={`w-full ${i > 0 && 'hidden md:block'}`}
              key={item.id}
            >
              <SpreadMedia
                scale={2}
                sizes={`(min-width: 48em) ${100 / media.length}vw, 100vw`}
                widths={media.length > 1 ? [500, 450, 700] : [500, 900, 1400]}
                width={media.length > 1 ? 375 : 750}
                data={item}
                loading={loading}
              />
            </div>
          ))}
        </div>
        <div
          className={`${
            textColour === 'contrast' ? 'text-contrast' : 'text-primary'
          } absolute items-end bottom-0 flex aspect-square md:min-h-screen gap-8 p-6 py-12 md:p-16 text-center md:text-left wrap`}
        >
          <Logo title="Margin" className="hidden opacity-0 md:block" />
          {headline && (
            <Heading type="label" className="whitespace-pre-line">
              {headline.toString().replace(/\\n/g, '\n')}
            </Heading>
          )}
        </div>
      </Link>
    </section>
  );
}

function SpreadMedia({
  data,
  loading,
  scale,
  width,
  ...passthroughProps
}: {
  data: any;
  loading: HTMLImageElement['loading'];
  scale: 2 | 3;
  width: number;
}) {
  if (data.mediaContentType === 'VIDEO') {
    return (
      <Video
        previewImageOptions={{scale, src: data.previewImage.url}}
        width={scale * width}
        className="block object-cover w-full h-full"
        data={data}
        controls={false}
        muted
        loop
        playsInline
        autoPlay
        {...passthroughProps}
      />
    );
  }

  if (data.mediaContentType === 'IMAGE') {
    return (
      <Image
        alt={data.alt || 'Marketing Banner Image'}
        className="block object-cover w-full h-full"
        src={data.image.url}
        sizes="90vw"
        loading={loading}
        aspectRatio="2/3"
        {...passthroughProps}
      />
    );
  }

  return null;
}
