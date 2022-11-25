const { Schema, Types, model } = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const reactionSchema = new Schema({
    reactionId: {
        type: Schema.Types.ObjectId,
        default: () => new Types.ObjectId(),
    },
    responseBody: {
        type: String,
        required: true,
        maxlength: 280,
    },
    username: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: createdAtVal => addDateSuffix(createdAtVal)
    },
},
    {
        toJSON: {
            getters: true,
        },
    }
);

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            validate: [({ length }) => length > 0 && length <= 280, 'Thoughts can only be between 1 and 280 characters long!']
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            get: createdAtVal => addDateSuffix(createdAtVal)
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: {
            getters: true,
            virtuals: true
        },
        id: false,
    }
);


// Create a virtual property `reactionCount` that gets the amount of reactions per thought
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});


const thought = model('thought', thoughtSchema);

// Uses model to create new instance including subdocument
// const reactionData = { reactionBody: 'cool', username: 'drewsparker' };

// thought.create(
//     { thoughtText: 'this is cool', username: 'drewsparker', reactions: [reactionData]},
//     (err, data) => {
//         if (err) {
//             console.error(err);
//         }
//         console.log(data);
//     }
// );

module.exports = thought;

