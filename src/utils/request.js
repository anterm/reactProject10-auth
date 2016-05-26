import request from 'superagent'

export default (params) => {
	return new Promise((resolve, reject) => {
		const req = request[params.method || 'get'](params.url)
		
		if(params.headers) 
			req.set(params.headers)

		if(params.data)
			req.send(params.data)

		req.end((err, res) => {
			if(err) reject(err)
			
			resolve(res.body)
		})
	})
} 