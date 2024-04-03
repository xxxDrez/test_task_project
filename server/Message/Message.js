export const Message = (() => {
    const messages = [];

    return {
        createMessage: (message) => {
            messages.push({
                messageId: messages.length + 1,
                message: message,
                date: new Date(),
            });
            return messages[messages.length - 1];
        },

        getMessages: () => {
            return messages;
        },

        deleteMessage: (messageId) => {
            const messageIndex = messages.findIndex(message => message.messageId === parseInt(messageId));
            if(~messageIndex){
                return messages.splice(messageIndex, 1)[0];
            }
            return undefined;
        }
    }
})();
