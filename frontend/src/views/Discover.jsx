import { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";


import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";

import img1 from "../assets/images/posts/background05.jpeg";
import { AppContext } from "../appContext";

import loveIcon from "../assets/icons/svgs/love__solid.svg";
import commentIcon from "../assets/icons/svgs/comment__solid.svg";

function Discover(){
    const [usersState, setUsersState] = useState([]);
    const context = useContext(AppContext);
    const { user, baseUrl, calculateAge } = context;

		// let users = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		let users = [
			{
				name: "arianablow",
				age: 21,
				address: "London"
			},
			{
				name: "clarasss",
				age: 21,
				address: "London"
			},
			{
				name: "Gill691",
				age: 20,
				address: "London"
			},
			{
				name: "arianablow",
				age: 21,
				address: "London"
			},
			{
				name: "clarasss",
				age: 21,
				address: "London"
			},
			{
				name: "Gill691",
				age: 20,
				address: "London"
			},
			{
				name: "Gill691",
				age: 20,
				address: "London"
			}
		]

    useEffect(() => {
        axios.get("/api/v1/user/users")
            .then(res => {
                const { users } = res.data;
								// console.log(users);
                const userComponents = users.map((user, index) => {
                    return (<div key={index} className="ms-1 mb-3">
												<NavLink className="" to={`/profile/${user._id}`}>
												{ user.profile_image
													? <img className="discover--user-list-item-img"
															src={`${baseUrl}/user/profileImages/${user.profile_image}`}/>
													: <img className="discover--user-list-item-img" src={img1}/>
												}
												</NavLink>
												<div className="d-flex justify-content-between mt-3">
													<div>
														<div>{ user.first_name } { user.last_name } </div>
													</div>
													<div>
														<img src={loveIcon} className="custom-icon-xl"/>
														<img src={commentIcon} className="custom-icon-xl"/>
													</div>
												</div>
												<div>
													{ user.dateOfBirth
														? calculateAge(user.dateOfBirth)
														: "20" } • { user.currentLocation
																					? `${user.currentLocation.split(",")[0]}, ${user.currentLocation.split(",")[2]}`
																					: "London"}
												</div>
										</div>);
                });
                setUsersState(userComponents);
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div>
					Discover Page
					<div className="discover--user-list">
						{/* { users.map((user, index) => {
										return <div className="discover--user-list-item ms-1 mb-3">
												<NavLink className="" to="/profile/1">
													<img className="discover--user-list-item-img" src={img1}/>
												</NavLink>
												<div className="d-flex justify-content-between mt-3">
													<div>
														<div>{ user.name }</div>
														<div>{ user.age } . { user.address }</div>
													</div>
													<div>
														<img src={loveIcon} className="custom-icon-xl"/>
														<img src={commentIcon} className="custom-icon-xl"/>
													</div>
												</div>
											</div>;

						}) } */}
						
						{ usersState }
					</div>
        </div>
    );
}

export default Discover;
