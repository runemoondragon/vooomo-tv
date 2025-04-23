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
    <div className="w-full h-full bg-black flex flex-col">
      <div className="flex justify-between items-center p-2 bg-gray-800/50">
        <h2 className="text-white text-lg font-semibold truncate" title={channelName}>
          {channelName || 'Live Stream'}
        </h2>
        <button
          onClick={onClose}
          className="p-1 text-gray-300 hover:text-white transition-colors"
          title="Close Player"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <video
        ref={videoRef}
        controls
        className="w-full flex-1 bg-black"
        playsInline
        autoPlay
      />
    </div>
  );
} 