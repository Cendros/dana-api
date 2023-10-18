import swagger from "@elysiajs/swagger";

export default swagger({
    documentation: {
        info: {
            title: 'API Chèques Apollo',
            version: '1.0.0'
        },
        tags: [
            { name: 'Auth', description: "Authentification endpoints" },
            { name: 'Mobile', description: "Mobile app endpoints" },
            { name: 'Society', description: "society endpoints" },
            { name: 'Structure', description: "structures endpoints" },
            { name: 'Admin', description: "Admin endpoints" },
        ],
        components: {
            securitySchemes: {
                bearer: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            { bearer: [] }
        ]
    }
})