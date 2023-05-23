const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
 const user = function (user) {
    this.email = user.email;
    this.password = user.password;
  };
exports.signIn = (req, res) => {
    const { email, password } = req.body;
    connection.query("SELECT * FROM (SELECT 'client' AS type, email, password FROM client UNION ALL SELECT 'personnel' AS type, email, password FROM personnel UNION ALL SELECT 'centre' AS type, email, password FROM centre) AS users WHERE email = ?", [email], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      } else if (results.length === 0) {
        res.status(401).send('Incorrect email or password');
      } else {
        const user = results[0];
        console.log('User type:', user.type);
        bcrypt.compare(password, user.password, (error, isMatch) => {
          if (error) {
            console.error(error);
            res.status(500).send('Internal server error');
          } else if (!isMatch) {
            res.status(401).send('Incorrect email or password');
          } else {
            const token = jwt.sign({ id: user.id, type: user.type }, 'your_secret_key', { expiresIn: '1h' });
            res.status(200).json({ token });
          }
        });
      }
    });
};
