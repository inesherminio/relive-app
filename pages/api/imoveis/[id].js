const axios = require('axios');

export default async (req, res) => {
    console.log('/api/imoveis', req.query.id)
    if (req.method === 'PUT') {
        console.log('PUT /api/imoveis/:id')
        try {
            await axios.put(`/wp/v2/imoveis/${req.query.id}`, {
                ...req.body
            })
            res.status(200).json({ success: true })
        } catch (error) {
            res.status(400).json({ success: false })
        }
    } else {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ name: 'Nothing here' }))
    }
}