'use strict'
require('dotenv').config();
const fs = require('fs')
const express=require('express');
const app = express();
const superagent =require("superagent");
const pg = require('pg');
const PORT =process.env.PORT || 3000;
const bodyparser=require('body-parser') 
const client = new pg.Client(process.env.DATABASE_URL);
const methodoverride = require('method-override');

app.use(express.static('./public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodoverride("M"));
app.set('view engine','ejs');
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
app.post("/favorite",fun)
function fun(req,res) {
    console.log(req.body,"body")
    client.query("insert into dataDig (img,name,level)  VALUES ($1,$2,$3)",[req.body.img,req.body.name,req.body.level])
    .then(() =>{
        client.query("select * from dataDig")
        .then(data =>{
            res.render('favorite' ,{data:data.rows})
        })
    })
}
// app.get('*',(req,res)=>{
//     res.send("NOT FOUND")
// })

app.get('/detail/:id',(req,res) =>{
    console.log("anything")
    client.query("select * from dataDig where id = $1",[req.params.id])
    .then(data =>{
        res.render('detaile' ,{data:data.rows[0]})
    })
})

app.delete('/delete/:id', (req,res)=>{
    client.query("delete from dataDig where id = $1;",[req.params.id])
    .then(()=>{
        res.redirect("/")
    })
});

app.put("/update/:id",(req,res) =>{
    client.query("update dataDig set img = $1,name = $2 , level = $3 where id = $4",[req.body.name,req.body.img,req.body.level,req.params.id])
    .then(()=>{
        res.redirect(`/detail/${req.params.id}`)
    })
});
