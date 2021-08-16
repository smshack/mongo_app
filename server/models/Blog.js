const { Schema, model, Types } = require('mongoose');
const { CommentSchema } = require('./Comment')
// const BlogSchema = new Schema({
//     title: { type: String, required: true },
//     content: { type: String, required: true },
//     islive: { type: Boolean, required: true, default: false },
//     user: { type: Types.ObjectId, required: true, ref: "user" }
// }, { timestamps: true });


const BlogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    islive: { type: Boolean, required: true, default: false },
    user: {
        _id: { type: Types.ObjectId, required: true, ref: "user", index: true },
        username: { type: String, required: true },
        name: {
            first: { type: String, required: true },
            last: { type: String, required: true }
        },
    },
    comments: [CommentSchema]
}, { timestamps: true });

// BlogSchema.index({ "user._id": 1, updateAt: 1 })
BlogSchema.index({ title: "text" })

BlogSchema.virtual("commment", {
    ref: "comment",
    localField: "_id",
    foreignField: "blog"
})

BlogSchema.set("toObject", { virtuals: true })
BlogSchema.set("toJSON", { virtuals: true })
const Blog = model("blog", BlogSchema);

module.exports = { Blog }