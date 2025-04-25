'use client';

import { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface VideoPlayerProps {
  streamUrl: string;
  onClose: () => void;
  channelName?: string;
}

export default function VideoPlayer({ streamUrl, onClose, channelName }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamUrl) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (streamUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hlsRef.current = hls;
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.error("Error playing video:", e));
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error('Fatal network error encountered, trying to recover');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error('Fatal media error encountered, trying to recover');
                hls.recoverMediaError();
                break;
              default:
                console.error('Fatal error encountered', data);
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(e => console.error("Error playing video:", e));
        });
      }
    } else {
      video.src = streamUrl;
      video.play().catch(e => console.error("Error playing video:", e));
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, [streamUrl]);

  return (
    <div className="fixed top-16 left-0 right-0 z-30 flex flex-col items-center gap-4 px-2 md:left-64 md:right-80">
      {/* Video Player */}
      <div className="w-full max-w-[100vw] md:max-w-[calc(100vw-20rem)] aspect-video bg-black relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-40 p-1 bg-black/40 rounded-full text-white"
          title="Close Player"
          aria-label="Close Player"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        <video
          ref={videoRef}
          controls
          className="w-full h-full object-contain bg-black"
          playsInline
          autoPlay
        />
      </div>

      {/* Desktop Ad Banners */}
      <div className="hidden md:flex justify-between items-center gap-4 w-full max-w-[calc(100vw-20rem)] px-2">
  <a href="https://amzn.to/4iwwoFC" target="_blank" rel="noopener noreferrer">
    <img src="/ads/ad1.jpg" alt="Ad 1" className="w-full max-w-[400px] h-[90px] object-cover rounded-md shadow-md" />
  </a>
  <a href="https://amzn.to/448nvyL" target="_blank" rel="noopener noreferrer">
    <img src="/ads/ad2.jpg" alt="Ad 2" className="w-full max-w-[400px] h-[90px] object-cover rounded-md shadow-md" />
  </a>
  <a href="https://amzn.to/3GDSg4D" target="_blank" rel="noopener noreferrer">
    <img src="/ads/ad3.JPG" alt="Ad 3" className="w-full max-w-[400px] h-[90px] object-cover rounded-md shadow-md" />
  </a>
</div>

      {/* Mobile Ad Banner */}
      <div className="md:hidden w-full max-w-md px-3">
      <a href="https://amzn.to/3YKJPuC" target="_blank" rel="noopener noreferrer">
    <img src="/ads/mb1.jpg" alt="Mobile Ad" className="w-full max-w-[400px] h-[90px] object-cover rounded-md shadow" />
  </a>
      </div>
    </div>
  );
}
