import React from 'react';
import './message-window.module.css';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import useWebSocket from 'react-use-websocket';
import RequestService from '../../../services/RequestService';

const MessageWindow = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['messages'],
        queryFn: RequestService.getMessages,
        keepPreviousData: true,
    });

    const handleMessage = (event) => {
        const { action, value } = JSON.parse(event.data);

        switch(action){
            case 'create': {
                queryClient.setQueryData('messages', (prevData) => [...prevData, value]);
                break;
            }

            case 'delete': {
                const messages = [...queryClient.getQueryData('messages')];
                const indexDeleteMessage = messages.findIndex(message => message.messageId === value.messageId);
            
                if (~indexDeleteMessage) {
                    console.log(indexDeleteMessage);
                    messages.splice(indexDeleteMessage, 1);
                    queryClient.setQueryData('messages', messages);
                }
                break;
            }
        }
    }

    useWebSocket(process.env.REACT_APP_SOCKET_URL, {
        onMessage: handleMessage,
        shouldReconnect: () => true
    });

    const removeMessage = useMutation(messageId => RequestService.deleteMessage(messageId), {
        onSuccess: () => queryClient.invalidateQueries(["messages"])
    });
    
    if(isLoading) {
        return <span>Loading...</span>
    }

    if(isError) {
        return <span>Error: {error.message}</span>;
    }
    
    return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {
                data && data.length > 0 ? (
                    data.map((data, index) => {
                        const { messageId, message, date } = data;
                        return (
                            <tr key={index}>
                                <td>{messageId}</td>
                                <td>{message}</td>
                                <td>{date}</td>
                                <td>
                                    <button onClick={() => removeMessage.mutate(messageId)}>Remove</button>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="4">No messages found</td>
                    </tr>
                )
            }
            </tbody>
        </table>
    );
};

export default MessageWindow;