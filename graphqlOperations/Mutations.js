const graphql = require('graphql');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

require('dotenv').config();

//this is allowable data types in mutations below
const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt,
    GraphQLID,
    GraphQLBoolean
} = graphql;

const AUTH_SECRET = process.env.JWT_SECRET;

// GraphQL Types
const UserType = require('../graphqlTypes/UserType');
const GoalType = require('../graphqlTypes/GoalType');
// Mongoose Models
const UserModel = require('../mongoModels/UserModel');
const GoalModel = require('../mongoModels/GoalModel');

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
                    console.log(newUser)

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

                    console.log('new user token is: ' + token);
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
                    throw new Error('Incorrect username or password, please try again')
                }
                //login the existing user by giving them a new jwtoken
                let token = jsonwebtoken.sign({
                        sub: existingUser.id,
                        email: existingUser.email
                        }, AUTH_SECRET,{
                        expiresIn: '3 hours'
                    })
                console.log('existing user token is: ' + token);
                existingUser.access_token = token
                return  existingUser;
            }
        },

        // Mutation to Add New Goal to DB for given User
            //other functions needed could be name
            // completeGoalForUser
            // deleteGoalForUser
        addGoalForUser: {
            type: GoalType,
            description: 'Add a Single Goal',
            args: {
                userid: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: "Userid of the user"
                },
                name: {
                    type: new GraphQLNonNull(GraphQLString),
                    description: "Email of the user"
                },
                is_target_type: {
                    type: new GraphQLNonNull(GraphQLBoolean),
                    description: "Password of the user"
                },
                target_amount_goal: {
                    type: GraphQLInt,
                    description: "Dream Job of the user"
                },
                target_unit: {
                    type: GraphQLString,
                    description: "Motivation for the user to get this job"
                },
                target_amount_completed: {
                    type: GraphQLInt,
                    description: "Total Point gained by the user for completing Goals"
                },
                points: {
                    type: GraphQLInt,
                    description: "Motivation for the user to get this job"
                }
            },
            async resolve(parent, args) {
                try {
                    //create new user - MongoDB config in OSX will prevent users being created with an existing email or username
                    // ToDo - configure MongoDB in Atlas to prevent duplicates
                    console.log('inside addGoalForUser')
                    
                    // BUG NOT WORKING - doesnot work with or wihtout userid
                    let newGoal = await new GoalModel({
                        userid: args.userid,
                        name: args.name,
                        is_target_type: args.is_target_type,
                        target_amount_goal: args.target_amount_goal,
                        target_unit: args.target_unit,
                        target_amount_completed: args.target_amount_completed,
                        points: args.points,
                        is_completed: false,
                        is_deleted: false
                    })
                        // date_created: new Date;
                        // doc.createdAt instanceof Date
                    if (!newGoal) {
                        throw new Error(`new goal not valid, with name  ${args.name}`)
                    }
                    //this never gets printed out
                    console.log('new goal: ')
                    console.log(newGoal)

                    //dates shoudl be auto handled by mongoose ie createdAt and updatedAt 

                    //4Feb does this return boolean, rather than the saved object?
                    let validNewGoal = await newGoal.save( );
                    
                    // this works to save doc but also triggers catch block to return error to GQL console
                    // let validNewGoal = await newGoal.save(function() {
                    //     console.log("MY Document inserted succussfully!");
                    // });

                    // let validNewGoal = await newGoal.save(function(err, doc) {
                    //   if (err) return console.error(err);
                    //   console.log("GOAL Document inserted succussfully!");
                    // });

                    //  Todo - need to test/force this error message ie what might prevent new user from saving?
                    //where am i actuallly preventing a user with same email address from being registered??
                    if (!validNewGoal) {
                        throw new Error(`Could not save new goal for user with goal name ${args.name}`)
                    }

                    //do i need tokens for goals? assume NOT
                    // log the new user in and give them a new jwtoken - what is sub for ??
                    // let token = jsonwebtoken.sign({
                    //         sub: newUser.id,
                    //         email: newUser.email
                    //     }, AUTH_SECRET,{
                    //         expiresIn: '3 hours'
                    //     })

                    // //return new user here, with token inside
                    // newUser.access_token = token;
                    return newGoal; 
                }
                catch(err) {
                    return new Error(`Could not add new goal for user with goal name ${args.name}`)
                }
            }
        },

        //also need to update Total Points for User collection
        updatePointsForUserGoal: {
            type: GoalType,
            description: 'Update points for Goal',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'Goal ID'
                },
                points: {
                    type: new GraphQLNonNull(GraphQLInt),
                    description: 'Points to Add'
                }
            },
            async resolve(parent, args)
            {
                // let foundUserByID = await GoalModel.findById(args.id)
                // console.log('foundUserByID : ' + foundUserByID);

            //how to find n update a recorrd in mongo?
            //how to find n update a recorrd in mongo?
            // const existingUserGoal = await GoalModel.findOne({ "_id": args.id})
            // updatedPoints = 
            const filter = { _id: args.id };
            // const update = { points: args.points };
            console.log('hello id: ' + args.id);

            const update = { $inc: {points: args.points } };
            console.log('hello points: ' + args.points);
            // `doc` is the document _after_ `update` was applied because of
            // `new: true`
            //depreacted findOneAndUpdate with findAndModify
            
            // db not being updated and null being returned 
             // let validNewGoal = await newGoal.save( );
             // what does findOneAndUpdate return??
            let updateddoc = await GoalModel.findOneAndUpdate(filter, update, {
                returnNewDocument: true,
                new: true,
                useFindAndModify: false
            });

            if (!updateddoc) {
                    console.log('FISH')
                    console.log(updateddoc); //this  s null 
                }

            console.log(updateddoc._id); // 'Jean-Luc Picard'
            console.log('points: ' + updateddoc.points); // 59
            return updateddoc;
            }
        }

    }
})

// also need these mutations
// completeGoalForUser
// deleteeGoalForUser
