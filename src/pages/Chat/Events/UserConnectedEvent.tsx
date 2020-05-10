import React from 'react';
import { format } from 'date-fns';

import { User } from '../../../App';
import { ChatEvents } from '../index';

import styles from './styles/ConnectionStatusEvent.module.scss';

type UserConnectedEventPayload = {
  username: string;
};

type UserConnectedEvent = {
  type: ChatEvents.USER_CONNECTED;
  id: string;
  timestamp: number;
  payload: UserConnectedEventPayload;
};

type UserConnectedEventProps = {
  user: User | null;
  event: UserConnectedEvent;
};

const UserConnectedEvent: React.FC<UserConnectedEventProps> = ({
  user,
  event,
}: UserConnectedEventProps) => (
  <div className={styles.container}>
    {user?.username === event.payload.username ? 'You' : event.payload.username}{' '}
    joined - {format(new Date(event.timestamp), 'dd/MM/yyyy HH:mm:ss')}
  </div>
);

export default UserConnectedEvent;
