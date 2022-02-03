const graphql = require('graphql');
const jsonwebtoken = require('jsonwebtoken');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLString
} = graphql;

//This file contains the GraphQL "Resolvers"

// GraphQL Types
const UserType = require('../graphqlTypes/UserType');

// Mongoose Models
const UserModel = require('../mongoModels/UserModel');

module.exports = new GraphQLObjectType({
    name: 'RootQuery',
    description: 'Queries fetch data about users',
    fields: {
        // these queries cannot have the same name!
        userid: {
            type: UserType,
            description: 'Retrieve a single User by ID',
            args: {
                id: {
                    type: GraphQLID,
                    description: 'ObjectId'
                }
            },
            async resolve(parent, args) {
                let foundUserByID = await UserModel.findById(args.id)
                if (!foundUserByID) {
                    throw new Error(`Could not find a user with ID ${args.id}`)
                }
                return foundUserByID;
            }
        },

        user: {
            type: UserType,
            description: 'Retrieve a single User by Email',
            args: {
                email: {
                    type: GraphQLString,
                    description: 'Email'
                }
            },
            async resolve(parent, args) {
                let foundUserByEmail = await UserModel.findOne({ "email": args.email})
                if (!foundUserByEmail) {
                    throw new Error(`Could not find a user with email ${args.email}`)
                }
                return foundUserByEmail;
            }
        },

        users: {
            type: new GraphQLList(UserType),
            description: 'Retrieve all Users in DB if no arguments provided, or just the user with the email provided',
            args: {
                email: {
                    type: GraphQLString,
                    description: 'Email of the required User'
                }
            },
            async resolve(parent, args) {
                if (!args.email) {
                    let multipleUsers = await UserModel.find({})
                    return multipleUsers;
                }
                let singleUser = await UserModel.find({"email": args.email})
                return singleUser;
            }
        }
    }
});