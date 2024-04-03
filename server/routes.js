import MessageController from "./controllers/Message.controller.js";
import validateRequest from "./middleware/validateRequest.js";
import { createMessageBodySchema, deleteMessageQuerySchema} from "./schema/message.schema.js";

export default function(server){
    server.post('/createMessage', validateRequest(createMessageBodySchema), MessageController.createMessage);
    server.get('/getMessages', MessageController.getMessages);
    server.delete('/deleteMessage', validateRequest({},deleteMessageQuerySchema), MessageController.deleteMessage);
}