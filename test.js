// code for create tables

const db = require('./db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const print = console.log;
const testFolder = './direct/';
const fs = require('fs');
let readXlsxFile = require('read-excel-file/node');

let CEobj = []
let DEEobj=[]
let SEobj=[]
let EEobj=[]
let SeOobj=[]
let CESet= new Set();
let SESet=new Set();
let EESet=new Set();
let DEESet=new Set();
let SeOSet=new Set();
let uniCode_RoadName=[];
let files = fs.readdirSync(testFolder)

files.forEach((file, index) => {
	promises.push(readXlsxFile(testFolder+file).then((rows) => {
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
			    CEobj.push({name:rows[i][header['CE name']],email:rows[i][header['CE E-mail']],phoneNo:rows[i][header['CE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Chief Engineer'});    
			}

			if(!DEESet.has(DEEPhone) && (rows[i][header['DEE name']]!=null)){
			    DEEobj.push({name:rows[i][header['DEE name']],email:rows[i][header['DEE E-mail']],phoneNo:rows[i][header['DEE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Deputy Executive Engineer'});    
			}

			if(!SESet.has(SEPhone)){
			    SEobj.push({name:rows[i][header['SE name']],email:rows[i][header['SE E-mail']],phoneNo:rows[i][header['SE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Superintending Engineer'});    
			}

			if(!EESet.has(EEPhone)){
			    EEobj.push({name:rows[i][header['EE name']],email:rows[i][header['EE E-mail']],phoneNo:rows[i][header['EE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Executive Engineer'});    
			}

			if(!SeOSet.has(SeOPhone)){
			    SeOobj.push({name:rows[i][header['Section officer name']],email:rows[i][header['Section officer E-mail']],phoneNo:rows[i][header['Section officer Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Section Officer'});    
			}

			uniCode_RoadName.push({road_code:rows[i][header['Uniqe code']],name:rows[i][header['Name of Road & chainage']]});

			CESet.add(CEPhone);
			DEESet.add(DEEPhone);
			SESet.add(SEPhone);
			EESet.add(EEPhone);
			SeOSet.add(SeOPhone);
		 }


	}))

})// Dir ForEach


let mainFunction = () => {
	return new Promise(async (resolve, reject) => {
		await files.forEach(async (file, index, array) => {
			await readXlsxFile(testFolder+file)
				.then((rows) => {
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
							CEobj.push({name:rows[i][header['CE name']],email:rows[i][header['CE E-mail']],phoneNo:rows[i][header['CE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Chief Engineer'});    
						}
			
						if(!DEESet.has(DEEPhone) && (rows[i][header['DEE name']]!=null)){
							DEEobj.push({name:rows[i][header['DEE name']],email:rows[i][header['DEE E-mail']],phoneNo:rows[i][header['DEE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Deputy Executive Engineer'});    
						}
			
						if(!SESet.has(SEPhone)){
							SEobj.push({name:rows[i][header['SE name']],email:rows[i][header['SE E-mail']],phoneNo:rows[i][header['SE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Superintending Engineer'});    
						}
			
						if(!EESet.has(EEPhone)){
							EEobj.push({name:rows[i][header['EE name']],email:rows[i][header['EE E-mail']],phoneNo:rows[i][header['EE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Executive Engineer'});    
						}
			
						if(!SeOSet.has(SeOPhone)){
							SeOobj.push({name:rows[i][header['Section officer name']],email:rows[i][header['Section officer E-mail']],phoneNo:rows[i][header['Section officer Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Section Officer'});    
						}
			
						uniCode_RoadName.push({road_code:rows[i][header['Uniqe code']],name:rows[i][header['Name of Road & chainage']]});
			
						CESet.add(CEPhone);
						DEESet.add(DEEPhone);
						SESet.add(SEPhone);
						EESet.add(EEPhone);
						SeOSet.add(SeOPhone);
					}
			})
			if (index === array.length -1) resolve();
		})
	})
}


async function main(){
	
		await files.forEach((file,index) => {
		    //console.log(file); 
		    // File path.
			promises.push(readXlsxFile(testFolder+file).then((rows) => {
			  // `rows` is an array of rows
			  // each row being an array of cells.
			 

				const header = {};
				let i=0;
				rows[0].forEach(e => {
					header[e] = i;
					i++;
				})

				Object.freeze(header);
				//console.log(header);
				//console.log(rows[1][header['CE Mobile No.']]);
				//console.log(rows);
				for (i = 1; i < rows.length; i++){
				    let CEPhone = rows[i][header['CE Mobile No.']];
				    let DEEPhone=rows[i][header['DEE Mobile No.']];
				     let SEPhone=rows[i][header['SE Mobile No.']];
				     let EEPhone=rows[i][header['EE Mobile No.']];
				     let SeOPhone=rows[i][header['Section officer Mobile No.']];
				    //console.log(typeof CEPhone,CEPhone);

					// if(!CESet.has(CEPhone)){
					//     CEobj.push({name:rows[i][header['CE name']],email:rows[i][header['CE E-mail']],phoneNo:rows[i][header['CE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Chief Engineer'});    
					// }

					// if(!DEESet.has(DEEPhone) && (rows[i][header['DEE name']]!=null)){

					//     DEEobj.push({name:rows[i][header['DEE name']],email:rows[i][header['DEE E-mail']],phoneNo:rows[i][header['DEE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Deputy Executive Engineer'});    
					// }
					// if(!SESet.has(SEPhone)){

					//     SEobj.push({name:rows[i][header['SE name']],email:rows[i][header['SE E-mail']],phoneNo:rows[i][header['SE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Superintending Engineer'});    
					// }
					// if(!EESet.has(EEPhone)){

					//     EEobj.push({name:rows[i][header['EE name']],email:rows[i][header['EE E-mail']],phoneNo:rows[i][header['EE Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Executive Engineer'});    
					// }

					// if(!SeOSet.has(SeOPhone)){

					//     SeOobj.push({name:rows[i][header['Section officer name']],email:rows[i][header['Section officer E-mail']],phoneNo:rows[i][header['Section officer Mobile No.']],password:'$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW',role:'Section Officer'});    
					// }
						// uniCode_RoadName.push({road_code:rows[i][header['Uniqe code']],name:rows[i][header['Name of Road & chainage']]});
				 		// CESet.add(CEPhone);
						// DEESet.add(DEEPhone);
						// SESet.add(SEPhone);
						// EESet.add(EEPhone);
						// SeOSet.add(SeOPhone);
				 }


				}))

		})// Dir ForEach

		Promise.all(promises).then(() => {doAtEnd()});
}

// main();


// setTimeout(()=>console.log(CEobj),5000);
// setTimeout(()=>console.log(DEEobj),6000);
// setTimeout(()=>console.log(SEobj),7000);
// setTimeout(()=>console.log(EEobj),8000);
// setTimeout(()=>console.log(SeOobj),9000);
async function doAtEnd() {
	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");
	console.log(uniCode_RoadName.length);
	console.log(CEobj.length);
	console.log(DEEobj.length);
	console.log(SEobj.length);
	console.log(EEobj.length);
	console.log(SeOobj.length);
	console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>");

	// await uniCode_RoadName.forEach(async road => {
	//     let rd = new db.Road({
	//         road_code: road.road_code,
	//         name: road.name
	//     })

	//     await rd.save()
	//             .then(data => {
	//                 console.log(rd.road_code);
	//             })
	//             .catch(err => console.log(err))
	// })

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
	            .catch(err => console.log(err))
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
	            .catch(err => console.log(err))
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
	            .catch(err => console.log(err))
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
	            .catch(err => console.log(err))
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
	            .catch(err => console.log(err))
	})

}

// mainFunction()
// 	.then(async () => {
// 		await doAtEnd();
// 		console.log(("done"));
		
// 	})






// //--------------Code for hierarchy -----------------------
const db = require('./db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const print = console.log;
const testFolder = './direct/';
const fs = require('fs');
let readXlsxFile = require('read-excel-file/node');

let CESet= new Set();
let SESet=new Set();
let EESet=new Set();
let DEESet=new Set();
let SeOSet=new Set();

let files = fs.readdirSync(testFolder)

let promises = []


async function main(){
	
	await files.forEach((file,index) => {
		promises.push(readXlsxFile(testFolder+file).then((rows) => {
			
			const header = {};
			let i=0;
			rows[0].forEach(e => {
				header[e] = i;
				i++;
			})

			Object.freeze(header);
			//console.log(header);
			//console.log(rows[1][header['CE Mobile No.']]);
			//console.log(rows);
			for (i = 1; i < rows.length; i++){
				let CEPhone = rows[i][header['CE Mobile No.']];
				let DEEPhone=rows[i][header['DEE Mobile No.']];
					let SEPhone=rows[i][header['SE Mobile No.']];
					let EEPhone=rows[i][header['EE Mobile No.']];
					let SeOPhone=rows[i][header['Section officer Mobile No.']];
				//console.log(typeof CEPhone,CEPhone);

				if(!SESet.has(SEPhone)){
					db.officer.find({'phoneNo': CEPhone}).then(data => {
							console.log(data);

							db.officer.find({phoneNo: CEPhone}, function(err, doc){
								if(err){
									res.render('error', {errorMsg: "Error blah blah"})
								}
			
								});

					}).catch(err => {})
				}

					CESet.add(CEPhone);
					DEESet.add(DEEPhone);
					SESet.add(SEPhone);
					EESet.add(EEPhone);
					SeOSet.add(SeOPhone);
				}


			}))

	})// Dir ForEach

	Promise.all(promises).then(() => {doAtEnd()});
}

// main();

let mainFunction = () => {
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


async function doAtEnd() {
	console.log("done");
}


mainFunction()
	.then(() => {
		doAtEnd()
	})
	.catch(err => console.log(err))






















// let roads = [
//     {
//         road_code: "CS1",
//         name: "Gandhinagar- Koba- airodram road Km.3/20 to 14/65"
//     },
//     {
//         road_code: "CS2",
//         name: "Koba-Sabarmati-Ahmedabad road Km.10/00 to 16/30"
//     },
//     {
//         road_code: "CS3",
//         name: "Sargasan-Shahpur- Lavarpur road 0/0 to 10/30"
//     },
//     {
//         road_code: "NS1",
//         name: "National Highway Division- Ahmedabad Chiloda-Gandhinagar -Sarkhej Km.0/0 to 11/0"
//     },
//     {
//         road_code: "NS2",
//         name: "National Highway Division- Ahmedabad Chiloda-Gandhinagar -Sarkhej Km.11/0 to 22/0"
//     },
//     {
//         road_code: "NS3",
//         name: "National Highway Division- Ahmedabad Chiloda-Gandhinagar -Sarkhej Km.22/0 to 33/0"
//     },
//     {
//         road_code: "NS4",
//         name: "National Highway Division- Ahmedabad Chiloda-Gandhinagar -Sarkhej Km.33/0 to 44/0"
//     },
// ]

// uniCode_RoadName.forEach(async road => {
//     let rd = new db.Road({
//         road_code: road.road_code,
//         name: road.name
//     })

//     await rd.save()
//             .then(data => {
//                 console.log(rd.road_code);
//             })
//             .catch(err => console.log(err))
// })


// db.Officer.insertMany([{
//     name: "Kaushik",
//     phoneNo: "8866538204",
//     email: "kaushikjadav602@gmail.com",
//     password: bcrypt.hashSync("123456", 10),
//     role: "Admin",
// }])

// let officerId = req.query.officerId;
// let officerWithData = [];
// let officers = [];
// let lvl = 0;

// let getJrs = async (id,callback) => {
//     await db.OfficerHierarchy.find({ senior_officer: mongoose.Types.ObjectId(id) })
//     .then(async data => {
        
//         let ids = await data.map(data => {
//             officers.push(String(data.junior_officer))

//             // officers.forEach(officer => {
            
//             // })

//             return String(data.junior_officer);
//         })
//         lvl += ids.length;

//         if(ids.length == 0 && lvl == 1) {
//             callback();
//             return 0;
//         } else {
//             ids.forEach(async id => {
//                 await getJrs(id,callback);
//                 lvl--;
//             });
//         }
//     })
// }

// let main = async () => {
//     officers.push("5c0794b3dda565126d26a45d")
//     await getJrs("5c0794b3dda565126d26a45d",mCallback);
//     // await Promise.all(lvl).then(data => print(officers))
//     return;
// }

// async function mCallback() {
//     let promises = [];
//     let mp = await officers.forEach(officer => {
//         promises.push(db.Officer.findOne({ _id: mongoose.Types.ObjectId(officer) })
//             .then(data => {
//                 officerWithData.push(data);
//             }));
//     })

//     print(mp,typeof mp,promises);
//     Promise.all(promises).then(() =>
//     print(officerWithData,officerWithData.length));
// }

// main()

// // let mMoreMain = async () => {
// //     await main();
// //     print(officers);
// // }

// // mMoreMain();
    


// // setTimeout(() => print(officers), 5000);