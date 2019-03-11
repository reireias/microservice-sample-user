const express = require('express')
const model = require('../../models/follow.js')
const User = require('../../models/user.js').User
const Follow = model.Follow
const router = express.Router({ mergeParams: true })

/**
 * @swagger
 *
 * /users/{id}/follows:
 *   get:
 *     description: Returns follow user list.
 *     tags:
 *       - follows
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID.
 *         schema:
 *           type: 'string'
 *         example: '000000000000000000000000'
 *     responses:
 *       '200':
 *         description: A JSON array of users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 */
router.get('/', (req, res, next) => {
  ;(async () => {
    if (!model.validateObjectId(req.params.id)) {
      res.status(400).json({ error: 'BadRequest' })
      return
    }
    const records = await Follow.find({ userId: req.params.id }).exec()
    const followIds = records.map(follow => follow.followId)
    const follows = await User.find({ _id: { $in: followIds } }).exec()
    res.status(200).json(follows)
  })().catch(next)
})

/**
 * @swagger
 *
 * /users/{id}/follows:
 *   post:
 *     description: Follow a user.
 *     tags:
 *       - follows
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID.
 *         schema:
 *           type: 'string'
 *         example: '000000000000000000000000'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               followId:
 *                 type: string
 *                 example: '000000000000000000000001'
 *             required:
 *               - followId
 *     responses:
 *       '200':
 *         description: Empty body.
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/', (req, res, next) => {
  ;(async () => {
    const follow = new Follow({
      userId: req.params.id,
      followId: req.body.followId
    })
    const error = follow.validateSync()
    if (error) {
      res.status(400).json({ error: 'BadRequest' })
      return
    }
    await follow.save()
    res.status(200).json({})
  })().catch(next)
})

/**
 * @swagger
 *
 * /users/{id}/follows:
 *   delete:
 *     description: Unfollow a user.
 *     tags:
 *       - follows
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID.
 *         schema:
 *           type: 'string'
 *         example: '000000000000000000000000'
 *       - name: followId
 *         in: query
 *         required: true
 *         description: Unfollow target user ID.
 *         schema:
 *           type: 'string'
 *         example: '000000000000000000000001'
 *     responses:
 *       '200':
 *         description: Empty body.
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/', (req, res, next) => {
  ;(async () => {
    const result = await Follow.findOneAndDelete({
      userId: req.params.id,
      followId: req.query.followId
    }).exec()
    if (result) {
      res.status(200).json({})
    } else {
      res.status(404).json({ error: 'NotFound' })
    }
  })().catch(next)
})

module.exports = router
