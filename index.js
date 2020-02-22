const {graphql, buildSchema} = require('graphql')

const db = {
    users: [
        {id: '1', email:'test1@test.com', name:'test1'},
        {id: '2', email:'test2@test.com', name:'test2'},
        {id: '3', email:'test3@test.com', name:'test3'}
    ]
}

const schema = buildSchema(`
    type Query{
        users: [User!]!
    }

    type User{
        id: ID!
        email: String!
        name: String
        avatarUrl: String
    }
`)

const rootValue = {
    users: () => db.users
}

graphql(
    schema,
    `{
        users {
            id
            email
        }
    }`,
    rootValue
).then(
    res => console.dir(res, { depth: null})
).catch(
    console.error
)