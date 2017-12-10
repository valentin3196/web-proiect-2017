//require = aducem dependinte externe, express pentru http si sequalize pt baza de date
var express = require("express")
const bodyParser=require('body-parser')
var Sequelize = require("sequelize")
var nodeadmin =require("nodeadmin")

//connect to mysql database - dialect: limbajul pe care il folosim
var sequelize = new Sequelize('ManagerEvenimente', 'root', '', {
    dialect:'mysql',
    host:'localhost'
})

//autentificare cu succes
sequelize.authenticate().then(function(){
    console.log('Success')
})

//define a new Model - definim tabelele - evenimente e numele si name, description sunt campurile
var Evenimente = sequelize.define('evenimente', {
    name: Sequelize.STRING,
    description: Sequelize.STRING,
    id_eveniment:Sequelize.INTEGER
})

var Locatii = sequelize.define('locatii', {
    name: Sequelize.STRING,
    eveniment_id: Sequelize.INTEGER,
    description: Sequelize.STRING,
    price: Sequelize.INTEGER,
    image: Sequelize.STRING
})

Evenimente.belongsTo(Locatii,{foreignKey: 'locatie id',targetKey: 'id'});

//definim variabila pt http
var app = express()
app.use(bodyParser.json())

//initializam nodeadmin

app.use('/nodeadmin',nodeadmin(app))

//access static files
app.use(express.static('public'))
app.use('/admin', express.static('admin'))

app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

// get a list of categories
//categories.findAll().then(functie...) ; find all nu returneaza direct produsele, el returneaza o promisiune ca atunci cand se va rula si va avea datele, o sa apeleze functia data dupa then - mod asicron -
//interogam bd si abia dupa ce primim datele apelam functia

app.get('/createEvenimente',(req,res)=>{
    sequelize.sync({force:true})
    .then(()=>res.status(201).send('tabela evenimente creata'))
    .catch(()=>res.status(500).send('eroare create evenimente'))
})



app.get('/evenimente', function(request, response) {
    Evenimente.findAll().then(function(evenimente){
        response.status(200).send(evenimente)
    })
        
})

// get one eveniment by id
app.get('/evenimente/:id', function(request, response) {
    Evenimente.findOne({where: {id:request.params.id}}).then(function(evenimente) {
        if(evenimente) {
            response.status(200).send(evenimente)
        } else {
            response.status(404).send()
        }
    })
})


// .body e un parametru din request cu care citim continutul din client
app.post('/evenimente', function(request, response) {
    Evenimente.create(request.body).then(function(evenimente) {
        response.status(201).send(evenimente)
    })
})

app.put('/evenimente/:id', function(request, response) {
    Evenimente.findById(request.params.id).then(function(evenimente) {
        if(evenimente) {
            evenimente.update(request.body).then(function(evenimente){
                response.status(201).send(evenimente)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/evenimente/:id', function(request, response) {
    Evenimente.findById(request.params.id).then(function(evenimente) {
        if(evenimente) {
            evenimente.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})


app.get('/createLocatii',(req,res)=>{
    sequelize.sync({force:true})
    .then(()=>res.status(201).send('tabela locatii creata'))
    .catch(()=>res.status(500).send('eroare create locatii'))
})

app.get('/locatii', function(request, response) {
    Locatii.findAll().then(
            function(locatii) {
                response.status(200).send(locatii)
            }
        )
})

app.get('/locatii/:id', function(request, response) {
    Locatii.findAll().then(
            function(locatii) {
                response.status(200).send(locatii)
            }
        )
})

app.post('/locatii', function(request, response) {
    Locatii.create(request.body).then(function(locatii) {
        response.status(201).send(locatii)
    })
})

app.put('/locatii/:id', function(request, response) {
    Locatii.findById(request.params.id).then(function(locatii) {
        if(locatii) {
            locatii.update(request.body).then(function(locatii){
                response.status(201).send(locatii)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.get('/evenimente/:id/locatii', function(request, response) {
    Locatii.findAll({where:{eveniment_id: request.params.id}}).then(
            function(locatii) {
                response.status(200).send(locatii)
            }
        )
})

app.listen(8080)