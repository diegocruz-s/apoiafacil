db.createUser({
  user: 'diego',
  pwd: 'segredo',
  roles: [
    { role: 'readWrite', db: 'auth_infra' },
    { role: 'readWrite', db: 'auth_infra_test' }
  ]
});