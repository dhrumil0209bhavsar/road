function addZeros(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

constants = {
    HOST: "https://roadgrievance.herokuapp.com/",
    SECRET_KEY: 's9iIk0llo06TgfrTFDrfvHFKJbJBbvftrdFYT',
    mongoDBURL: 'mongodb://road123:road123@ds113443.mlab.com:13443/roadgrievancedb',
    // mongoDBURL: 'mongodb://kaushik:123456@localhost:27017/roadGrievanceDB',
    // mongoImage: 'mongodb://road123:road123@ds135724.mlab.com:35724/roadgrievancedb',
    // mongoDBURL: 'mongodb://new_files:new_files07@ds147190.mlab.com:47190/new_files07',
    // mongoMlabURL: 'mongodb://roadImage@r0adImage@ds037468.mlab.com:37468/image_cdn',
    // mongoDBURL: 'mongodb://localhost/roadGrievanceDB',
    // mongoDBURL: 'mongodb://kaushik:kaushik1@ds113443.mlab.com:13443/roadgrievancedb',
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
            addZeros(date.getDate())
            + ':'
            + addZeros(date.getMonth()) 
            + ':' 
            + addZeros(date.getFullYear())
        );
    },
    getFormatedTime: (date) => {
        return (
        addZeros(date.getHours())
        + ':'
        + addZeros(date.getMinutes()) 
        + ':' 
        + addZeros(date.getSeconds())
        )
    },
    MIN_RADIUS: 500,
    isUpdated: new Date()
}


module.exports = {
    constants
}
