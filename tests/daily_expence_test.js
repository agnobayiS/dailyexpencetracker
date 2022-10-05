const express = require('express');
const daily = require('./dailyExpensesDB');
const pgp = require('pg-promise')();





const local_database_url = 'postgres://siyabonga:siya@localhost:5432/daily_expenses';
const connectionString = process.env.DATABASE_URL || local_database_url;

const db = pgp(connectionString);


describe("daily_expenses database test", async function () {



    beforeEach(async function () {
        await db.manyOrNone('delete from daily_expenses')

    });


    it("should display all registration from (BELLIVEL) in the database", async function () {
        let instance = daily(db)

        await instance.create_user(names, surnames, emails,code)
            

        assert.deepEqual([
            {
                "regnumber": "CY 123 321"
            }
        ]
            , await registration.getTown("BELLIVEL"))




    })
    it("should display all registration from (CAPE TOWN) in the database", async function () {
        let registration = regNumbers(db)

        await registration.eachTown("ca 123 321")
        await registration.eachTown("ca 321 123")
        await registration.eachTown("cy 123 321")

        assert.deepEqual([
            {
                "regnumber": "CA 123 321"
            },
            {
                "regnumber": "CA 321 123"
            }
        ]
            , await registration.getTown("CAPE_TOWN"))




    })
    it("should display all registration from (EASTERN CAPE) in the database", async function () {
        let registration = regNumbers(db)

        await registration.eachTown("123 321 EC")
        await registration.eachTown("ca 321 123")
        await registration.eachTown("cy 123 321")

        assert.deepEqual([
            {
                "regnumber": "123 321 EC"
            }
        ]
            , await registration.getTown("EASTERN_CAPE"))




    })
    it("should display all registration in the database", async function () {
        let registration = regNumbers(db)

        await registration.eachTown("123 321 EC")
        await registration.eachTown("ca 321 123")


        assert.deepEqual([

            {
                "regnumber": "CA 321 123"
            },
            {
                "regnumber": "123 321 EC"

            },
        ]
            , await registration.getAll())




    })
    it("should clear all registration in the database", async function () {
        let registration = regNumbers(db)

        await registration.eachTown("123 321 EC")
        await registration.eachTown("ca 321 123")
        await registration.eachTown("cy 123 321")

        await registration.clear()

        assert.deepEqual([], await registration.getAll())




    })

    it("should return true if the registration is already enterd in the database", async function () {
        let registration = regNumbers(db)

        await registration.eachTown("123 321 EC")
        await registration.eachTown("ca 321 123")
        await registration.eachTown("cy 123 321")


        assert.equal(true, await registration.checkReg("123 321 EC"))




    })
    it("should return false if the registration is not allready enterd", async function () {
        let registration = regNumbers(db)

        await registration.eachTown("123 321 EC")
        await registration.eachTown("ca 321 123")
        await registration.eachTown("cy 123 321")


        assert.equal(false, await registration.checkReg("223 321 EC"))




    })






    after(async function () {
        await db.manyOrNone('Truncate daily_expenses');
    })
})
