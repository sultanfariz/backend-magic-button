const jwt = require('jsonwebtoken');
const jwt_decode = require('jwt-decode');
const { NotFoundError, WrongIdentityError } = require('../errors');
const { response } = require('../helper/bcrypt');
const fetch = require('node-fetch');

module.exports = {
  // token signature authentication middleware by secret code
  authenticateToken: (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      // create locals variable to pass it to next middleware
      res.locals.token = authHeader && authHeader.split(' ')[1];
      if (res.locals.token == null) throw new NotFoundError('Token Not Found');
      // verify the signature
      jwt.verify(
        res.locals.token,
        process.env.ACCESS_JWT_SECRET,
        (err, user) => {
          if (err)
            throw new WrongIdentityError(
              "Your token doesn't matched our credentials"
            );
          req.user = user;
          next();
        }
      );
    } catch (error) {
      if (error.name === 'NotFoundError')
        return response(res, {
          code: 401,
          success: false,
          message: error.message,
        });

      if (error.name === 'WrongIdentityError')
        return response(res, {
          code: 403,
          success: false,
          message: error.message,
        });
    }
  },
  authenticateTokenIPB: async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      // create locals variable to pass it to next middleware
      res.locals.token = authHeader && authHeader.split(' ')[1];
      if (res.locals.token == null) throw new NotFoundError('Token Not Found');
      // verify the signature
      const url =  "http://api.ipb.ac.id/v1/Authentication/ValidateToken?token=" + res.locals.token;
      // const apiBody = { test: "test" }
      // const apiResponse = await fetch("http://api.ipb.ac.id/v1/Authentication/ValidateToken?"+ 
      // new URLSearchParams({
      //     Token: res.locals.token
        // }), {
      const apiBodyy = {Username: "sultan_fariz", Password: "eldiablo123" };
      const apiResponsee = await fetch("http://api.ipb.ac.id/v1/Authentication/LoginMahasiswa", {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'X-IPBAPI-Token': process.env.ACCESS_TOKEN
        },
        body: JSON.stringify(apiBodyy)
      })

      console.log(await apiResponsee.json());

      // const apiResponse = await fetch("http://api.ipb.ac.id/v1/Authentication/ValidateToken?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyODE5NDIiLCJpcGJEbiI6InVpZD1zdWx0YW5fZmFyaXosb3U9S09NLG91PUZNSVBBLG91PVMxLG91PVN0dWRlbnQsb3U9UGVvcGxlLGRjPWlwYixkYz1hYyxkYz1pZCIsImlwYlVpZCI6InN1bHRhbl9mYXJpeiIsImlwYk5hbWUiOiJTVUxUQU4gRkFSSVoiLCJpcGJFbWFpbCI6InN1bHRhbl9mYXJpekBhcHBzLmlwYi5hYy5pZCIsImlwYk5pbSI6Ikc2NDE4MDA4NiIsImlwYlRpcGVBa3VuIjoiU3R1ZGVudCIsImlwYk9yYW5nSUQiOiIyOTI1OTMiLCJpcGJNYWhhc2lzd2FJRCI6IjI4MTk0MiIsImV4cCI6MTYzMDc2NzYwMSwiaXNzIjoiaHR0cHM6Ly9hcGkuaXBiLmFjLmlkIn0.TLPm1pXMm0osNZxpLdkYx8rDP4o0RMG1wy8w5bQkZaWZuTwpr8WCQSW1fCLQovwsrkGl-9qhgTv139Yc2YqdedC8l6bcq1zL5WKqoPYlQZEMBYje4d7AXOuH7V4CRxE6pbM7E-L_m9_u-utiEg6NYWOpwJJS-CJq3ccjjev3FWz9Mq06x5I0xTX2GE_32DJxI9Eua_Qp8MDez1VVM1iUWLCaic8e58-k8HL4xq1I-JGPFApIntrhru4feZnacgf8rkcZVW1YJsJUxlBifxm2ImuDrDjFKrB2PWLW6tGT1M0ANfJM-ovFanx2ci4teyk162UjS6gCGxgcnPxL6ZFJtw", {
      const apiResponse = await fetch(url, {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json',
          'X-IPBAPI-Token': process.env.ACCESS_TOKEN,
        },
        // body: JSON.stringify(apiBody)
      })
      console.log("apiResponse");
      console.log(await apiResponse.json());
      console.log(apiResponse.status);
      if (apiResponse.status === 200){
        const data = await apiResponse.json();
        console.log(data);
        // continue to next middleware
        next();
        console.log("apiResponse");
      }  
      next();
      console.log("apiResponse");

    
    } catch (error) {
      if (error.name === 'NotFoundError')
        return response(res, {
          code: 401,
          success: false,
          message: error.message,
        });

      if (error.name === 'WrongIdentityError')
        return response(res, {
          code: 403,
          success: false,
          message: error.message,
        });
    }
  },
  // decode payload jwt to get user data
  parseJwtPayload: (token) => {
    return jwt_decode(token);
  },
  // generate new jwt token which expires in 7 days
  generateAccessToken: (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' });
  },
};
