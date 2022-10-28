import axios from "axios";

class UserService {

    getUsers(): any {
        
        return ['Juan Diego', 'Nicolas', 'Santiago'];

        // axios.get('http://localhost:3001/')
        
        //     .then((res) => {
        //         console.log(res);
        //         return res;
        //     })

        //     .catch((err) => {
        //         console.log(err);
        //         return err;
        //     });
        
        
    };
}

export default UserService;