import { useEffect } from "react";
import axios from "axios";

import Upshot from "../components/Upshot";

import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";
import moreHorizontal from "../assets/icons/svgs/more-horizontal.svg";
import closeMd from "../assets/icons/svgs/close-md.svg";

import img1 from "../assets/images/posts/background05.jpeg";
// import img2 from "../assets/images/posts/background06.jpg";
// import img3 from "../assets/images/posts/berlin_city_sunset.jpg";
// import img4 from "../assets/images/posts/cherry_blossoms.jpg";
// import img5 from "../assets/images/posts/kruger_national_park.webp";

function Home(){
    useEffect(() => {
        axios.get("/api/v1")
            .then(res => {
                // console.log(res)
            })
            .catch(err => console.log(err))
    }, []);

    return (
        <div className="app-content">
            <div>
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <img className="user-profile" src={femaleDefaultProfile} alt={femaleDefaultProfile}/>
                        <div className="ms-1 post-detail">
                            <span className="d-block">Thian Ngun</span>
                            <small>4 mins ago</small>
                        </div>
                    </div>
                    <div>
                        <img src={moreHorizontal} alt={moreHorizontal} className="custom-icon-lg"/>
                        <img src={closeMd} alt={closeMd} className="ms-1 custom-icon-lg"/>
                    </div>
                </div>
                <div>
                    <p className="post-body">
                        Feel about natural beauty
                    </p>
                    <img className="post-image" src={img1} alt={img1}/>
                </div>
                <div className="mt-2">
                    <Upshot/>
                </div>
                <hr className="post-horizontal-line"/>
            </div>
        </div>
    );
}

export default Home;
