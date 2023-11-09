//  const model=require('../db/Models');
const Student=require('../db/Models/studentModel');
const Teacher=require('../db/Models/teacherModel');
const jwt=require('jsonwebtoken');
const modelsMap = new Map();
modelsMap.set('student', Student);
modelsMap.set('teacher', Teacher);
 
const middleware = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies or headers
    console.log("middleware called");
    // console.log(token);
    
    if (!token) {
        //console.log(req.body);
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'key');
        // console.log(decoded);
        req.user = decoded; // Attach the decoded payload to the request object
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token by middle' });
    }

};

const insertTestUser = async () => {
    try {
        const newUser = new Student({
            email: 'ajaykumar',
            password: 'ajay', // In a real scenario, this should be hashed
            userType: 'student'
        });

        await newUser.save();
        console.log('Test user inserted successfully');
    } catch (error) {
        console.error('Error inserting test user:', error);
    }
};


async function isValidUser(email, password, userType,newToken) {

    try {
        console.log("Is validuser");

        let user; // Declare the user variable
        if([...modelsMap.keys()].includes(userType)){
            user=await modelsMap.get(userType).findOne({email});
        }else{
            return([false,'']);
        }

        if (!user) {
            console.log("User not found");
            return ([false,'']); // User not found
        }

       // console.log("User found:", user); // Print the user object
        const passwordMatches = user.password === password;
        if(passwordMatches){
            try {
                const updatedUser = await modelsMap.get(userType).findOneAndUpdate(
                    { email }, // Find the user by email
                    { $set: { token: newToken } }, // Update the token field
                    { new: true } // Return the updated document
                );
        
                if (!updatedUser) {
                    console.log('User not found');
                } else {
                    // console.log('Token updated successfully:', (updatedUser));
                    console.log('Token updated successfully:');
                }
                return [passwordMatches,(updatedUser._id.toHexString())];
            } catch (error) {
                console.error('Error updating token:', error);
            }
        }
        return[false,''];
 // Return the result of password comparison
    } catch (error) {
        console.error('Error validating user:', error);
        return [false,'']; // Error occurred
    }
}

function generateAuthToken(email) {
    const secretKey = 'key';
    const expiresIn = 15 * 24 * 60 * 60; 
    const token = jwt.sign({ email }, secretKey, { expiresIn });
    return token;
  }


  async function login(req, res) {
    const { email, password, userType } = req.body;
    console.log(email + password + userType);
    console.log("post request");
  
    try {
      const token = generateAuthToken(email + 1000 * Math.random());
  
      const [isValid, id] = await isValidUser(email, password, userType, token);
      console.log(id);
      const expirationTime = new Date();
      expirationTime.setHours(expirationTime.getHours() + 1); // 
      if (isValid) {
        // Set cookies securely with specific options
        res.cookie('token', token, {
          httpOnly: false,
          sameSite: 'none',
          secure: true,
          domain: `${process.env.DMN}` , 
          expires: expirationTime 
        });
        
        res.cookie('userType', userType, {
          sameSite: 'none',
          secure: true,
          domain: `${process.env.DMN}`,
          expires: expirationTime 
        });
        
        res.cookie('email', email, {
          sameSite: 'none',
          secure: true,
          domain: `${process.env.DMN}`,
          expires: expirationTime 
        });
        
        res.cookie('id', id, {
          sameSite: 'none',
          secure: true,
          domain: `${process.env.DMN}`,
          expires: expirationTime 
        });        
  
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  function logout(req, res) {
    // Clear all cookies
    res.clearCookie('userType', { sameSite: 'none', secure: true });
    res.clearCookie('email', { sameSite: 'none', secure: true });
    res.clearCookie('obj', { sameSite: 'none', secure: true });
    res.clearCookie('id', { sameSite: 'none', secure: true });
    res.clearCookie('token', { sameSite: 'none', secure: true });
  
    // Respond with a success message
    res.json({ message: 'Logged out successfully from server' });
  }
  
module.exports = {
    logout,
    middleware,
    isValidUser,login
};

