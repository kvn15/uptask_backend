import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: function(origin, callback) {
        const whitelist = [process.env.URL_FRONTEND,process.env.URL_FRONTEND_V2]
        
        if (process.argv[2] === '--api') {
            whitelist.push(undefined)
        }

        if (whitelist.includes(origin)) {
            callback(null, true) // Pemitir la conexion
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}