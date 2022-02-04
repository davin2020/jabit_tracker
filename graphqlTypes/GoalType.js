const graphql = require('graphql');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean
} = graphql;


module.exports = new GraphQLObjectType({
    name: 'Goal',
    description: 'A single Goal belonging to a certain User',
    fields: () => ({
        _id: {
            type: GraphQLID,
            description: 'ObjectId of Goal'
        },
        userid: {
            type: GraphQLID,
            description: 'Userid of User who is doing this Goal'
        },
        name: {
            type: GraphQLString,
            description: 'Name of Goal'
        },
        is_target_type: {
            type: GraphQLBoolean,
            description: 'The Target Type of this Goal - True means its Measurable by a target amount, False means its Boolean'
        },
        target_amount_goal: {
            type: GraphQLInt,
            description: 'The target amount to aim for in order to complete the goal'
        },
        target_unit: {
            type: GraphQLString,
            description: 'The Units for the amount eg Appplications submitted, Interviews attended etc'
        },
        target_amount_completed: {
            type: GraphQLInt,
            description: 'The target amount that has been completed for this goal, could be more than the target_amount_goal'
        },
        points: {
            type: GraphQLInt,
            description: 'Points gained by completing each goal'
        },
        is_completed: {
            type: GraphQLBoolean,
            description: 'Is this goal marked as completed?'
        },
        is_deleted: {
            type: GraphQLBoolean,
            description: 'Has this goal been soft deleted?'
        }
    })
});