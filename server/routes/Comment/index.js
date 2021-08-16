const express = require('express');
const router = express.Router({ mergeParams: true });
const { Blog } = require('../../models/Blog')
const { User } = require('../../models/User')
const { Comment } = require('../../models/Comment')
const { isValidObjectId, startSession } = require('mongoose');


// 생성
router.post('/', async (req, res) => {
    // const session = await startSession();
    let comment;
    try {
        // await session.withTransaction(async () => {
        const { blogId } = req.params;
        const { content, userId } = req.body;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" })
        if (!isValidObjectId(userId)) return res.status(400).send({ err: "invalid userId" })
        if (typeof content !== "string") return res.status(400).send({ err: 'content is requeird and should send string' })

        // 성능 최적화를 위해서 순차적으로 불러올 필요 없이 동시에 불러와도 되는 것들은 Promise.all 로 처리한다
        let [blog, user] = await Promise.all([
            Blog.findById(blogId, {}, {}),
            User.findById(userId, {}, {})
            // Blog.findById(blogId, {}, { session }),
            // User.findById(userId, {}, { session })
        ])
        // const blog = await Blog.findByIdAndUpdate(blogId); 
        // const user = await User.findByIdAndUpdate(userId); 

        if (!blog || !user) return res.status(400).send({ err: "blog or user does not exitst" })

        if (!blog.islive) return res.status(400).send({ err: "blog is not available" })
        comment = new Comment({ content, userFullName: `${user.name.first} ${user.name.last}`, user, blog: blogId })

        // await session.abortTransaction()

        // await Promise.all([
        //     comment.save(),
        //     Blog.updateOne({ _id: blogId }, { $push: { comments: comment } })
        // ])
        blog.commentsCount++;
        blog.comments.push(comment);

        if (blog.commentsCount > 3) blog.comments.shift();
        await Promise.all([
            // comment.save({ session }),
            comment.save(),
            Blog.updateOne({ _id: blogId }, { $inc: { commentsCount: 1 } })
        ])

        // })
        return res.send({ comment })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ e: e.message })
    } finally {
        // await session.endSession();
    }
})

// 해당 블로그 아이디에 맞는 댓글 찾기
router.get('/', async (req, res) => {
    try {
        let { page } = req.query;
        page = parseInt(page);

        const { blogId } = req.params;
        if (!isValidObjectId(blogId)) return res.status(400).send({ err: "invalid blogId" })
        const comment = await Comment.find({ blog: blogId }).sort({ createdAt: -1 }).skip(page * 3).limit(3)

        return res.send({ comment })
    } catch (e) {
        console.log(e);
        return res.status(500).send({ e: e.message })
    }
})

// 댓글 하나의 아이디를 받아서 후기를 수정하는 api
router.patch("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;
    if (typeof content !== "string") return res.status(400).send({ err: "content is required string" })
    console.log(commentId)
    console.log(content)

    // const comment = await Comment.findOneAndUpdate(
    //     { _id: commentId },
    //     { content },
    //     { new: true }
    // );
    // console.log(comment)
    // // 몽고 DB 에서의 배열을 나타내는 경우 .으로 사용 가능
    // const test = await Blog.updateOne({ 'comments._id': commentId }, { "comments.$.content": content });
    // console.log(test)
    const [comment] = await Promise.all([
        Comment.findOneAndUpdate(
            { _id: commentId },
            { content },
            { new: true }
        ),
        Blog.updateOne({ 'comments._id': commentId }, { "comments.$.content": content }),

    ])

    return res.send({ comment })

})

// 삭제
router.delete("/:commentId", async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findOneAndDelete({ _id: commentId })

    await Blog.updateOne({ "comments._id": commentId }, { $pull: { comments: { _id: commentId } } })

    return res.send({ comment })
})

module.exports = router;