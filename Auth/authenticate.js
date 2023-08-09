//  const model=require('../db/Models');
const Student=require('../db/Models/studentModel');
const Teacher=require('../db/Models/teacherModel');
const jwt=require('jsonwebtoken');
const modelsMap = new Map();
modelsMap.set('student', Student);
modelsMap.set('teacher', Teacher);
 
const middleware = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies or headers
    // console.log(token);
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'key');
        console.log(decoded);
        req.user = decoded; // Attach the decoded payload to the request object
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
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
        console.log("Function entered");

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

        console.log("User found:", user); // Print the user object
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
                    console.log('Token updated successfully:', (updatedUser));
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



module.exports = {
    middleware,
    isValidUser
};

