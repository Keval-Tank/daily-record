import supabase from './supabaseClient/supabaseClient.js'
import express, { urlencoded } from 'express'
import fs from 'fs/promises'

const app = express()
const PORT = process.env.PORT

app.use(express.json({limit : '10mb'}))
app.use(urlencoded({limit : '10mb', extended : true}))

class AppError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
    }
}

// create-bucket
app.get('/create-bucket/:bucket', async(req, res) => {
   try{
        const bucket = req.params.bucket
        if(!bucket){
            throw new AppError('Invalid input', 400)
        }
        const {data, error} = await supabase.storage.createBucket(bucket,{
            public : false,
            allowedMimeTypes : ['image/png'],
            fileSizeLimit : 5 * 1024 * 1024
        })
        if(error){
            throw new AppError('Bucket not created', 500)
        }
        return res.status(200).json(data)
   }catch(err){
      return res.status(err.statusCode || 500).json({
        "msg" : err.messsage
      })
   }
})

// get-bucket
app.get('/get-bucket/:bucket', async(req, res) => {
   try{
        const bucket = req.params.bucket
        if(!bucket){
            throw new AppError('Invalid input', 400)
        }
        const {data, error} = await supabase.storage.getBucket(bucket)
        if(error){
            throw new AppError(error.message, 500)
        }
        if(data){
            return res.status(200).json(data)
        }
   }catch(err){
      return res.status(err.statusCode || 500).json({
        "msg" : err.message
      })
   }
})

//update bucket
app.put('/update-bucket/:bucket', async(req, res) => {
    try{
        const {data,error} = await supabase.storage.updateBucket(req.params.bucket, {
        public : true,
        allowedMimeTypes : ['image/png'],
        fileSizeLimit : 50 * 1024 * 1024
        })
        if(error){
            throw new AppError('Not updated', 500)
        }
        if(data){
            return res.status(200).json(data)
        }
    }catch(err){
        return res.status(err.statusCode || 500).json({
        "msg" : err.messsage
        })
    }
})

//upload to bucket
let i = 3;
app.post('/upload-image/:bucket', async(req, res) => {
    try{
        const buffer = await fs.readFile('./public/download.png')
        if(!buffer){
            throw new AppError('Not Found', 404)
        }
        const path = `public/image${3}.png`;
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

// get-all-files from a bucket
app.get('/get-files/:bucket', async(req, res) => {
    try{
        const {data, error} = await supabase.storage.from(req.params.bucket).list()
        if(error){
            throw new AppError(error.message, 404)
        }
        if(data){
            return res.status(200).json(data)
        }
    }catch(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message
        })
    }
})

// download an image from a public url
app.get('/download/:bucket/:file', async(req, res) => {
    try{
        const {data, error} = await supabase.storage.from(req.params.bucket).getPublicUrl(req.params.file, {
            transform: {
            width: 100,
            height: 100,
            },
            download : true
        })
        if(error){
            throw new AppError(error.message, 500)
        }
        if(data){
            return res.status(200).json(data)
        }
    }catch(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message
        })
    }
})

app.post('/move/:bucket',async(req, res) => {
    try{
        const {source_path , dest_path} = req.body
        const {data, error} = await supabase.storage.from(req.params.bucket).move(source_path, dest_path)
        if(error){
            throw new AppError('Failed to move', 500)
        }
        if(data){
            return res.status(200).json(data)
        }
    }catch(err){
        return res.status(err.statusCode).json({
            "msg" : err.message
        })
    }
})

// copy an existing file
app.post('/copy/:bucket', async(req, res) => {
   try{
        const {source_path, dest_path} = req.body
        const {data, error} = await supabase.storage.from(req.params.bucket).copy(source_path, dest_path)
        if(error){
            throw new AppError(error.message, 500)
        }
        if(data){
            return res.status(200).json(data)
        }
   }catch(err){
     return res.status(err.statusCode || 500).json({
        "msg" : err.message
     })
   }
})

// delete files from bucket
app.delete('/delete-file/:bucket', async(req, res) => {
    try{
        const {data, error} = await supabase.storage.from(req.params.bucket).remove([req.body.path])
        if(error){
            throw new AppError('File not found', 404)
        }
        if(data){
            return res.status(200).json(data)
        }
    }catch(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message
        })
    }
})

//create signed URL -> used to provide temporary access of a resource to others after time duration the resource becomes inaccessible
app.post('/create-signed-url/:bucket', async(req, res) => {
    try{
        const {data, error} = await supabase.storage.from(req.params.bucket).createSignedUrl(req.body.path, 10)
        if(error){
            throw new AppError('Failed to create URL')
        }
        if(data){
            return res.status(200).json(data)
        }
    }catch(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message
        })
    }
})

// create signed upload url for uploading data once without having a service_role_key
app.post('/create-signed-upload-url/:bucket', async(req, res) => {
    try{
        const {data, error} = await supabase.storage.from(req.params.bucket).createSignedUploadUrl('./public/download.png')
        if(error){
            throw new AppError('Failed to create URL')
        }
        if(data){
            return res.status(200).json(data)
        }
    }catch(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message
        })
    }
})

// upload to signed url -> in uploadToSignedUrl(<final path in the bucket to where an upload will be stored and must be same in both methods>, token given by createSignedUploadUrl() method,  file buffer for file to upload)
app.post('/upload-to-signed-url/:bucket', async(req, res) => {
    try{
        const buffer = await fs.readFile('./public/download.png')
        const {data, error} = await supabase.storage.from(req.params.bucket).uploadToSignedUrl('./public/download.png', req.body.token, buffer, {
            contentType : 'image/png'
        })
        if(error){
            throw new AppError(error.message, 500)
        }
        if(data){
            return res.status(200).json(data)
        }
    }catch(err){
        return res.status(err.statusCode || 500).json({
            "msg" : err.message
        })
    }
})



//get file buffer
// app.get('/create-buffer', async (req, res) => {
//     const file_buffer = await fs.readFile('./public/download.png')
//     return res.json(file_buffer)
// })


app.listen(PORT, () => {console.log(`Server running on ${PORT}`)})