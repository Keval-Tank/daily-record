import express from 'express'
import supabase from './supabaseClient/supabaseClient.js'
import cors from 'cors'

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors())
const PORT = 5000

const channel = supabase.channel('channel-1', {
  config : {
    presence : {
      key : `${Date.now()}`
    }
  }
})

// get all channels
const channels = supabase.getChannels()
channels.forEach((channel) => {
  console.log(channel.subTopic)
})

// send updated data to all connected users
channel.on('presence', {event : 'sync'}, () => {
  console.log("current users : ", channel.presenceState())
})

// joined new user
channel.on('presence', {event : 'join'}, ({newPresences}) => {
  console.log('Joined :', newPresences)
})

// left a user
channel.on('presence', {event : 'leave'}, ({leftPresences}) => {
  leftPresences[0].status = 'offline'
  console.log("left : ", leftPresences)
})

// listen to broadcasted message
channel.on('broadcast', {event : 'new-message'}, (payload) => {
   console.log("message : ", payload)
})

// subscribe to a channel
channel.subscribe((status) => {
  if(status === 'SUBSCRIBED'){
    channel.track({ status : 'online', createdAt : `${Date.now().toLocaleString('en-US')}`, newData : 5})
  }
})



app.listen(3000, () => {console.log('Server running on 3000')})



// // let users = {}
// // let total_users = 0;
// // let i = 1;
// // let user = `user${i++}`
// // // let server = `server${i}`
// // // i++;
// // const channel = supabase.channel('channel1')

// // channel.on('presence', {event : 'sync'}, ()=>{
// //   const current = channel.presenceState();
// //   console.log("current ", current)
// // })

// // channel.on('presence', {event : 'join'}, ({key, newPresences})=>{
// //    users[key] = newPresences;
// //    console.log(`${key} , ${newPresences} Joined `)
// // })

// // channel.on('presence', {event : 'leave'}, ({key, leftPresences}) => {
// //    users[key] = ''
// //    console.log(`${key}, ${leftPresences} left`)
// // })

// // channel.subscribe();
// // const presence = channel.presence(user)

// // channel.subscribe(async(status) => {
// //   if(status === 'SUBSCRIBED'){
// //     await presence.track(server)

// //     presence.on('join', ({key, newPresences}) => {
// //       console.log(`user joined : ${key} -> ` , newPresences)
// //       total_users++;
// //       console.log('Current users : ', total_users)
// //     })

// //     presence.on('leave', ({key, leftPresences}) => {
// //       console.log(`user left : ${key} -> `, leftPresences)
// //       total_users--;
// //       console.log('Current Users : ', total_users)
// //     })

// //     presence.onSync(() => {
// //       console.log('current state : ', total_users)
// //     })
// //   }
// // })

// // app.post('/user-join', async(req, res) => {

// // })
// // const channel = supabase.channel("messages")
// // let pid = crypto.randomUUID().toString();
// // const presence = channel.presence(pid)

// // channel.on('broadcast', {event : 'new-message'}, (payload) => {
// //   console.log(payload.payload)
// // })

// // .on('presence', {event : 'join'}, ({newPresences})=>{
// //   console.log('Newly Joined', newPresences)
// // })
// // .on('presence', {event : 'sync'}, () => {

// //   console.log('Current state : ', channel.presenceState())
// // })
// // .on('presence', {event : 'leave'}, ({leftPresences}) => {
// //   console.log('Left', leftPresences)
// // })
// // .on('presence', {event : 'sync'}, () => {
// //     // const newState = channel.presenceState()
// //     // console.log(newState)
// //   console.log('Synced state', channel.presenceState())
// // })
// // .on('presence', {event : 'join'}, ({key}) => {
// //   console.log('join', key)
// // })
// // .on('presence', {event : 'leave'}, ({key}) => {
// //   console.log('leave', key)
// // })
// // .subscribe(async(status) => {
// //   // console.log('Subscribed')
// //   // if(status === 'SUBSCRIBED'){
// //   //    await channel.send({
// //   //     type : 'broadcast',
// //   //     event : 'new-message',
// //   //     payload : {sender : "sender name", message : "message from sender"}
// //   //    })
// //   // }
// //   if(status === 'SUBSCRIBED'){
// //     // const user_presence = await channel.track({status : "online"})
// //     console.log(status)
// //     await presence.track({status : 'online'})

// //     presence.on('join', (key, newPresences)=>{

// //     })
// //     // await channel.untrack()
// //     // console.log(user_presence)
    
// //   }
// // })

// // channel.on("*", {event : '*'}, payload => {
// //    console.log(payload)
// // })

// // channel.subscribe(status => console.log(status))

// // channel.on("*", { event: "*" }, (payload) => {
// //   console.log("Cursor position received!", payload);
// // }).subscribe((status) => {
// //   if (status === "SUBSCRIBED") {
// //     console.log('subscribed')
// //     channel.send({
// //       type: "broadcast",
// //       event: "cursor-pos",
// //       payload: { x: Math.random(), y: Math.random() },
// //     });
// //   }
// // });

// // app.post('/send-message', async(req, res) => {
// //     // const {sender, message} = req.body
// //     // await channel.send({
// //     //     type : 'broadcast',
// //     //     event : 'new-message',
// //     //     payload : {sender, message}
// //     // })
// //     // res.json({
// //     //     "status" : 'sent'
// //     // })
// // })
// // app.listen(PORT, () => {console.log(`Server running on ${PORT}`)})


// // import express from "express"
// // import supabase from './supabaseClient/supabaseClient.js'

// // const app = express()
// // app.use(express.json())
// // app.use(express.urlencoded({extended : true}))
// // let channel;

// // // Track online users in memory (optional)
// // let onlineUsers = {}

// // async function setupRealtime() {
// //   channel = supabase.channel("channel1")

// //   // Listen for users joining
// //   channel.on('presence', { event: 'join' }, ({ newPresences }) => {
// //     newPresences.forEach((p) => {
// //       onlineUsers[p.username] = p
// //       console.log(`✅ User joined:`, p)
// //     })
// //     console.log("Online Users:", onlineUsers)
// //   })

// //   // Listen for users leaving
// //   channel.on('presence', { event: 'leave' }, ({ leftPresences }) => {
// //     leftPresences.forEach((p) => {
// //       delete onlineUsers[p.username]
// //       console.log(`❌ User left:`, p)
// //     })
// //     console.log("Online Users:", onlineUsers)
// //   })

// //   // Full sync
// //   channel.on('presence', { event: 'sync' }, () => {
// //     const state = channel.presenceState()
// //     console.log("🔄 Presence Sync:", state)
// //   })

// //   await channel.subscribe((status) =>
// //     console.log("📡 Realtime Status:", status)
// //   )
// // }

// // // Express endpoint to simulate user joining
// // app.post("/join", async (req, res) => {
// //   const { userId, username } = req.body

// //   // const presence = channel.presence(userId)

// //   // await presence.track({ username, status: "online" })
// //   await 

// //   res.json({ message: `${username} is now online` })
// // })

// // // Express endpoint to simulate user leaving
// // app.post("/leave", async (req, res) => {
// //   const { userId } = req.body

// //   // const presence = channel.presence(userId)
// //   await presence.untrack()

// //   res.json({ message: `${userId} removed from presence` })
// // })


// // app.listen(3000, async () => {
// //   console.log("Server running at 3000")
// //   await setupRealtime()
// // })

// import express from 'express'
// import supabase from './supabaseClient/supabaseClient.js'

// const app = express()
// app.use(express.json())
// app.use(express.urlencoded({extended : true}))

// const channel = supabase.channel('channel1', {
//   config : {
//     presence : {
//       key : '1'
//     }
//   }
// })

// const presence = channel.presence("user1")

// channel.on('presence', {event : 'join'}, ({newPresences}) => {
//   console.log('new joined : ', newPresences)
// })

// channel.on('presence', {event : 'leave'}, ({leftPresences}) => {
//   console.log('user left : ', leftPresences)
// })

// await presence.track({username : 'karan', status : "online"})

// channel.subscribe();

// app.listen(5000, () => {console.log('Server running')})

// // app.post('/join', async(req, res) => {
// //   const {userId, username} = req.body
// //   const presence = channel.presence(userId)
// //   await presence.track({username, status : "online"})
// // })





