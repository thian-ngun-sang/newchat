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
        axios.get(`/api/v1/user/users?-current_user_id=${user._id}`)
            .then(res => {
                const { users } = res.data;
								console.log(users);
	
                const userComponents = users.map((_user, index) => {
										if(_user._id === user._id){
											return null;
										}

                    return <DiscoverUserItem key={index} _user={ _user }/>;
                });
                setUsersState(userComponents);
            })
            .catch(err => console.log(err))
    }, [0]);

    return (
        <div className="app-content">
					<div className="text-center cmb-3">
						<h3>Find someone to love</h3>
					</div>
					<div className="discover--user-list">
					{ usersState }
					{ usersState }
					{ usersState }
					{ usersState }
					{ usersState }
					{ usersState.length < 2 && <div></div> }
					{ usersState.length < 3 && <div></div> }
					
					</div>
        </div>
    );
}

export default Discover;
