const express = require('express');
const router = express.Router();
const { User } = require('../../models/User')
const { Blog } = require('../../models/Blog')
const { Comment } = require('../../models/Comment')
const { isValidObjectId } = require('mongoose')
// 유저 전체 찾기
router.get('/', async (req, res) => {
    try {
        const users = await User.find({});
        return res.send({ users })
    } catch (e) {
        console.log(err);
        return res.status(500).send({ err: e.message })
    }
})

// 해당 하는 아이디 하나 찾기
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
        const users = await User.findOne({ _id: userId });
        return res.send({ users })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ err: e.message })
    }
})

// 생성
router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        return res.send({ user })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ err: e.message })
    }

})


// 수정
router.put('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
        const { age, name } = req.body;
        console.log(req.body)
        if (!age && !name) return res.status(400).send({ err: 'age,name는 반드시 들어가야 함' });
        if (typeof age != 'number') return res.status(400).send({ err: 'age 는 숫자형이여야 함' });
        // let updateBody ={}
        // if(age) updateBody.age =age;
        // if(name) updateBody.namme =name;
        // const users = await User.findByIdAndUpdate({_id:userId},{$set:updateBody},{new:true});
        let user = await User.findById(userId);
        console.log(user)
        console.log(age)
        console.log(name)
        if (age) user.age = age;
        if (name) {
            user.name = name;
            await Promise.all([
                Blog.updateMany({ "user._id": userId }, { "user.name": name }),
                Blog.updateMany(
                    {},
                    { "comments.$[comment].userFullName": `${name.first} ${name.last}` },
                    { arrayFilters: [{ "comment.user": userId }] })

            ])
            await user.save();
        }
        return res.send({ user })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ e: e.message })
    }

})

// 삭제
router.delete('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
        const users = await Promise.all([
            User.findOneAndDelete({ _id: userId }),
            Blog.deleteMany({ "user.id": userId }),
            Blog.updateMany(
                { "comment.user": userId },
                { $pull: { comments: { user: userId } } }
            ),
            Comment.deleteMany({ user: userId }),
        ])
        return res.send({ users })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ e: e.message })
    }
})

module.exports = router;