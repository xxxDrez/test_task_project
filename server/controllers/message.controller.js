import HttpServer from "../HttpServer/HttpServer.js";
import { Message } from "../Message/Message.js";
import { socket } from "../server.js";

export default class MessageController {
    static createMessage(request, response) {
        const { message } = request.body;

        try {
            const newMessage = Message.createMessage(message);

            socket.sendToAll({
                action: "create",
                value: newMessage
            });

            return HttpServer.sendResponse(response, 200, { value: newMessage });
        } catch (error) {
            return HttpServer.sendResponse(response, 500, { error: 'Failed to create message' });
        }
    }

    static getMessages(request, response) {
        try {
            const messages = Message.getMessages();
            return HttpServer.sendResponse(response, 200, { value: messages });
        } catch (error) {
            return HttpServer.sendResponse(response, 500, { error: 'Failed to retrieve messages' });
        }
    }

    static deleteMessage(request, response) {
        const { messageId } = request.query;

        if (!messageId) {
            return HttpServer.sendResponse(response, 400, { error: 'MessageId is required' });
        }

        try {
            const deletedMessage = Message.deleteMessage(messageId);

            if (deletedMessage) {
                socket.sendToAll({
                    action: "delete",
                    value: deletedMessage
                });
                return HttpServer.sendResponse(response, 200, { value: deletedMessage });
            } else {
                return HttpServer.sendResponse(response, 404, { error: `Message '${messageId}' not found` });
            }
        } catch (error) {
            return HttpServer.sendResponse(response, 500, { error: 'Failed to delete message' });
        }
    }
}