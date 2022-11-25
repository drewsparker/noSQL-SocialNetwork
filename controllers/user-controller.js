const req = require("express/lib/request");
const { thought, user } = require('../models');

const userController = {
    // Get all users
    getUsers(req, res) {
        user.find()
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    },
    // Get a single user
    getSingleUser(req, res) {
        user.findOne({ _id: req.params.userId })
            .select('-__v')
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
    },
    // create a new user
    createUser(req, res) {
        user.create(req.body)
            .then((user) => res.json(user))
            .catch((err) => res.status(500).json(err));
    },
    // Delete a user and associated apps
    deleteUser(req, res) {
        user.findOneAndDelete({ _id: req.params.userId })
            .then((user) =>
                !user
                    ? res.status(404).json({ message: 'No user with that ID' })
                    : thought.deleteMany({ _id: { $in: user.thought } })
            )
            .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
            .catch((err) => res.status(500).json(err));
    },
    // POST /api/users/:userId/friends/:friendId
    addFriend({ params }, res) {
        // add friendId to userId's friend list
        user.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this userId' });
                    return;
                }
                // add userId to friendId's friend list
                user.findOneAndUpdate(
                    { _id: params.friendId },
                    { $addToSet: { friends: params.userId } },
                    { new: true, runValidators: true }
                )
                    .then(dbUserData2 => {
                        if (!dbUserData2) {
                            res.status(404).json({ message: 'No user found with this friendId' })
                            return;
                        }
                        res.json(dbUserData);
                    })
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    },

    // DELETE /api/users/:userId/friends/:friendId
    deleteFriend({ params }, res) {
        // remove friendId from userId's friend list
        user.findOneAndUpdate(
            { _id: params.userId },
            { $pull: { friends: params.friendId } },
            { new: true, runValidators: true }
        )
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({ message: 'No user found with this userId' });
                    return;
                }
                // remove userId from friendId's friend list
                user.findOneAndUpdate(
                    { _id: params.friendId },
                    { $pull: { friends: params.userId } },
                    { new: true, runValidators: true }
                )
                    .then(dbUserData2 => {
                        if (!dbUserData2) {
                            res.status(404).json({ message: 'No user found with this friendId' })
                            return;
                        }
                        res.json({ message: 'Successfully deleted the friend' });
                    })
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    }
}
module.exports = userController;