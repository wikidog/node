import jwt from 'jsonwebtoken';

let data = {
  id: 10
};

jwt.sign(data, 'abc123');
