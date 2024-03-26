import { NavLink } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";

const CustomLink = ({ to, children, normalClassName, activeClassName }) => {
	const location = useLocation();

	let linkClassName = normalClassName; 
	if(location.pathname === to){
		linkClassName = activeClassName;	
	}

  return (
    <Link to={to} className={linkClassName}>
      {children}
    </Link>
  );
};

export default CustomLink;
