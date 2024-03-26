export function dashToCamelCase(inputString) {
  return inputString.replace(/-([a-z])/g, (match, group) => group.toUpperCase());
}

export function toUpperCaseWithUnderscores(inputString) {
  // Replace dashes with underscores and convert to uppercase
  return inputString.replace(/-/g, '_').toUpperCase();
}

export function toTitleCase(str) {
	if(!str){
		return "";
	}

  // Split the string by underscores
  let words = str.split('_');
  
  // Capitalize each word
  let titleWords = words.map(word => {
    // Convert the word to lowercase and capitalize the first letter
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  // Join the words back together with spaces
  let titleString = titleWords.join(' ');
  
  return titleString;
}

export function validateImage(filename){
	if(/[a-zA-Z0-9_\[\]]+\.(png)|(jpg)|(jpeg)|(webp)/.test(filename)){
			return true;
	}else{
			return false;
	}
}

export function generateProfileImageUri(filename, gender){
		if(filename && /[a-zA-Z0-9\[\]]+\.(jpg)|(jpeg)|(webp)/.test(filename)){
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

export function cmToFeetAndInches(cm){
		// 1 inch is equal to 2.54 centimeters
		let inches = cm / 2.54
		
		// 1 foot is equal to 12 inches
		let feet = Math.floor(inches / 12)
		let remaining_inches = Math.round(inches % 12)
		
		return { feet, inches: remaining_inches }
}

export function poundsToKilograms(pounds){
		//  1 pound is approximately equal to 0.453592 kilograms
		let kilograms = pounds * 0.453592;
		return kilograms
}
