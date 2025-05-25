import React, { useState, useRef, useLayoutEffect } from 'react';

type Placement = 'top' | 'bottom' | 'left' | 'right';

type TooltipProps = {
    content: React.ReactNode;
    placement?: Placement;
    children: React.ReactNode;
    className?: string;
};

export const Tooltip: React.FC<TooltipProps> = ({
    content,
    placement = 'top',
    children,
    className = '',
}) => {
    const [visible, setVisible] = useState(false);
    const [style, setStyle] = useState<React.CSSProperties>({});
    const triggerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!visible || !triggerRef.current || !tooltipRef.current) return;

        const trigger = triggerRef.current.getBoundingClientRect();
        const tooltip = tooltipRef.current.getBoundingClientRect();
        const margin = 8;

        let top = 0;
        let left = 0;

        if (placement === 'top') {
            top = trigger.top - tooltip.height - margin;
            left = trigger.left + (trigger.width - tooltip.width) / 2;
        } else if (placement === 'bottom') {
            top = trigger.bottom + margin;
            left = trigger.left + (trigger.width - tooltip.width) / 2;
        } else if (placement === 'left') {
            top = trigger.top + (trigger.height - tooltip.height) / 2;
            left = trigger.left - tooltip.width - margin;
        } else if (placement === 'right') {
            top = trigger.top + (trigger.height - tooltip.height) / 2;
            left = trigger.right + margin;
        }

        // Snap to viewport edges (no flipping)
        const maxLeft = window.innerWidth - tooltip.width - 4;
        const minLeft = 4;
        const maxTop = window.innerHeight - tooltip.height - 4;
        const minTop = 4;

        setStyle({
            top: Math.min(Math.max(top, minTop), maxTop),
            left: Math.min(Math.max(left, minLeft), maxLeft),
        });
    }, [visible, placement]);

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                style={{ display: 'inline-block' }}
            >
                {children}
            </div>
            {visible && (
                <div
                    ref={tooltipRef}
                    style={{
                        ...style,
                        position: 'fixed',
                        zIndex: 9999,
                        background: 'black',
                        color: 'white',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap',
                        pointerEvents: 'none',
                    }}
                    className={className}
                >
                    {content}
                </div>
            )}
        </>
    );
};
