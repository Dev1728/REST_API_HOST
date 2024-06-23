import express from "express";
import bodyParser from "body-parser";
import jokes from './Jokes.json' assert{type:'json'};
import path from 'path'
import fs, { access } from "fs";
import { type } from "os";
import dotenv from "dotenv";


const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
const __dirname=path.resolve('./');
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

app.use(bodyParser.urlencoded({ extended: true }));


app.get('/jokes',(req,res)=>{
  return res.status(200).json(jokes);
})
//1. GET a random joke
app.get('/random',(req,res)=>{
    const randomjoke=Math.floor(Math.random(jokes)*jokes.length);
    res.json(jokes[randomjoke]);
})
//2. GET a specific joke
app.get('/jokes/:id',(req,res)=>{
      const jokeid=Number(req.params.id);
        const response =jokes.find((joke)=>joke.id===jokeid);
        if(response){
          return res.json(response) 
        }else{
          res.sendStatus(404);
        }
})
//3. GET a jokes by filtering on the joke type
app.get('/filter',(req,res)=>{
   
      const joketype = req.query.jokeType;
      const typefilter = jokes.filter((joke) => joke.jokeType === joketype);
   
      return res.json(typefilter);
})
//4. POST a new joke
app.post('/joke/addJoke',(req,res)=>{
      const newUser=req.body;
      console.log(newUser);
      newUser.id=jokes.length+1;
      jokes.push(newUser);
      return res.json(jokes);
})
//5. PUT a joke
app.put('/jokes/:id',(req,res)=>{

    const jokeid=Number(req.params.id);
    const userIndex=jokes.findIndex((joke)=>joke.id==jokeid);
    if(userIndex<0 && userIndex>jokes.length){
      return res.status(404).json({error:"invalid id is given"});
    }
    
    const updateUser={...jokes[userIndex],...req.body};
    jokes[userIndex]=updateUser;

    
       fs.writeFile(__dirname+'jokes.json',JSON.stringify(jokes),(err)=>{
        if(err){
            console.log(err);
            return res.status(50).json({status:"failed to write file"});
        }
        return res.status(201).json({status:"Created"}); 
      })
})
//6. PATCH a joke
app.patch('/jokes/:id',(req,res)=>{

  const jokeid=Number(req.params.id);
  const userIndex=jokes.findIndex((joke)=>joke.id==jokeid);
  if(userIndex<0 && userIndex>jokes.length){
    return res.status(404).json({error:"invalid id is given"});
  }
  
  const updateUser={...jokes[userIndex],...req.body};
  console.log(updateUser)
  jokes[userIndex]=updateUser;

  
     fs.writeFile(__dirname+'jokes.json',JSON.stringify(jokes),(err)=>{
      if(err){
          console.log(err);
          return res.status(50).json({status:"failed to write file"});
      }
      return res.status(201).json({status:"updated"}); 
    })
})
//7. DELETE Specific joke
app.delete('/jokes/delete/:id',(req,res)=>{
    const userId=Number(req.params.id);
    const filterid=jokes.findIndex((joke)=>joke.id=userId);

    if(filterid== -1){
      return res.status(500).json({error:"Id not found correctly"});
    }
    jokes.splice(filterid,1);

    for(let index=filterid;index<jokes.length;index++){
      jokes[index].id-=1;
    }

    return res.status(200).json(jokes);
})
//8. DELETE All jokes
app.delete('/jokes',(req,res)=>{
    jokes.splice(jokes.id,jokes.length);
    return res.status(200).json({success:"successfully deleted all data"});
})




app.listen(PORT, () => {
  console.log(`Successfully started server on port ${PORT}.`);
})
