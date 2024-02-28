import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

import img1 from "../assets/images/posts/background05.jpeg";

import loveIcon from "../assets/icons/svgs/love__solid.svg";
import commentIcon from "../assets/icons/svgs/comment__solid.svg";

function Discover(){
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

    return (
        <div>
					Discover Page
					<div className="discover--user-list">
						{ users.map((user, index) => {
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

						}) }
					</div>
        </div>
    );
}

export default Discover;
