const db = require('./db');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const print = console.log;

let roads = [
    {
        road_code: "CS1",
        name: "Gandhinagar- Koba- airodram road Km.3/20 to 14/65"
    },
    {
        road_code: "CS2",
        name: "Koba-Sabarmati-Ahmedabad road Km.10/00 to 16/30"
    },
    {
        road_code: "CS3",
        name: "Sargasan-Shahpur- Lavarpur road 0/0 to 10/30"
    },
    {
        road_code: "NS1",
        name: "National Highway Division- Ahmedabad Chiloda-Gandhinagar -Sarkhej Km.0/0 to 11/0"
    },
    {
        road_code: "NS2",
        name: "National Highway Division- Ahmedabad Chiloda-Gandhinagar -Sarkhej Km.11/0 to 22/0"
    },
    {
        road_code: "NS3",
        name: "National Highway Division- Ahmedabad Chiloda-Gandhinagar -Sarkhej Km.22/0 to 33/0"
    },
    {
        road_code: "NS4",
        name: "National Highway Division- Ahmedabad Chiloda-Gandhinagar -Sarkhej Km.33/0 to 44/0"
    },
]

// officers.forEach(async officer => {
//     let user = new db.Officer({
//         name: officer.name,
//         email: officer.email,
//         phoneNo: officer.phoneNo,
//         password: officer.password,
//         role: officer.role,
//     })

//     await user.save()
//             .then(data => {
//                 // console.log(dat);
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
let officerWithData = [];
let officers = [];
let lvl = 0;

let getJrs = async (id,callback) => {
    await db.OfficerHierarchy.find({ senior_officer: mongoose.Types.ObjectId(id) })
    .then(async data => {

        console.log("db fetch data ", data);
        
        let ids =[]
        for(let i=0; i < data.length; i++){
            officers.push(String(data[i].junior_officer))
            ids.push(String(data[i].junior_officer))

            console.log('inside for : ' , data[i]);
        }

        // let ids = await data.map(data => {
        //     console.log("ids data", data);
        //     officers.push(String(data.junior_officer))
        //     return String(data.junior_officer);
        // })
        lvl += ids.length;

        if(ids.length == 0 && lvl == 1) {
            console.log(officers);
//            callback();
            return 0;
        } else {

            for(let i=0; i < ids.length; i++){
                console.log('ides foreach : ', ids[i]);
                getJrs(ids[i],callback);
                lvl--;
            }

            // ids.forEach(async id => {
            //     console.log('ides foreach : ', id);
            //     await getJrs(id,callback);
            //     lvl--;
            // });
        }
    })
}

let main = async () => {
    //officers.push("5c0794b3dda565126d26a45d")
    await getJrs("5c079674dda565126d26a460",mCallback);
    // await Promise.all(lvl).then(data => print(officers))
    return;
}

async function mCallback() {
    let promises = [];
    let mp = await officers.forEach(officer => {
        promises.push(db.Officer.findOne({ _id: mongoose.Types.ObjectId(officer) })
            .then(data => {
                officerWithData.push(data);
            }));
    })

    print(mp,typeof mp,promises);
    Promise.all(promises).then(() =>
    print(officerWithData,officerWithData.length));
}

main()

// let mMoreMain = async () => {
//     await main();
//     print(officers);
// }

// mMoreMain();
    


// setTimeout(() => print(officers), 5000);