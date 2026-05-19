// middlewares/validate.middleware.js
// Zod v4 compatible — v4 me .issues use hota hai, v3 me .errors tha

const formatErrors = (zodError) =>
    (zodError?.issues ?? zodError?.errors ?? []).map((err) => ({
        field: err.path.join('.'),
        message: err.message,
    }))

// Body validator
// Usage: router.post('/route', validate(mySchema), controllerFn)
export const validate = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.body)
    // console.log("validation result ", req.body, result)
     if (!result.success) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: formatErrors(result.error),
        })
    }

    req.body = result.data
    next()
}

// URL Params validator
// Usage: router.get('/route/:_id', validateParams(mongoIdParamSchema), controllerFn)
export const validateParams = (schema) => (req, res, next) => {
    const result = schema.safeParse(req.params)

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Invalid URL parameter',
            errors: formatErrors(result.error),
        })
    }

    req.params = result.data
    next()
}