"use server"
import { getCollection } from "../lib/db";
import bcrypt from 'bcrypt';

function isAlphaNumeric(x) {
    const regex = /^[a-zA-Z0-9]*$/;
    return regex.test(x);
}

export const register = async function(prevState, formData) {
    const errors = {};
    const ourUser = {
        userName: formData.get("name"),
        password: formData.get("password"),
    };
    console.log(ourUser);
    if (typeof ourUser.userName !== "string") ourUser.userName = ""
    if (typeof ourUser.password !== "string") ourUser.password = ""

    ourUser.userName = ourUser.userName.trim();
    ourUser.password = ourUser.password.trim();

    if (ourUser.userName.length < 3 ) errors.userName = "User name should be at least 3 characters."
    if (ourUser.userName.length > 30 ) errors.userName = "User name can not exceed 30 characters."
    if (!isAlphaNumeric(ourUser.userName)) errors.userName = "User name only can contains letters and numbers."
    if (ourUser.userName === "") errors.userName = "You should provide a user name"
    if (ourUser.password.length < 3 ) errors.password = "User name should be at least 3 characters."
    if (ourUser.password.length > 50 ) errors.password = "Password should not exceed 50 characters."
    if (ourUser.password === "") errors.password = "You should provide a user name"

    if (errors.userName || errors.password) {
        return {
            errors,
            success: false,      
        }
    };
    // hash password before storing
    const salt  = bcrypt.genSaltSync(10);
    ourUser.password = bcrypt.hashSync(ourUser.password, salt);
    // storing a new user into db
    const userCollection = await getCollection("users");
    await userCollection.insertOne(ourUser);
    return {
        success: true,
    }
    
}