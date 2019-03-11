const express = require('express')
const model = require('../../models/user.js')
const User = model.User
const router = express.Router()

/**
 * @swagger
 *
 * /users:
 *   get:
 *     description: Returns a list of users.
 *     tags:
 *       - users
 *     responses:
 *       '200':
 *         description: A JSON array of users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 */
router.get('/', (req, res, next) => {
  ;(async () => {
    if (req.query.name) {
      const users = await User.find(
        { name: req.query.name },
        {},
        { sort: { name: 1 } }
      ).exec()
      res.status(200).json(users)
    } else {
      const users = await User.find().exec()
      res.status(200).json(users)
    }
  })().catch(next)
})

/**
 * @swagger
 *
 * /users/{id}:
 *   get:
 *     description: Find user by ID.
 *     tags:
 *       - users
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
 *         description: A JSON object of user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.get('/:id', (req, res, next) => {
  ;(async () => {
    try {
      const user = await User.findById(req.params.id).exec()
      if (user) {
        res.status(200).json(user)
      } else {
        res.status(404).json({ error: 'NotFound' })
      }
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'BadRequest' })
    }
  })().catch(next)
})

/**
 * @swagger
 *
 * /users:
 *   post:
 *     description: Create a user.
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'alice'
 *               avatarUrl:
 *                 type: string
 *                 example: 'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png'
 *             required:
 *               - name
 *               - avatarUrl
 *     responses:
 *       '200':
 *         description: Created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 */
router.post('/', (req, res, next) => {
  ;(async () => {
    try {
      const record = new User({
        name: req.body.name
      })
      const savedRecord = await record.save()
      res.status(200).json(savedRecord)
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'BadRequest' })
    }
  })().catch(next)
})

/**
 * @swagger
 *
 * /users/{id}:
 *   put:
 *     description: Update a user or create a user if user not exist.
 *     tags:
 *       - users
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
 *               name:
 *                 type: string
 *                 example: 'alice'
 *               avatarUrl:
 *                 type: string
 *                 example: 'https://1.bp.blogspot.com/-LFh4mfdjPSQ/VCIiwe10YhI/AAAAAAAAme0/J5m8xVexqqM/s800/animal_neko.png'
 *             required:
 *               - name
 *               - avatarUrl
 *     responses:
 *       '200':
 *         description: Updated or created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.put('/:id', (req, res, next) => {
  ;(async () => {
    try {
      // idにloginUserを指定された場合は、ログインユーザー情報の登録or更新を行う
      if (req.params.id === 'loginUser') {
        const record = await User.findOneAndUpdate(
          { name: req.body.name },
          {
            name: req.body.name,
            avatarUrl: req.body.avatarUrl
          },
          {
            new: true,
            upsert: true
          }
        ).exec()
        res.status(200).json(record)
      } else {
        const record = await User.findByIdAndUpdate(req.params.id, req.body, {
          new: true
        }).exec()
        if (record) {
          res.status(200).json(record)
        } else {
          res.status(404).json({ error: 'NotFound' })
        }
      }
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'BadRequest' })
    }
  })().catch(next)
})

/**
 * @swagger
 *
 * /users/{id}:
 *   delete:
 *     description: Delete a user.
 *     tags:
 *       - users
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
 *         description: Empty body.
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
router.delete('/:id', (req, res, next) => {
  ;(async () => {
    try {
      const removedRecord = await User.findByIdAndDelete(req.params.id).exec()
      if (removedRecord) {
        res.status(200).json({})
      } else {
        res.status(404).json({ error: 'NotFound' })
      }
    } catch (err) {
      console.error(err)
      res.status(400).json({ error: 'BadRequest' })
    }
  })().catch(next)
})

module.exports = router
