import { useEffect, useRef } from 'react';

interface IframeAutoResizeProps {
  frameId: string;
  srcDoc: string;
  title: string;
  className?: string;
  /**
   * Initial CSS height value for the iframe element. Defaults to '100vh'.
   * Use '100%' when placing the iframe inside a fixed-height container.
   */
  initialHeight?: string;
  /**
   * When true, the component will ignore resize messages and keep the iframe
   * height locked to the container (100%). Useful for sticky/fixed layouts.
   */
  lockToContainer?: boolean;
  /**
   * Optional inline style overrides.
   */
  style?: React.CSSProperties;
}

export function IframeAutoResize({ frameId, srcDoc, title, className, initialHeight = '100vh', lockToContainer = false, style }: IframeAutoResizeProps) {
  const ref = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event?.data?.type === 'resize' && event?.data?.id === frameId) {
        const iframe = ref.current;
        if (iframe) {
          if (lockToContainer) {
            iframe.style.height = '100%';
          } else {
            iframe.style.height = `${Math.max(200, Number(event.data.height) || 0)}px`;
          }
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
      scrolling='no'
      sandbox='allow-scripts allow-same-origin'
      title={title}
      style={{ height: initialHeight, minHeight: 200, width: '100%', display: 'block', overflow: 'hidden', ...style }}
    />
  );
}
