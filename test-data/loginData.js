module.exports = {
  validUser: {
    username: 'standard_user',
    password: 'secret_sauce'
  },

  invalidUsers: [
    {
      username: 'wrong_user',
      password: 'secret_sauce',
      error: 'Epic sadface: Username and password do not match any user in this service'
    },
    {
      username: 'standard_user',
      password: 'wrong_pass',
      error: 'Epic sadface: Username and password do not match any user in this service'
    },
    {
      username: '',
      password: 'secret_sauce',
      error: 'Epic sadface: Username is required'
    },
    {
      username: 'standard_user',
      password: '',
      error: 'Epic sadface: Password is required'
    }
  ]
};
