const contacts = [
  {
    _id: '5eb074232c30a1378dacdbda',
    name: 'Allen Raymond',
    email: 'nulla.ante@vestibul.com',
    phone: '9929143792',
    subscription: 'free',
  },

  {
    _id: '5eb074232c30a1378dacdbdb',
    name: 'Chaim Lewis',
    email: 'dui.in@egetlacus.ru',
    phone: '1122334499',
    subscription: 'pro',
  },
];

const newContact = {
  name: 'New',
  email: 'new@new.com',
  phone: '1231231230',
  subscription: 'premium',
};

const User = {
  _id: '604780b0a33f593b5866d70d',
  name: 'TestUser',
  email: 'test@test.com',
  password: '$2a$08$uS3qerS0sX82l2y9LzxfwuVyUoCpBYNW9TQwzMafzYtNdcCHZE4SO',
  sex: 'male',
  subscription: 'premium',
  token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwM2U5MzFlNzM2MzUzM2Y1MGVkMmNiYSIsImlhdCI6MTYxNTQzMDg2OSwiZXhwIjoxNjE1NDM0NDY5fQ.IjCjH0cmfFoOLFhP36F-pKondQg1SnAsyunDTJiteCw',
  avatar:
    'https://s.gravatar.com/avatar/d6ac26ce64657b23fce03f68f65dc6b4?s=250',
};

const users = [];
users[0] = User;

const newUser = {
  name: 'NewUserTest',
  email: 'newusertest@test.com',
  password: '123456',
  sex: 'female',
  subscription: 'free',
};

module.exports = {
  contacts,
  newContact,
  User,
  users,
  newUser,
};
