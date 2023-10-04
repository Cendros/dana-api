import swagger from "@elysiajs/swagger";

export default swagger({
    documentation: {
        info: {
            title: 'API Chèques Apollo',
            version: '1.0.0'
        },
        tags: [
            { name: 'DEV', description: "Testing endpoints" },
            { name: 'Check', description: "checks endpoints" },
            { name: 'Structure', description: "structures endpoints" },
            { name: 'User', description: "users endpoints" },
            { name: 'Society', description: "society endpoints" },
        ]
    }
})