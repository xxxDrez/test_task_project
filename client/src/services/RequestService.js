import axios from "axios";

/**
 * Сервис для выполнения запросов к API.
 */
export default class RequestService {
    /**
     * Получить все сообщения.
     * @returns {Promise<Array>} Массив сообщений.
     */
    static async getMessages() {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/getMessages`);
            return response.data.value;
        } catch (error) {
            throw new Error(`Failed to get messages: ${error.message}`);
        }
    }

    /**
     * Удалить сообщение по его идентификатору.
     * @param {number} messageId Идентификатор сообщения для удаления.
     * @returns {Promise<void>}
     */
    static async deleteMessage(messageId) {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/deleteMessage?messageId=${messageId}`);
        } catch (error) {
            throw new Error(`Failed to delete message: ${error.message}`);
        }
    }

    /**
     * Создать новое сообщение.
     * @param {object} data { message: "" } Данные для создания сообщения.
     * @returns {Promise<void>}
     */
    static async createMessage(data) {
        try {
            await axios.post(`${process.env.REACT_APP_API_URL}/createMessage`, data);
        } catch (error) {
            throw new Error(`Failed to create message: ${error.message}`);
        }
    }
}