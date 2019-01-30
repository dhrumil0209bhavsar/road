const db = require('./db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// const print = console.log;
const testFolder = './new_roads/07/check/';
const fs = require('fs');
let readXlsxFile = require('read-excel-file/node');

let CESet   =   new Set();
let SESet   =   new Set();
let EESet   =   new Set();
let DEESet  =   new Set();
let SeOSet  =   new Set();
let RoadSet  =   new Set();

let files   =   fs.readdirSync(testFolder)
console.log("files : ",files);


let CEobj               =   []
let DEEobj              =   []
let SEobj               =   []
let EEobj               =   []
let SeOobj              =   []
let uniCode_RoadName    =   [];

//for adding officer and road to db
let mainFunction1 = () => {
	return new Promise(async (resolve, reject) => {
		setTimeout(() => {
			console.log("resolved");
			doAtEnd1();
			resolve();
		}, 30000)
		await files.forEach((file, index, array) => {
			readXlsxFile(testFolder+file)
			.then((rows) => {
					// return
					// console.log(file, index);
					const header = {};
					let i=0;
			
					rows[0].forEach(e => {
						header[e] = i;
						i++;
					})
					Object.freeze(header);
					
			
					for (i = 1; i < rows.length; i++){
			
						let CEPhone		=	rows[i][header['CE Mobile No.']];
						let DEEPhone	=	rows[i][header['DEE Mobile No.']];
						let SEPhone		=	rows[i][header['SE Mobile No.']];
						let EEPhone		=	rows[i][header['EE Mobile No.']];
						let SeOPhone	=	rows[i][header['Section officer Mobile No.']];
			
						if(!CESet.has(CEPhone)){
							// console.log(file, " > ", rows[i][header['CE name']], rows[i][header['CE E-mail']], rows[i][header['CE Mobile No.']] );
							CEobj.push({name:rows[i][header['CE name']],email:rows[i][header['CE E-mail']],phoneNo:rows[i][header['CE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Chief Engineer'});    
						}
			
						if(!DEESet.has(DEEPhone)){
							// console.log(file, " > ", "DEE", rows[i][header['DEE name']], rows[i][header['DEE E-mail']], rows[i][header['DEE Mobile No.']] );
							DEEobj.push({name:rows[i][header['DEE name']],email:rows[i][header['DEE E-mail']],phoneNo:rows[i][header['DEE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Deputy Executive Engineer'});    
						}
			
						if(!SESet.has(SEPhone)){
							// console.log(file, " > ", "SE", rows[i][header['SE name']], rows[i][header['SE E-mail']], rows[i][header['SE Mobile No.']]);
							SEobj.push({name:rows[i][header['SE name']],email:rows[i][header['SE E-mail']],phoneNo:rows[i][header['SE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Superintending Engineer'});    
						}
			
						if(!EESet.has(EEPhone)){
							// console.log(file, " > ", "EE", rows[i][header['EE name']], rows[i][header['EE E-mail']], rows[i][header['EE Mobile No.']] );
							EEobj.push({name:rows[i][header['EE name']],email:rows[i][header['EE E-mail']],phoneNo:rows[i][header['EE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Executive Engineer'});    
						}
			
						if(!SeOSet.has(SeOPhone)){
							// console.log(file, " > ", "SeO", rows[i][header['Section officer name']], rows[i][header['Section officer E-mail']], rows[i][header['Section officer Mobile No.']] );
							SeOobj.push({name:rows[i][header['Section officer name']],email:rows[i][header['Section officer E-mail']],phoneNo:rows[i][header['Section officer Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Section Officer'});    
						}
						// console.log(rows[i][header['Uniqe code']]);
						console.log(rows[i][header['Uniqe code']])
						uniCode_RoadName.push({road_code:rows[i][header['Uniqe code']],name:rows[i][header['Name of Road & chainage']]});
						// if(rows[i][header['Uniqe code']]) {
						// 	console.log(file, " > ", "Road : ", rows[i][header['Uniqe code']] );
						// } else {
						// 	return reject(file)
						// }

						/*

							Ahmedabad
							Anand
							Porbandar
							Rajkot
							Surat
							Narmada
							Valsad

						*/
			
						CESet.add(CEPhone);
						DEESet.add(DEEPhone);
						SESet.add(SEPhone);
						EESet.add(EEPhone);
						SeOSet.add(SeOPhone);
					}
			})
			.catch(e => {
				console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>> Error File : ", file, e);	
				reject(e)
			})
		})
	})
}

async function doAtEnd1() {
	// setTimeout(async () => {
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
		console.log("road : ", uniCode_RoadName.length);
		console.log("CE : ", CEobj.length);
		console.log("DEE : ", DEEobj.length);
		console.log("SE : ", SEobj.length);
		console.log("EE : ", EEobj.length);
		console.log("SEO : ", SeOobj.length);
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
		// return
		// await uniCode_RoadName.forEach(async road => {
		// 	console.log("Road : ", road.road_code);
		// })

		// await CEobj.forEach(async road => {
		// 	console.log("CE : ", road.phoneNo);
		// })
	
	
		// await DEEobj.forEach(async road => {
		// 	console.log("DEE : ", road.phoneNo);
		// })
	
	
		// await EEobj.forEach(async road => {
		// 	console.log("EE : ", road.phoneNo);
		// })
	
		// await SEobj.forEach(async road => {
		// 	console.log("SE : ", road.phoneNo);
		// })
	
		// await SeOobj.forEach(async road => {
		// 	console.log("SeO : ", road.phoneNo);
		// })
		
		// return
		await uniCode_RoadName.forEach(async road => {
			let rd = new db.Road({
				road_code: road.road_code,
				name: road.name
			})
	
			await rd.save()
					.then(data => {
						console.log(data);
					})
					.catch(err => console.log(road.road_code))
		})
	
		await CEobj.forEach(async road => {
			let rd = new db.Officer({
			name: road.name,
			phoneNo: road.phoneNo,
			email: road.email,
			password: road.password,
			role: road.role
			})
			
			await rd.save()
					.then(data => {
						console.log("CE"+rd.name);
					})
					.catch(err => console.log(rd))
		})
	
	
		await DEEobj.forEach(async road => {
			let rd = new db.Officer({
			name: road.name,
			phoneNo: road.phoneNo,
			email: road.email,
			password: road.password,
			role: road.role
			})
	
			await rd.save()
					.then(data => {
						console.log("DE"+rd.name);
					})
					.catch(err => console.log(rd))
		})
	
	
		await EEobj.forEach(async road => {
			let rd = new db.Officer({
			name: road.name,
			phoneNo: road.phoneNo,
			email: road.email,
			password: road.password,
			role: road.role
			})
	
			await rd.save()
					.then(data => {
						console.log("EE"+rd.name);
					})
					.catch(err => console.log(rd))
		})
	
		await SEobj.forEach(async road => {
			let rd = new db.Officer({
			name: road.name,
			phoneNo: road.phoneNo,
			email: road.email,
			password: road.password,
			role: road.role
			})
	
			await rd.save()
					.then(data => {
						console.log("SE"+rd.name);
					})
					.catch(err => console.log(rd))
		})
	
		await SeOobj.forEach(async road => {
			let rd = new db.Officer({
				name: road.name,
				phoneNo: road.phoneNo,
				email: road.email,
				password: road.password,
				role: road.role
			})
	
			await rd.save()
					.then(data => {
						console.log("SEO"+rd.name);
					})
					.catch(err => console.log(rd))
		})
	// }, 120000)
}

//for adding officerHierarchy
let mainFunction2 = () => {
	return new Promise(async (resolve, reject) => {
		await files.forEach(async (file, index, array) => {
			await readXlsxFile(testFolder+file)
				.then(async (rows) => {
					const header = {};
					let i=0;
					rows[0].forEach(e => {
						header[e] = i;
						i++;
					})
		
					Object.freeze(header);

					for (i = 1; i < rows.length; i++){
						let CEPhone		=	rows[i][header['CE Mobile No.']];
						let SEPhone		=	rows[i][header['SE Mobile No.']];
						let EEPhone		=	rows[i][header['EE Mobile No.']];
						let DEEPhone	=	rows[i][header['DEE Mobile No.']];
						let SeOPhone	=	rows[i][header['Section officer Mobile No.']];

						// console.log("SE >>>>  CE");
						
						if(!SESet.has(SEPhone)){
							await db.Officer.findOne({'phoneNo': SEPhone}).then(async jrOff => {
								await db.Officer.findOne({'phoneNo': CEPhone}).then(async srOff => {
									let tempH = new db.OfficerHierarchy({
										senior_officer: srOff._id,
										junior_officer: jrOff._id
									})
									await tempH.save()
											.then(data => {
												console.log("officer H saved")
											})
								})
							}).catch(err => reject(err))
						}

						// console.log("EE >>>>  SE");

						if(!EESet.has(EEPhone)){
							await db.Officer.findOne({'phoneNo': EEPhone}).then(async jrOff => {
								await db.Officer.findOne({'phoneNo': SEPhone}).then(async srOff => {
									let tempH = new db.OfficerHierarchy									({
										senior_officer: srOff._id,
										junior_officer: jrOff._id
									})
									await tempH.save()
											.then(data => {
												console.log("officer H saved")
											})
								})
							}).catch(err => reject(err))
						}

						// console.log("DEE >>>>  EE");

						if(!DEESet.has(DEEPhone)){
							await db.Officer.findOne({'phoneNo': DEEPhone}).then(async jrOff => {
								await db.Officer.findOne({'phoneNo': EEPhone}).then(async srOff => {
									let tempH = new db.OfficerHierarchy									({
										senior_officer: srOff._id,
										junior_officer: jrOff._id
									})
									await tempH.save()
											.then(data => {
												console.log("officer H saved")
											})
								})
							}).catch(err => reject(err))
						}

						// console.log("SeO >>>>  DEE");

						if(!SeOSet.has(SeOPhone)){
							await db.Officer.findOne({'phoneNo': SeOPhone}).then(async jrOff => {
								await db.Officer.findOne({'phoneNo': DEEPhone}).then(async srOff => {
									let tempH = new db.OfficerHierarchy({
										senior_officer: srOff._id,
										junior_officer: jrOff._id
									})
									await tempH.save()
											.then(data => {
												console.log("officer H saved")
											})
								})
							}).catch(err => reject(err))
						}
		
						CESet.add(CEPhone);
						SESet.add(SEPhone);
						DEESet.add(DEEPhone);
						EESet.add(EEPhone);
						SeOSet.add(SeOPhone);
					}		
				})
			if (index === array.length -1) resolve();
		})
	})
}

function isnum(d) { return /^\d+$/.test(d); }

async function doAtEnd2() {
	console.log("done");
}

//for adding roadToOfficer to db
let mainFunction3 = () => {
	return new Promise(async (resolve, reject) => {
		await files.forEach(async (file, index, array) => {
			await readXlsxFile(testFolder+file)
			.then(async (rows) => {
				const header = {};
				let i=0;
				rows[0].forEach(e => {
					header[e] = i;
					i++;
				})
				
				console.log("File + ",file, + " : index ", index);
					Object.freeze(header);
					
					// let findOnce = true;
					for (i = 1; i < rows.length; i++){
						let RoadCode	=	rows[i][header['Uniqe code']];
						let SeOPhone	=	rows[i][header['Section officer Mobile No.']];
						// let CEPhone		=	rows[i][header['CE Mobile No.']];
						// let DEEPhone	=	rows[i][header['DEE Mobile No.']];
						// let SEPhone		=	rows[i][header['SE Mobile No.']];
						// let EEPhone		=	rows[i][header['EE Mobile No.']];
						// if(!(isnum(SeOPhone) &&
						// isnum(CEPhone) &&
						// isnum(DEEPhone) &&
						// isnum(SEPhone) &&
						// isnum(EEPhone) &&
						// isnum(RoadCode) && findOnce))
						// {
						// 	console.log("Error FounD");
						// 	findOnce = false;
						// }

						if(!RoadSet.has(RoadCode)){
							console.log(RoadCode);
							
							await db.Officer.findOne({'phoneNo': SeOPhone}).then(async officer => {
								await db.Road.findOne({'road_code': RoadCode}).then(async road => {
									let tempH = new db.RoadToOfficer({
										road_code: road.road_code,
										officer: officer._id
									})
									await tempH.save()
											.then(data => {
												console.log("roadToOfficer saved")
											})
								})
							}).catch(err => reject(err))
                        }
                        
						RoadSet.add(RoadCode);
						SeOSet.add(SeOPhone);
					}		
				})
			if (index === array.length -1) resolve();
		})
	})
}

async function doAtEnd3() {
	setTimeout(() => {
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
		console.log("done");
		console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
	}, 120000)
}

//use mainFunction 1 or 2 or 3
mainFunction3()
	.then(() => {
		// doAtEnd1()
	})
	.catch(err => console.log(err))
