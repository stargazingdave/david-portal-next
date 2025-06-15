import React, { useRef, useEffect } from 'react';
import { useCanvasSize } from './useCanvasSize';
import { OscParam } from '../../types/OscParam';

export const SineWave: React.FC<{ param: OscParam }> = ({ param }) => {
    const { containerRef, size } = useCanvasSize();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        let startTime = performance.now();

        const draw = (now: number) => {
            canvas.width = size.width;
            canvas.height = size.height;
            const tSec = (now - startTime) / 1000;
            const { width, height } = canvas;

            ctx.clearRect(0, 0, width, height);
            ctx.beginPath();
            const points: { x: number, y: number }[] = [];

            for (let x = 0; x <= width; x++) {
                const t = x / width * 2 * Math.PI;
                const baseY = height * (1 - param.value);
                const sineY = param.amp * Math.sin(2 * Math.PI * param.freq * (t + tSec));
                const y = param.osc ? baseY + sineY * height : baseY;
                points.push({ x, y });
            }

            ctx.moveTo(0, height);
            points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.lineTo(width, height);
            ctx.closePath();
            ctx.fillStyle = '#de006b';
            ctx.fill();

            requestAnimationFrame(draw);
        };

        requestAnimationFrame(draw);
    }, [param, size]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
            <canvas ref={canvasRef} />
        </div>
    );
};
