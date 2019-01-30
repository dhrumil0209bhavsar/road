const db = require('./db');


// setInterval(() => {
// 	db.Officer.findOne({
// 		phoneNo: "9426314245"
// 	}, (err, data) => {
// 		console.log(data.phoneNo)
// 	})
// }, 1)

// let k = new db.Officer({
// 	name: "Kaushik Jadav",
// 	phoneNo: "8866538204",
// 	email: "kaushikjadav602@gmail.com",
// 	role: "Admin",
// 	password: "$2a$10$Ytp/HET0w3BlKFggDcQ6uOXTdLFNNo11MLnrpEMUeMwuFwS0WhKoW"
// })

// k.save()
//  .then(data => console.log(data))

// let phoneNo = req.body.phoneNo,
// password = req.body.password;
let filter = { "phoneNo": "8866538204" };

// search for officer in db.Officer
db.Officer.find(filter, (err, data) => {
	console.log("new", err, data);
})

// api/android/complaint.js api/android/otp.js api/portal/complaint.js excelToDb.js globals/index.js models/officer.js models/roads.js test.js