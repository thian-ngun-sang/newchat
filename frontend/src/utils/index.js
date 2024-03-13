export function dashToCamelCase(inputString) {
  return inputString.replace(/-([a-z])/g, (match, group) => group.toUpperCase());
}

export function toUpperCaseWithUnderscores(inputString) {
  // Replace dashes with underscores and convert to uppercase
  return inputString.replace(/-/g, '_').toUpperCase();
}

export function validateImage(filename){
	if(/[a-zA-Z0-9_\[\]]+\.(png)|(jpg)|(jpeg)|(webp)/.test(filename)){
			return true;
	}else{
			return false;
	}
}

export function generateProfileImageUri(filename, gender){
		if(/[a-zA-Z0-9\[\]]+\.(jpg)|(jpeg)|(webp)/.test(filename)){
				return `user/profileImages/${filename}` 
		}else{
				if(gender === "male"){
					return `user/profileImages/defaults/male_user.jpg`;
				}else if(gender === "female"){
					return `user/profileImages/defaults/female_user.jpg`;
				}else{
					return `user/profileImages/defaults/user.jpg`;
				}
		}
}

export function calculateAge(dateOfBirth){
	const dateOfBirthObj = new Date(dateOfBirth);

	var month_diff = Date.now() - dateOfBirthObj;

	//	convert the calculated difference in date format  
	var age_dt = new Date(month_diff);
	//	extract year from date      
	var year = age_dt.getUTCFullYear();  
	//	now calculate the age of the user  
	var age = Math.abs(year - 1970);

	return age;
}
