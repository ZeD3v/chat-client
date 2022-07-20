import React from 'react';
import { format } from 'date-fns';

import { User } from '../../../App';
import { ChatEvents } from '../index';

import styles from './styles/ConnectionStatusEvent.module.scss';

type UserDisconnectedEventPayload = {
  username: string;
  reason: string;
};

type UserDisconnectedEvent = {
  type: ChatEvents.USER_DISCONNECTED;
  id: string;
  timestamp: number;
  payload: UserDisconnectedEventPayload;
};

type UserDisconnectedEventProps = {
  user: User | null;
  event: UserDisconnectedEvent;
};

const messages: { [reason: string]: string } = {
  USER_LEFT: 'left',
  USER_INACTIVE: 'disconnected due to inactivity',
};

const UserDisconnectedEvent: React.FC<UserDisconnectedEventProps> = ({
  user,
  event,
}: UserDisconnectedEventProps) => (
  <div className={styles.container}>
    {user?.username === event.payload.username ? 'You' : event.payload.username}{' '}
    {messages[event.payload.reason] || 'disconnected'} -{' '}
    {format(new Date(event.timestamp), 'dd/MM/yyyy HH:mm:ss')}
  </div>
);

export default UserDisconnectedEvent;
