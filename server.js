import express, { urlencoded } from 'express'
import supabase from './supabaseClient/supabaseClient.js'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(urlencoded({extended : true}))
app.use(cors({
    origin : 'http://localhost:3000'
}))

let user_id;

class AppError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
    }
}

// register and automatic-login 
app.post('/signup', async(req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            throw new AppError('Invalid input', 400)
        }
        const {data, error} = await supabase.auth.signUp({
            email,
            password
        })
        if(error){
            throw new AppError(error.message, 500)
        }
        if(data.user === null || data.session == null){
            throw new AppError("Failed to register", 500)
        }
        if(data){
            user_id = data.user.id
            return res.status(201).json(data)
        }
    }catch(err){
        return res.status(err.statusCode || 400).json({
            "msg" : err.message
        })
    }
})

// login
app.post('/login', async(req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            throw new AppError('invalid input', 400)
        }
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password
        })
        if(error){
            throw new AppError(error.message, 500)
        }
        if(data){
            user_id = data.user.id
            return res.status(200).json({
                "id" : user_id
            })
        }
    }catch(err){
        return res.status(err.statusCode || 400).json({
            "msg" : err.message
        })
    }
})

// create-bucket
// app.get('/create-bucket/:bucket', async(req, res) => {
//    try{
//         if(!user_id){
//             throw new AppError("Unauthorized", 401)
//         }
//         const {data, error} = await supabase.storage.createBucket(,{
//             public : false,
//             allowedMimeTypes : ['image/png'],
//             fileSizeLimit : 5 * 1024 * 1024
//         })
//         if(error){
//             throw new AppError('Bucket not created', 500)
//         }
//         return res.status(200).json(data)
//    }catch(err){
//       return res.status(err.statusCode || 500).json({
//         "msg" : err.messsage
//       })
//    }
// })

//upload to bucket
app.post('/upload-image/:bucket', async(req, res) => {
    try{
        const buffer = await fs.readFile('./public/download.png')
        if(!buffer){
            throw new AppError('Not Found', 404)
        }
        const path = `public/image.png`;
        i++;
        const {data, error} = await supabase.storage.from(req.params.bucket).upload(path, buffer, {
            upsert : false,
            contentType : 'image/png'
        })
        if(error){
            throw error
        }
        if(data){
            return res.json(data)
        }
    }catch(err){
        return res.status(err.statusCode||500).json({
        "msg" : err.messsage
        })
    }
})


// create note
app.post('/create-note', async(req, res) => {
    try{
        if(!user_id){
            throw new AppError('Unauthorized', 401)
        }
        const {title, content} = req.body
        const {data, error} = await supabase.from('notes').insert([{writer : user_id,title, content}]).select()
        if(error){
            throw new AppError(error.message, 500)
        }
        return res.status(201).json(data)  
    }catch(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message
        })
    }
})

// get data 
app.get('/get-notes', async(req, res) => {
   try{
        if(!user_id){
            throw new AppError('Unauthorized', 401)
        }
        const {data, error} = await supabase.from('notes').select().eq('writer',user_id)
        if(error){
            throw new AppError('Data nou found!', 404)
        }
        if(data.length === 0){
            return res.status(200).json("You've not created any notes yet!")
        }
        if(data){
        return res.status(200).json(data)   
        }
   }catch(err){
        return res.status(err.statusCode || 400).json({
            "msg" : err.message
        }) 
   }
})

// update note
app.put('/update-note/:id', async(req, res) => {
    try{
        let writer_id;
        if(!user_id){
            throw new AppError('Unauthorized', 401)
        }
        const id = req.params.id
        const {nt, new_content} = req.body
        const {data} = await supabase.from('notes').select().eq('note_id', id)
        if(data.length === 0){
            throw new AppError('Data not found!',404)
        }
        if(data){
           writer_id = data[0].writer;
        }
        if(writer_id !== user_id){
            throw new AppError('Unauthorized to update note',403)
        }
        const {error} = await supabase.from('notes').update({title : nt, content : new_content}).eq('note_id', id)
        if(error){
            throw new AppError('Internal server error', 500)
        }
        return res.status(200).json({
            "note_id" : data[0].note_id,
            "writer" : data[0].writer,
            "title" : nt,
            "content" : new_content,
            "created_at" : data[0].created_at
        })
    }catch(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message
        })
    }
})

// delete note
app.delete('/delete/:id', async(req, res) => {
    try{
        if(!user_id){
            throw new AppError('Unauthorized', 401)
        }
        const note_id = req.params.id
        const {data} = await supabase.from('notes').select().eq('note_id', note_id)
        if(data.length === 0){
            throw new AppError('Data not found', 404)
        }
        if(data[0].writer !== user_id){
            throw new AppError('Unauthorized to delete', 403)
        }
        const {error} = await supabase.from('notes').delete().eq('note_id', note_id)
        if(error){
            throw new AppError('Server error', 500)
        }
        return res.status(200).json({
            "note_id" : data[0].note_id,
            "writer" : data[0].writer,
            "title" : data[0].title,
            "content" : data[0].content,
            "created_at" : data[0].created_at
        })
    }catch(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message
        })
    }
})

//check sessions
app.get('/sessions', async(req, res) => {
    const {data : {session},} = await supabase.auth.getSession();
    return res.json({
        "session" : session
    })
})

// signout
app.get('/signout', async(req, res) => {
    try{
        if(!user_id){
            throw new AppError('Unauthorized', 401)
        }
        const {error} = await supabase.auth.signOut()
        if(error){
            throw new AppError(error.message, 500)
        }
        user_id = ''
        return res.status(204).end();
    }catch(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message
        })
    }
})

app.listen(PORT, () => {console.log(`Server running on ${PORT}`)})