const express = require('express');
const router = express.Router({ mergeParams: true });
const { Blog } = require('../../models/Blog')
const { User } = require('../../models/User')
const { Comment } = require('../../models/Comment')
const { isValidObjectId } = require('mongoose')
const comment = require('../Comment')

// 댓글은 블로그 하기 개념이므로 아래로 빼줌
router.use("/:blogId/comment", comment)

// 블로그 전체 찾기
router.get('/', async (req, res) => {
    try {
        //populate를 사용하면 해당 관계된 데이터를 가져올수 있다
        let { page } = req.query;
        page = parseInt(page)
        console.log(page)
        const blogs = await Blog.find({}).sort({ updatedAt: -1 }).skip(page * 3).limit(10).populate([{ path: "user" }, { path: "commment" }]);
        return res.send({ blogs })
    } catch (e) {
        console.log(err);
        return res.status(500).send({ err: e.message })
    }
})

// 해당 하는 아이디 하나 찾기
router.get('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" })
        const blogs = await Blog.findOne({ _id: blogId });
        const commentCount = await Comment.find({ blog: blogId }).countDocuments();
        return res.send({ blogs, commentCount })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ e: e.message })
    }
})

// 생성
router.post('/', async (req, res) => {
    try {
        const { title, content, islive, userId } = req.body;
        if (typeof title !== "string") return res.status(400).send({ err: 'title is required' })
        if (typeof content !== "string") return res.status(400).send({ err: 'content is required' })
        if (islive && typeof islive !== 'boolean') return res.status(400).send({ err: 'islive is boolean' })
        if (!isValidObjectId(userId)) return res.status(400).send({ err: 'userId is invalid' })

        let user = await User.findByIdAndUpdate(userId);
        if (!user) res.status(400).send({ err: "user does not exist" });
        let blog = new Blog({ ...req.body, user });

        await blog.save();
        return res.send({ blog })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ e: e.message })
    }

})


// 수정
router.put('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" })
        const { title, content } = req.body;
        if (!title && !content) return res.status(400).send({ err: 'title,content 반드시 들어가야 함' });
        if (typeof title != 'string') return res.status(400).send({ err: 'title 는 숫자형이여야 함' });
        if (typeof content != 'string') return res.status(400).send({ err: 'content 는 숫자형이여야 함' });


        const blog = await Blog.findByIdAndUpdate({ _id: blogId }, { title, content }, { new: true });
        return res.send({ blog })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ e: e.message })
    }

})


router.patch('/:blogId/live', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" })
        const { islive } = req.body;
        if (!islive) return res.status(400).send({ err: 'islive는 반드시 들어가야 함' });
        if (typeof islive != 'boolean') return res.status(400).send({ err: 'islive 는 boolean이여야 함' });

        const blog = await Blog.findByIdAndUpdate({ _id: blogId }, { islive }, { new: true });
        return res.send({ blog })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ e: e.message })
    }

})


// 삭제
router.delete('/:blogId', async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" })
        const blogs = await Blog.deleteOne({ _id: blogId });
        return res.send({ blogs })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ e: e.message })
    }
})


module.exports = router;