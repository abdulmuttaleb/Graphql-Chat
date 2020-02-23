const { ApolloServer, gql} = require('apollo-server')

const expressPlayground = require('graphql-playground-middleware-express').default
const crypto = require('crypto')

const db = {
    users: [
        {id: '11', email:'test1@test.com', name:'test1'},
        {id: '21', email:'test2@test.com', name:'test2'},
        {id: '31', email:'test3@test.com', name:'test3'}
    ],

    messages:[
        { id:'1', userId:'11', body:'Hello', createdAt:Date.now()},
        { id:'2', userId:'21', body:'Hi', createdAt:Date.now()},
        { id:'3', userId:'31', body:'what\'s up', createdAt:Date.now()}
    ]
}

const typeDefs = gql`
    type Query{
        users: [User!]!
        user(id:ID!):User
        messages: [Message!]!
    }

    type Mutation{
        addUser(email:String!, name:String): User
    }

    type User{
        id: ID!
        email: String!
        name: String
        avatarUrl: String
        messages: [Message!]!
    }

    type Message{
        id:ID!
        userId:ID!
        body:String
        createdAt: String
    }`

const resolvers = {

    Query:{
        users: () => db.users,

        user: (root, {id}) => db.users.find( user => user.id === id),
    
        messages: () => db.messages
    },

    Mutation:{
        addUser: (root, {email, name}) =>{
            const user = {
                id: crypto.randomBytes(10).toString('hex'),
                email,
                name
            }
    
            db.users.push(user)
    
            return user
        }
    },
    User:{
        messages: user => db.messages.filter(message => message.userId === user.id)
    }
}

const server = new ApolloServer({typeDefs, resolvers})

server.listen().then(({ url }) => console.log(url))