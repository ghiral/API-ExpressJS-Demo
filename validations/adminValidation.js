const Joi = require('joi');

const adminValidation = (data)=>{
    
    const schema = Joi.object().keys({
        id:Joi.string().required(),
        name:Joi.string().min(2).pattern(/\D+/).max(100).required(),
        password:Joi.string()
        .when('id', {is: Joi.equal('',null), then: Joi.required() , otherwise: Joi.optional().allow('')}),
        password_confirmation:Joi.string()
        .when('id', {is: Joi.equal('',null), then:  Joi.required(), otherwise: Joi.optional().allow('')})
        .equal(Joi.ref('password')),
        image:Joi.string().optional().allow(''),
    });
    const result = schema.validate(data);
    return result;    
}
module.exports = {adminValidation}