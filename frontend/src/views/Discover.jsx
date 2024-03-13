import { useEffect, useState, useContext } from "react";
import axios from "axios";
// import { NavLink } from "react-router-dom";
// import { Link } from "react-router-dom";


import { AppContext } from "../appContext";

// import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";
// import img1 from "../assets/images/posts/background05.jpeg";
// import loveIcon from "../assets/icons/svgs/love__solid.svg";
// import commentIcon from "../assets/icons/svgs/comment__solid.svg";

import DiscoverUserItem from "../components/DiscoverUserItem";

function Discover(){
    const [usersState, setUsersState] = useState([]);
    const context = useContext(AppContext);
    const { user } = context;

    useEffect(() => {
        axios.get("/api/v1/user/users")
            .then(res => {
                const { users } = res.data;
								// console.log(users);
                const userComponents = users.map((_user, index) => {
										if(_user._id === user._id){
											return;
										}

                    return <DiscoverUserItem key={index} _user={ _user }/>;
                });
                setUsersState(userComponents);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div>
					Discover Page
					<div className="discover--user-list">
						{ usersState }
					</div>
        </div>
    );
}

export default Discover;
