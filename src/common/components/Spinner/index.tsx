import React from 'react';

import styles from './styles/Spinner.module.scss';

type SpinnerProps = {
  fullScreen?: boolean;
  overlay?: boolean;
  overlayColor?: string;
  hidden?: boolean;
  testId?: string;
};

const Spinner: React.FC<SpinnerProps> = ({
  fullScreen = false,
  overlay = false,
  overlayColor = '#fff',
  hidden = false,
  testId = undefined,
}: SpinnerProps) => {
  return (
    <div
      data-testid={testId}
      style={{
        background: overlayColor,
      }}
      className={`${styles.container}${
        fullScreen ? ` ${styles['container--fullscreen']}` : ''
      }${overlay ? ` ${styles['container--overlay']}` : ''}${
        hidden ? ` ${styles['container--hidden']}` : ''
      }`}
    >
      <div className={styles['inner-container']}>
        <div className={styles.sphere} />
        <div className={`${styles.sphere} ${styles['sphere--2']}`} />
      </div>
    </div>
  );
};

export default Spinner;
