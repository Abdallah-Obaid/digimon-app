'use strict'

require('dotenv').config();
const express=require('express');
const cors=require('cors');
const bodyparser=require('body-parser');
const superagent=require('superagent');
const pg=require('pg');
const methodOverride=require('method-override');
const PORT=process.env.PORT || 3000;
const client=new pg.Client(process.env.DATABASE_URL);
const app=express();
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(methodOverride('M'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');

client.connect()
.then(()=>{
    app.listen(PORT,(req,res)=>{
        console.log(`AL PORT = ${PORT}`)
    })
})

app.get(('/'),homeBage);

function homeBage (req,res) {
  return superagent.get('https://digimon-api.herokuapp.com/api/digimon')      
.then((digimonData)=>{
    res.render('homeBage',{'digimonData':digimonData.body})
})
}
app.get("/favorite",fun)
function fun(req,res) {
    client.query("select * from dataDig")
    .then(data =>{
        res.render('/favorite' ,{data:data.rows})
    })
    // console.log(req.body)
    // let digimonName=req.body.name;
    // let digimonImg=req.body.img;
    // let digimonLevel=req.body.level;
    // client.query("INSERT INTO dataDig (img,name,level)  VALUES ($1,$2,$3);",[digimonImg,digimonName,digimonLevel])
    // .then(()=>{
    // })
    // console.log(digimonName,digimonImg,digimonLevel)
}
app.get('*',(req,res)=>{
    res.send("NOT FOUND")
})
app.get("/details/:id",fun)
function fun(req,res) {
    client.query("select * from dataDig where id = $1;",[req.params.id])
    .then(data =>{
        res.render(`/detaile` ,{data:data.rows[0]})
    })
    // console.log(req.body)
    // let digimonName=req.body.name;
    // let digimonImg=req.body.img;
    // let digimonLevel=req.body.level;
    // client.query("INSERT INTO dataDig (img,name,level)  VALUES ($1,$2,$3);",[digimonImg,digimonName,digimonLevel])
    // .then(()=>{
    // })
    // console.log(digimonName,digimonImg,digimonLevel)
}
app.delete('/delete/:id', (req,res)=>{
    client.query("delete from dataDig where id = $1;",[req.params.id])
    .then(()=>{
        res.redirect("/favorite")
    })
});
app.put("/update/:id",(req,res) =>{
    client.query("update dataDig set img = $1,name = $2 , level = $3 where id = $4",[req.body.name,req.body.img,req.body.level,req.params.id])
    .then(()=>{
        res.redirect(`/details/${req.params.id}`)
    })
});
