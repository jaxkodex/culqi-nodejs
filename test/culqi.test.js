const Culqi = require('../lib/culqi')
const axios = require('axios')

jest.mock('axios')

test('Culqi charge is made', async () => {
    axios.post.mockResolvedValue({
        data: require('./data/charge.response.json')
    })
    let culqiM = new Culqi({
        http: axios
    })
    let charge = await culqiM.charge({
        amount: 1000,
        currency_code: 'PEN',
        email: 'admin@gmail.com',
        source_id: 'tkn_test_vzMuTHoueOMlgUPj'
    })
    expect(charge.object).toBe('token')
})

test('Culqi charge throws exception', async () => {
    axios.post.mockImplementation(() => {
        throw {
            response: {
                status: 401,
                statusText: 'Unauthorized',
                data: require('./data/charge.error.json')
            }
        }
    })
    let culqiM = new Culqi({
        http: axios
    })
    try {
        await culqiM.charge({
            amount: 1000,
            currency_code: 'PEN',
            email: 'admin@gmail.com',
            source_id: 'tkn_test_vzMuTHoueOMlgUPj'
        })
    } catch (e) {
        expect(e.data.response.status).toBe(401)
    }
})