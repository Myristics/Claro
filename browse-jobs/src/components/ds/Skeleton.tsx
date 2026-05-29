import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
  style?: React.CSSProperties;
}

export function Skeleton({ width, height, className, rounded = false, style }: SkeletonProps) {
  const classes = [
    styles.skeleton,
    rounded ? styles.rounded : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={classes}
      aria-hidden="true"
      style={{
        display: 'block',
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : '100%',
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : '16px',
        ...style,
      }}
    />
  );
}

export default Skeleton;
