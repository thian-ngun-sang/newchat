// import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function AppLayout(){
    return (
        <div className="app-layout">
            <Navbar/>
            <div> 
                <Outlet/>
            </div>
        </div>
    );
}

export default AppLayout;
