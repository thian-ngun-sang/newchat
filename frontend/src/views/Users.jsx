import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";

function Users(){
    const [usersState, setUsersState] = useState([]);

    useEffect(() => {
        axios.get("/api/v1/users")
            .then(res => {
                const { users } = res.data;
                const userComponents = users.map((user, index) => {
                    return (
                        <div key={index}>
                            <Link to={`/user/${user._id}`}>
                                <div className="my-2">
                                    <img className="chat-user-item me-2 cursor-pointer" alt="user-list-view" src={femaleDefaultProfile}/>
                                    <span className="cursor-pointer">{user.first_name} {user.last_name}</span>
                                </div>
                            </Link>
                        </div>
                    );
                });
                setUsersState(userComponents);
            })
            .catch(err => console.log(err))
    }, []);

    return <div>
            { usersState }
        </div>
}

export default Users;