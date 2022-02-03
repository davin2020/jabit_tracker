const graphql = require('graphql');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt
} = graphql;

const AUTH_SECRET = 'YOUR_SECRET';

// GraphQL Types
const UserType = require('../graphqlTypes/UserType');

// Mongoose Models
const UserModel = require('../mongoModels/UserModel');

module.exports = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Mutations change data about Users',
    fields: {

        // Mutation to Add New User to DB
        addUser: {
            type: UserType,
            description: 'Add a Single User ie Register a New User',
            args: {
                email: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "Email of the user"
                },
                fullname: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "Fullname of the user ie first and last names"
                },
                password: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "Password of the user"
                },
                dream_job: {
                    type: GraphQLString,
                    description: "Dream Job of the user"
                },
                motivation: {
                    type: GraphQLString,
                    description: "Motivation for the user to get this job"
                }
                // total_points: {
                //     type: GraphQLInt,
                //     description: "Total Point gained by the user for completing Goals"
                // }
            },
            async resolve(parent, args) {
                try {
                    //create new user - MongoDB config in OSX will prevent users being created with an existing email or username
                    // ToDo - configure MongoDB in Atlas to prevent duplicates
                    let newUser = await new UserModel({
                        email: args.email,
                        fullname: args.fullname,
                        password: await bcrypt.hash(args.password, 10),
                        dream_job: args.dream_job,
                        motivation: args.motivation,
                        total_points: 0
                    })

                    let validNewUser = await newUser.save( );

                    //  Todo - need to test/force this error message ie what might prevent new user from saving?
                    //where am i actuallly preventing a user with same email address from being registered??
                    if (!validNewUser) {
                        throw new Error(`Could not save new user with email ${args.email}`)
                    }

                    // log the new user in and give them a new jwtoken - what is sub for ??
                    let token = jsonwebtoken.sign({
                            sub: newUser.id,
                            email: newUser.email
                        }, AUTH_SECRET,{
                            expiresIn: '3 hours'
                        })

                    //return new user here, with token inside
                    newUser.access_token = token;
                    return newUser; 
                }
                catch(err) {
                    return new Error(`Could not add new user with the same email address ${args.email}`)
                }
            }
        },

        // Mutation to Log User In by checking for Existing UserName
        loginEmailAddress: {
            type: UserType,
            description: 'Login and Retrieve a single User by Email and Password',
            args: {
                email: {
                    type: GraphQLString,
                    description: 'Username'
                },
                password: {
                    type: GraphQLString,
                    description: 'Password'
                }
            },
            async resolve(parent, args)
            {

                //ToDo - Issue that only first user with given username is returned as duplicates are currently allowed in MongoDB Atlas
                const existingUser = await UserModel.findOne({ "email": args.email})
                if (!existingUser) {
                    throw new Error(`Could not find a user with email ${args.email}`)
                }
                const validPassword = await bcrypt.compare(args.password, existingUser.password)
                if (!validPassword) {
                    throw new Error('Incorrect password, please try again')
                }
                //login the existing user by giving them a new jwtoken
                let token = jsonwebtoken.sign({
                        sub: existingUser.id,
                        email: existingUser.email
                        }, AUTH_SECRET,{
                        expiresIn: '3 hours'
                    })
                existingUser.access_token = token
                return  existingUser;
            }
        }
    }
});