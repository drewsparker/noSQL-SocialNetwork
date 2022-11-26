const router = require('express').Router();
const {
    getThought,
    getSingleThought,
    createThought,
    updateThought,
    deleteThought,
    addThoughtReaction,
    removeThoughtReaction
} = require('../../controllers/thought-controller');

router
    .route('/')
    .get(getThought)
    .post(createThought);

router
    .route('/:id')
    .get(getSingleThought)
    .put(updateThought)
    .delete(deleteThought);

router
    .route('/:thoughtId/reactions/')
    .post(addThoughtReaction)

router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(removeThoughtReaction)

module.exports = router;
