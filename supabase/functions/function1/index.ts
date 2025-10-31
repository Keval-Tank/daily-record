// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import {createClient} from 'https://esm.sh/@supabase/supabase-js'
import {serve} from "https://deno.land/std/http/server.ts"


const supabase = createClient(Deno.env.get("_SUPABASE_URL") ?? "", Deno.env.get("_SUPABASE_SERVICE_KEY") ?? "")
serve(async(req) => {
  const url = new URL(req.url)
  const req_body = await req.json();
  const path_name = url.pathname.split('/')[1]

  if(path_name === 'create-note'){
    const writer = req_body.writer
    const {data, error} = await supabase.from('notes').select('*').eq('writer', writer)
    if(error){
      throw error
    }
    if(data){
      return new Response(data, {
        status : 201
      })
    }
  }
})
// const supabase = createClient(Deno.env.get("_SUPABASE_URL") ?? " ", Deno.env.get("_SUPABASE_SERVICE_KEY") ?? " ");

// serve(async (req : Request ) : Promise<Response> => {
//   const url = new URL(req.url)
//   const path_name = url.pathname.split('/')[1];
//   const method = req.method;
//   const req_body = await req.json();
//   const {data, error} = await supabase.from('notes').select('*').eq('writer', req_body.writer);
//   if(error){
//     throw new AppError(error.message, 500)
//     }
//     return new Response(JSON.stringify(data),{
//       status : 200,
//       headers : {"Content-Type" : "application/json"},
//     });
// })


/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/function1' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
