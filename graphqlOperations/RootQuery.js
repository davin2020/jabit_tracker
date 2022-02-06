const graphql = require('graphql');
const jsonwebtoken = require('jsonwebtoken');

const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLString
} = graphql;

//This file contains the GraphQL "Resolvers" for both the User and Goal objects

// GraphQL Types
const UserType = require('../graphqlTypes/UserType');
const GoalType = require('../graphqlTypes/GoalType');

// Mongoose Models
const UserModel = require('../mongoModels/UserModel');
const GoalModel = require('../mongoModels/GoalModel');


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
        },

        //get all goals, or all goals for a given userid
        goals: {
            type: new GraphQLList(GoalType),
            description: 'Retrieve all GOALS in DB if no arguments provided, or just the Goals for the Userid provided',
            args: {
                userid: {
                    type: GraphQLString,
                    description: 'Userid of the User whose Goals you wan to find'
                }
            },
            async resolve(parent, args) {
                if (!args.userid) {
                    let multipleUsers = await GoalModel.find({})
                    return multipleUsers;
                }
                let singleUser = await GoalModel.find({"userid": args.userid})
                return singleUser;
            }
        },

        //is the issue abotu returnign an array vs single item? or abut havnig multipel object ids? - works if i change data type in collection from ObjectId to String !
        goalsByUserid: {
            //need to ddeclare a new goal type here or else query wont work but not sure why
            type: new GraphQLList(GoalType),
            description: 'Retrieve all Goals for a given Userid',
            args: {
                userid: {
                    type: GraphQLString,
                    description: 'Userid of goals'
                }
            },
            async resolve(parent, args) {
                let foundGoalsByUserid = await GoalModel.find({"userid": args.userid})
                if (!foundGoalsByUserid) {
                    throw new Error(`Could not find goals for user with userid ${args.userid}`)
                }
                return foundGoalsByUserid;
            }
        },

        goalById: {
            type: GoalType,
            description: 'Retrieve a single Goal by Userid',
            args: {
                id: {
                    type: GraphQLID,
                    description: 'ObjectId'
                }
            },
            async resolve(parent, args) {
                let foundUserByID = await GoalModel.findById(args.id)
                if (!foundUserByID) {
                    throw new Error(`Could not find goals for user with id ${args.id}`)
                }
                return foundUserByID;
            }
        },

    }
});