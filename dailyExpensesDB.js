module.exports = function waiters(db) {


    async function validateLogIns(name) {

        let nameRegex = /^[a-zA-Z]{3,}$/
        let emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/


        const names = nameRegex.test(name);
        // const surnames = nameRegex.test(surname)
        // const emails = emailRegex.test(email)


        if (names) {
           return await db.none('insert into login (names) values ($1)', [names])
        }

    }
    async function checkUser(users) {

        let user = await db.any('select name from logins where name = $1', [users])
        return user.length >= 1 ? true : false;
    }

    async function insertExpence(date,expence,amount,name_id,catergory_Id){

      return await db.none('insert into tablereff (DATE,EXPENCESENAME,AMOUNT,NAME_ID,CATEGORY_ID) values($1,$2,$3,$4,$5)',[date,expence,amount,name_id,catergory_Id])



    }

    async function getuser(name){

        let user = await db.manyOrNone('select * from logins where names = $1',[name])
        return user
    }

    return {
        validateLogIns,
        checkUser,
        insertExpence,
        getuser
    }
}
