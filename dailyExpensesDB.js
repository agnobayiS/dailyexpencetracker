module.exports = function waiters(db) {


    async function create_user(names, surnames, emails) {
        let user_name = names.toUpperCase()
        let user_surname = surnames.toUpperCase()
        let user_email = emails.toUpperCase()
        let nameRegex = /^[a-zA-Z]{3,}$/
        let emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/


        const name = nameRegex.test(user_name);
        const surname = nameRegex.test(user_surname)
        const email = emailRegex.test(user_email)

        console.log(name);
        if (name && surname && email) {
            let duplicate = await checkUser(user_name)
            console.log(duplicate);
            if (duplicate) {
                await db.none('insert into logins (names, surname, email) values ($1, $2, $3)', [user_name, user_surname, user_email])
                return "created a user"
            } 
            else {
                return "duplicate"
            }

        }
    }
    async function checkUser(users) {
        let user = await db.any('select names from logins where names = $1', [users])
        console.log(user);
        return user.length == 0 ? true : false;
    }

    async function insertExpence(date, expence, amount, name_id, catergory_Id) {

        return await db.none('insert into tablereff (DATE,EXPENCESENAME,AMOUNT,NAME_ID,CATEGORY_ID) values($1,$2,$3,$4,$5)', [date, expence, amount, name_id, catergory_Id])



    }

    async function getuser(name) {

        let user = await db.manyOrNone('select * from logins where names = $1', [name])
        return user
    }

    async function insertExpence(name, catergory, amount) {
       
        let get_user_id = await db.one('select id from logins where  names = $1', [name])
        console.log(get_user_id);
        let get_catergory_id = await db.one('select id from EXPENCESE where  CATEGORY = $1', [catergory])
        let timestamp = new Date()
         await db.none('insert into TABLEREFF (date, EXPENCESENAME, AMOUNT, NAMES_ID, CATEGORY_ID  ) values($1, $2, $3, $4, $5)' ,[ timestamp, catergory, amount, get_user_id.id, get_catergory_id.id])

    }

    return {
        create_user,
        checkUser,
        insertExpence,
        getuser
        // joinTable
    }
}
