const joi = require('joi');

const signupSchema = joi.object({
    firstname: joi.string().required().messages({
        "string.empty": "Họ không được để trống",
        "any.required": "Trường 'Họ' là trường bắt buộc",
    }),
    lastname: joi.string().required().messages({
        "string.empty": "Tên không được để trống",
        "any.required": "Trường 'Tên' là trường bắt buộc",
    }),
    email: joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "any.required": "Trường 'Email' là trường bắt buộc",
        "string.email": "Email không đúng định dạng",
    }),
    password: joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Trường 'Mật khẩu' là bắt buộc",
        "string.min": "Mật khẩu phải có ít nhất {#limit} kí tự",
    }),
    mobile: joi.string().required().messages({
        "string.empty": "Số điện thoại không được để trống",
        "any.required": "Trường 'Mobile' là trường bắt buộc"
    }),
});



const signinSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "any.required": 'Trường "Email" là bắt buộc',
        "string.email": "Email không đúng định dạng",
    }),
    password: joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": 'Trường "Mật khẩu" là bắt buộc',
        "string.min": "Mật khẩu phải có ít nhất {#limit} kí tự"
    }),

});

module.exports = {
    signupSchema,
    signinSchema
};