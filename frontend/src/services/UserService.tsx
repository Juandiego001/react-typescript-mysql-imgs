import axios from "axios";

class UserService {

    async postUsers(userData: Object): Promise<Object> {
        let response = await axios.post("http://localhost:3002/users", userData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        return response.data;
    }

    async getUsers(): Promise<Object> {
        let response = await axios.get('http://localhost:3002/users');
        return response.data;
    };
}

export default new UserService();