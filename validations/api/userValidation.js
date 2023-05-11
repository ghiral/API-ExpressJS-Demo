const Joi = require('joi');

const userValidation = (data)=>{
    try {
        const schema = Joi.object().keys({
            id:Joi.string().optional().allow(''),
            name:Joi.string().min(2).max(100).required().messages({
                "string.base":`Please give data in json!`,
                "string.min":`First name should have atleast 2 characters!`,
                "string.max":`First name cannot exceed more than 100 characters!`,
                "any.required":`Please enter first name!`
            }),
            email:Joi.string().email().max(100).required().messages({
                "string.base":`Please give data in json!`,
                "string.email":`Please enter email in proper format!`,
                "string.max":`Email cannot exceed more than 100 characters!`,
                "any.required":`Please enter email!`
            }),
            password:Joi.string().required().messages({
                "string.base":`Please give data in json!`,
                "any.required":`Please enter password!` 
            }),
        });
        
        const result = schema.validate(data);
        // console.log(result.error.details);
        return result;
    } catch (error) {
        return result.status(400).json({error:error.message});
    }
}

module.exports = {userValidation}