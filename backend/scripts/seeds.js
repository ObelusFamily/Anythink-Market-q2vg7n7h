//TODO: seeds script should come here, so we'll be able to put some data in our local env


// require mongoose library
const mongoose = require('mongoose')

//require the models
require('../models/User')
require('../models/Item')
require('../models/Comment')

var User = mongoose.model('User')
var Item = mongoose.model('Item')
var Comment = mongoose.model('Comment')

// connect to the db instance

if(process.env.MONGODB_URI){
    mongoose.connect(process.env.MONGODB_URI)
}else{
    console.warn('Mongodb url is missing');
}


// defined global variables
let userId;
let itemId;

// function that will create 100 items, users and comments
async function seedData(){

    // user
    const users = Array.from(Array(100)).map((_item, i)=>({
        username: `user${i}`,
        email: `user${i}@gmail.com`,
        bio: 'test bio',
        image: 'https://picsum.photos/200',
        role: 'user',
        favorite: [],
        following:[]         
    }))

    for(let user of users){
        const U = new User(user)
        const dbItem = await U.save()
        if(!userId){
            userId = dbItem._id
        }
    }

    // item
    const items = Array.from(Array(100)).map((_item, i)=>({
        slug: `Test Title ${i}`,
        title: `Test Item ${i}`,
        description: "test description",
        image: 'https://picsum.photos/200',
        comments: [],
        tagList: ['test', 'tag'],
        seller: userId
    }))

    for(item of items){
        const it = new Item(item)
        const dbItem = await it.save()
        
        if(!itemId){
            itemId = dbItem._id
        }
    }

    // Comments
    const comments = Array.from(Array(100)).map((_item, i)=>({
        body: `This is the body for ${i}`,
        seller: userId,
        item: itemId
    }))

    for(comment of comments){
        const c = new Comment(comment)
        await c.save()
    }
}



//script run
seedData().then(()=>{
    process.exit()
}).catch((err)=>{
    console.error('err');
    process.exit()
})