import React from 'react';
import { format } from 'date-fns';

import { User } from '../../../App';
import { ChatEvents } from '../index';

import styles from './styles/MessageEvent.module.scss';

type MessageEventPayload = {
  username: string;
  message: string;
};

type MessageEvent = {
  type: ChatEvents.MESSAGE;
  id: string;
  timestamp: number;
  payload: MessageEventPayload;
};

type MessageEventProps = {
  user: User | null;
  event: MessageEvent;
};

const MessageEvent: React.FC<MessageEventProps> = ({
  user,
  event,
}: MessageEventProps) => {
  const { username, message } = event.payload;

  return (
    <div
      key={`${username}-${event.timestamp}`}
      className={`${styles.message}${
        username === user?.username ? ` ${styles['message--user']}` : ''
      }`}
    >
      {username !== user?.username && (
        <div className={styles['message-user']}>
          <span>{username}</span>
        </div>
      )}
      <div className={styles['message-bubble']}>
        <p>{message}</p>
      </div>
      <div className={styles['message-timestamp']}>
        <span>{format(new Date(event.timestamp), 'dd/MM/yyyy HH:mm:ss')}</span>
      </div>
    </div>
  );
};

export default MessageEvent;
