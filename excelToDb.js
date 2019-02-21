const http = require('http');
const fs = require('fs');
const mongoose = require('mongoose');

const CONSTANTS = require('./globals').constants;
const ExcelReader = require('node-excel-stream').ExcelReader;
const dataStream = fs.createReadStream("./newExcelfromJashvantsir.xlsx");
// const db = require('./db');
const newOfficer = require('./models/newOfficer');

mongoose.set('useCreateIndex', true);
mongoose.connect(CONSTANTS['mongoDBURL'], { useNewUrlParser: true });
const database = mongoose.connection;
mongoose.Promise = global.Promise;

let main = () => {
	let reader = new ExcelReader(dataStream, {
		sheets: [{
			name: 'OfficersWithEmainAndName',
			rows: {
				headerRow: 1,
				allowedHeaders: [
					{name: 'roadcode', key: 'roadcode'},
					{name: 'role', key: 'role'},
					{name: 'name', key: 'name'},
					{name: 'phoneNo', key: 'phoneNo'},
					{name: 'email',	key: 'email'},
					{name: 'fileName', key: 'fileName'},
					{name: 'new_phoneNo', key: 'new_phoneNo'},
					{name: 'srno',	key: 'srno'},
					{name: 'merged', key: 'merged'}
				]
			}
		}]
	})
	
	reader.eachRow((rowData, rowNum) => {
		let { roadcode, role, name, phoneNo, email, fileName, new_phoneNo, srno, merged } = rowData;
		
		// let officer = new db.Officer({
		// 	name,
		// 	phoneNo: new_phoneNo,
		// 	email,
		// 	role,
		// 	roadCode: roadcode,
		// 	fileName
		// });

		// officer
		// 	.save()
		// 	.then(data => {
		// 		// console.log(data._id, data.email);				
		// 	})
		// 	.catch(err => {
		// 		console.log(rowNum, name, fileName, err.message);
		// 	});

		let officer = new newOfficer({
			merged,
			phoneNo: new_phoneNo,
		});

		officer
			.save()
			.then(data => {
				console.log(data._id, data.phoneNo);				
			})
			.catch(err => {
				console.log(rowNum, name, fileName, err.message);
			});


	})
	.then(() => {
		console.log('done parsing');
	});
}

//Error on database connection
database.on('err', () => {
    console.error("Error connecting database");
});

database.once('open', () => {
	//Running server
	main();
});
