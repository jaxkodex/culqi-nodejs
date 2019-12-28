
class DomainError extends Error {
    constructor(message) {
        super(message)
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor)
    }
}

class CulqiOpError extends DomainError {
    constructor(request, response) {
        super(response.data && response.data.object == 'error' ? response.data.merchant_message : `${response.status} - ${response.statusText}`)
        this.data = { request, response }
    } 
}

class Culqi {
    constructor(options) {
        this.http = options.http
    }

    async charge (request) {
        try {
            let response = await this.http.post('/charges', request)
            return response.data
        } catch (e) {
            throw new CulqiOpError(request, e.response)
        }
    }
}

module.exports = Culqi