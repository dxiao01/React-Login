const bcrypt = require('bcrypt');

class Router {
    
    constructor(app, daba){
        this.login(app, daba);
        this.logout(app, daba);
        this.isLoggedIn(app, daba);
    }

    login(app, daba){
        app.post('/login', (req, res) => {
            let username = req.body.username;
            let password = req.body.password;

            username = username.toLowerCase();

            if(username.length > 12 || password.length > 12){
                res.json({
                    sucess: false,
                    msg: 'Please try again'
                })
                return;
            }

            let cols = [username];
            daba.query('SELECT * FROM users WHERE username = ? LIMIT 1', cols, (err, data, fields) => {
                if(err) {
                    res.json({
                        success: false,
                        msg: 'Please try again'
                    })
                    return;
                }

                if(data && data.length === 1){
                    bcrypt.compare(password, data[0].password, (bcryptErr, verified) => {

                        if(verified){
                            req.session.userID = data[0].id;

                            res.json({
                                success: true,
                                username: data[0].username
                            })
                            return;
                        }
                        
                        else{
                            res.json({
                                success: false,
                                msg: 'Invalid password'
                            })
                        }
                    });

                }
                else{
                    res.json({
                        success: false,
                        msg: 'User not found, please try again'
                    })
                }
            });
        })

        
    }

    logout(app, daba){
        app.post('/logout', (req, res) => {
            if(req.session.userID){
                req.session.destroy();
                res.json({
                    success: true,

                })
                return true;
            }
            else{
                res.json({
                    success:false,
                })
                return false;
            }
        })
    }

    isLoggedIn(app, daba){
        app.post('/logout', (req, res) => {

            if(req.session.userID){

                let cols = [req.session.userID];
                daba.query('SELECT * FROM user WHERE id = ? LIMIT 1', cols, (err, data, fields) => {
                    if(data && data.length === 1){
                        res.json({
                            success: true,
                            username: data[0].username
                        })
                        return true;
                    }
                    else{
                        res.json({
                            success: false
                        })
                    }

                });
            }
            else{
                res.json({
                    success: false
                })
            }
        });
    }
}

module.exports = Router;