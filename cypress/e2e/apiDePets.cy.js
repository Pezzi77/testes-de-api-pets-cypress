describe('Teste da API de Pets', () => {
    it('Deve retornar o status da API', () => {
        cy.request({
            url: 'http://localhost:3000/status',
            method: 'GET'
        }).then((resposta) => {
            expect(resposta.status).to.eq(200)
            expect(resposta.body.status).to.eq('Operacional')
            expect(resposta.body.version).to.eq('1.0.0')
            expect(resposta.body.database).to.deep.eq({
                "status": "Operacional",
                "maxConnections": 900
            })

        })
    })

    it('Deve cadastrar um usuario', () => {
        const usuario = `usuarioabc2${Date.now()}`
        cy.request({
            url: 'http://localhost:3000/register',
            method: 'POST',
            body: {
                username: usuario,
                password: "123456"
            }
        }).then((resposta) => {
            expect(resposta.status).to.eq(201)
            expect(resposta.body.username).to.eq(usuario)
        })
    })
    it('Deve cadastrar um pet', () => {
        let token
        const pet = `pet${Date.now()}`
        cy.request({
            url: 'http://localhost:3000/login',
            method: 'POST',
            body: {
                username: "felipe",
                password: "123456"
            }
        }).then((resposta) => {
            token = resposta.body.token
        }).then(() => {
            cy.request({
                url: 'http://localhost:3000/pets',
                method: 'POST',
                body: {
                    name: pet,
                    type: "cão"
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then((resposta) => {
                expect(resposta.status).to.eq(201)
                expect(resposta.body).to.have.property('id')
                expect(resposta.body.userId).to.eq(8)
                expect(resposta.body.name).to.eq(pet)
                expect(resposta.body.type).to.eq('cão')
            })
        })
    })

    it('Não deve realizar login com dados inválidos', () => {
        cy.request({
            url: 'http://localhost:3000/login',
            method: 'POST',
            failOnStatusCode: false,
            body: {
                username: "felipe",
                password: "12345"
            },
            failOnStatusCode: false
        }).then((resposta) => {
            expect(resposta.status).to.eq(401)
            expect(resposta.body.error).to.eq('Invalid credentials')
        })
    })
})
