const express = require('express')
const User  = express.Router()
const bcrypt = require('bcrypt');

require('dotenv').config()
const db = require('../config/db.js');
const Op = db.Sequelize.Op;
const sq = db.sequelize;

//Get list all users
User.get('/list', async (req, res) => {
    let data;

    try{
        data = await db.users.findAndCountAll({
            attribute: ['id', 'name', 'age', 'role'],
            logging: console.log
        });
    } catch(e) {
        console.error(e)
        return res.status(500).send({errMsg: 'Unable to fetch all user.'});
    }
    return res.send({ status: 'success', data });
})

//Get single user details
User.get('/details/:id', async (req, res) => {
    let user = req.params.id;
    let response = {};
    let data;

    if (!user) return res.status(422).send({errMsg: `id is missing.`});
    
    try{
        data = await db.users.findOne({
            where:{
              id :{[Op.eq]: user}
            },
            logging: console.log
        });

        if(!data) return res.status(422).send({errMsg: `User ${user} is not exist.`});
        
        response.count = 1
        response.rows = [data] 

    } catch(e) {
        console.error(e)
        return res.status(500).send({errMsg: 'Unable to fetch single user details'});
    }
    return res.send({ status: 'success', data: response });
})

//Add new user
User.post('/add', async (req, res) => {
    let { id, password, role, full_name, phone, email, age, birth_date } = req.body

    if (!id) return res.status(422).send({errMsg: 'Missing id parameter.'});
    if (!password) return res.status(422).send({errMsg: 'Missing password parameter.'});
    if (!role) return res.status(422).send({errMsg: 'Missing role parameter.'});
    if (!full_name) return res.status(422).send({errMsg: 'Missing full_name parameter.'});
    if (!age) return res.status(422).send({errMsg: 'Missing age parameter.'});
    if (!birth_date) return res.status(422).send({errMsg: 'Missing birth_date parameter.'});

    //Below is optional
    // if (!phone) return res.status(422).send({errMsg: 'Missing phone parameter.'});
    // if (!email) return res.status(422).send({errMsg: 'Missing email parameter.'});
    
    let isUserExist, transaction;

    try{
        isUserExist = await db.users.findOne({
            where:{
                id :{[Op.eq]: id}
            },
            logging: console.log
        });
        
        if (isUserExist) return res.status(422).send({errMsg: 'User already exist.'})
        
        let hashedPassword = bcrypt.hashSync(password, parseInt(process.env.HASH_SALTROUND))
        
        transaction = await sq.transaction();
        await db.users.create({
          id,
          password: hashedPassword,
          role,
          full_name,
          active: true,
          phone: phone ? phone : null,
          email: email ? email : null,
          age,
          birth_date,
          created_by: 'system'
        }, transaction);
        
        await transaction.commit();

    } catch(e) {
        console.error(e)
        if(transaction) await transaction.rollback();
        return res.status(500).send({errMsg: `Unable to create user for id: ${id}`});
    }
    return res.send({ status: 'success', message: 'New user created successfully.' });
})

//Update existing user
let qUpdateExistingUser = `UPDATE users
SET role=:role, 
    full_name=:full_name, 
    active=:status, 
    phone=:phone, 
    email=:email,
    age=:age,
    birth_date=:birth_date
WHERE id =:id`

User.post('/update', async (req, res) => {
    let { id, role, full_name, status, phone, email, age, birth_date } = req.body

    if (!id) return res.status(422).send({errMsg: 'Missing id parameter.'});
    
    //Below validation mandatory field to update
    if (!status) return res.status(422).send({errMsg: 'Active field is mandatory'});
    if (!birth_date) return res.status(422).send({errMsg: 'Birth Date is mandatory'});
    if (!role) return res.status(422).send({errMsg: 'Role field is mandatory.'});
    if (!['customer', 'superadmin'].includes(role)) return res.status(422).send({errMsg: 'Invalid role name.'});
    if (!full_name) return res.status(422).send({errMsg: 'Full Name field is mandatory'})
        else if (full_name && full_name.length < 5) return res.status(422).send({errMsg: 'Full Name field should be more than 5 char.'})
    if (age === 0) return res.status(422).send({errMsg: 'Age field is mandatory.'});
     else if (parseInt(age) < 18)  return res.status(422).send({errMsg: 'Age should be more than 18.'});
    
    let isUserExist, transaction;

    try{
        isUserExist = await db.users.findOne({
            where:{
                id :{[Op.eq]: id}
            },
            logging: console.log
        });
        
        if (!isUserExist) return res.status(422).send({errMsg: 'User id not exist.'})

        transaction = await sq.transaction();
        await sq.query(qUpdateExistingUser,{
            type: sq.QueryTypes.UPDATE,
            replacements : {
                id, role, full_name, birth_date,
                status: status == 'active' ? true : false,
                phone: phone ? phone : null,
                email: email ? email : null,
                age: age
            },
            logging: console.log, transaction
          })

        await transaction.commit();

    } catch(e) {
        console.error(e)
        if(transaction) await transaction.rollback();
        return res.status(500).send({errMsg: `Unable to update user for id: ${id}`});
    }
    return res.send({ status: 'success', message: `User Id (${id}) updated successfully.` });
})

module.exports = User