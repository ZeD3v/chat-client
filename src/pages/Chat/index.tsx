import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import io from 'socket.io-client';

import Spinner from '../../common/components/Spinner';

import { UserContext, ErrorContext } from '../../App';

import UserConnectedEvent from './Events/UserConnectedEvent';
import MessageEvent from './Events/MessageEvent';
import UserDisconnectedEvent from './Events/UserDisconnectedEvent';

import buttonStyles from '../../common/styles/Button.module.scss';
import styles from './styles/Chat.module.scss';

export enum ChatEvents {
  'MESSAGE' = 'MESSAGE',
  'USER_CONNECTED' = 'USER_CONNECTED',
  'USER_DISCONNECTED' = 'USER_DISCONNECTED',
}

type MessageSocketData = {
  eventId: string;
  username: string;
  message: string;
  timestamp: number;
};

type UserConnectedSocketData = {
  eventId: string;
  username: string;
  timestamp: number;
};

type UserDisconnectedSocketData = {
  eventId: string;
  username: string;
  reason: string;
  timestamp: number;
};

type ChatEvent = UserConnectedEvent | MessageEvent | UserDisconnectedEvent;

const ChatPage: React.FC = () => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<SocketIOClient.Socket>();

  const { user, setUser } = useContext(UserContext);
  const { setError } = useContext(ErrorContext);

  const [events, setEvents] = useState<ChatEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState<string>('');

  const sendMessage = (): void => {
    if (socketRef.current) {
      socketRef.current.emit('message', {
        message: newMessage,
      });
    }
  };

  const prepareToDisconnect = useCallback(
    (reason?: string): void => {
      setEvents([]);
      setNewMessage('');

      if (reason && setError) {
        setError(reason);
      }

      if (setUser) {
        setUser(null);
      }
    },
    [setError, setUser]
  );

  const onSendMessage = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    sendMessage();
    setNewMessage('');
  };

  useEffect(() => {
    socketRef.current = io(process.env.REACT_APP_API_URL || '/', {
      query: `${user ? `username=${user.username}&token=${user.token}` : ''}`,
    });

    socketRef.current.on('connect', (): void => {
      // To avoid flash of loading spinner and imporve ux
      // show loading spinner 0.5s longer after the actual
      // connection gets established
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    });

    socketRef.current.on('error', (): void => {
      prepareToDisconnect(
        'Oops. Something went wrong, please try again later.'
      );
    });

    socketRef.current.on('message', (data: MessageSocketData): void => {
      setEvents((currentEvents) => [
        ...currentEvents,
        {
          type: ChatEvents.MESSAGE,
          id: data.eventId,
          timestamp: data.timestamp,
          payload: {
            username: data.username,
            message: data.message,
          },
        },
      ]);
    });

    socketRef.current.on(
      'user_connected',
      (data: UserConnectedSocketData): void => {
        setEvents((currentEvents) => [
          ...currentEvents,
          {
            type: ChatEvents.USER_CONNECTED,
            id: data.eventId,
            timestamp: data.timestamp,
            payload: {
              username: data.username,
            },
          },
        ]);
      }
    );

    socketRef.current.on(
      'user_disconnected',
      (data: UserDisconnectedSocketData): void => {
        if (
          data.username === user?.username &&
          data.reason === 'USER_INACTIVE'
        ) {
          prepareToDisconnect('Disconnected due to inactivity.');
          return;
        }

        setEvents((currentEvents) => [
          ...currentEvents,
          {
            type: ChatEvents.USER_DISCONNECTED,
            id: data.eventId,
            timestamp: data.timestamp,
            payload: {
              username: data.username,
              reason: data.reason,
            },
          },
        ]);
      }
    );

    socketRef.current.on('server_shutting_down', (): void => {
      prepareToDisconnect('Disconnected, server shutting down.');
    });

    socketRef.current.on('disconnect', (): void => {
      prepareToDisconnect();
    });

    return (): void => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
    };
  }, [prepareToDisconnect, setError, setUser, user]);

  useEffect(() => {
    if (
      messagesContainerRef &&
      messagesContainerRef.current &&
      messagesContainerRef.current.lastChild
    ) {
      (messagesContainerRef.current.lastChild as HTMLDivElement).scrollIntoView(
        {
          behavior: 'smooth',
          block: 'end',
        }
      );
    }
  }, [events]);

  const renderEvent = (event: ChatEvent): React.ReactNode => {
    if (event.type === ChatEvents.MESSAGE) {
      return <MessageEvent key={event.id} user={user} event={event} />;
    }

    if (event.type === ChatEvents.USER_CONNECTED) {
      return <UserConnectedEvent key={event.id} user={user} event={event} />;
    }

    if (event.type === ChatEvents.USER_DISCONNECTED) {
      return <UserDisconnectedEvent key={event.id} user={user} event={event} />;
    }

    return null;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>{user?.username}</div>
        <button
          className={`${buttonStyles.button} ${buttonStyles['button--simple']}`}
          type="button"
          onClick={(): void => {
            prepareToDisconnect();
          }}
        >
          Disconnect
        </button>
      </div>
      <div ref={messagesContainerRef} className={styles['messages-container']}>
        {events.map(renderEvent)}
      </div>
      <div className={styles['form-container']}>
        <form onSubmit={onSendMessage} className={styles.form}>
          <textarea
            data-testid="chat-message-input"
            className={styles['message-input']}
            value={newMessage}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>): void => {
              setNewMessage(event.target.value);
            }}
          />
          <button
            data-testid="chat-message-submit-btn"
            className={`${buttonStyles.button} ${styles['submit-button']}`}
            type="submit"
          >
            Send!
          </button>
        </form>
        <Spinner
          hidden={!isLoading}
          overlay
          overlayColor="rgb(236, 236, 236)"
        />
      </div>
    </div>
  );
};

export default ChatPage;
