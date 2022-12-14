const express = require('express');
const flash = require('express-flash');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser')
const session = require('express-session');
const { render } = require('ejs');
const daily = require('./dailyExpensesDB');
const { default: ShortUniqueId } = require('short-unique-id');
// const routes = require('./routs/waters-routs')


const pgp = require('pg-promise')();
// const ShortUniqueId = ('short-unique-id')

const local_database_url = 'postgres://siyabonga:siya@localhost:5432/daily_expenses';
let connectionString = process.env.DATABASE_URL || local_database_url;


const app = express();

const uid = new ShortUniqueId({ length: 6 });


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

    res.render("login", {

    })
})

app.post('/login', async function (req, res) {

    let user_name = req.body.name
    let user_code = req.body.code
    let user = user_name.toUpperCase()
    

    let validate = await dailyFF.checkcode(user_code)
    let validate2 = await dailyFF.checkUser(user)
    
    if (validate && validate2) {
        
        req.flash('erro', 'Please enter valid details');
        res.redirect('/')

        
    } else if(!validate && !validate2) {
        
        res.redirect(`/expenses/${user_name}`)
    }
});
app.get('/adduser', function (req, res) {
    res.render('signup')
});

app.post('/adduser', async function (req, res) {

    const name = req.body.name;
    const surname = req.body.surname;
    const email = req.body.email;
    
    if (name && surname && email) {
        
        const code = uid();

        await dailyFF.create_user(name, surname, email ,code)
        req.flash('info', 'Account created!! your login code is: ' + code );
    } else {
        req.flash('erro', 'Please enter valid details');
        
    }

    res.render('signup')
})

app.get('/adduser/:name', async function (req, res) {
    res.render('expence', {
    })

})

app.get('/expenses/:name', async function (req, res) {

    let name = req.params.name


    res.render('expence', {
        name
    })
})

app.post('/addExpence/:name', async function (req, res) {
    const amount = req.body.amount
    const type = req.body.group1
    console.log(type);
    let name = req.params.name
    if (amount && type) {
        let user = name.toUpperCase();
        let catergory = type.toUpperCase()
        await dailyFF.insertExpence(user, catergory, amount)

        req.flash('info', 'Your Daily Expens has been added');
    } else {
        req.flash('info', 'Enter your Expens and type');
    }
    res.redirect(`/expenses/${name}`)
})

app.get('/expense/:name',async function (req, res) {
    
    let name = req.params.name
    name = name.toUpperCase()
    let nam = await db.one('select ID from logins where NAMES = $1', [name] )

    let data = await dailyFF.alldata(nam.id)
    
    res.render('admin', {
        data
    })
})
app.get('/filter/:name',async function(req,res){
    
    let date = req.body.date
    let name = req.params.name
    name = name.toUpperCase()
    

    let data = await dailyFF.filter(name,date)

    res.render('admin', {
        data
    }) 
})

app.get('/resert/:user_id',async function(req,res){

    let user_id = req.params.user_id

    let data = await dailyFF.deletedata(user_id)
    req.flash('erro', 'Your Data have been deleted');
    
    res.render('admin', {
        data
    })

})




const PORT = process.env.PORT || 3053;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});