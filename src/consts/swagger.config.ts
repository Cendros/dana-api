import swagger from "@elysiajs/swagger";

export default swagger({
    documentation: {
        info: {
            title: 'API Chèques Apollo',
            version: '1.0.0'
        },
        tags: [
            { name: 'Auth', description: "Authentification endpoints" },
            { name: 'Check', description: "checks endpoints" },
            { name: 'Structure', description: "structures endpoints" },
            { name: 'User', description: "users endpoints" },
            { name: 'Society', description: "society endpoints" },
            { name: 'Accessibility', description: "Accessibility endpoints" },
            { name: 'DEV', description: "Developement endpoints" },
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