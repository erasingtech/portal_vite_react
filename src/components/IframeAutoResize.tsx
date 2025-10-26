import { useEffect, useRef } from 'react';

interface IframeAutoResizeProps {
  frameId: string;
  srcDoc: string;
  title: string;
  className?: string;
}

export function IframeAutoResize({ frameId, srcDoc, title, className }: IframeAutoResizeProps) {
  const ref = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event?.data?.type === 'resize' && event?.data?.id === frameId) {
        const iframe = ref.current;
        if (iframe) {
          iframe.style.height = `${Math.max(200, Number(event.data.height) || 0)}px`;
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [frameId]);

  return (
    <iframe
      ref={ref}
      id={`iframe-${frameId}`}
      srcDoc={srcDoc}
      className={className ?? 'w-full border-0'}
      sandbox='allow-scripts allow-same-origin'
      title={title}
      style={{ minHeight: 200, display: 'block', overflow: 'hidden' }}
    />
  );
}
