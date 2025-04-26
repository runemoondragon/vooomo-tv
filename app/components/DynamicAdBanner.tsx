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

const getRandomAds = (adList: Ad[], count: number): Ad[] => {
  const shuffled = [...adList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const DynamicAdBanner: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentAds, setCurrentAds] = useState<Ad[]>([]);

  useEffect(() => {
    fetch('/ads_metadata.json')
      .then((res) => res.json())
      .then((data) => {
        setAds(data);
        setCurrentAds(getRandomAds(data, 3));
      })
      .catch((err) => console.error('Failed to load ad metadata:', err));
  }, []);

  useEffect(() => {
    if (ads.length === 0) return;

    const interval = setInterval(() => {
      setCurrentAds(getRandomAds(ads, 3));
    }, 45000); // Rotate every 45 seconds

    return () => clearInterval(interval);
  }, [ads]);

  if (currentAds.length === 0) return null;

  // 👇 This function handles PiP mode on mobile
  const handleMobileAdClick = async (link: string) => {
    try {
      const videoElement = document.querySelector('video');
      if (videoElement && (document as any).pictureInPictureEnabled && !document.pictureInPictureElement) {
        await (videoElement as any).requestPictureInPicture();
      }
    } catch (error) {
      console.error('Failed to enter PiP mode:', error);
    }
    window.open(link, '_blank');
  };

  return (
    <>
      {/* Desktop: show 3 ads side by side */}
      <div className="hidden md:flex justify-between gap-4 w-full max-w-[calc(100vw-20rem)] px-2">
        {currentAds.map((ad, index) => (
          <a
            key={index}
            href={ad.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full max-w-[300px] h-[90px] flex-shrink-0"
          >
            <Image
              src={`/${ad.image_file}`}
              alt={ad.product_name}
              width={450}
              height={110}
              className="object-cover w-full h-full rounded-md shadow-md"
              priority
            />
          </a>
        ))}
      </div>

      {/* Mobile: show only 1 ad, with PiP activation on click */}
      <div className="md:hidden w-full max-w-md px-3">
        <div
          onClick={() => handleMobileAdClick(currentAds[0].affiliate_link)}
          className="block w-full h-[120px] cursor-pointer"
        >
          <Image
            src={`/${currentAds[0].image_file}`}
            alt={currentAds[0].product_name}
            width={500}
            height={110}
            className="object-cover w-full h-full rounded-md shadow-md"
            priority
          />
        </div>
      </div>
    </>
  );
};

export default DynamicAdBanner;
