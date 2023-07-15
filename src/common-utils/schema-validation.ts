import Ajv, { ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'

// Initialize AJV instance
const ajv = new Ajv()
addFormats(ajv)

/**
 * Validate the request body against a JSON schema.
 * @param schema The JSON schema to validate against.
 * @param data The request body data to validate.
 * @returns An array of error messages if the data is invalid, or null if the data is valid.
 */
export function validateRequest(schema: object, data: any): string[] | null {
  const valid = ajv.validate(schema, data)
  if (!valid) {
    const errors: ErrorObject[] = ajv.errors || []
    console.log(errors)
    const errorMessages = errors.map((error) => error.message || '')
    return errorMessages
  }
  return null
}
