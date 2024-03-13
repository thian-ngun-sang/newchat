import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import { AppContext } from "../appContext";

import { dashToCamelCase, toUpperCaseWithUnderscores } from "../utils/index";

import AuthBridge from "../components/AuthBridge";

function MoreAbout(){
	const context =  useContext(AppContext);
	const { user, storeToken } = context;

	const [form, setForm] = useState({
				sexualOrientation: "STRAIGHT_MALE",
				profession: "",
				relationshipStatus: "SINGLE",
				idealRelationship: [],
				languages: []
			});

	const [bioInfoForm, setBioInfoForm] = useState({
		height: null,
		weight: null
	})

	const navigate = useNavigate();

	function handleOnChange(event){
		const target = event.target;
		const name = dashToCamelCase(target.name);
		const value = event.target.value;

		if(target.getAttribute("dtype") === "array"){
				const valueInArray = value.split(",");
				setForm(prev => {
					return {
						...prev,
						[name]: valueInArray
					}
				});

			return;
		}

		if(event.target.type === "checkbox"){
				if(target.checked){
					setForm(prev => {
						return {
							...prev,
							[name]: [...form[name], toUpperCaseWithUnderscores(target.id)]
						}
					});
				}else{
					setForm(prev => {
						return {
							...prev,
							[name]: form[name].filter(item => item !== toUpperCaseWithUnderscores(target.id))
						}
					});
				}

			return;
		}

		setForm(prev => {
			return {
				...prev,
				[name]: value
			};
		});
	}

	function handleBioInfo(event){
		const target = event.target;

		if(target.getAttribute("dtype") === "float"){
			setBioInfoForm(prev => {
				return {
					...prev,
					[target.name]: parseFloat(target.value)
				}
			});
		}else if(target.getAttribute("dtype") === "number"){
			setBioInfoForm(prev => {
				return {
					...prev,
					[target.name]: Number.parseInt(target.value)
				}
			});
		}

	}

	async function submitForm(event){
		event.preventDefault();

		try{
			await axios.post("/api/v1/user/add-overview-info", form)
		}catch(error){
			console.log(error);	
			return;
		}

		try{
			await axios.post("/api/v1/user/add-bio-info", bioInfoForm)
		}catch(error){
			console.log(error);
			return;
		}

		navigate("/account");
	}

const floatHeights = [
	121.92, 124.46, 127, 129.54, 132.08, 134.62, 137.16, 139.7,
	142.24, 144.78, 147.32, 149.86,

	152.4, 154.94, 157.48, 160.02, 162.56, 165.1, 167.64,
	170.18, 172.72, 175.26, 177.8, 180.34,
	
	182.88, 185.42, 187.96, 190.5, 193.04, 195.58, 198.12,
	200.66, 203.2, 205.74, 208.28, 210.82,
	
	213.36, 215.9, 218.44, 220.98, 223.52, 226.06, 228.6,
	231.14, 233.68, 236.22, 238.76, 241.3, 243.84
]

const weightList = [
 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150,
 155, 160, 165, 170, 175, 180, 185, 190, 195, 200
];

	function cmToFeetAndInches(cm){
			// 1 inch is equal to 2.54 centimeters
			let inches = cm / 2.54
			
			// 1 foot is equal to 12 inches
			let feet = Math.floor(inches / 12)
			let remaining_inches = Math.round(inches % 12)
			
			return { feet, inches: remaining_inches }
	}

	function poundsToKilograms(pounds){
			//  1 pound is approximately equal to 0.453592 kilograms
			let kilograms = pounds * 0.453592;
			return kilograms
	}

	// if overviewInfo is already filled,
	// 	redirect user to '/account'
	useEffect(() => {
		if(user.overviewInfo || user.bioInfo){
			navigate("/account");
		}
	}, []);

	return <AuthBridge>
		<div className="auth-layout mt-5">
				<div className="text-center">
					<h3>More about you</h3>
				</div>
				<form onSubmit={submitForm}>

					<div className="cmt-2">
						<label className="custom-label">What are you looking for</label>
						<select className="custom-input" name="sexual-orientation" onChange={handleOnChange}>
							<option value="STRAIGHT_MALE">Straight male</option>
							<option value="STRAIGHT_FEMLALE">Straight female</option>
							<option value="GAY">Gay</option>
							<option value="LESBIAN">Lesbian</option>
						</select>
					</div>

					<div className="cmt-2">
						<label className="custom-label">
							Your profession
						</label>
						<input className="custom-input" name="profession" type="text" placeholder="Web developer" onChange={handleOnChange}/>
					</div>

					<div className="cmt-2">
						<label className="custom-label">
							Current relationship status
						</label>
						<select className="custom-input" name="relationship-status" onChange={handleOnChange}>
							<option value="SINGLE">Single</option>
							<option value="MARRIED">Married</option>
							<option value="DIVORCED">Divorced</option>
							<option value="PURE_SINGLE">I have been single for my entire life</option>
						</select>
					</div>

					<div className="cmt-2">
						<label className="custom-label">
							What kind of relationship are you looking
						</label>
						
						<div className="more-about--checkbox-ctn">
							{/* the ids' are used as values (coverted to uppercase with underscores) */}
							<div className="more-about--checkbox">
								<input name="ideal-relationship" type="checkbox" id="casual-relationship" onChange={handleOnChange}/>
								<label className="cms-1" htmlFor="casual-relationship">Casual Relationship</label>
							</div>
							<div className="more-about--checkbox">
								<input name="ideal-relationship" type="checkbox" id="romantic-relationship" onChange={handleOnChange}/>
								<label className="cms-1" htmlFor="romantic-relationship">Romantic Relationship</label>
							</div>
							<div className="more-about--checkbox">
								<input name="ideal-relationship" type="checkbox" id="open-relationship" onChange={handleOnChange}/>
								<label className="cms-1" htmlFor="open-relationship">Open Relationship</label>
							</div>
							<div className="more-about--checkbox">
								<input name="ideal-relationship" type="checkbox" id="friends-with-benefit" onChange={handleOnChange}/>
								<label className="cms-1" htmlFor="friends-with-benefit">Friends with benefit</label>
							</div>
							<div className="more-about--checkbox">
								<input name="ideal-relationship" type="checkbox" id="sax-partner" onChange={handleOnChange}/>
								<label className="cms-1" htmlFor="sax-partner">S*x partner</label>
							</div>
						</div>

					</div>

					<div className="d-flex mt-1">
						<div className="cmt-2 w-50">
							<select className="custom-input" name="height" dtype="float" onChange={handleBioInfo} 
								value={ bioInfoForm.height ? bioInfoForm.heightObj : "" }>
								<option disabled value="">Height</option>
								{ floatHeights.map((item, index) => {
										let heightObj = cmToFeetAndInches(item);
										return <option key={index} value={item}>
											{ heightObj.feet + "\'" } { heightObj.inches !== 0 && heightObj.inches + "\"" } ({ item + "cm" })
										</option>
								}) }
							</select>
						</div>

						<div className="ps-2 cmt-2 w-50">
							<select className="custom-input" name="weight" dtype="number" onChange={handleBioInfo}
								value={ bioInfoForm.weight ? bioInfoForm.weight : "" }>
								<option disabled value="">Weight</option>
								{ weightList.map((item, index) => {
										return <option key={index} value={item}>
										{ item + " lb" } ({ poundsToKilograms(item).toFixed(2) + " kg" })
										</option>
								}) }
							</select>
						</div>
					</div>

					<div className="cmt-2">
						<label className="custom-label">
							Languages
						</label>
						<input className="custom-input" type="text" dtype="array" name="languages" placeholder="English, German"
							onChange={handleOnChange}/>
					</div>

				
					<div className="cmt-3 d-flex justify-content-end">
						<button className="cbtn bd-green">Next</button>	
					</div>
					
					<div className="test"></div>

				</form>
			</div>
		</AuthBridge>;
}

export default MoreAbout;
