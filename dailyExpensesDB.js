module.exports = function waiters(db) {


    async function create_user(names, surnames, emails,code) {

        let user_name = names.toUpperCase()
        let user_surname = surnames.toUpperCase()
        let user_email = emails.toUpperCase()
        let nameRegex = /^[a-zA-Z]{3,}$/
        let emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/


        const name = nameRegex.test(user_name);
        const surname = nameRegex.test(user_surname)
        const email = emailRegex.test(user_email)

        
        if (name && surname && email && code) {
            let duplicate = await checkUser(user_name)
        
            if (duplicate) {
                await db.none('insert into logins (names, surname, email, USER_CODE) values ($1, $2, $3,$4)', [user_name, user_surname, user_email,code])
                return "created a user"
            } 
            else {
                return "duplicate"
            }

        }
    }
    async function checkUser(users) {
        let user = await db.any('select names from logins where names = $1', [users])
        
        return user.length == 0 ? true : false;
    }
    async function checkcode(code) {
        let user = await db.any('select USER_CODE from logins where USER_CODE = $1', [code])
        
        return user.length == 0 ? true : false;
    }

  

    async function getuser(name) {

        let user = await db.manyOrNone('select * from logins where names = $1', [name])
        return user
    }

    async function insertExpence(name, catergory, amount) {
       
        let get_user_id = await db.one('select id from logins where  names = $1', [name])

        let get_catergory_id = await db.one('select id from EXPENCESE where  CATEGORY = $1', [catergory])
        let timestamp = new Date()
         await db.none('insert into TABLEREFF (date, EXPENCESENAME, AMOUNT, NAMES_ID, CATEGORY_ID  ) values($1, $2, $3, $4, $5)' ,[ timestamp, catergory, amount, get_user_id.id, get_catergory_id.id])

    }

    async function alldata(identity){

        let all = await db.manyOrNone('select * from TABLEREFF where NAMES_ID = $1',[identity])
        return all
    }

    async function deletedata(identity){
   
        let resert = await db.manyOrNone('DELETE FROM  TABLEREFF WHERE NAMES_ID = $1',[identity])
        return resert
    
    }

    async function filter(name,date){

        let timestamp = new Date()

        
         let dates =  await db.manyOrNone('select * from TABLEREFF where names_id = (select id from logins where names = $1) and date between $2 and $3 ', [name,date,timestamp])
        
        return dates

    }

    return {
        create_user,
        checkUser,
        insertExpence,
        getuser,
        alldata,
        checkcode,
        deletedata,
        filter

        
        
    }
}
