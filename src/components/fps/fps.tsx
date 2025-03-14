import React, { useState, useEffect, useRef, FC } from "react";

// Define types for the FPS metrics
interface FpsMetrics {
  current: number;
  average: number;
  min: number;
  max: number;
}

// Define return type for the useFps hook
interface UseFpsReturn {
  fps: FpsMetrics;
  frame: () => void;
}

// FPS Hook to track frame rate with TypeScript
export const useFps = (): UseFpsReturn => {
  const [fps, setFps] = useState<FpsMetrics>({
    current: 0,
    average: 0,
    min: Infinity,
    max: 0,
  });

  const frameCountRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(performance.now());
  const frameTimesRef = useRef<number[]>([]);

  const calculateFps = (): void => {
    const now: number = performance.now();
    const delta: number = now - lastTimeRef.current;

    // Update frameTimesRef with the last 60 frames for average calculation
    frameTimesRef.current.push(delta);
    if (frameTimesRef.current.length > 60) {
      frameTimesRef.current.shift();
    }

    // Calculate average fps
    const totalTime: number = frameTimesRef.current.reduce(
      (sum, time) => sum + time,
      0
    );
    const averageFps: number = Math.round(
      1000 / (totalTime / frameTimesRef.current.length)
    );

    // Calculate current fps
    const currentFps: number = Math.round(1000 / delta);

    // Update fps state
    setFps(
      (prevFps: FpsMetrics): FpsMetrics => ({
        current: currentFps,
        average: averageFps,
        min: Math.min(prevFps.min, currentFps),
        max: Math.max(prevFps.max, currentFps),
      })
    );

    lastTimeRef.current = now;
    frameCountRef.current++;
  };

  // Function to be called on each frame render
  const frame = (): void => {
    requestAnimationFrame((): void => {
      calculateFps();
    });
  };

  // Initial setup
  useEffect((): (() => void) => {
    const interval: NodeJS.Timeout = setInterval((): void => {
      // Reset min/max values every 10 seconds
      setFps(
        (prevFps: FpsMetrics): FpsMetrics => ({
          ...prevFps,
          min: prevFps.current,
          max: prevFps.current,
        })
      );
    }, 10000);

    return (): void => clearInterval(interval);
  }, []);

  return { fps, frame };
};

// Props type for FPS Counter Component
interface FpsCounterProps {
  fps: FpsMetrics;
}

// CSS style types
type CounterStyle = React.CSSProperties;
interface DynamicStyleFunction {
  (value: number): React.CSSProperties;
}

// FPS Counter Component with color styling
export const FpsCounter: FC<FpsCounterProps> = ({ fps }) => {
  // Determine color based on current FPS
  const getFpsColor = (fps: number): string => {
    if (fps >= 55) return "#4CAF50"; // Green for good fps
    if (fps >= 30) return "#FFC107"; // Yellow for ok fps
    return "#F44336"; // Red for poor fps
  };

  const counterStyle: CounterStyle = {
    position: "fixed",
    top: "10px",
    right: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "10px",
    borderRadius: "5px",
    color: "#FFF",
    fontFamily: "monospace",
    fontSize: "14px",
    zIndex: 9999,
    userSelect: "none",
  };

  const valueStyle: DynamicStyleFunction = (
    value: number
  ): React.CSSProperties => ({
    color: getFpsColor(value),
    fontWeight: "bold",
  });

  return (
    <div style={counterStyle}>
      <div>
        FPS: <span style={valueStyle(fps.current)}>{fps.current}</span>
      </div>
      <div>
        AVG: <span style={valueStyle(fps.average)}>{fps.average}</span>
      </div>
      <div>
        MIN:{" "}
        <span style={valueStyle(fps.min === Infinity ? 0 : fps.min)}>
          {fps.min === Infinity ? 0 : fps.min}
        </span>
      </div>
      <div>
        MAX: <span style={valueStyle(fps.max)}>{fps.max}</span>
      </div>
    </div>
  );
};

// // Props type for MyComponent
// interface MyComponentProps {
//   onRender: () => void;
// }

// // Example usage with a component that triggers frame counting
// const MyComponent:FC<MyComponentProps> = ({ onRender }) => {
//   // Call onRender on each animation frame
//   useEffect((): (() => void) => {
//     let animationFrameId: number;

//     const animate = (): void => {
//       onRender();
//       animationFrameId = requestAnimationFrame(animate);
//     };

//     animationFrameId = requestAnimationFrame(animate);

//     return (): void => {
//       cancelAnimationFrame(animationFrameId);
//     };
//   }, [onRender]);

//   return <div>Your application content here</div>;
// };

// // Example usage of the FPS counter
// const App: FC = () => {
//   const { fps, frame } = useFps();

//   return (
//     <div>
//       <FpsCounter fps={fps} />
//       <MyComponent onRender={frame} />
//     </div>
//   );
// };

// export default App;
