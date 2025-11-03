import express from 'express'
import supabase from './supabaseClient/supabaseClient.js'
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended : true}))

const channel = supabase.channel('messages')

channel.subscribe((status) => {console.log(status)})
app.post('/send-message', async(req, res) => {
    const {sender, message} = req.body
    const result = await channel.send({
        type : 'broadcast',
        event : 'new-message',
        payload : {sender, message}
    })
    res.json(result)
})

app.listen(8000, ()=> console.log('Server running on 8000'))