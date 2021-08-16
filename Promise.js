const addSum =(a,b) => new Promise((resolve,reject)=>{
        setTimeout(()=>{
            if(typeof a !== 'number' || typeof b !=='number')
                reject('a,b must be numbers')
            resolve(a+b);
        },3000);
    })


// addSum(10,15)
//     .then((sum)=> console.log({sum}))
//     .catch((error)=>console.log({error}))



const totalSum = async () =>{
    try{
        let sum= await addSum(10,10)
        let sum2= await addSum(10,20)
        let sum3= await addSum(10,30)
        console.log({sum,sum2,sum3})
    }catch(e){
        console.log(e)
    }
  
}

totalSum();