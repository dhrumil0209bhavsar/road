const testFolder = './direct/check/';
const fs = require('fs');
let readXlsxFile = require('read-excel-file/node');
let files   =   fs.readdirSync(testFolder)
console.log("files : ",files);

readXlsxFile(testFolder+"b1.xlsx")
	.then(f1 => {
		readXlsxFile(testFolder+"t1.xlsx")
			.then(b1 => {

				const headerf1 = {};
				let if1=0;
		
				f1[0].forEach(e => {
					headerf1[e] = if1;
					if1++;
				})
				Object.freeze(headerf1);

				const headerb1 = {};
				let ib1=0;
		
				b1[0].forEach(e => {
					headerb1[e] = ib1;
					ib1++;
				})
				Object.freeze(headerb1);
                
                let mMap = new Map();

				for (i = 1; i < f1.length; i++){
                    mMap.set(f1[i][headerf1['Uniqe code']],f1[i][headerf1['road']])
                }

                for (i = 1; i < b1.length; i++){
                    if(mMap.get(b1[i][headerf1['Uniqe code']]) === b1[i][headerb1['road']]){
                        console.log("true : " + i);
                    }else{
                        break;   
                    }
                }

				// for (i = 1; i < f1.length; i++){
				// 	if(f1[i][headerf1['Uniqe code']] === b1[i][headerb1['Uniqe code']]) {
				// 		console.log(true);
				// 	} else {
				// 		console.log(i);
				// 		break;
				// 	}
				// }				

			})
	})


