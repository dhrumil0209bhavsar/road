constants = {
    HOST: "http://192.168.43.149:3003/",
    SECRET_KEY: 's9iIk0llo06TgfrTFDrfvHFKJbJBbvftrdFYT',
    //mongoDBURL: 'mongodb://localhost:27017/roadGrievanceDB',
    // mongoDBURL: 'mongodb://road:roadserver2@ds131313.mlab.com:31313/roadb',
    mongoDBURL: 'mongodb://road123:road123@ds113443.mlab.com:13443/roadgrievancedb',
    //mongoMlabURL: 'mongodb://roadImage@r0adImage@ds037468.mlab.com:37468/image_cdn',
    // mongoDBURL: 'mongodb://localhost:27017/roadGrievanceDB',
    // mongoDBURL: 'mongodb://kaushik:kaushik1@ds113443.mlab.com:13443/roadgrievancedb',
    // mongoMlabURL: 'mongodb://roadImage@r0adImage@ds037468.mlab.com:37468/image_cdn',
    officersHierarchy: [
        'Section Officer',
        'Deputy Executive Engineer',
        'Executive Engineer',
        'Superintending Engineer',
        'Chief Engineer'
    ],
    OTP_EXPIRATION: 120,
    getFormatedDate: (date) => {
        return ( 
            (date.getDate() < 10) ? '0'+date.getDate() : date.getDate() 
        ) 
        + ":" + 
        ( (date.getMonth() + 1) < 10 ? '0'+(date.getMonth() + 1) : (date.getMonth() + 1) )
         + ":" + date.getFullYear();
    }
}


module.exports = {
    constants
}
