console.log("client code running");
const axios = require('axios');
const URI = `http://localhost:3000/api`

// 비효율적인 방법:
//    - blogLimit 20일 때: 6초
//    - blogLimit 50 일때 15초

// populate 사용하는 방법
//    - blogsLimit 20 일때 :0.8초
//    - blogLimit 50 일 때: 0.7초
//      - blogsLimit 200일 때: 2초

// nesting 사용하는 방법
//      - blogLimit 20일 때 : 0.1~2초
//      - blogLimit 50일 때 : 0.2~3초
//      - blogsLimit 200일 때: 0.3초



const test = async () => {
    console.time('loading time:')
    let {
        data: { blogs },
    } = await axios.get(`${URI}/blog`);
    console.dir(blogs[0], { depth: 10 })
    // blogs = await Promise.all(blogs.map(async blog => {
    //     // 1번 방식 
    //     // const res1 =await Promise.all()axios.get(`${URI}/api/user/${blog.user}`)
    //     // const res2 =await axios.get(`${URI}/api/blog/${blog._id}/comment`)
    //     // blog.user = res1.data.user;
    //     // blog.comments = res2.data.comments;

    //     // 2번 방식으로 처리하면 효율이 올라감
    //     const [res1, res2] = await Promise.all([
    //         axios.get(`${URI}/user/${blog.user}`),
    //         axios.get(`${URI}/blog/${blog._id}/comment`)
    //     ])
    //     blog.user = res1.data.user;
    //     blog.comments = await Promise.all(res2.data.comment.map(async (comment) => {
    //         const { data: { users } } = await axios.get(`${URI}/user/${comment.user}`)
    //         comment.user = users
    //         return comment
    //     }))

    //     return blog
    // }))
    console.timeEnd('loading time:')
}



const testGroup = async () => {
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
    await test();
}

testGroup()