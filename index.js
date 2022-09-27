const express = require('express');
const flash = require('express-flash');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const session = require('express-session');
const { render } = require('ejs');
const daily = require('./dailyExpensesDB');
// const routes = require('./routs/waters-routs')

const local_database_url = 'postgres://siyabonga:siya@localhost:5432/daily_expenses';
const connectionString = process.env.DATABASE_URL || local_database_url;


const app = express();


const config = {
    connectionString
}
if (process.env.NODE_ENV == "production") {
    config.ssl = {
        rejectUnauthorized: false
    }
}

const db = pgp(config);

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.static("public"))


app.use(session({
    secret: "<add a secret string here>",
    resave: false,
    saveUninitialized: true
}));


app.use(flash());


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())


app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: true,


    })
);


const dailyFF = daily(db)


app.get('/', function (req, res) {



    res.render("index", {

    })
})


app.post('/adduser', async function (req, res) {

    const name = req.body.name

    if(name){
        await dailyFF.validateLogIns(name)

    }
    const getuser = await dailyFF.getuser(name)
    const getname = getuser.name
    
    res.redirect(`/adduser/${getname}`)
})

app.get('/adduser:name', async function(req,res){
    res.render('expence',{
    })

})

app.get('/expenses',async function (req,res){

    const amount = req.body.amount
    const type = req.body.btn

    if(amount && type){
        await dailyFF.insertExpence()
    }

    res.render('admin',{

    })
})

app.get('/waiters/:username', function (req, res) {



})




const PORT = process.env.PORT || 3052;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});