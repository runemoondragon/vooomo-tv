'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Ad {
  product_name: string;
  image_file: string;
  image_url: string;
  metadata: {
    category: string;
    brand: string;
    price: string;
    tv_channel: string;
    country: string;
    tags: string[];
  };
  affiliate_link: string;
}

const getUniqueRandomAds = (adList: Ad[], count: number): Ad[] => {
  if (adList.length <= count) return adList;
  const shuffled = [...adList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const DynamicAdBanner: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAds, setCurrentAds] = useState<Ad[]>([]);
  const [fade, setFade] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/ads_metadata.json')
      .then((res) => res.json())
      .then((data) => {
        setAds(data);
        setCurrentAds(getUniqueRandomAds(data, 3));
      })
      .catch((err) => console.error('Failed to load ad metadata:', err));
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setFade(true);
      setLoading(true);

      setTimeout(() => {
        setCurrentAds(getUniqueRandomAds(ads, 3));
        setFade(false);
        setLoading(false);
      }, 400);
    }, 20000);

    return () => clearInterval(interval);
  }, [ads]);

  if (currentAds.length === 0) return null;

  const handlePictureInPicture = () => {
    try {
      const videoElement = document.querySelector('video');
      if (videoElement && (document as any).pictureInPictureEnabled && !document.pictureInPictureElement) {
        (videoElement as any).requestPictureInPicture();
      }
    } catch (error) {
      console.error('Failed to enter PiP mode:', error);
    }
  };

  return (
    <>
      {/* Desktop & iPad: 3 ads side by side but responsive */}
      <div
        className={`relative hidden md:flex flex-wrap justify-center gap-4 w-full px-2 transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
          </div>
        )}
        {currentAds.map((ad, index) => (
          <a
            key={index}
            href={ad.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-[30%] min-w-[200px] max-w-[300px] h-[90px] flex-shrink-0"
          >
            <Image
              src={`/${ad.image_file}`}
              alt={ad.product_name}
              width={450}
              height={125}
              className="object-cover w-full h-full rounded-md shadow-md"
              priority
            />
          </a>
        ))}
      </div>

      {/* Mobile: show 1 ad only */}
      <div className="relative md:hidden w-full max-w-md px-3">
        <div
          onClickCapture={handlePictureInPicture}
          className={`block w-full h-[120px] transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-md">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          )}
          <a
            href={currentAds[0].affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-[120px]"
          >
            <Image
              src={`/${currentAds[0].image_file}`}
              alt={currentAds[0].product_name}
              width={500}
              height={110}
              className="object-cover w-full h-full rounded-md shadow-md"
              priority
            />
          </a>
        </div>
      </div>
    </>
  );
};

export default DynamicAdBanner;
