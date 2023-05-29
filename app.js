const express = require("express")
const app = express()
const multer = require("multer")
const form = multer().array()
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose")
const {channelId,videoId}  = require("@gonetone/get-youtube-id-by-url")
app.set('view engine', 'ejs')
const axios = require("axios")
const cookieparser = require("cookie-parser")
const ytdl = require("ytdl-core")
const session = require("cookie-session")
const moment = require("moment")
require("dotenv").config()
const ffmpeg = require("fluent-ffmpeg")
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath)
const Long = require("long")
const {v4:uuidv4} = require('uuid');
const download = require("image-downloader")
const cron = require("node-cron")
const ytch = require('yt-channel-info')
const cheerio = require("cheerio")
const puppeteerExtra = require("puppeteer-extra")
const stealthPlugin = require("puppeteer-extra-plugin-stealth")
app.use(cookieparser())
app.use(session({
  secret:"e6VgtiqH1DwSNFnHWOJcQEp4b7FwGEZB",
  saveUninitialized: true,
  resave: true
}))


// channelId("https://www.youtube.com/AllAction").then((e)=>{
//     console.log(e)
// })
mongoose.connect(process.env.MONGO_URL,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then((res)=>{
  console.log("connect");
}).catch((err)=>{
  console.log(err);
})

const User = require("./model/users");
const {executablePath} = require("puppeteer")
   const loginAndUploadSingleVideo = async({title,description,tags,categoryId,videoFilePath,thumbFilePath,id}) => {
     console.log("called")
      puppeteerExtra.use(stealthPlugin());
      const browser = await puppeteerExtra.launch({ args: ['--no-sandbox',],
      headless: false,
      ignoreHTTPSErrors: true,
      // add this
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", });
      // const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      try {
      await page.goto('https://accounts.google.com/signin/v2/identifier');
      const userDetail = User.find({_id:id})
      await page.type('[type="email"]', userDetail[0].email,);
      await page.click('#identifierNext');
      await page.waitForTimeout(5000);
      await page.type('[type="password"', userDetail[0].password);
      await page.click('#passwordNext');
      await page.waitForTimeout(6000);
    // Go to upload page
    await page.goto('https://www.youtube.com/upload');

    // Select video file
    const fileInput = await page.$("input[type='file']");
    await fileInput.uploadFile(videoFilePath); // Replace with the path to your video file

    // Fill in video details
    await page.waitForSelector('#textbox');
    const titlebox = await page.$("#textbox")
          await titlebox.click({clickCount:3})
    // await page.evaluate( () => document.getElementById("#textbox").value = "");
    await page.type('#textbox', title); // Replace with your video title
    const desc = await page.$("#description-textarea  #textbox")
    await desc.type(description) // Replace with your video description
    var exists =  await page.$eval("#file-loader", () => true).catch(() => false)
    if(exists){

      const thumbinput = await page.$("#file-loader");
      
      await thumbinput.uploadFile(thumbFilePath);
    }
    // Set privacy
    await page.waitForTimeout(50000)
    const mfk = await page.$("[name='VIDEO_MADE_FOR_KIDS_NOT_MFK']")
    await mfk.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const next_btn = await page.waitForSelector('#next-button');
          await next_btn.evaluate((x)=>{
            x.click()
          })
    // await page.click('#next-button');
    
    await page.waitForTimeout(15000)
    const again_next_btn = await page.waitForSelector('#next-button');
    await again_next_btn.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const again_next_btn_2 = await page.waitForSelector('#next-button');
    await again_next_btn_2.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const again_next_btn_3 = await page.waitForSelector('#next-button');
    await again_next_btn_3.evaluate((x)=>{
      x.click()
    })
    
    await page.waitForTimeout(5000)

    await page.click('#done-button');
    // await page.click('#next-button');
    // await page.click('#radioLabel');
    // await page.waitForSelector('#private-label');
    // await page.click('#private-label');

    // Submit the upload

    // Wait for the upload to complete
    await page.waitForNavigation();

    console.log('Video uploaded successfully!');
   
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
      // Close the browser
      await browser.close();
      fs.unlink(thumbFilePath,(err)=>{
        console.log(err)
      })
      fs.unlink(videoFilePath,(err)=>{
        console.log(err)
      })
    } 
  }

  app.get("/",async(req,res)=>{
      res.redirect("/uploadpop",)
  })

  app.get("/login",(req,res)=>{
    res.render('login')
  })
  app.get("/autoupload",async(req,res)=>{
      const user = await 
    res.render("autoupload")
  })
  app.get("/linkupload",(req,res)=>{
    res.render("linkupload")
  
  })
  app.get("/uploadpop",(req,res)=>{
    res.render("uploadPop")
  })


  app.post("/uploadurl",form,async(req,res)=>{
    const urls =  req.body.urls.split(",")
    const startTime =  new Long( new Date(moment(req.body.time)).getTime())
    var timeIsBeing936 = new Date(new Date(moment(req.body.time))).getTime()
    , currentTime = new Date().getTime()
    , subtractMilliSecondsValue = timeIsBeing936 - currentTime;
    const interval = new Long( parseInt(req.body.interval) * 60000)
    console.log(interval.toString())
    setTimeout(async()=>{
      puppeteerExtra.use(stealthPlugin());
      const browser = await puppeteerExtra.launch({ args: ['--no-sandbox',],
      headless: false,
      ignoreHTTPSErrors: true,
      // add this
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", });
      // const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      try {
      await page.goto('https://accounts.google.com/signin/v2/identifier');
      const userDetail = await User.find({_id:req.body._id})

      await page.type('[type="email"]', userDetail[0].email,);
      await page.click('#identifierNext');
      await page.waitForTimeout(5000);
      await page.type('[type="password"', userDetail[0].password);
      await page.click('#passwordNext');
      await page.waitForTimeout(6000);
    // Go to upload page
    for (let i = 0; i < urls.length; i++) {
      try{
      await page.goto('https://www.youtube.com/upload');
      await waitforme(interval);
      console.log("hey")
      const videoId = urls[i].match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)[1]

  const randomname = uuidv4() + ".mp4"
  const randvid = uuidv4() + ".mp4"
  const randAudio = uuidv4() + ".mp3"
  const randothumb = __dirname +"/" +  uuidv4() + ".jpg"
   const video =   ytdl(videoId,{quality:'highestvideo'}).pipe(fs.createWriteStream(randomname))
   const audio =   ytdl(videoId,{quality:"highestaudio"}).pipe(fs.createWriteStream(randAudio))


function merge(video, audio) {
  ffmpeg()
      .addInput(video)
      .addInput(audio)
      .addOptions(['-map 0:v', '-map 1:a', '-c:v copy'])
      .format('mp4')
      .on('error', error => console.log(error))
      // .on('end', res => {fs.unlink(__dirname + "\/" + randomname,(err)=>{console.log(err)});fs.unlink(__dirname + "\/" + randAudio,(err)=>{console.log(err)})})
      .saveToFile(randvid)
}
await waitforme(30000)
merge( `${__dirname}` +  `\/${randomname}`,__dirname + "\/" + randAudio)

  let info = await ytdl.getInfo("https://www.youtube.com/watch?v="+videoId);
  // console.log(info.videoDetails)
  download.image({
    url: info.videoDetails.thumbnails.find((e)=>{return e.url.includes("maxresdefault.webp")})?.url ? info.videoDetails.thumbnails.find((e)=>{return e.url.includes("maxresdefault.webp")})?.url : info.videoDetails.thumbnails[0].url,
    dest:randothumb
  }).then((e)=>{
    console.log(e)
  }).catch((err)=>{
    console.log(err)
  })
  const title = info.videoDetails.title
  const description = info.videoDetails.description
  const keywords = info.videoDetails.keywords
  // const mfk = info.videoDetails.age_restricted
  const category = {
     "Film & Animation":1	 ,
     "Autos & Vehicles":2	 ,
     "Music":10,
     "Pets & Animals":15,
     "Sports":17,
     "Short Movies":18,
     "Travel & Events":19,
     "Gaming":20,
     "Videoblogging":21,
     "People & Blogs":22,
     "Comedy":23,
     "Entertainment":24,
     "News & Politics":25,
     "Howto & Style":26,
     "Education":27,
     "Science & Technology":28,
     "Nonprofits & Activism":29,
     "Movies":30,
     "Anime/Animation":31,
     "Action/Adventure":32,
     "Classics":33,
     "Comedy":34,
     "Documentary":35,
     "Drama":36,
     "Family":37,
     "Foreign":38,
     "Horror":39,
     "Sci-Fi/Fantasy":40,
     "Thriller":41,
     "Shorts":42,
     "Shows":43,
     "Trailers":44,
  }
  fs.unlink(__dirname + "/"+  randomname,(err)=>{
    console.log(err)
  })
  fs.unlink(__dirname +"/" +randAudio,(err)=>{
    console.log(err)
  })
    const cat_id = category[info.videoDetails.category]
      
      // Select video file
    const fileInput = await page.$("input[type='file']");
    await fileInput.uploadFile(`${__dirname}/${randvid}`); // Replace with the path to your video file
    
    // Fill in video details
    await page.waitForSelector('#textbox');
    const titlebox = await page.$("#textbox")
          await titlebox.click({clickCount:3})
    // await page.evaluate( () => document.getElementById("#textbox").value = "");
    await page.type('#textbox', title); // Replace with your video title
    const desc = await page.$("#description-textarea  #textbox")
    await desc.type(description)
    // Set privacy
    var exists =  await page.$eval("#file-loader", () => true).catch(() => false)
    if(exists){

      const thumbinput = await page.$("#file-loader");
      
      await thumbinput.uploadFile(randothumb);
    }
    await page.waitForTimeout(30000)
    const mfk = await page.$("[name='VIDEO_MADE_FOR_KIDS_NOT_MFK']")
    await mfk.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const next_btn = await page.waitForSelector('#next-button');
    await next_btn.evaluate((x)=>{
      x.click()
    })
    // await page.click('#next-button');
    
    await page.waitForTimeout(15000)
    const again_next_btn = await page.waitForSelector('#next-button');
    await again_next_btn.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const again_next_btn_2 = await page.waitForSelector('#next-button');
    await again_next_btn_2.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const again_next_btn_3 = await page.waitForSelector('#next-button');
    await again_next_btn_3.evaluate((x)=>{
      x.click()
    })
    
    await page.waitForTimeout(5000)
    
    await page.click('#done-button');
    // await page.click('#next-button');
    // await page.click('#radioLabel');
    // await page.waitForSelector('#private-label');
    // await page.click('#private-label');
    
    // Submit the upload
    
    // Wait for the upload to complete
    await page.waitForTimeout(5000)
    
    console.log('Video uploaded successfully!');
    
  }catch(err){
    console.log(err);

  }finally{
    fs.unlink(`${__dirname}/${randvid}`,(err)=>{
      console.log(err)
    })
    fs.unlink(randothumb,(err)=>{
      console.log(err)
    })
  }
  }
  } catch (error) {
    console.error('An error occurred:', error);
    
  } finally {
    // Close the browser
    await browser.close();
    fs.unlink(`${__dirname}/${randvid}`,(err)=>{
      console.log(err)
    })
    fs.unlink(randothumb,(err)=>{
      console.log(err)
    })
    //   for (let i = 0; i < urls.length; ++i) {
    //     await waitforme(interval);
    //     // downloadAndUpload(urls[i])


    // }
    }
    },subtractMilliSecondsValue)
    res.json({status:1})
  })

  const loginAndUploadMultyVideo = async({title,description,videoFilePath,thumbFilePath,id}) => {
    console.log("called")
    
     await browser.close();
 }

  app.post("/uploadpopular",form,async(req,res)=>{
    console.log(req.body._id)
     var timeIsBeing936 = new Date(new Date(moment(req.body.time))).getTime()
     , currentTime = new Date().getTime()
     , subtractMilliSecondsValue = timeIsBeing936 - currentTime;
     const interval = new Long( parseInt(req.body.interval) * 60000)
     const channelid = await getChannelId(req.body.channel)
     const {data} = await axios(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBlO79AaaK7z0HsMRYgOb9uS7dfmsF6NPg&type=video&channelId=${channelid}&part=snippet,id&order=viewCount&maxResults=${parseInt(req.body.count)}`)
     setTimeout(async()=>{
      puppeteerExtra.use(stealthPlugin());
      const browser = await puppeteerExtra.launch({ args: ['--no-sandbox',],
      headless: false,
      ignoreHTTPSErrors: true,
      // add this
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", });
      // const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      try {
      await page.goto('https://accounts.google.com/signin/v2/identifier');
      const userDetail = await User.find({_id:req.body._id})

      await page.type('[type="email"]', userDetail[0].email,);
      await page.click('#identifierNext');
      await page.waitForTimeout(5000);
      await page.type('[type="password"', userDetail[0].password);
      await page.click('#passwordNext');
      await page.waitForTimeout(6000);
    // Go to upload page
    console.log(data.items[0])

    for (let i = 0; i < data.items.length; ++i) {
      await page.goto('https://www.youtube.com/upload');
      await waitforme(interval);
      console.log("hey")
      const videoId = data.items[i].id.videoId

  const randomname = uuidv4() + ".mp4"
  const randvid = uuidv4() + ".mp4"
  const randAudio = uuidv4() + ".mp3"
  const randothumb = __dirname +"/" +  uuidv4() + ".jpg"
   const video =   ytdl(videoId,{quality:'highestvideo'}).pipe(fs.createWriteStream(randomname))
   const audio =   ytdl(videoId,{quality:"highestaudio"}).pipe(fs.createWriteStream(randAudio))


function merge(video, audio) {
  ffmpeg()
      .addInput(video)
      .addInput(audio)
      .addOptions(['-map 0:v', '-map 1:a', '-c:v copy'])
      .format('mp4')
      .on('error', error => console.log(error))
      // .on('end', res => {fs.unlink(__dirname + "\/" + randomname,(err)=>{console.log(err)});fs.unlink(__dirname + "\/" + randAudio,(err)=>{console.log(err)})})
      .saveToFile(randvid)
}
await waitforme(30000)
merge( `${__dirname}` +  `\/${randomname}`,__dirname + "\/" + randAudio)

  let info = await ytdl.getInfo("https://www.youtube.com/watch?v="+videoId);
  // console.log(info.videoDetails)
  download.image({
    url: info.videoDetails.thumbnails.find((e)=>{return e.url.includes("maxresdefault.webp")})?.url ? info.videoDetails.thumbnails.find((e)=>{return e.url.includes("maxresdefault.webp")})?.url : info.videoDetails.thumbnails[0].url,
    dest:randothumb
  }).then((e)=>{
    console.log(e)
  }).catch((err)=>{
    console.log(err)
  })
  const title = info.videoDetails.title
  const description = info.videoDetails.description
  const keywords = info.videoDetails.keywords
  // const mfk = info.videoDetails.age_restricted
  const category = {
     "Film & Animation":1	 ,
     "Autos & Vehicles":2	 ,
     "Music":10,
     "Pets & Animals":15,
     "Sports":17,
     "Short Movies":18,
     "Travel & Events":19,
     "Gaming":20,
     "Videoblogging":21,
     "People & Blogs":22,
     "Comedy":23,
     "Entertainment":24,
     "News & Politics":25,
     "Howto & Style":26,
     "Education":27,
     "Science & Technology":28,
     "Nonprofits & Activism":29,
     "Movies":30,
     "Anime/Animation":31,
     "Action/Adventure":32,
     "Classics":33,
     "Comedy":34,
     "Documentary":35,
     "Drama":36,
     "Family":37,
     "Foreign":38,
     "Horror":39,
     "Sci-Fi/Fantasy":40,
     "Thriller":41,
     "Shorts":42,
     "Shows":43,
     "Trailers":44,
  }
  fs.unlink(__dirname + "/"+  randomname,(err)=>{
    console.log(err)
  })
  fs.unlink(__dirname +"/" +randAudio,(err)=>{
    console.log(err)
  })
    const cat_id = category[info.videoDetails.category]
      
      // Select video file
    const fileInput = await page.$("input[type='file']");
    await fileInput.uploadFile(`${__dirname}/${randvid}`); // Replace with the path to your video file
    
    // Fill in video details
    await page.waitForSelector('#textbox');
    const titlebox = await page.$("#textbox")
          await titlebox.click({clickCount:3})
    // await page.evaluate( () => document.getElementById("#textbox").value = "");
    await page.type('#textbox', title); // Replace with your video title
    const desc = await page.$("#description-textarea  #textbox")
    await desc.type(description)
    var exists =  await page.$eval("#file-loader", () => true).catch(() => false)
    if(exists){

      const thumbinput = await page.$("#file-loader");
      
      await thumbinput.uploadFile(randothumb);
    }
    // Set privacy
    await page.waitForTimeout(30000)
    const mfk = await page.$("[name='VIDEO_MADE_FOR_KIDS_NOT_MFK']")
    await mfk.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const next_btn = await page.waitForSelector('#next-button');
    await next_btn.evaluate((x)=>{
      x.click()
    })
    // await page.click('#next-button');
    
    await page.waitForTimeout(15000)
    const again_next_btn = await page.waitForSelector('#next-button');
    await again_next_btn.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const again_next_btn_2 = await page.waitForSelector('#next-button');
    await again_next_btn_2.evaluate((x)=>{
      x.click()
    })
    await page.waitForTimeout(5000)
    const again_next_btn_3 = await page.waitForSelector('#next-button');
    await again_next_btn_3.evaluate((x)=>{
      x.click()
    })
    
    await page.waitForTimeout(5000)
    
    await page.click('#done-button');
    // await page.click('#next-button');
    // await page.click('#radioLabel');
    // await page.waitForSelector('#private-label');
    // await page.click('#private-label');
    
    // Submit the upload
    
    // Wait for the upload to complete
    await page.waitForTimeout(5000)
    
    console.log('Video uploaded successfully!');
    fs.unlink(`${__dirname}/${randvid}`,(err)=>{
      console.log(err)
    })
    fs.unlink(randothumb,(err)=>{
      console.log(err)
    })

  }
  } catch (error) {
    console.error('An error occurred:', error);
    
  } finally {
    // Close the browser
    await browser.close();
    fs.unlink(`${__dirname}/${randvid}`,(err)=>{
      console.log(err)
    })
    fs.unlink(randothumb,(err)=>{
      console.log(err)
    })
  }
     },subtractMilliSecondsValue)
     res.json({status:1})
   
     
  
  })

  const downloadAndUpload = async(e) =>{
    // await timer(interval)
  const videoId = e.match(/^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/)[1]

  const randomname = uuidv4() + ".mp4"
  const randvid = uuidv4() + ".mp4"
  const randAudio = uuidv4() + ".mp3"
  const randothumb = __dirname +"/" +  uuidv4() + ".jpg"
   const video =   ytdl(videoId,{quality:'highestvideo'}).pipe(fs.createWriteStream(randomname))
   const audio =   ytdl(videoId,{quality:"highestaudio"}).pipe(fs.createWriteStream(randAudio))


function merge(video, audio) {
  ffmpeg()
      .addInput(video)
      .addInput(audio)
      .addOptions(['-map 0:v', '-map 1:a', '-c:v copy'])
      .format('mp4')
      .on('error', error => console.log(error))
      // .on('end', res => {fs.unlink(__dirname + "\/" + randomname,(err)=>{console.log(err)});fs.unlink(__dirname + "\/" + randAudio,(err)=>{console.log(err)})})
      .saveToFile(randvid)
}
await waitforme(10000)
merge( `${__dirname}` +  `\/${randomname}`,__dirname + "\/" + randAudio)

  let info = await ytdl.getInfo("https://www.youtube.com/watch?v="+videoId);
  // console.log(info.videoDetails)
  download.image({
    url: info.videoDetails.thumbnails.find((e)=>{return e.url.includes("maxresdefault.webp")})?.url ? info.videoDetails.thumbnails.find((e)=>{return e.url.includes("maxresdefault.webp")})?.url : info.videoDetails.thumbnails[0].url,
    dest:randothumb
  }).then((e)=>{
    console.log(e)
  }).catch((err)=>{
    console.log(err)
  })
  const title = info.videoDetails.title
  const description = info.videoDetails.description
  const keywords = info.videoDetails.keywords
  const mfk = info.videoDetails.age_restricted
  const category = {
     "Film & Animation":1	 ,
     "Autos & Vehicles":2	 ,
     "Music":10,
     "Pets & Animals":15,
     "Sports":17,
     "Short Movies":18,
     "Travel & Events":19,
     "Gaming":20,
     "Videoblogging":21,
     "People & Blogs":22,
     "Comedy":23,
     "Entertainment":24,
     "News & Politics":25,
     "Howto & Style":26,
     "Education":27,
     "Science & Technology":28,
     "Nonprofits & Activism":29,
     "Movies":30,
     "Anime/Animation":31,
     "Action/Adventure":32,
     "Classics":33,
     "Comedy":34,
     "Documentary":35,
     "Drama":36,
     "Family":37,
     "Foreign":38,
     "Horror":39,
     "Sci-Fi/Fantasy":40,
     "Thriller":41,
     "Shorts":42,
     "Shows":43,
     "Trailers":44,
  }
  fs.unlink(__dirname + "/"+  randomname,(err)=>{
    console.log(err)
  })
  fs.unlink(__dirname +"/" +randAudio,(err)=>{
    console.log(err)
  })
    const cat_id = category[info.videoDetails.category]
    videoUpload({title,description,tags:keywords,thumbFilePath:__dirname+"/"+randothumb,categoryId:cat_id,videoFilePath:__dirname +"/"+ randvid})
}

app.post("/selectchannel",form,async(req,res)=>{
    
    
    // oauth2Client.get
      var oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });
    oauth2.userinfo.get(async (err, res) => {
      if (err) {
        console.log(err);
      }
        const findUser = await User.findOneAndUpdate({google_id:res.data.id},{url:req.body.url,sort:req.body.sort})
    });
  })

  app.get("/getusers",async(req,res)=>{
   
     
          const users = await User.find()
          if(users.length>0){
            console.log(users)
            res.json({status:1,data:users})
          }
  })

  app.post("/adduser",form,async(req,res)=>{
    const user = await User.find({email:req.body.email})
    if(user.length > 0){
      res.json({status:0,message:"Internal Server Error"})
    }else{
        const user_data = new User({
          email:req.body.email,
          name:req.body.name,
          password:req.body.password,
        })
        await user_data.save()
        const data = await User.find()
        console.log(data)
       res.redirect("/")
    }
  })

  app.post("/findchannel",form,async(req,res)=>{
   
  
    const channelid = await getChannelId(req.body.channel)
    ytch.getChannelInfo({channelId:channelid}).then(async(response) => {
        console.log(response)
      if (!response.alertMessage) {
       res.json({status:1,message:"Channel Found",result:response})
    } else {
       console.log('Channel could not be found.')
       // throw response.alertMessage
    }
  }).catch((err) => {
    console.log(err)
  })
    //
    {/* const youtube = google.youtube({
      version:"v3",
      auth:oauth2Client
    })
    youtube.search.list({ auth: oauth2Client, part: 'snippet',
    channelId: channelid, type:'video',
    order:'date', maxResults:10
  },
  function(err, response) {
    console.log(err)
    // console.log(response)
  }
  ); */}
  
  })

app.get("/queues",(req,res)=>{
    return res.render("history")
  })

  const videoUpload = ({title,description,tags,categoryId,videoFilePath,thumbFilePath}) =>{




    fs.unlink(videoFilePath,(err)=>{
      if(err) console.log(err)
    })
     
    
    
    console.log(response.data)
    fs.unlink(thumbFilePath,(err)=>{
      if(err) console.log(err)
    })
  
}

const getChannelId = async(url) =>{

    const {data:content} = await axios(url) 
    const $ = cheerio.load(content);
    const id = $('meta[itemprop="identifier"]').attr("content")
    return id
}
function waitforme(millisec) {
    return new Promise(resolve => {
        setTimeout(() => { resolve('') }, millisec);
    })
  }
const uploadNewVideo = async() =>{
    const user_data = await User.find()

    for(let i=0;i<user_data.length;i++){    
    const channelid = await getChannelId(user_data[i].url)
    const {data:html} = await axios(`https://www.googleapis.com/youtube/v3/search?key=AIzaSyBlO79AaaK7z0HsMRYgOb9uS7dfmsF6NPg&type=video&channelId=${channelid}&part=snippet,id&order=date&maxResults=${parseInt(1)}`)
    if(moment(html.items[0].snippet.publishedAt).diff(moment().local()) <= -31){

    
    const videoId = html.items[0].id.videoId

    const randomname = uuidv4() + ".mp4"
  const randvid = uuidv4() + ".mp4"
  const randAudio = uuidv4() + ".mp3"
  const randothumb = __dirname +"/" +  uuidv4() + ".jpg"
   const video =   ytdl(videoId,{quality:'highestvideo'}).pipe(fs.createWriteStream(randomname))
   const audio =   ytdl(videoId,{quality:"highestaudio"}).pipe(fs.createWriteStream(randAudio))


function merge(video, audio) {
  ffmpeg()
      .addInput(video)
      .addInput(audio)
      .addOptions(['-map 0:v', '-map 1:a', '-c:v copy'])
      .format('mp4')
      .on('error', error => console.log(error))
      .on('end', res => {fs.unlink(__dirname + "\/" + randomname,(err)=>{console.log(err)});fs.unlink(__dirname + "\/" + randAudio,(err)=>{console.log(err)})})
      .saveToFile(randvid)
}
await waitforme(10000)
merge( `${__dirname}` +  `\/${randomname}`,__dirname + "\/" + randAudio)

  let info = await ytdl.getInfo("https://www.youtube.com/watch?v="+videoId);
  // console.log(info.videoDetails)
  download.image({
    url: info.videoDetails.thumbnails.find((e)=>{return e.url.includes("maxresdefault.webp")})?.url ? info.videoDetails.thumbnails.find((e)=>{return e.url.includes("maxresdefault.webp")})?.url : info.videoDetails.thumbnails[0].url,
    dest:randothumb
  }).then((e)=>{
    console.log(e)
  }).catch((err)=>{
    console.log(err)
  })
  const title = info.videoDetails.title
  const description = info.videoDetails.description
  const keywords = info.videoDetails.keywords
  const mfk = info.videoDetails.age_restricted
  const category = {
     "Film & Animation":1	 ,
     "Autos & Vehicles":2	 ,
     "Music":10,
     "Pets & Animals":15,
     "Sports":17,
     "Short Movies":18,
     "Travel & Events":19,
     "Gaming":20,
     "Videoblogging":21,
     "People & Blogs":22,
     "Comedy":23,
     "Entertainment":24,
     "News & Politics":25,
     "Howto & Style":26,
     "Education":27,
     "Science & Technology":28,
     "Nonprofits & Activism":29,
     "Movies":30,
     "Anime/Animation":31,
     "Action/Adventure":32,
     "Classics":33,
     "Comedy":34,
     "Documentary":35,
     "Drama":36,
     "Family":37,
     "Foreign":38,
     "Horror":39,
     "Sci-Fi/Fantasy":40,
     "Thriller":41,
     "Shorts":42,
     "Shows":43,
     "Trailers":44,
  }
  fs.unlink(__dirname + "/"+  randomname,(err)=>{
    console.log(err)
  })
  fs.unlink(__dirname +"/" +randAudio,(err)=>{
    console.log(err)
  })
    const cat_id = category[info.videoDetails.category]
    await loginAndUploadSingleVideo({title,description,id:user_data[i]._id,videoFilePath:`${__dirname}/${randvid}`,thumbFilePath:randothumb})
//     for(let i=0;i<user_data.length;i++){
//  if(user_data[i].url){
//     const channelid = await getChannelId(user_data[i].url)
//     console.log(channelid)
//             }


// } 
      }
    }
}


  // uploadNewVideo()

cron.schedule("* 30 * * * *",async()=>{
            
        })
  
  // yt.uploadVideo("demo","no desc","multipleg tage")

  app.listen(5000,()=>{
    console.log("running on 5000")
})