const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
} = graphql;

module.exports = new GraphQLObjectType({
    name: 'User',
    description: 'A single user/learner',
    fields: () => ({
        _id: {
            type: GraphQLID,
            description: 'ObjectId of User'
        },
        email: {
            type: GraphQLString,
            description: 'Email of User'
        },
        fullname: {
            type: GraphQLString,
            description: 'FullName of the User'
        },
        password: {
            type: GraphQLString,
            description: 'Password of User'
        },
        dream_job: {
            type: GraphQLString,
            description: 'Dream Job that User is aiming for'
        },
        motivation: {
            type: GraphQLString,
            description: 'Motivation for the User achieve this job'
        },
        total_points: {
            type: GraphQLString,
            description: 'Total Points that User has achieved by completing goals'
        },
        access_token: {
            type: GraphQLString,
            description: 'Access token of the User'
        }
    })
});