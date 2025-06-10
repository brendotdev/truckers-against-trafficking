const connectToDB = require("../db");

const User = require('../models/user');

connectToDB();

const makeUserAdmin = async (username) => {
  const user = await User.findOne({ username });
  if (!user) {
    console.log('User not found');
    return;
  }
  user.isAdmin = true;
  await user.save();
  console.log('User is now an admin');
}

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the username of the user you want to make an admin: ', async (username) => {
  await makeUserAdmin(username);
  rl.close();
});



