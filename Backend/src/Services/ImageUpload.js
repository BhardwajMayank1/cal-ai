const imageKit = require('@imagekit/nodejs')
const client  = new imageKit({
    privateKey:process.env.IMAGEKIT_PRIVATE_KEY
})
async function uploadPic(file){
const result = await client.files.upload({
    file,
    fileName:'avatar_'+Date.now(),
    folder:"profilePic_",
})
return result
}

async function uploadMeal(file){
    const result = await client.files.upload({
        file,
        fileName:'MealPic_'+Date.now(),
        folder:'Meal'
    }) 
    return result
}

module.exports={uploadPic , uploadMeal}